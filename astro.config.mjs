// @ts-check
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/abonate': 'https://abonate.balonmanovetusta.com',
  },
  integrations: [react()],
});
