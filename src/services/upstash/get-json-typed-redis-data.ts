import type Redis from 'ioredis';
import type { InputSchemaType, RedisStoredObject } from 'types';

export async function getJSONTypedRedisData<T extends InputSchemaType>(
  redisKey: string | URL,
  redis: Redis
) {
  return redis.get(redisKey.toString()).then((response) => {
    const data: RedisStoredObject<T> | null = response
      ? (JSON.parse(response) as RedisStoredObject<T>)
      : null;

    return data ? data : null;
  });
}
