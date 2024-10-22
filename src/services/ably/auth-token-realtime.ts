import Ably from 'ably';
import { actions } from 'astro:actions';
import { ablyClientIdKey } from './constants';

export function ablyAuthTokenRealtime() {
  const realtime = new Ably.Realtime({
    authCallback: async (tokenParams, callback) => {
      const url = new URL(window.location.href);
      const ablyClientId =
        url.searchParams.get(ablyClientIdKey) ?? localStorage.getItem(ablyClientIdKey);
      try {
        if (ablyClientId) {
          tokenParams.clientId = ablyClientId;
        }
        const token = await actions.ably.refreshLiveGraphicsToken.orThrow(tokenParams as any);
        callback(null, token);
      } catch (error) {
        callback(`Error while retrieving the token for ClientId: "${tokenParams?.clientId}"`, null);
      }
    },
  });

  window.addEventListener('beforeunload', () => {
    realtime.close();
  });

  return realtime;
}
