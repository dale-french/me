import { describe, expect, it } from "vitest";

import { strip, tokenize, withBaselineHolder } from "./typed-tokens";

describe("tokenize", () => {
  it("splits plain text into one char token per grapheme", () => {
    expect(tokenize("Hi.")).toEqual([
      { kind: "char", text: "H" },
      { kind: "char", text: "i" },
      { kind: "char", text: "." },
    ]);
  });

  it("keeps multi-code-point emoji as a single grapheme", () => {
    expect(tokenize("🛠️")).toEqual([{ kind: "char", text: "🛠️" }]);
    expect(tokenize("🇿🇦")).toEqual([{ kind: "char", text: "🇿🇦" }]);
  });

  it("emits ^N markers as pause tokens", () => {
    expect(tokenize("Oh,^250 hi.")).toEqual([
      { kind: "char", text: "O" },
      { kind: "char", text: "h" },
      { kind: "char", text: "," },
      { kind: "pause", ms: 250 },
      { kind: "char", text: " " },
      { kind: "char", text: "h" },
      { kind: "char", text: "i" },
      { kind: "char", text: "." },
    ]);
  });

  it("treats a caret without digits as literal text", () => {
    expect(tokenize("a^b")).toEqual([
      { kind: "char", text: "a" },
      { kind: "char", text: "^" },
      { kind: "char", text: "b" },
    ]);
  });

  it("emits tags whole while their content types char by char", () => {
    expect(tokenize("<em>flex</em>")).toEqual([
      { kind: "tag", text: "<em>" },
      { kind: "char", text: "f" },
      { kind: "char", text: "l" },
      { kind: "char", text: "e" },
      { kind: "char", text: "x" },
      { kind: "tag", text: "</em>" },
    ]);
  });

  it("treats an unclosed angle bracket as literal text", () => {
    expect(tokenize("1 < 2")).toEqual([
      { kind: "char", text: "1" },
      { kind: "char", text: " " },
      { kind: "char", text: "<" },
      { kind: "char", text: " " },
      { kind: "char", text: "2" },
    ]);
  });

  it("handles the empty string", () => {
    expect(tokenize("")).toEqual([]);
  });
});

describe("strip", () => {
  it("returns only the visible text", () => {
    expect(strip("I have opinions about <em>flex</em> vs <em>grid</em>.")).toBe(
      "I have opinions about flex vs grid.",
    );
    expect(strip("Oh,^250 hi.")).toBe("Oh, hi.");
  });

  it("strips a tag-wrapped emoji down to the emoji", () => {
    expect(strip("<span>👋</span>")).toBe("👋");
  });
});

describe("withBaselineHolder", () => {
  it("leaves strings with bare text untouched", () => {
    expect(withBaselineHolder("Hi.")).toBe("Hi.");
    expect(withBaselineHolder("Same same, <em>but different</em>.")).toBe(
      "Same same, <em>but different</em>.",
    );
  });

  it("prefixes a zero-width space when all text sits inside tags", () => {
    expect(withBaselineHolder("<span>👋</span>")).toBe(
      "\u{200B}<span>👋</span>",
    );
  });

  it("prefixes a zero-width space when there is no text at all", () => {
    expect(withBaselineHolder("")).toBe("\u{200B}");
  });
});
