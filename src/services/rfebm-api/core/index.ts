import { REDIS_URL } from 'astro:env/server';
import { clientUpstash } from 'src/services/upstash/client';
import type { z } from 'zod';
import { getSetDataFromToRedis } from './get-set-data-from-to-redis';
import { requestRFEBMApiData } from './request-rfebm-api-data';

const DEFAULT_RFEBM_API_BASE_HREF = 'https://balonmano.isquad.es';
const RFEBM_API_BASE_HREF = process.env.RFEBM_API_BASE_HREF ?? DEFAULT_RFEBM_API_BASE_HREF;

// Cache & fallback scenarios:
// 1. If cacheTTL <= 0 & cacheAsFallback === false, the redis cache it is not used and
//     will try to retrive the data from rfebm
// 2. If we provide a cacheTTL > 0 and cacheAsFallback as true, the value will be tried
//     to be get from redis if its still on cacheTTL then the value is retrieved. If is
//     expired will try to get the value from rfebm if it is not posible the cached
//     version is retrieved and error is emited. This means it is revalidated after ttl.
// 3. cacheTTL === Infinity || cacheTTL === 0 and cacheAsFallback as true, cached value
//     is only retrieved if rfebm fetch fails
// 4. cacheAsFallback = false, the value will be set with expire option as cacheTTL seconds
//     the cached value is retrieved if it is not expired
//
// Important cached values are updated every time a value is well fetched from rfebm if
// cacheTTL > 0. This means cacheTTL = 0 will only retrieve fetched result
export async function rfebmApiFetch<T extends z.ZodType = z.ZodType>(
  pathname: string,
  schema: T,
  body?: URLSearchParams,
  cacheTTL = 0, // In secs
  cacheAsFallback = false
  // shouldPrintErrorsToConsole = false,
  // shouldEmitErrorsIfFetchFail = true
): Promise<z.output<T> | null> {
  const url = new URL(pathname, RFEBM_API_BASE_HREF);

  if (!REDIS_URL || (cacheTTL <= 0 && cacheAsFallback === false)) {
    return requestRFEBMApiData<T>(url, schema, body);
  }

  const redis = clientUpstash()!;

  return getSetDataFromToRedis<T>(url.href, cacheTTL, cacheAsFallback, Date.now(), redis, () =>
    requestRFEBMApiData<T>(url, schema, body)
  ).then((data) => data ?? null);
}
