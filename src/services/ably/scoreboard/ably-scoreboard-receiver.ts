import type { Message } from 'ably';
import { ablyAuthTokenRealtime } from '../auth-token-realtime';
import { liveGraphicsScoresChannelName } from '../constants';
import { ScoreboardAction, ScoreboardTeam } from './constants';
export type ScoreMessage = { team: 'HOME' | 'AWAY'; payload: number };

export function ablyScoreboardReceiver({
  onUpdate,
  inititalScores: { HOME: homeScore, AWAY: awayScore } = { HOME: 0, AWAY: 0 },
}: {
  inititalScores?: { HOME?: number; AWAY?: number };
  onUpdate: (message: ScoreMessage) => void;
}) {
  const realtime = ablyAuthTokenRealtime();

  const teamScores = {
    HOME: homeScore ?? 0,
    AWAY: awayScore ?? 0,
  };

  realtime.channels.get(liveGraphicsScoresChannelName).subscribe((message: Message) => {
    if (message.name === ScoreboardAction.SET_SCORE) {
      teamScores[message.data.team as ScoreboardTeam] = message.data.payload;
      onUpdate({
        team: message.data.team,
        payload: message.data.payload,
      });
    }

    if (message.name === ScoreboardAction.ADD_SCORE) {
      teamScores[message.data.team as ScoreboardTeam] += message.data.payload;
      onUpdate({
        team: message.data.team,
        payload: teamScores[message.data.team as ScoreboardTeam],
      });
    }
  });

  return () => {
    realtime.close();
  };
}
