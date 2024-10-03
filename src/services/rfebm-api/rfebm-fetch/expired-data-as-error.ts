import type { RedisStoredObject } from './get-data-from-redis-with-fallback-data';

export class ExpiredDataAsError<T extends any = any> extends Error {
  constructor(public data: RedisStoredObject<T>) {
    super('Expired data used as Fallback');
  }
}
