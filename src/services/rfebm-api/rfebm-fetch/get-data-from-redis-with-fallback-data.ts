import type { Redis } from '@upstash/redis';
import type { z } from 'zod';
import { ExpiredDataAsError } from './expired-data-as-error';

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
    if (data) {
      if (!isRedisStoredObjectExpiredData(data, cacheTTL, now)) {
        // Not expired data
        return data;
      }

      if (data.isFallback) {
        throw new ExpiredDataAsError<T>(data);
      }
    }

    return null;
  });
}
