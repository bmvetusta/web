import type { Message } from 'ably';
import Ably from 'ably';
import { actions } from 'astro:actions';
import { ablyClientIdKey, liveGraphicsScoresChannelName } from '../constants';
import { ScoreboardAction } from './constants';
export type ScoreMessage = { team: 'HOME' | 'AWAY'; payload: number };

export function ablyScoreboardReceiver({
  onUpdate,
}: {
  onUpdate: (message: ScoreMessage) => void;
}) {
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

  realtime.channels.get(liveGraphicsScoresChannelName).subscribe((message: Message) => {
    if (message.name === ScoreboardAction.SET_SCORE) {
      console.log('Received message:', message.data);
      onUpdate({
        team: message.data.team,
        payload: message.data.payload,
      });
    }
  });

  return () => {
    realtime.close();
  };
}
