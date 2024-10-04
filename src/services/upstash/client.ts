import { Redis } from '@upstash/redis';
import { REDIS_REST_TOKEN, REDIS_REST_URL, REDIS_TIMEOUT } from 'astro:env/server';

let client: Redis | undefined;

export function clientUpstash() {
  if (!client) {
    client = new Redis({
      url: REDIS_REST_URL,
      token: REDIS_REST_TOKEN,
      signal: AbortSignal.timeout(REDIS_TIMEOUT),
      enableAutoPipelining: true,
    });
  }

  return client;
}
