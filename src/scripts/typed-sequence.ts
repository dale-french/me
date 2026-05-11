import Typed from "typed.js";
import { introSegments, type SegmentId } from "../data/intro";

const LONG_DELAY = 1500;
const MAX_CONSECUTIVE_EMPTIES = 3;

const INITIAL_ORDER: readonly SegmentId[] = [
  "hello",
  "name",
  "job",
  "previous",
  "next",
];

// --- timing knobs --------------------------------------------------------
// After the just-typed string finishes, before the baton moves to `next`.
const LINGER_BASE = 450;
const LINGER_LENGTH_MS_PER_CHAR = 8;
const LINGER_LENGTH_CAP = 250;

// After the baton moves, before the new segment starts typing/backspacing.
const THINK_BASE = 650;
const THINK_LENGTH_MS_PER_CHAR = 6;
const THINK_LENGTH_CAP = 250;

// Extra weight before kicking off after a closing-feel segment.
const PRE_THINK_BONUS_AFTER: Partial<Record<SegmentId, number>> = {
  next: 350,
  outro: 350,
};

// Trailing-punctuation bonus on the just-typed string.
const PUNCT_BONUS: Record<string, number> = {
  ".": 120,
  "!": 80,
  "?": 220,
  "…": 320,
  ")": 100,
};

// Base typing speed (ms/char). typed.js's own humanizer adds ±50% on top.
const TYPE_SPEED_BASE = 28;

// Resume-after-pause think delay (used when no `pendingResume` is stashed).
const RESUME_THINK_DELAY = 750;

function strip(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\^\d+/g, "");
}

function lingerFor(lastTyped: string): number {
  const stripped = strip(lastTyped);
  const trailing = stripped.trim().slice(-1);
  const lengthBonus = Math.min(
    stripped.length * LINGER_LENGTH_MS_PER_CHAR,
    LINGER_LENGTH_CAP,
  );
  const punctBonus = PUNCT_BONUS[trailing] ?? 0;
  return LINGER_BASE + lengthBonus + punctBonus;
}

function thinkFor(nextStr: string, fromId: SegmentId): number {
  const stripped = strip(nextStr);
  const lengthBonus = Math.min(
    stripped.length * THINK_LENGTH_MS_PER_CHAR,
    THINK_LENGTH_CAP,
  );
  const segBonus = PRE_THINK_BONUS_AFTER[fromId] ?? 0;
  return THINK_BASE + lengthBonus + segBonus;
}

const ACTIVE = "typed--active";
const BACKGROUND = "typed--background";
const PAUSED = "typed--paused";
const REPEATING = "typed--repeating";
const RUNNING = "typed--running";
const TYPING = "typed--typing";

export interface TypedSequenceController {
  pause(): void;
  resume(): void;
  destroy(): void;
}

type TypedSelf = Typed & {
  el: HTMLElement;
  strings: string[];
  sequence: number[];
  arrayPos: number;
  options: { stringsElement: string } & Record<string, unknown>;
  afterDelay: number;
  typeSpeed: number;
  pause: { status: boolean; typewrite: boolean };
  start: () => void;
  stop: () => void;
};

export function startTypedSequence(
  host: HTMLElement,
  options: { pauseThreshold?: number } = {},
): TypedSequenceController {
  const pauseThreshold = options.pauseThreshold ?? 0;

  const instances = new Map<SegmentId, TypedSelf>();
  const initialQueue: SegmentId[] = [...INITIAL_ORDER];
  let current: TypedSelf | null = null;
  let paused = false;
  let pausedByObserver = false;
  let pendingTimeout: number | null = null;
  let pendingResume: (() => void) | null = null;
  let runCount = 0;
  let consecutiveEmpties = 0;

  function idOf(self: TypedSelf): SegmentId {
    return self.options.stringsElement
      .replace("#seg-", "")
      .replace("--strings", "") as SegmentId;
  }

  function peekNextString(self: TypedSelf): string {
    const len = self.sequence.length;
    if (!len) return "";
    // typed.js's `arrayPos` carries two different meanings depending on where
    // the instance was paused:
    //   - Paused mid-backspace (after our stop() in onStringTyped) →
    //     arrayPos points at the *just-typed* string. The next typed string
    //     is at sequence[arrayPos + 1].
    //   - Paused before typewriting (after lastStringBackspaced → begin() →
    //     our stop(), which resets arrayPos to 0 and reshuffles) →
    //     arrayPos points at the *about-to-type* string. The next typed
    //     string is at sequence[arrayPos].
    // `pause.typewrite` is typed.js's discriminator for these two cases.
    const aboutToType = self.pause?.typewrite === true;
    const idx = aboutToType
      ? self.sequence[self.arrayPos % len]
      : self.sequence[(self.arrayPos + 1) % len];
    return self.strings[idx] ?? "";
  }

  function lastTypedOf(self: TypedSelf): string {
    const len = self.sequence.length;
    if (!len) return "";
    // Mirror of peekNextString: if `pause.typewrite` is true, arrayPos is the
    // about-to-type pick — so the most-recently-typed string was one before.
    const aboutToType = self.pause?.typewrite === true;
    const idx = aboutToType
      ? self.sequence[(self.arrayPos - 1 + len) % len]
      : self.sequence[self.arrayPos % len];
    return self.strings[idx] ?? "";
  }

  function clearTimer() {
    if (pendingTimeout !== null) {
      clearTimeout(pendingTimeout);
      pendingTimeout = null;
    }
  }

  function setTyping(self: TypedSelf) {
    host
      .querySelectorAll("." + TYPING)
      .forEach((el) => el.classList.remove(TYPING));
    self.el.classList.add(TYPING);
  }

  function clearTyping(self: TypedSelf) {
    self.el.classList.remove(TYPING);
  }

  function setActive(self: TypedSelf) {
    current = self;
    host
      .querySelectorAll("." + ACTIVE)
      .forEach((el) => el.classList.remove(ACTIVE));
    self.el.classList.add(ACTIVE);
  }

  function pickRandomExcluding(from: TypedSelf): TypedSelf {
    const pool = Array.from(instances.values()).filter((i) => i !== from);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function pickNonEmptyExcluding(from: TypedSelf): TypedSelf {
    const pool = Array.from(instances.values()).filter(
      (i) => i !== from && peekNextString(i) !== "",
    );
    if (!pool.length) return pickRandomExcluding(from);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function nextInstance(from: TypedSelf): TypedSelf {
    while (initialQueue.length) {
      const inst = instances.get(initialQueue.shift()!);
      if (inst && inst !== from) return inst;
    }
    return pickRandomExcluding(from);
  }

  function advance(from: TypedSelf) {
    from.stop();
    clearTimer();

    let next = nextInstance(from);
    let nextStr = peekNextString(next);
    const fromId = idOf(from);
    const linger = lingerFor(lastTypedOf(from));
    let think = thinkFor(nextStr, fromId);

    if (paused) {
      current = next;
      pendingResume = () => runAdvance(next, nextStr, linger, think);
      return;
    }

    // Empty slot: invisible. No baton, no cursor, no think delay. Trigger
    // typed.js so it backspaces any prior content of that segment + "types" "".
    // onStringTyped chains back into advance(next).
    if (nextStr === "") {
      consecutiveEmpties += 1;
      if (consecutiveEmpties >= MAX_CONSECUTIVE_EMPTIES) {
        next = pickNonEmptyExcluding(from);
        nextStr = peekNextString(next);
        think = thinkFor(nextStr, fromId);
        consecutiveEmpties = 0;
      } else {
        next.afterDelay = 0;
        next.start();
        return;
      }
    }

    consecutiveEmpties = 0;
    runAdvance(next, nextStr, linger, think);
  }

  function runAdvance(
    next: TypedSelf,
    nextStr: string,
    linger: number,
    think: number,
  ) {
    if (nextStr === "") {
      next.afterDelay = 0;
      next.start();
      return;
    }

    // Two-phase handoff:
    //   1. Linger — old segment stays bright after it finishes typing so the
    //      just-typed sentence has a moment to land.
    //   2. Think — setActive moves to `next` (old fades), cursor blinks on
    //      `next`, then typing resumes.
    const handoff = () => {
      setActive(next);
      const start = () => {
        pendingResume = null;
        pendingTimeout = null;
        next.typeSpeed = TYPE_SPEED_BASE;
        next.afterDelay = 0;
        next.start();
      };
      pendingResume = start;
      pendingTimeout = window.setTimeout(start, think);
    };
    pendingResume = handoff;
    pendingTimeout = window.setTimeout(() => {
      pendingTimeout = null;
      handoff();
    }, linger);
  }

  const sharedOptions = {
    afterDelay: 0,
    autoInsertCss: false,
    backDelay: 0,
    backSpeed: 22,
    loop: true,
    loopCount: Infinity,
    showCursor: false,
    shuffle: true,
    smartBackspace: false,
    typeSpeed: TYPE_SPEED_BASE,
    onBegin: (self: TypedSelf) => {
      instances.set(idOf(self), self);
      self.stop();
    },
    onStart: (_pos: number, self: TypedSelf) => setTyping(self),
    preStringTyped: (_pos: number, self: TypedSelf) => {
      runCount += 1;
      setTyping(self);
      if (runCount === 1) host.classList.add(RUNNING);
    },
    onTypingPaused: (_pos: number, self: TypedSelf) => clearTyping(self),
    onTypingResumed: (_pos: number, self: TypedSelf) => setTyping(self),
    onStringTyped: (_pos: number, self: TypedSelf) => {
      clearTyping(self);
      if (runCount === 5) host.classList.add(REPEATING);
      advance(self);
    },
    afterBackspaced: (_pos: number, self: TypedSelf) => {
      clearTyping(self);
      if (paused) self.stop();
    },
  };

  introSegments.forEach((seg) => {
    new Typed("#seg-" + seg.id, {
      ...sharedOptions,
      stringsElement: "#seg-" + seg.id + "--strings",
    } as unknown as ConstructorParameters<typeof Typed>[1]);
  });

  document.querySelectorAll('ul[id$="--strings"]').forEach((el) => el.remove());

  const hello = instances.get("hello");
  if (hello) {
    initialQueue.shift();
    setActive(hello);
    const startHello = () => {
      pendingResume = null;
      pendingTimeout = null;
      hello.start();
    };
    pendingResume = startHello;
    pendingTimeout = window.setTimeout(startHello, LONG_DELAY);
  }

  function pause() {
    if (paused) return;
    paused = true;
    clearTimer();
    if (current) current.stop();
    host.classList.add(PAUSED);
    host.classList.add(REPEATING);
  }

  function resume() {
    if (!paused) return;
    paused = false;
    clearTimer();
    host.classList.remove(PAUSED);

    if (pendingResume) {
      const fn = pendingResume;
      pendingResume = null;
      fn();
      return;
    }

    if (!current) return;
    setActive(current);
    pendingTimeout = window.setTimeout(() => {
      pendingTimeout = null;
      if (current) current.start();
    }, RESUME_THINK_DELAY);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        host.classList.remove(BACKGROUND);
        if (pausedByObserver) {
          pausedByObserver = false;
          resume();
        }
      } else {
        host.classList.add(BACKGROUND);
        if (!paused) {
          pausedByObserver = true;
          pause();
        }
      }
    },
    { threshold: pauseThreshold },
  );
  observer.observe(host);

  return {
    pause,
    resume,
    destroy() {
      observer.disconnect();
      clearTimer();
    },
  };
}
