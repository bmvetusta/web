import type { Message } from 'ably';
import Ably from 'ably';
import { actions } from 'astro:actions';
import { ablyClientIdKey, liveGraphicsScoresChannelName } from './constants';
type ReceivedScoreMessage = Message & { data: { team: 'HOME' | 'AWAY'; payload: number } };
export type ScoreMessage = { team: 'HOME' | 'AWAY'; payload: number };

export enum ScoreboardTeam {
  HOME = 'HOME',
  AWAY = 'AWAY',
}

export enum ScoreboardAction {
  SET_SCORE = 'SCORE_SET',
}

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
      const receivedMessage = message.data as ReceivedScoreMessage;
      onUpdate({
        team: receivedMessage.data.team,
        payload: receivedMessage.data.payload,
      });
    }
  });
}
