// @ts-check
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig, envField } from 'astro/config';
import { site } from './.meta/site-url.mjs';

const headers = {
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=120',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

if (!import.meta.env.DEV) {
  headers['Access-Control-Allow-Origin'] = site.href;
  // @ts-ignore
  headers['Content-Security-Policy'] =
    "upgrade-insecure-requests; script-src 'self' *.cloudflareinsights.com; connect-src 'self' *.cloudflareinsights.com; media-src 'self' https:; img-src 'self' data: blob: https:; object-src 'self'; default-src 'none'; base-uri 'self'; frame-ancestors 'none'; font-src 'self' https://fonts.bunny.net; style-src 'self' https://fonts.bunny.net 'unsafe-inline'; manifest-src 'self';";
}

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
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=120',
      'Access-Control-Allow-Origin': 'https://balonmanovetusta.com',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Content-Security-Policy':
        "upgrade-insecure-requests; script-src 'self' *.cloudflareinsights.com; connect-src 'self' *.cloudflareinsights.com; media-src 'self' https:; img-src 'self' data: blob: https:; object-src 'self'; default-src 'none'; base-uri 'self'; frame-ancestors 'none'; font-src 'self' https://fonts.bunny.net; style-src 'self' https://fonts.bunny.net 'unsafe-inline'; manifest-src 'self';",
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
