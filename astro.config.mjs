// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://dalefrench.dev",
  integrations: [mdx(), sitemap()],

  markdown: {
    shikiConfig: {
      theme: "github-light",
      wrap: false,
    },
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Neue Haas Grotesk Text",
      cssVariable: "--font-neue-haas-grotesk-text",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/neue-haas-grotesk-text--55--roman.woff2"],
            weight: 400,
            style: "normal",
            display: "swap",
          },
          {
            src: [
              "./src/assets/fonts/neue-haas-grotesk-text--56--italic.woff2",
            ],
            weight: 400,
            style: "italic",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/neue-haas-grotesk-text--75--bold.woff2"],
            weight: 700,
            style: "normal",
            display: "swap",
          },
          {
            src: [
              "./src/assets/fonts/neue-haas-grotesk-text--76--bold-italic.woff2",
            ],
            weight: 700,
            style: "italic",
            display: "swap",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Neue Haas Grotesk Display",
      cssVariable: "--font-neue-haas-grotesk-display",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: [
              "./src/assets/fonts/neue-haas-grotesk-display--65--medium.woff2",
            ],
            weight: 500,
            style: "normal",
            display: "swap",
          },
          {
            src: [
              "./src/assets/fonts/neue-haas-grotesk-display--66--medium-italic.woff2",
            ],
            weight: 500,
            style: "italic",
            display: "swap",
          },
          {
            src: [
              "./src/assets/fonts/neue-haas-grotesk-display--75--bold.woff2",
            ],
            weight: 700,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
