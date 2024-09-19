// @ts-check
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig, envField } from 'astro/config';
import { site } from './.meta/site-url.mjs';

// https://astro.build/config
export default defineConfig({
  site: site.href,
  env: {
    schema: {
      RFEBM_API_BASE_HREF: envField.string({
        context: 'server',
        access: 'public',
        optional: false,
      }),
      PRIMERA_GROUP_ID: envField.number({
        context: 'server',
        access: 'public',
        optional: false,
      }),
      PRIMERA_TEAM_ID: envField.number({
        context: 'server',
        access: 'public',
        optional: false,
      }),
      SEASON_ID: envField.number({
        context: 'server',
        access: 'public',
        optional: false,
      }),
    },
  },
  integrations: [react()],
  output: 'server',
  adapter: vercel({
    includeFiles: [
      'public/assets/fonts/alumni/AlumniSans-Bold.ttf',
      'public/assets/fonts/alumni/AlumniSans-BoldItalic.ttf',
    ],
    webAnalytics: { enabled: true },
    imageService: true,
    devImageService: 'sharp',
  }),
});
