import { Redis } from '@upstash/redis';
import { REDIS_REST_TOKEN, REDIS_REST_URL } from 'astro:env/server';

let client: Redis | undefined;

export function clientUpstash() {
  if (!client) {
    client = new Redis({
      url: REDIS_REST_URL,
      token: REDIS_REST_TOKEN,
    });
  }

  return client;
}
