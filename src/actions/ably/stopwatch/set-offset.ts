import type { Message } from 'ably';
import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'astro:schema';
import { TimerAction } from 'src/lib/stopwatch-worker';
import { liveGraphicsStopwatchChannelName } from 'src/services/ably/constants';
import { getAblyRestClient } from 'src/services/ably/server/rest-client';
import { isAuth } from '../_is-auth';

const input = z.object({
  name: z.string(),
  payload: z.coerce.number(),
});

export const setOffset = defineAction({
  accept: 'json',
  input: input,
  handler: async (payload, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    const message: Message = {
      name: TimerAction.SET_OFFSET,
      data: { payload },
    };
    const ably = getAblyRestClient();
    await ably.channels.get(liveGraphicsStopwatchChannelName).publish(message);
  },
});
