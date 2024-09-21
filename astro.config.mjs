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
      YOUTUBE_CHANNEL: envField.string({
        context: 'server',
        access: 'public',
        optional: false,
        default: '@balonmanovetusta',
      }),
      // YOUTUBE_CHANNEL_ID: envField.string({
      //   context: 'server',
      //   access: 'public',
      //   optional: true,
      //   default: 'UCIL4QnwwTj0h4zFH57K-u9A',
      // }),
    },
  },
  integrations: [react()],
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
    devImageService: 'sharp',
  }),
});
