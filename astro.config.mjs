// @ts-check

import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://dalefrench.dev",
  integrations: [sitemap()],

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Allo",
      cssVariable: "--font-allo",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/AlloVariableFriendly.woff2"],
            weight: "100 900",
            style: "normal",
            display: "swap",
          },
          {
            src: ["./src/assets/fonts/Allo-MediumOblique.woff2"],
            weight: 500,
            style: "italic",
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
