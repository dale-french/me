export default [
  // The emoji-only strings open with an invisible zero-width space (U+200B)
  // so the segment has real text content and keeps the line's text baseline.
  // It looks like nothing in an editor — don't "clean" it away.
  "​<span>👋</span>",
  "​<span>✋</span>",
  "​<span>🇳🇱</span>",
  "Hi.",
  "Hey.",
  "Hoi.",
  "Hallo.",
  "Hello.",
  "Howzit.",
  "Hi there.",
  "Hey there.",
  "Oh,^250 hi.",
  "Well,^250 hello.",
  "Hi,^375 again.",
  "Hello there.",
  "Nice to meet you.",
  "You found me online.",
] as const satisfies readonly string[];
