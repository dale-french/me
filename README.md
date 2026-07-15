# dalefrench.dev

My personal website — [dalefrench.dev](https://dalefrench.dev).

A single page that introduces itself: the hero types, erases, and retypes
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

## License

[MIT](LICENSE). The Neue Haas Grotesk font files are licensed separately
and are not covered.
