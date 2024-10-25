import { hideShow } from './ably/advertising/hide-show';
import { refreshLiveGraphicsToken } from './ably/refresh-live-graphics-token';
import { addScore } from './ably/scores/add';
import { setScore } from './ably/scores/set-score';
import { actionToTimerName } from './ably/stopwatch/action-to-timer-name';
import { addOffset } from './ably/stopwatch/add-offset';
import { addRelativeTimers } from './ably/stopwatch/add-relative-timers';
import { createOrSet } from './ably/stopwatch/create-or-set';
import { removeRelativeTimers } from './ably/stopwatch/remove-relative-timers';
import { setOffset } from './ably/stopwatch/set-offset';
import { start } from './ably/stopwatch/start';

export const server = {
  ably: {
    refreshLiveGraphicsToken,
    stopwatch: {
      start,
      createOrSet,
      actionToTimerName,
      setOffset,
      addOffset,
      addRelativeTimers,
      removeRelativeTimers,
    },
    score: {
      setScore,
      addScore,
    },
    advertising: {
      hideShow,
    },
  },
};
