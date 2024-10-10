import type Redis from 'ioredis';
import type { ApiFetcher, InputSchemaType, RedisStoredObject } from 'types';

export async function setJSONTypedRedisData<T extends InputSchemaType>(
  setter: ReturnType<ApiFetcher<T>>,
  redis: Redis,
  redisKey: string | URL,
  cacheAsFallback: boolean
) {
  return setter
    .then((fetchedData: T | null) => {
      if (!fetchedData) {
        return null;
      }

      const data: RedisStoredObject<T> = {
        data: fetchedData,
        createdAt: Date.now(),
        isFallback: cacheAsFallback,
      };

      return redis.set(redisKey.toString(), JSON.stringify(data)).then(() => {
        return fetchedData;
      });
    })
    .catch(() => null);
}
