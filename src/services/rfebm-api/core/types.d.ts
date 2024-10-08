export type RedisStoredObject<T> = {
  data: T;
  createdAt: number;
  isFallback: boolean;
};
