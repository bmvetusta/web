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

if (import.meta.env.PROD) {
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
    headers,
  },
  env: {
    schema: {
      // App
      RFEBM_APP_ID: envField.number({
        context: 'server',
        access: 'secret',
        optional: true,
        default: 1244686472,
      }),

      // Api
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

      // Custom club data to request api
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
      CLUB_ID: envField.number({
        context: 'server',
        access: 'public',
        optional: false,
      }),
      CLUB_AMBITO_ID: envField.number({
        context: 'server',
        access: 'public',
        optional: false,
      }),

      // Youtube
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

      // Redis stuff
      REDIS_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      REDIS_COMMAND_TIMEOUT: envField.number({
        context: 'server',
        access: 'public',
        optional: true,
        default: 2, // seconds
      }),
      REDIS_CONNECT_TIMEOUT: envField.number({
        context: 'server',
        access: 'public',
        optional: true,
        default: 3, // seconds
      }),
      REDIS_MAX_RETRIES_PER_REQUEST: envField.number({
        context: 'server',
        access: 'public',
        optional: true,
        default: 3, // seconds
      }),

      // Request stuff
      FETCH_TIMEOUT: envField.number({
        context: 'server',
        access: 'public',
        optional: false,
        default: 5, // seconds
      }),
      PROXY_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),

      // Pushover
      PUSHOVER_API_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      PUSHOVER_USER_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),

      // Notifications
      SEND_NOTIFICATION_OK_STATUS: envField.boolean({
        context: 'server',
        access: 'public',
        optional: false,
        default: false,
      }),

      // Ably
      ABLY_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      PUBLIC_ABLY_API_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),

      // A key to interact with private apis
      AUTH_SECRET_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
});
