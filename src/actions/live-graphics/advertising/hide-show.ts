import type { Message } from 'ably';
import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'astro:schema';
import { liveGraphicsAdvertisingChannelName } from 'src/services/ably/constants';
import { getAblyRestClient } from 'src/services/ably/server/rest-client';
import { isAuth } from '../_is-auth-action';

export const advertisingAction = z.enum(['SHOW', 'HIDE']);

const translateOption = {
  [advertisingAction.Enum.SHOW]: 'START',
  [advertisingAction.Enum.HIDE]: 'STOP',
};

const input = z.object({
  action: advertisingAction,
  payload: z.object({ duration: z.coerce.number() }).optional(),
});

export const hideShow = defineAction({
  accept: 'json',
  input: input,
  handler: async ({ action, payload }, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    const message: Message = {
      name: translateOption[action],
    };

    if (payload) {
      message.data = payload;
    }

    const ably = getAblyRestClient();
    try {
      await ably.channels.get(liveGraphicsAdvertisingChannelName).publish(message);
    } catch (error) {
      throw new Error(`Failed to publish message to Ably: ${error}`);
    }
  },
});
