import Ably from 'ably';
import { ABLY_API_KEY } from 'astro:env/server';

let client: Ably.Rest | undefined;

export function getAblyRestClient() {
  if (!client) {
    client = new Ably.Rest({ key: ABLY_API_KEY });
  }

  return client;
}
