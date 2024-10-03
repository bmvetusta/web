import type { Redis } from '@upstash/redis';
import { RFEBM_API_BASE_HREF } from 'astro:env/server';
import EventEmitter from 'node:events';
import { z } from 'zod';
import { clientUpstash } from '../upstash/client';
import { getRFEBMAPIHeaders } from './base-href';

export const fetchEmitter = new EventEmitter();
export const fetchEventError = 'error:fetch:rfebm';

type CacheStoredObject<T> = {
  data: T;
  createdAt: number;
  isFallback: boolean;
};

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
  cacheAsFallback = false,
  shouldPrintErrorsToConsole = false,
  shouldEmitErrorsIfFetchFail = true
): Promise<z.output<T> | null> {
  const url = new URL(pathname, RFEBM_API_BASE_HREF);
  const now = Date.now();

  // Redis stuff
  let redis: Redis | undefined;
  let data: CacheStoredObject<T> | null = null;
  const cacheUrl = new URL(url.href);

  if (body) {
    for (const [k, v] of body.entries()) {
      cacheUrl.searchParams.set(k, v);
    }
  }

  console.log('rfebmAPIFetch', { url: url.href, body });

  if (cacheTTL > 0) {
    redis = clientUpstash();

    console.log('Trying to get cached data for key "%s"', cacheUrl.href);
    data = await redis.get<CacheStoredObject<T>>(cacheUrl.href);
    // console.log({ cachedDataGotSomething: !!data });

    // If is fallback
    if (data) {
      // console.log('Cached Data exists', {
      //   isFallback: data.isFallback,
      //   cacheTTL,
      //   createdAt: data.createdAt,
      // });

      if (!data.isFallback) {
        return data.data;
      }

      if (data.isFallback) {
        const dataTTL = Math.floor((now - data.createdAt) / 1000);
        const isExpired = data.isFallback && cacheTTL < Infinity && dataTTL > cacheTTL;

        // Not fallback or fallback but we can consider not old data due cacheTTL
        if (!data.isFallback || !isExpired) {
          return data.data as T;
        }
      }
    }
  }

  try {
    const init = {
      method: 'POST',
      body,
      headers: getRFEBMAPIHeaders(),
    };

    console.log('Fetching the data', { init });
    const responseData = await fetch(url, init).then((res) => res.json());

    if (responseData.status === 'OK') {
      const parsedData = schema.safeParse(responseData);

      console.log('Data fetched and parsed', { parsedStatus: parsedData.success });
      if (parsedData.success && parsedData.data) {
        data = {
          createdAt: now,
          isFallback: cacheAsFallback,
          data: parsedData.data,
        };

        if (redis) {
          console.log('Storing the data');
          await redis.set(cacheUrl.href, data);

          // If we should expire the value, this mean
          // not used as fallback cache and period defines
          // between 1 seconds and less than Infinity
          if (cacheTTL < Infinity && !cacheAsFallback) {
            await redis.expire(cacheUrl.href, cacheTTL);
          }
        }

        return parsedData.data;
      }

      if (parsedData.success === false) {
        throw new z.ZodError(parsedData.error.errors);
      }

      console.error('Not valid data received while fetching url: "%s"', url.href);
      return null;
    }

    // If any error while requesting data we emit an error to allow
    // some automations in case any header has expired because they
    // change User-Agent sometimes due is used as a password
    if (shouldEmitErrorsIfFetchFail) {
      console.error('Fetching the data from RFEBM website failed');
      fetchEmitter.emit(fetchEventError, {
        url,
        requestInit: init,
        response: responseData,
      });
    }

    // In case fetch fails but the cache is persistent and used as fallback
    if (data && data.isFallback) {
      console.error('Retrieving fallback data');
      return data;
    }

    // if (shouldReturnUnparsedIfFail) {
    //   return responseData;
    // }
  } catch (error) {
    if (shouldPrintErrorsToConsole) {
      console.error(error);
    }
  }

  return null;
}
