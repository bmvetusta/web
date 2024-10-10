import { decrypt } from '@vercel/flags';
import type { FeatureFlags } from '@well-known/vercel/flags/index';
import { defineMiddleware } from 'astro:middleware';

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const featureFlagOverrideCookie = context.cookies.get('vercel-flag-overrides')?.value;
  if (featureFlagOverrideCookie && context.url.pathname === '/') {
    const decryptedFlags = await decrypt<FeatureFlags>(
      featureFlagOverrideCookie,
      import.meta.env.FLAGS_SECRET
    );

    // Assign flags to `locals` to make them available
    Object.assign(context.locals, { flags: decryptedFlags ?? { liveMatch: true } });
  }
  return response;
});
