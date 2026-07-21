import { THEME_COLORS } from "../consts";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * The effective theme for a stored override + system preference. Anything
 * but a valid override (missing, or garbage someone wrote to localStorage)
 * falls through to the system.
 */
export function resolveCurrentTheme(
  override: string | null,
  systemDark: boolean,
): Theme {
  if (override === "light" || override === "dark") return override;
  return systemDark ? "dark" : "light";
}

/**
 * The state after a toggle press: always flip the visible theme, but only
 * store an override while it disagrees with the system. Flipping back to
 * the system's choice returns to following it, so a later OS switch isn't
 * pinned to a stale preference.
 */
export function resolveToggle(
  current: Theme,
  system: Theme,
): { next: Theme; stored: Theme | null } {
  const next: Theme = current === "dark" ? "light" : "dark";
  return { next, stored: next === system ? null : next };
}

/**
 * Wires the theme toggle. Colors and the bulb icon track the theme via CSS
 * (`color-scheme` + `light-dark()`); this only maintains the override in
 * localStorage / `data-theme`, the theme-color metas, and `aria-pressed`
 * (pressed = dark active).
 */
export function mountThemeToggle(button: HTMLButtonElement): void {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  const currentTheme = () =>
    resolveCurrentTheme(
      document.documentElement.dataset.theme ?? null,
      systemDark.matches,
    );

  const syncPressed = () => {
    button.setAttribute("aria-pressed", String(currentTheme() === "dark"));
  };

  button.addEventListener("click", () => {
    const system: Theme = systemDark.matches ? "dark" : "light";
    const { stored } = resolveToggle(currentTheme(), system);

    if (stored) {
      document.documentElement.dataset.theme = stored;
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      if (stored) {
        localStorage.setItem(STORAGE_KEY, stored);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Storage can be unavailable (private mode); the theme still applies
      // for this visit.
    }

    // With an override, both metas pin to its color; without one, each meta
    // falls back to its own `media` match again.
    document
      .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
      .forEach((meta) => {
        meta.content = stored
          ? THEME_COLORS[stored]
          : meta.media.includes("dark")
            ? THEME_COLORS.dark
            : THEME_COLORS.light;
      });

    syncPressed();
  });

  // When following the system, an OS-level switch flips the CSS on its own;
  // only the ARIA state needs a nudge.
  systemDark.addEventListener("change", syncPressed);

  syncPressed();
}
