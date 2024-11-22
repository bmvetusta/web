import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'astro:schema';
import { liveGraphicsSceneChannelName } from 'src/services/ably/constants';
import { publishMessage } from 'src/services/stopwatch/publish-message';
import { isAuth } from './_is-auth-action';

const input = z.object({
  type: z.literal('TITLES').default('TITLES'),
  title: z.string(),
  subtitle: z.string().nullable(),
  description: z.string().nullable(),
  time: z.number().default(5_000),
});

export const showTitles = defineAction({
  accept: 'json',
  input: input,
  handler: async (data, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    await publishMessage(liveGraphicsSceneChannelName, { data });
  },
});
