import type { Message } from 'ably';
import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'astro:schema';
import { TimerAction } from 'src/lib/stopwatch-worker';
import { liveGraphicsStopwatchChannelName } from 'src/services/ably/constants';
import { getAblyRestClient } from 'src/services/ably/server/rest-client';
import { isAuth } from '../_is-auth-action';
import { timeInMsSchema } from './schemas/time-in-ms';

const input = z.object({
  name: z.string(),
  index: z.coerce.number(),
  payload: z
    .object({
      id: z.string().or(z.number()),
      start: timeInMsSchema,
    })
    .array(),
});

export const addRelativeTimers = defineAction({
  accept: 'json',
  input: input,
  handler: async (input, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    const message: Message = {
      name: TimerAction.ADD_RELATIVE_TIMERS,
      data: input,
    };

    const ably = getAblyRestClient();
    await ably.channels.get(liveGraphicsStopwatchChannelName).publish(message);
  },
});
