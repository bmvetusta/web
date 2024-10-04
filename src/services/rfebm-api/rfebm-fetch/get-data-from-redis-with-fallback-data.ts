import type { Redis } from '@upstash/redis';
import type { z } from 'zod';
import { ExpiredDataAsError } from './expired-data-as-error';
import { fetchSignal } from './get-data-by-fetch';

export type RedisStoredObject<T> = {
  data: T;
  createdAt: number;
  isFallback: boolean;
};

function isRedisStoredObjectExpiredData(
  data: RedisStoredObject<any> | null,
  cacheTTL: number = 86400,
  now: number = Date.now()
) {
  const { createdAt = now } = data ?? {};

  const dataTTL = Math.floor((now - createdAt) / 1000);
  const isExpired = cacheTTL > 0 && cacheTTL < Infinity && dataTTL <= 0;

  return isExpired;
}

export async function getDataFromRedisWithFallbackData<T extends z.ZodType = z.ZodType>(
  redisKey: string,
  cacheTTL: number,
  now: number,
  redis: Redis
): Promise<RedisStoredObject<T> | null | undefined> {
  return redis.get<RedisStoredObject<T>>(redisKey).then((data) => {
    console.log('Response from redis');
    if (data) {
      if (!isRedisStoredObjectExpiredData(data, cacheTTL, now)) {
        // Not expired data
        console.log('Not expired data');
        fetchSignal.abort();
        return data;
      }

      if (data.isFallback) {
        console.log('Fallback data');
        throw new ExpiredDataAsError<T>(data);
      }
    }

    console.debug('No data was retrieved from redis');
    return null;
  });
}
