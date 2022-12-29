import { defineConfig } from 'astro/config';

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
import image from "@astrojs/image";

// https://astro.build/config
// export default defineConfig({
//   integrations: [sitemap(), image()],
//   output: "server",
//   adapter: netlify(),
//   experimental: {
//     errorOverlay: true,
//   },
// });