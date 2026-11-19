# dalefrench.dev

My personal website — [dalefrench.dev](https://dalefrench.dev).

A single page that introduces me: the hero types, erases, and retypes
shuffled intro lines from a small pool, over a subtle CSS-only parallax.
Everything degrades gracefully — no JS, reduced motion, and old browsers
all get a static intro.

## Stack

- [Astro](https://astro.build) 6 with [Tailwind CSS](https://tailwindcss.com) 4
- No client framework — interactivity is vanilla TypeScript in component scripts
- Deployed to [Cloudflare Workers](https://workers.cloudflare.com) as static assets

## Develop

```sh
pnpm install
pnpm dev
```

`pnpm build` builds to `dist/`, `pnpm check` type-checks, `pnpm test` runs
the unit tests, and `pnpm format` formats. CI runs all four.

Working on this repo with an AI agent? Start with [AGENTS.md](AGENTS.md).

## Typography

The site self-hosts [Allo](https://allo.joshpuckett.me) v1.0.3 by Josh
Puckett, using Astro’s local font provider. There are no external font
requests.

Typography uses Allo’s Friendly webfont, with roundness fixed at 50 to
reduce the download size while retaining variable weight and automatic
optical sizing. The normal variable face is preloaded; the true medium
oblique loads only when needed.

- `src/assets/fonts/AlloVariableFriendly.woff2` — normal, weights 100–900
- `src/assets/fonts/Allo-MediumOblique.woff2` — italic, weight 500
- `src/assets/fonts/OFL.txt` — upstream license and copyright notices

## License

[MIT](LICENSE) for source code; personal content and branding are reserved.
The Allo fonts are licensed separately under the
[SIL Open Font License 1.1](src/assets/fonts/OFL.txt).
