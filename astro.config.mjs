// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [{
    provider: fontProviders.fontsource(),
    name: "Raleway",
    weights: [400, 500, 600, 700],
    cssVariable: "--font-raleway",
  }]
});