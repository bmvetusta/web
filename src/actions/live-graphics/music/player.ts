import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { liveGraphicsSceneChannelName } from 'src/services/ably/constants';
import { publishMessage } from 'src/services/stopwatch/publish-message';
import { isAuth } from '../_is-auth-action';

export const player = defineAction({
  accept: 'json',
  input: z.object({
    action: z.enum(['PLAY', 'PAUSE', 'TOGGLE']),
    file: z.string().or(z.number()).optional(),
  }),
  handler: async (input, context) => {
    isAuth(context);

    await publishMessage(liveGraphicsSceneChannelName, {
      data: {
        ...input,
        type: 'MUSIC',
      },
    });
  },
});
