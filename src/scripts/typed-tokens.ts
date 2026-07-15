/*
 * Tokenizer for the hero's typed strings. The strings (src/data/intro)
 * use a small mini-syntax: inline `^N` markers pause typing for N ms, and
 * raw HTML tags emit at once while their text content types. Everything
 * here is pure so the syntax has one home — the controller in
 * typed-sequence.ts only consumes tokens.
 */

export type Token =
  | { kind: "char"; text: string }
  | { kind: "tag"; text: string }
  | { kind: "pause"; ms: number };

// Guarded so importing this module never throws on browsers without
// Intl.Segmenter (Safari < 16.4, Firefox < 125); callers check
// isTypedSequenceSupported() and fall back to static text.
const segmenter =
  "Segmenter" in Intl
    ? new Intl.Segmenter("en", { granularity: "grapheme" })
    : null;

export function isTypedSequenceSupported(): boolean {
  return segmenter !== null;
}

function* graphemesOf(s: string): Iterable<string> {
  if (segmenter) {
    for (const { segment } of segmenter.segment(s)) yield segment;
  } else {
    // Only reachable if a caller skips the support check. Code points split
    // some emoji sequences, but everything still types.
    yield* Array.from(s);
  }
}

const PAUSE_MARKER = /^\^(\d+)/;

/** Split a string into tokens for typing: graphemes, HTML tags, ^N pauses. */
export function tokenize(raw: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let textRun = "";

  const flushTextRun = () => {
    if (!textRun) return;
    for (const g of graphemesOf(textRun))
      tokens.push({ kind: "char", text: g });
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

/** The string's visible text: tags and pause markers removed. */
export function strip(s: string): string {
  return tokenize(s)
    .filter((tok) => tok.kind === "char")
    .map((tok) => tok.text)
    .join("");
}

/**
 * The emoji <span>s render at line-height: 0 (see Hero.astro), so they
 * can't hold the line's baseline. Strings with no bare text outside their
 * tags get a zero-width space prefix so the segment still contributes
 * baseline text.
 */
export function withBaselineHolder(raw: string): string {
  let depth = 0;
  for (const tok of tokenize(raw)) {
    if (tok.kind === "tag") depth += tok.text.startsWith("</") ? -1 : 1;
    else if (tok.kind === "char" && depth === 0) return raw;
  }
  return `\u{200B}${raw}`;
}
