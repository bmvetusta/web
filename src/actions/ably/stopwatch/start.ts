import type { Message } from 'ably';
import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'astro:schema';
import { TimerAction } from 'src/lib/stopwatch-worker';
import { liveGraphicsStopwatchChannelName } from 'src/services/ably/constants';
import { getAblyRestClient } from 'src/services/ably/server/rest-client';
import { isAuth } from '../_is-auth';

const input = z.object({
  name: z.string(),
  payload: z
    .object({
      offsetMs: z.number().optional(),
      limitMs: z.number().optional(),
      backwards: z.boolean().optional(),
      relativeTimers: z.object({}).optional(),
      relativeTimersLimitInMs: z.number().optional(),
      backwardsRelativeTimers: z.boolean().optional(),
      intervalTimeMs: z.number().optional(),
    })
    .optional(),
});

export const start = defineAction({
  accept: 'json',
  input: input,
  handler: async (payload, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    const message: Message = {
      name: TimerAction.START,
      data: payload,
    };
    const ably = getAblyRestClient();
    await ably.channels.get(liveGraphicsStopwatchChannelName).publish(message);
  },
});
