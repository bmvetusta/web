// @ts-check
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig, envField } from 'astro/config';
import { site } from './.meta/site-url.mjs';

// https://astro.build/config
export default defineConfig({
  site: site.href,
  integrations: [react()],
  build: {
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
    devImageService: 'sharp',
  }),
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
  server: {
    headers: {
      'Content-Security-Policy':
        "upgrade-insecure-requests; script-src 'self' static.cloudflareinsights.com; connect-src 'self';media-src 'self' https:;img-src 'self' data: blob: https:;default-src 'none';base-uri 'self';frame-ancestors 'none';style-src 'self' 'unsafe-inline';font-src 'self';manifest-src 'self';",
    },
  },
  env: {
    schema: {
      RFEBM_USER_AGENT: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: `5&,?"->(1483>%1*!("%* 0''>8.38-"?",("2#,!$(1>:64?"?,#?*='")*2" =.70&"7*/5*IOS`,
      }),
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
      REDIS_REST_URL: envField.string({
        context: 'server',
        access: 'public',
        optional: false,
      }),
      REDIS_REST_TOKEN: envField.string({
        context: 'server',
        access: 'public',
        optional: false,
      }),
      REDIS_TIMEOUT: envField.number({
        context: 'server',
        access: 'public',
        optional: false,
        default: 9_000,
      }),
      // FETCH_TIMEOUT: envField.number({
      //   context: 'server',
      //   access: 'public',
      //   optional: false,
      //   default: 9_000,
      // }),
      PROXY_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      // PROXY_USER: envField.string({
      //   context: 'server',
      //   access: 'secret',
      //   optional: true,
      // }),
      // PROXY_PASSWORD: envField.string({
      //   context: 'server',
      //   access: 'secret',
      //   optional: true,
      // }),
    },
  },
});
