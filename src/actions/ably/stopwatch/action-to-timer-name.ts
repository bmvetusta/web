import type { Message } from 'ably';
import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'astro:schema';
import { TimerAction } from 'src/lib/stopwatch-worker';
import { liveGraphicsStopwatchChannelName } from 'src/services/ably/constants';
import { getAblyRestClient } from 'src/services/ably/server/rest-client';
import { isAuth } from '../_is-auth';

const input = z.object({
  action: z.enum([
    TimerAction.PAUSE,
    TimerAction.RESUME,
    TimerAction.STOP,
    TimerAction.RESET,
    TimerAction.DELETE_TIMER,
    TimerAction.GET_RELATIVE_TIMERS,
  ]),
  name: z.string(),
});

export const actionToTimerName = defineAction({
  accept: 'json',
  input: input,
  handler: async (input, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    const message: Message = {
      name: input.action,
      data: { name: input.name },
    };
    const ably = getAblyRestClient();
    await ably.channels.get(liveGraphicsStopwatchChannelName).publish(message);
  },
});
