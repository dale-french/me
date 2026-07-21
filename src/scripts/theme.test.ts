import { describe, expect, it } from "vitest";

import { resolveCurrentTheme, resolveToggle } from "./theme";

describe("resolveCurrentTheme", () => {
  it("honours a valid override regardless of the system", () => {
    expect(resolveCurrentTheme("dark", false)).toBe("dark");
    expect(resolveCurrentTheme("light", true)).toBe("light");
  });

  it("follows the system when there is no override", () => {
    expect(resolveCurrentTheme(null, true)).toBe("dark");
    expect(resolveCurrentTheme(null, false)).toBe("light");
  });

  it("ignores garbage stored by other tools or old versions", () => {
    expect(resolveCurrentTheme("auto", true)).toBe("dark");
    expect(resolveCurrentTheme("", false)).toBe("light");
  });
});

describe("resolveToggle", () => {
  it("stores an override when flipping away from the system theme", () => {
    expect(resolveToggle("light", "light")).toEqual({
      next: "dark",
      stored: "dark",
    });
    expect(resolveToggle("dark", "dark")).toEqual({
      next: "light",
      stored: "light",
    });
  });

  it("clears the override when flipping back to the system theme", () => {
    expect(resolveToggle("dark", "light")).toEqual({
      next: "light",
      stored: null,
    });
    expect(resolveToggle("light", "dark")).toEqual({
      next: "dark",
      stored: null,
    });
  });
});
