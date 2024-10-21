import type { Message } from 'ably';
import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'astro:schema';
import { ScoreboardAction } from 'src/services/ably/ably-scoreboard-receiver';
import { liveGraphicsScoresChannelName } from 'src/services/ably/constants';
import { getAblyRestClient } from 'src/services/ably/server/rest-client';
import { isAuth } from '../_is-auth';

export const teamSchema = z.enum(['HOME', 'AWAY']);

const input = z.object({
  team: teamSchema,
  payload: z.coerce.number(),
});

export const addOffset = defineAction({
  accept: 'json',
  input: input,
  handler: async (payload, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    const message: Message = {
      name: ScoreboardAction.SET_SCORE,
      data: payload,
    };
    const ably = getAblyRestClient();
    await ably.channels.get(liveGraphicsScoresChannelName).publish(message);
  },
});
