import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { liveGraphicsSceneChannelName } from 'src/services/ably/constants';
import { publishMessage } from 'src/services/stopwatch/publish-message';
import { isAuth } from '../_is-auth-action';

export const textInfo = defineAction({
  accept: 'json',
  input: z.string(),
  handler: async (input, context) => {
    isAuth(context);

    await publishMessage(liveGraphicsSceneChannelName, {
      data: {
        type: 'TEXT_INFO',
        value: input,
      },
    });
  },
});
