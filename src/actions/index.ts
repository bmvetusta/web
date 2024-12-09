import { refreshLiveGraphicsToken } from './ably/refresh-live-graphics-token';
import { hideShow } from './live-graphics/advertising/hide-show';
import { player } from './live-graphics/music/player';
import { change } from './live-graphics/scene/change';
import { textInfo } from './live-graphics/scene/text-info';
import { addScore } from './live-graphics/scores/add';
import { setScore } from './live-graphics/scores/set-score';
import { showTitles } from './live-graphics/show-titles';
import { actionToTimerName } from './live-graphics/stopwatch/action-to-timer-name';
import { addRelativeTimers } from './live-graphics/stopwatch/add-relative-timers';
import { offset } from './live-graphics/stopwatch/offset';
import { removeRelativeTimers } from './live-graphics/stopwatch/remove-relative-timers';
import { startCreateSet } from './live-graphics/stopwatch/start-create-set';

export const server = {
  ably: {
    refreshLiveGraphicsToken,
  },
  liveGraphics: {
    stopwatch: {
      startCreateSet,
      actionToTimerName,
      offset,
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

    scene: {
      textInfo,
      change,
    },

    showTitles,

    music: {
      player,
    },
  },
};
