import NumberFlow from '@number-flow/react';
import { useAblyScoreboardReceiver } from 'src/services/ably/react/use-ably-scoreboard-receiver';
import type { ScoreboardTeam } from 'src/services/ably/scoreboard/constants';

export function Score({ team }: { team: ScoreboardTeam }) {
  const ablyScoreboard = useAblyScoreboardReceiver();

  const value = ablyScoreboard?.[team] ?? 0;
  return (
    <NumberFlow
      format={{
        minimumIntegerDigits: 2,
        useGrouping: false,
      }}
      trend={true}
      value={value}
    ></NumberFlow>
  );
}
