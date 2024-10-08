import type Redis from 'ioredis';
import type { z } from 'zod';
import type { ApiFetcherFactory, InputSchemaType, RedisStoredObject } from '../../../../types';
import { ExpiredDataAsError } from './expired-data-as-error';
import { isRedisStoredObjectExpiredData } from './is-redis-stored-object-expired-data';

export async function getSetDataFromToRedis<T extends InputSchemaType>(
  redisKey: string | URL,
  cacheTTL: number,
  cacheAsFallback: boolean,
  now: number,
  redis: Redis,
  setter: ReturnType<ApiFetcherFactory<T>>
): Promise<z.output<T> | null> {
  return redis
    .get(redisKey.toString())
    .then((response) => {
      const data: RedisStoredObject<T> | null = response
        ? (JSON.parse(response) as RedisStoredObject<T>)
        : null;
      // console.debug('Response from redis ok');
      let isExpired = true;
      if (data) {
        isExpired = isRedisStoredObjectExpiredData(data, cacheTTL, now);
        // console.debug('is Expired data: ', isExpired);
        if (!isExpired) {
          // console.debug('Not expired data', typeof data.data);
          return data.data;
        }

        // Expired data try to fetch
        if (isExpired) {
          // console.error('Expired data');
          throw new ExpiredDataAsError<T>(data);
        }
      }

      // No data, try to fetch
      // console.error('No data was retrieved from redis');
      throw new Error('No data was retrieved from redis');
    })
    .catch(async (e) => {
      // console.error('Redis Catch: Error while fetching the data from redis', e);
      return setter()
        .then((fetchedData) => {
          if (!fetchedData && e instanceof ExpiredDataAsError) {
            // console.debug('Fallback data');
            return e.data.data;
          }

          if (!fetchedData) {
            // console.error('fetchedData is null');
            return null;
          }

          const data: RedisStoredObject<T> = {
            data: fetchedData,
            createdAt: now,
            isFallback: cacheAsFallback,
          };

          return redis.set(redisKey.toString(), JSON.stringify(data)).then(() => {
            if (cacheTTL > 0) {
              return redis
                .expire(redisKey.toString(), cacheTTL)
                .then(() => fetchedData)
                .catch(() => fetchedData);
            }

            return fetchedData;
          });
        })
        .catch((error) => {
          if (e instanceof ExpiredDataAsError) {
            // console.error('Fallback data');
            return e.data.data;
          }

          // console.error('No data was retrieved from redis or fetch');
          console.error(error);
          return null;
        });
    });
}
