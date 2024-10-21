import Ably from 'ably';
import { ABLY_READONLY_API_KEY } from 'astro:env/server';
let client: Ably.Realtime | undefined;

export async function getReadRealtimeClient() {
  if (!client) {
    client = new Ably.Realtime({ key: ABLY_READONLY_API_KEY });
  }

  return client;
}
