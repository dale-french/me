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
}

/**
 * Candidate strings for each segment of the hero typing sequence. The
 * controller in `src/scripts/typed-sequence.ts` owns segment order and the
 * shuffle within each segment. Strings may include inline `^N` pause
 * markers and raw HTML; emoji-only strings need no special handling (the
 * controller prefixes a zero-width space to hold the text baseline).
 */
export const introSegments: readonly IntroSegment[] = [
  { id: "hello", strings: hello },
  { id: "name", strings: name },
  { id: "job", strings: job },
  { id: "fact", strings: fact },
  { id: "live", strings: live },
  { id: "next", strings: next },
  { id: "outro", strings: outro },
];

/**
 * Canonical one-sentence intro for every non-animated surface: the hero's
 * aria-label, its noscript fallback, and the reduced-motion/unsupported
 * static text. Lives here so it can't drift from the typed content above.
 */
export const staticIntro =
  "Hi there. My name is Dale French, and I’m a frontend engineer and engineering manager based in Amsterdam.";
