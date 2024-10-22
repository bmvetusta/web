import type { Message } from 'ably';
import { ablyAuthTokenRealtime } from '../auth-token-realtime';
import { liveGraphicsScoresChannelName } from '../constants';
import { ScoreboardAction } from './constants';
export type ScoreMessage = { team: 'HOME' | 'AWAY'; payload: number };

export function ablyScoreboardReceiver({
  onUpdate,
}: {
  onUpdate: (message: ScoreMessage) => void;
}) {
  const realtime = ablyAuthTokenRealtime();

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
