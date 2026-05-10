import hello from "./hello";
import name from "./name";
import job from "./job";
import fact from "./fact";
import live from "./live";
import previous from "./previous";
import next from "./next";
import outro from "./outro";

export type SegmentId =
  | "hello"
  | "name"
  | "job"
  | "fact"
  | "live"
  | "previous"
  | "next"
  | "outro";

export interface IntroSegment {
  readonly id: SegmentId;
  readonly strings: readonly string[];
}

/**
 * Sequence order. The first pass types segments in this order; subsequent
 * passes pick segments at random. Segments whose `strings` include empty
 * entries can render as gaps during random rotation — that's intentional.
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
