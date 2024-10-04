import { Redis } from '@upstash/redis';

const REDIS_TIMEOUT = 5000;
const key = 'inventedKey';

const client = new Redis({
  url: process.env.REDIS_REST_URL,
  token: process.env.REDIS_REST_TOKEN,
  signal: AbortSignal.timeout(REDIS_TIMEOUT),
});
await client.set(key, { data: 'inventedData', createdAt: Date.now(), isFallback: true });
console.log(await client.get(key));
