import hello from "./hello";
import name from "./name";
import job from "./job";
import fact from "./fact";
import live from "./live";
import previous from "./previous";
import next from "./next";
import outro from "./outro";

export type SegmentId =
  "hello" | "name" | "job" | "fact" | "live" | "previous" | "next" | "outro";

export interface IntroSegment {
  readonly id: SegmentId;
  readonly strings: readonly string[];
}

/**
 * Candidate strings for each segment of the hero typing sequence. The
 * controller in `src/scripts/typed-sequence.ts` owns the order in which
 * segments appear and the shuffle within each segment.
 *
 * Strings may include inline `^N` pause markers (sleep N ms while typing)
 * and raw HTML — tags emit at once, their text content types per grapheme.
 *
 * Emoji-only strings in `hello.ts` start with an invisible zero-width space
 * (U+200B) so the segment still has text content and holds the line's text
 * baseline. It's easy to delete by accident — leave it in place.
 */
export const introSegments: readonly IntroSegment[] = [
  { id: "hello", strings: hello },
  { id: "name", strings: name },
  { id: "job", strings: job },
  { id: "fact", strings: fact },
  { id: "live", strings: live },
  { id: "previous", strings: previous },
  { id: "next", strings: next },
  { id: "outro", strings: outro },
];
