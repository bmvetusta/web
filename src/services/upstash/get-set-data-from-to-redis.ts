import type Redis from 'ioredis';
import type { ApiFetcherFactory, InputSchemaType, RedisStoredObject } from 'types';
import type { z } from 'zod';
import { ExpiredDataAsError } from '../rfebm-api/core/expired-data-as-error';
import { isRedisStoredObjectExpiredData } from '../rfebm-api/core/is-redis-stored-object-expired-data';
import { getJSONTypedRedisData } from './get-json-typed-redis-data';
import { setJSONTypedRedisData } from './set-json-typed-redis-data';

export async function getSetDataFromToRedis<T extends InputSchemaType>(
  redisKey: string | URL,
  cacheTTL: number,
  cacheAsFallback: boolean,
  now: number,
  redis: Redis,
  forceCachedDataIfTruthy: boolean = false,
  forceRevalidate = false,
  setter: ReturnType<ApiFetcherFactory<T>>
): Promise<z.output<T> | null> {
  if (forceRevalidate) {
    return setJSONTypedRedisData(setter(), redis, redisKey.toString(), cacheAsFallback).then(
      (data: T | null) => {
        if (data !== null) {
          return data;
        }

        return redis.get;
      }
    );
  }

  return getJSONTypedRedisData<T>(redisKey.toString(), redis)
    .then((data) => {
      if (forceCachedDataIfTruthy && data && data.data) {
        return data.data;
      }

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
            if (!cacheAsFallback && cacheTTL > 0 && cacheTTL < Number.MAX_SAFE_INTEGER) {
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
