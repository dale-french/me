import hello from "./hello";
import name from "./name";
import job from "./job";
import fact from "./fact";
import live from "./live";
import next from "./next";
import outro from "./outro";

export type SegmentId =
  "hello" | "name" | "job" | "fact" | "live" | "next" | "outro";

export interface IntroSegment {
  readonly id: SegmentId;
  readonly strings: readonly string[];
  /** Part of the deliberate first pass, played in array order. */
  readonly firstPass: boolean;
  /** Eligible for the random rotation after the first pass. */
  readonly inRotation: boolean;
}

/**
 * Candidate strings for each segment of the hero typing sequence, plus
 * which passes the segment plays in — this array is the single source of
 * truth for sequence membership; the controller in
 * `src/scripts/typed-sequence.ts` only owns timing and the shuffle within
 * each segment. Strings may include inline `^N` pause markers and raw
 * HTML; emoji-only strings need no special handling (the controller
 * prefixes a zero-width space to hold the text baseline).
 */
export const introSegments: readonly IntroSegment[] = [
  { id: "hello", strings: hello, firstPass: true, inRotation: true },
  { id: "name", strings: name, firstPass: true, inRotation: true },
  { id: "job", strings: job, firstPass: true, inRotation: true },
  // `fact` is rotation-only garnish; it would slow the intro story down.
  { id: "fact", strings: fact, firstPass: false, inRotation: true },
  { id: "live", strings: live, firstPass: true, inRotation: true },
  { id: "next", strings: next, firstPass: true, inRotation: true },
  // `outro` closes the first pass and never reappears mid-rotation.
  { id: "outro", strings: outro, firstPass: true, inRotation: false },
];

/**
 * Canonical one-sentence intro for every non-animated surface: the hero's
 * aria-label, its noscript fallback, and the reduced-motion/unsupported
 * static text. Lives here so it can't drift from the typed content above.
 */
export const staticIntro =
  "Hi there. My name is Dale French, and I’m a frontend engineer and engineering manager based in Amsterdam.";
