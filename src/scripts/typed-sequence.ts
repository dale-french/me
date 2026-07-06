/*
 * Hero typing sequence.
 *
 * Drives the animated <h1> in the Hero. Each segment (hello, name, job, …)
 * is an inline <span>; the controller decides who's "active" and types the
 * next shuffled string into that segment one grapheme at a time. After a
 * segment finishes, the baton lingers, fades to the next segment, thinks,
 * and types again.
 *
 * The string source supports inline `^N` pause markers (sleep N ms before
 * resuming) and raw HTML (tags emit at once; their text content types).
 */

import { introSegments, type SegmentId } from "../data/intro";

/* ------------------------------- timing -------------------------------- */

const TYPE_SPEED = 28;
const BACK_SPEED = 22;
const INITIAL_DELAY = 3000;
// Beat between erasing prior content and typing the new string. A short
// "fresh canvas" moment so the swap doesn't read as a hard cut.
const POST_BACKSPACE_SETTLE = 500;

const LINGER_BASE = 450;
const LINGER_LENGTH_MS_PER_CHAR = 8;
const LINGER_LENGTH_CAP = 250;

const THINK_BASE = 650;
const THINK_LENGTH_MS_PER_CHAR = 6;
const THINK_LENGTH_CAP = 250;

const PRE_THINK_BONUS_AFTER: Partial<Record<SegmentId, number>> = {
  next: 350,
  outro: 350,
};

// Rotation handoffs (where `next` has prior content about to be erased) get
// extra breathing room around the swap. The user is comparing what's there
// to what's about to arrive — they need more time on the just-finished
// string before the baton moves, and more time on the old content before
// it's erased. First-pass handoffs (next is fresh) skip both bonuses.
const REVISIT_LINGER_BONUS = 750;
const REVISIT_THINK_BONUS = 350;

const PUNCT_BONUS: Record<string, number> = {
  ".": 120,
  "!": 80,
  "?": 220,
  "…": 320,
  ")": 100,
};

/* ------------------------------ sequence ------------------------------- */

// First pass — a deliberate intro story, ending with the close.
const INITIAL_ORDER: readonly SegmentId[] = [
  "hello",
  "name",
  "job",
  "live",
  "previous",
  "next",
  "outro",
];

// After the initial pass, segments rotate randomly from this pool. `outro`
// is excluded so the closer never reappears mid-rotation.
const ROTATION_POOL: readonly SegmentId[] = [
  "hello",
  "name",
  "job",
  "fact",
  "live",
  "previous",
  "next",
];

/* -------------------------------- DOM ---------------------------------- */

const ACTIVE = "typed--active";
const TYPING = "typed--typing";

/* ------------------------------- types --------------------------------- */

type Token =
  | { kind: "char"; text: string }
  | { kind: "tag"; text: string }
  | { kind: "pause"; ms: number };

interface Segment {
  readonly id: SegmentId;
  readonly el: HTMLElement;
  readonly strings: readonly string[];
  sequence: number[];
  pos: number;
  lastTyped: string;
}

export interface TypedSequenceController {
  pause(): void;
  resume(): void;
  destroy(): void;
}

class CancelledError extends Error {}

/* ----------------------------- utilities ------------------------------- */

const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });

function* graphemesOf(s: string): Iterable<string> {
  for (const { segment } of segmenter.segment(s)) yield segment;
}

function shuffledIndices(n: number): number[] {
  const out = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const PAUSE_MARKER = /^\^(\d+)/;

/** Split a string into tokens for typing: graphemes, HTML tags, ^N pauses. */
function tokenize(raw: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let textRun = "";

  const flushTextRun = () => {
    if (!textRun) return;
    for (const g of graphemesOf(textRun)) tokens.push({ kind: "char", text: g });
    textRun = "";
  };

  while (i < raw.length) {
    const ch = raw[i];
    if (ch === "^") {
      const match = PAUSE_MARKER.exec(raw.slice(i));
      if (match) {
        flushTextRun();
        tokens.push({ kind: "pause", ms: parseInt(match[1], 10) });
        i += match[0].length;
        continue;
      }
    }
    if (ch === "<") {
      const end = raw.indexOf(">", i);
      if (end !== -1) {
        flushTextRun();
        tokens.push({ kind: "tag", text: raw.slice(i, end + 1) });
        i = end + 1;
        continue;
      }
    }
    textRun += ch;
    i += 1;
  }
  flushTextRun();
  return tokens;
}

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

/** ±50% jitter around `base` ms-per-char so typing feels less mechanical. */
function humanize(base: number): number {
  return base + Math.round((Math.random() * base) / 2);
}

/* ---------------------------- controller ------------------------------- */

export function startTypedSequence(
  host: HTMLElement,
): TypedSequenceController {
  const segments = new Map<SegmentId, Segment>();
  for (const seg of introSegments) {
    const el = host.querySelector<HTMLElement>(`#seg-${seg.id}`);
    if (!el) continue;
    segments.set(seg.id, {
      id: seg.id,
      el,
      strings: seg.strings,
      sequence: shuffledIndices(seg.strings.length),
      pos: 0,
      lastTyped: "",
    });
  }

  let cancelled = false;
  let paused = false;
  let activeTimer: number | null = null;
  let activeSleepResolve: (() => void) | null = null;
  const pauseWaiters: (() => void)[] = [];

  function sleep(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      activeSleepResolve = resolve;
      activeTimer = window.setTimeout(() => {
        activeTimer = null;
        activeSleepResolve = null;
        resolve();
      }, ms);
    });
  }

  function waitWhilePaused(): Promise<void> {
    if (!paused) return Promise.resolve();
    return new Promise<void>((resolve) => pauseWaiters.push(resolve));
  }

  /**
   * Yield point between awaits. Resolves immediately if running; blocks
   * while paused; throws CancelledError if destroyed. Use only at segment
   * boundaries (handoff, run loop) so a pause never strands a half-typed
   * sentence on screen.
   */
  async function checkpoint(): Promise<void> {
    if (paused) await waitWhilePaused();
    if (cancelled) throw new CancelledError();
  }

  /**
   * Cancel-only yield point. Ignores pause so the in-flight sentence
   * (typing or backspacing) completes before pause takes effect at the
   * next handoff.
   */
  function cancelOnly(): void {
    if (cancelled) throw new CancelledError();
  }

  function setActive(seg: Segment) {
    host
      .querySelectorAll("." + ACTIVE)
      .forEach((el) => el.classList.remove(ACTIVE));
    seg.el.classList.add(ACTIVE);
  }

  function setTyping(seg: Segment) {
    host
      .querySelectorAll("." + TYPING)
      .forEach((el) => el.classList.remove(TYPING));
    seg.el.classList.add(TYPING);
  }

  function clearTyping(seg: Segment) {
    seg.el.classList.remove(TYPING);
  }

  function peekString(seg: Segment): string {
    return seg.strings[seg.sequence[seg.pos]] ?? "";
  }

  function advanceCursor(seg: Segment): void {
    seg.pos += 1;
    if (seg.pos >= seg.sequence.length) {
      const lastPlayed = seg.sequence[seg.sequence.length - 1];
      seg.pos = 0;
      seg.sequence = shuffledIndices(seg.strings.length);
      // Don't let the fresh shuffle open with the string that just played —
      // erasing a sentence and retyping it verbatim reads as a glitch.
      if (seg.sequence.length > 1 && seg.sequence[0] === lastPlayed) {
        const j = 1 + Math.floor(Math.random() * (seg.sequence.length - 1));
        [seg.sequence[0], seg.sequence[j]] = [seg.sequence[j], seg.sequence[0]];
      }
    }
  }

  /** Concatenate a token list into rendered HTML (skipping pause markers). */
  function renderTokens(tokens: readonly Token[]): string {
    let out = "";
    for (const tok of tokens) {
      if (tok.kind !== "pause") out += tok.text;
    }
    return out;
  }

  /**
   * Backspace the segment's prior content one grapheme at a time. Tags fall
   * off instantly with the char to their right — they're invisible, so the
   * user only sees char-by-char shrinking. We may briefly leave unbalanced
   * tags in the DOM (e.g. an open `<em>` whose `</em>` was already popped);
   * the browser closes the element at the boundary, so the visual is just
   * "italic region shrinks" rather than a flash of broken markup.
   */
  async function backspaceCurrent(seg: Segment): Promise<void> {
    const tokens = tokenize(seg.lastTyped).filter((t) => t.kind !== "pause");
    while (tokens.length > 0) {
      cancelOnly();
      while (
        tokens.length > 0 &&
        tokens[tokens.length - 1].kind === "tag"
      ) {
        tokens.pop();
      }
      if (tokens.length === 0) break;
      tokens.pop();
      seg.el.innerHTML = renderTokens(tokens);
      await sleep(humanize(BACK_SPEED));
    }
    seg.el.innerHTML = "";
    seg.lastTyped = "";
  }

  /**
   * Type `seg`'s next string. If `seg` carries content from an earlier
   * visit, erase it first and settle on the empty slot for a beat before
   * typing — so each visit reads as a complete "erase → type" gesture
   * rather than a snap-replace. The caret stays solid throughout.
   */
  async function typeSegment(seg: Segment): Promise<void> {
    setTyping(seg);
    if (seg.lastTyped) {
      await backspaceCurrent(seg);
      await sleep(POST_BACKSPACE_SETTLE);
      cancelOnly();
    }
    const str = peekString(seg);
    let html = "";
    for (const tok of tokenize(str)) {
      cancelOnly();
      switch (tok.kind) {
        case "tag":
          html += tok.text;
          seg.el.innerHTML = html;
          break;
        case "pause":
          await sleep(tok.ms);
          break;
        case "char":
          await sleep(humanize(TYPE_SPEED));
          cancelOnly();
          html += tok.text;
          seg.el.innerHTML = html;
          break;
      }
    }
    clearTyping(seg);
    seg.lastTyped = str;
    advanceCursor(seg);
  }

  /**
   * Linger on `from` to absorb what just typed, move the baton to `next`,
   * then think. Erasure of `next`'s prior content happens inside
   * `typeSegment`, deliberately *after* the think — so the user gets a
   * silent window to read `next`'s old content (or, on the first pass,
   * just to settle into the empty slot) before it's replaced. Revisit
   * handoffs widen both pauses for a more deliberate swap rhythm.
   */
  async function handoff(from: Segment, next: Segment): Promise<void> {
    // Pause point: the just-finished sentence is fully typed and visible.
    // If a pause is pending (e.g. footer scrolled into view), block here
    // before starting the linger so the dim doesn't fall over a sentence
    // in motion.
    await checkpoint();
    const revisit = next.lastTyped !== "";
    const lingerBonus = revisit ? REVISIT_LINGER_BONUS : 0;
    const thinkBonus = revisit ? REVISIT_THINK_BONUS : 0;
    await sleep(lingerFor(from.lastTyped) + lingerBonus);
    await checkpoint();
    setActive(next);
    await sleep(thinkFor(peekString(next), from.id) + thinkBonus);
    await checkpoint();
  }

  function pickFromPool(excludeId: SegmentId): Segment | null {
    const candidates = ROTATION_POOL.filter(
      (id) => id !== excludeId && segments.has(id),
    );
    if (!candidates.length) return null;
    const id = candidates[Math.floor(Math.random() * candidates.length)];
    return segments.get(id) ?? null;
  }

  async function run(): Promise<void> {
    const hello = segments.get("hello");
    if (!hello) return;

    setActive(hello);
    await sleep(INITIAL_DELAY);
    await checkpoint();
    await typeSegment(hello);

    let from: Segment = hello;
    for (const id of INITIAL_ORDER.slice(1)) {
      const next = segments.get(id);
      if (!next) continue;
      await handoff(from, next);
      await typeSegment(next);
      from = next;
    }

    while (!cancelled) {
      const next = pickFromPool(from.id);
      if (!next) return;
      await handoff(from, next);
      await typeSegment(next);
      from = next;
    }
  }

  run().catch((err) => {
    if (err instanceof CancelledError) return;
    throw err;
  });

  function pause() {
    if (paused) return;
    paused = true;
  }

  function resume() {
    if (!paused) return;
    paused = false;
    const waiters = pauseWaiters.splice(0);
    for (const resolve of waiters) resolve();
  }

  return {
    pause,
    resume,
    destroy() {
      cancelled = true;
      if (activeTimer !== null) {
        clearTimeout(activeTimer);
        activeTimer = null;
      }
      // Settle the in-flight sleep so the run loop reaches its next cancel
      // check and exits via CancelledError instead of hanging forever.
      activeSleepResolve?.();
      activeSleepResolve = null;
      const waiters = pauseWaiters.splice(0);
      for (const resolve of waiters) resolve();
    },
  };
}
