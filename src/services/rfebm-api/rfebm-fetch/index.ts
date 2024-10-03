import type { Redis } from '@upstash/redis';
import { RFEBM_API_BASE_HREF } from 'astro:env/server';
// import EventEmitter from 'node:events';
import type { z } from 'zod';
import { clientUpstash } from '../../upstash/client';
import { ExpiredDataAsError } from './expired-data-as-error';
import { getDataByFetch } from './get-data-by-fetch';
import { getDataFromRedisWithFallbackData } from './get-data-from-redis-with-fallback-data';

// export const fetchEmitter = new EventEmitter();
// export const fetchEventError = 'error:fetch:rfebm';

// const RFEBM_API_BASE_HREF = 'https://balonmano.isquad.es';

// Cache & fallback scenarios:
// 1. If we provide a cacheTTL > 0 and cacheAsFallback as true, the value will be tried
//     to be get from redis if its still on cacheTTL then the value is retrieved. If is
//     expired will try to get the value from rfebm if it is not posible the cached
//     version is retrieved and error is emited. This means it is revalidated after ttl.
// 2. cacheTTL === Infinity and cacheAsFallback as true, cached value is only retrieved
//     if rfebm fetch fails
// 3. cacheAsFallback = false, the value will be set with expire option as cacheTTL seconds
//     the cached value is retrieved if it is not expired
//
// Important cached values are updated every time a value is well fetched from rfebm if
// cacheTTL > 0. This means cacheTTL = 0 will only retrieve fetched result
export async function rfebmAPIFetch<T extends z.ZodType = z.ZodType>(
  pathname: string,
  schema: T,
  body?: URLSearchParams,
  cacheTTL = 86400,
  cacheAsFallback = false
  // shouldPrintErrorsToConsole = false,
  // shouldEmitErrorsIfFetchFail = true
): Promise<z.output<T> | null> {
  const url = new URL(pathname, RFEBM_API_BASE_HREF);
  const now = Date.now();

  if (cacheTTL > 0) {
    // Redis stuff
    const redis: Redis = clientUpstash();
    const fetchUrlWithParams = new URL(url.href);

    if (body) {
      for (const [k, v] of body.entries()) {
        fetchUrlWithParams.searchParams.set(k, v);
      }
    }

    const redisKey = fetchUrlWithParams.href;

    return Promise.allSettled([
      getDataFromRedisWithFallbackData(redisKey, cacheTTL, now, redis),
      getDataByFetch(url, schema, cacheAsFallback, now, body, redis, redisKey),
    ]).then(([redisResolved, fetchResolved]) => {
      // All rejected but with expired data
      if (
        redisResolved.status === 'rejected' &&
        redisResolved.reason instanceof ExpiredDataAsError &&
        fetchResolved.status === 'rejected'
      ) {
        return redisResolved.reason.data.data as T;
      }

      if (redisResolved.status === 'fulfilled') {
        return redisResolved.value?.data ?? null;
      }

      if (fetchResolved.status === 'fulfilled') {
        return fetchResolved.value?.data ?? null;
      }

      console.error('Redis and fetch failed, see the logs!');
      return null;
    });
  }

  return getDataByFetch<T>(url, schema, cacheAsFallback, now, body).catch(() => null);
}
