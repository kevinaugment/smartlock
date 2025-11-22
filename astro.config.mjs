import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://smartlockhub.engineering',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // We'll use custom base styles
    }),
    sitemap(),
    mdx(),
  ],
  output: 'static', // Static site generation
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
