import type { TokenParams } from 'ably';
import { ActionError, defineAction, type ActionAPIContext } from 'astro:actions';
import { ABLY_VALID_CLIENT_ID } from 'astro:env/server';
import { z } from 'astro:schema';
import { liveGraphicsNamespaceName } from 'src/services/ably/constants';
import { getAblyRestClient } from 'src/services/ably/server/rest-client';
import { isAuth } from './_is-auth';

const input = z.object({
  clientId: z.string().optional(),
});

export const refreshLiveGraphicsToken = defineAction({
  accept: 'json',
  input,
  handler: async ({ clientId }, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    if (clientId !== ABLY_VALID_CLIENT_ID) {
      throw new ActionError({ message: 'Invalid client ID', code: 'FORBIDDEN' });
    }

    const tokenParams: TokenParams = {
      clientId,
      capability: JSON.stringify({
        [`${liveGraphicsNamespaceName}:*`]: ['subscribe'],
      }),
    };
    const ably = getAblyRestClient();
    const tokenRequest = await ably.auth.createTokenRequest(tokenParams);
    return tokenRequest;
  },
});
