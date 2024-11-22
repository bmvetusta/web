import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { liveGraphicsSceneChannelName } from 'src/services/ably/constants';
import { publishMessage } from 'src/services/stopwatch/publish-message';
import { isAuth } from '../_is-auth-action';

export const change = defineAction({
  accept: 'json',
  input: z.object({
    scene: z.enum(['timeout', 'live']),
    text: z.string().optional(),
  }),
  handler: async (input, context) => {
    isAuth(context);

    await publishMessage(liveGraphicsSceneChannelName, {
      data: {
        type: 'SCENE',
        scene: input.scene,
        text: input.text,
      },
    });
  },
});
