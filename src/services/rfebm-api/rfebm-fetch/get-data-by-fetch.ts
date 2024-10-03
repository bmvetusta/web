import type { Redis } from '@upstash/redis';
import { FETCH_TIMEOUT } from 'astro:env/server';
import { ZodError, type z } from 'zod';
import { getRFEBMAPIHeaders } from '../base-href';
import type { RedisStoredObject } from './get-data-from-redis-with-fallback-data';

export async function getDataByFetch<T extends z.ZodType = z.ZodType>(
  url: URL,
  schema: T,
  cacheAsFallback: boolean,
  now: number,
  body?: URLSearchParams,
  redis?: Redis,
  redisKey?: string
): Promise<RedisStoredObject<T> | null> {
  const init: RequestInit = {
    method: 'POST',
    body,
    headers: getRFEBMAPIHeaders(),
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  };

  // console.debug('Fetching the data', { init });
  return fetch(url, init)
    .then((res) => res.json())
    .then((response: any) => {
      // console.debug('Fetching response', response);
      if (response.status !== 'OK') {
        // If any error while requesting data we emit an error to allow
        // some automations in case any header has expired because they
        // change User-Agent sometimes due is used as a password
        // fetchEmitter.emit(fetchEventError, {
        //   url,
        //   requestInit: init,
        //   response: responseData,
        // });
        console.error(
          'Fetching the data from RFEBM website failed. Perhaps a User Agent change :)'
        );
        throw new Error('Fetching the data from RFEBM website failed');
      }

      const data = schema.safeParse(response);

      if (data.success && data.data) {
        const redisObject = {
          data: data.data,
          createdAt: now,
          isFallback: cacheAsFallback,
        };

        return redisKey && redis
          ? redis.set(redisKey, redisObject).then(() => redisObject)
          : redisObject;
      }

      if (data.success === false) {
        if (data.error instanceof ZodError) {
          console.error(`Error while parsing the fetched data from url "${url.href}"`);
          throw data.error;
        }
      }

      console.error(`Unknown error while fetching "${url.href}"`);
      throw new Error(`Unknown error while fetching "${url.href}"`);
    });
}
