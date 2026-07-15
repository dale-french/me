# Agent notes

Personal portfolio site (dalefrench.dev). Astro 6 + Tailwind 4, statically
built, served as Cloudflare Workers static assets. No client framework:
interactivity is plain TypeScript mounted from component `<script>` tags.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm check` — astro check (type-checks `.astro` and `.ts`)
- `pnpm test` — vitest unit tests
- `pnpm format` / `pnpm format:check` — prettier (the only formatter)

CI (`.github/workflows/ci.yml`) runs format check, type check, tests, and
the build; all must pass.

## Layout

- `src/data/` — content as data: hero intro strings, contact links, footer
  notes. Adding or editing copy is a data change only; the animation
  sequence derives from `src/data/intro/index.ts`, so a new segment can't
  be silently left out.
- `src/scripts/` — framework-free TS modules, mounted from `<script>` tags
  in components. `typed-sequence.ts` drives the hero typing animation.
- `src/components/`, `src/layouts/`, `src/pages/` — Astro.
- `src/styles/` — `global.css` (Tailwind theme + base), `tokens.css`
  (design tokens), `parallax.css` (scroll effect, see gotcha below).

## Gotchas

- **`<body>` is the scroll container, not `window`.** The parallax effect
  (`src/styles/parallax.css`) sets `overflow: hidden` on `html` and scrolls
  `body` inside a 3D perspective. Scroll listeners must attach to
  `document.body` (a `window` scroll listener never fires), and the scroll
  position is `document.body.scrollTop`.
- **Astro scoped styles can't reach child-component DOM.** To size or style
  something inside a child (e.g. the svg in `Logo.astro`), pass Tailwind
  utilities via the `class` prop or use `:global()` — a scoped selector in
  the parent silently does nothing.
- **Hero strings use a mini-syntax.** Strings in `src/data/intro` may
  contain `^N` (pause typing for N ms) and inline HTML (tags emit at once;
  their text content types out). `staticIntro` in `src/data/intro/index.ts`
  is the canonical fallback sentence for every non-animated surface.
- **Motion is progressive.** Parallax and the typing animation both
  disable under `prefers-reduced-motion`, and the typing animation also
  falls back to `staticIntro` without JS or `Intl.Segmenter`. Keep new
  motion behind the same guards.

## Conventions

- Comments explain _why_, never _what_ — keep that bar.
- Conventional commit messages with a trailing emoji (see `git log`).
- This is a public repo: no secrets, no dead code, no leftover scaffolding.
