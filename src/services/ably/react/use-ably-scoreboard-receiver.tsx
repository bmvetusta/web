import { useEffect, useState } from 'react';
import { ablyScoreboardReceiver } from '../scoreboard/ably-scoreboard-receiver';
import { ScoreboardTeam } from '../scoreboard/constants';

export function useAblyScoreboardReceiver() {
  const [home, setHome] = useState(0);
  const [away, setAway] = useState(0);

  useEffect(() => {
    ablyScoreboardReceiver({
      onUpdate: (message) => {
        if (message.team === ScoreboardTeam.HOME) {
          setHome(message.payload);
        }
        if (message.team === ScoreboardTeam.AWAY) {
          setAway(message.payload);
        }
      },
    });
  }, []); // Empty dependency array ensures this effect runs only once, on mount.

  return { HOME: home, AWAY: away };
}
