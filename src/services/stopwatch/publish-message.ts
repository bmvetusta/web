import type { Message } from 'ably';
import { getAblyRestClient } from '../ably/server/rest-client';

export function publishMessage(channel: string, message: Message) {
  const ably = getAblyRestClient();
  return ably.channels.get(channel).publish(message);
}
