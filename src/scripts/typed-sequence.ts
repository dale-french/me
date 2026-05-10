import Typed from "typed.js";
import { introSegments, type SegmentId } from "../data/intro";

const ACTIVE = "typed--active";
const TYPING = "typed--typing";
const FRESH = "typed--fresh";
const BACKGROUND = "typed--background";

const TYPE_SPEED = 40;
const BACK_SPEED = 20;
const HAND_OFF_DELAY = 750;
const INITIAL_DELAY = 1500;

interface SegmentInstance {
  readonly id: SegmentId;
  readonly el: HTMLElement;
  readonly typed: Typed;
}

interface Options {
  /** IntersectionObserver threshold below which the sequence pauses. */
  pauseThreshold?: number;
}

export interface TypedSequenceController {
  pause(): void;
  resume(): void;
  destroy(): void;
}

/**
 * Starts a Typed.js-driven intro sequence inside `host`.
 *
 * Each segment is rendered server-side as `<span id="seg-{id}">` with its
 * strings sourced from `<ul id="seg-{id}--strings">`. On first pass segments
 * type in declaration order; afterwards a different segment is picked at
 * random after each completed string, matching MF's rolling rotation.
 */
export function startTypedSequence(
  host: HTMLElement,
  options: Options = {},
): TypedSequenceController {
  const pauseThreshold = options.pauseThreshold ?? 0.666;

  const segments: SegmentInstance[] = [];
  let currentIndex = 0;
  let firstPass = true;
  let paused = false;
  let pendingTimer: number | null = null;

  function clearTimer() {
    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
  }

  function findEl(id: SegmentId): HTMLElement {
    const el = host.querySelector<HTMLElement>(`#seg-${id}`);
    if (!el) throw new Error(`Missing typed segment: #seg-${id}`);
    return el;
  }

  function setActive(idx: number) {
    currentIndex = idx;
    for (const s of segments) s.el.classList.remove(ACTIVE);
    segments[idx].el.classList.add(ACTIVE);
  }

  function setTyping(idx: number) {
    for (const s of segments) s.el.classList.remove(TYPING);
    segments[idx].el.classList.add(TYPING);
  }

  function clearTyping(idx: number) {
    segments[idx].el.classList.remove(TYPING);
  }

  function markFresh(idx: number) {
    for (const s of segments) s.el.classList.remove(FRESH);
    segments[idx].el.classList.add(FRESH);
  }

  function pickRandomOther(currentIdx: number): number {
    if (segments.length <= 1) return currentIdx;
    let pick: number;
    do {
      pick = Math.floor(Math.random() * segments.length);
    } while (pick === currentIdx);
    return pick;
  }

  function scheduleNext(currentIdx: number) {
    if (paused) return;

    let nextIdx: number;
    if (firstPass) {
      nextIdx = currentIdx + 1;
      if (nextIdx >= segments.length) {
        firstPass = false;
        nextIdx = pickRandomOther(currentIdx);
      }
    } else {
      nextIdx = pickRandomOther(currentIdx);
    }

    setActive(nextIdx);
    pendingTimer = window.setTimeout(() => {
      pendingTimer = null;
      if (paused) return;
      segments[nextIdx].typed.start();
    }, HAND_OFF_DELAY);
  }

  introSegments.forEach((seg, i) => {
    const el = findEl(seg.id);
    const typed = new Typed(`#seg-${seg.id}`, {
      stringsElement: `#seg-${seg.id}--strings`,
      typeSpeed: TYPE_SPEED,
      backSpeed: BACK_SPEED,
      backDelay: HAND_OFF_DELAY,
      startDelay: i === 0 ? INITIAL_DELAY : 0,
      shuffle: true,
      loop: true,
      smartBackspace: false,
      showCursor: false,
      autoInsertCss: false,
      onStart: () => setTyping(i),
      onTypingPaused: () => clearTyping(i),
      onTypingResumed: () => setTyping(i),
      onStringTyped: (_pos, self) => {
        clearTyping(i);
        markFresh(i);
        // Halt the loop so this segment doesn't immediately backspace +
        // retype. Another segment will take over via scheduleNext; when
        // this one is picked again, .start() resumes from here, backspacing
        // the current string before typing a new shuffled one.
        self.stop();
        scheduleNext(i);
      },
    });
    if (i !== 0) typed.stop();
    segments.push({ id: seg.id, el, typed });
  });

  setActive(0);

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        host.classList.remove(BACKGROUND);
        if (paused) {
          paused = false;
          clearTimer();
          pendingTimer = window.setTimeout(() => {
            pendingTimer = null;
            segments[currentIndex].typed.start();
          }, INITIAL_DELAY);
        }
      } else {
        host.classList.add(BACKGROUND);
        if (!paused) {
          paused = true;
          clearTimer();
          for (const s of segments) s.typed.stop();
        }
      }
    },
    { threshold: pauseThreshold },
  );
  observer.observe(host);

  return {
    pause() {
      paused = true;
      clearTimer();
      for (const s of segments) s.typed.stop();
    },
    resume() {
      paused = false;
      segments[currentIndex].typed.start();
    },
    destroy() {
      observer.disconnect();
      clearTimer();
      for (const s of segments) s.typed.destroy();
    },
  };
}
