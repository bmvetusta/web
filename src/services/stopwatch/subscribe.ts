import type { Message } from 'ably';
import { TimerWorker } from 'src/lib/stopwatch-worker';
import { AblyStopwatchActionMessage } from 'src/schema/ably/stopwatch-action-message';
import type { OffsetActionTimer } from 'src/schema/timer/actions/offset';
import type { AddRelativeActionTimer } from 'src/schema/timer/actions/relative/add';
import type { RemoveRelativeActionTimer } from 'src/schema/timer/actions/relative/remove';
import type { StartCreateActionTimer } from 'src/schema/timer/actions/start-create';
import { TimerAction } from 'src/schema/timer/actions/type';
import type {
  ErrorTimerCallback,
  SuccessTimerCallback,
  TickTimerCallback,
} from 'src/schema/timer/messages/callbacks';
import type { TimerOptionsInput } from 'src/schema/timer/options';
import { ablyAuthTokenRealtime } from '../ably/auth-token-realtime';
import { liveGraphicsSceneChannelName, liveGraphicsStopwatchChannelName } from '../ably/constants';
import { sceneSwitcher } from './scene-switcher';
import { titleGraphics } from './title-graphics';

type InitialTimer = TimerOptionsInput & { name: string; start?: number; active?: boolean };

const playlist: Array<{
  file: string;
  [key: string]: string | number;
}> = await fetch('/assets/audio/audio.json').then((res) => res.json());

const player = document.querySelector('audio#audioplayer') as HTMLAudioElement | null;
let currentIndex = 0;
if (player) {
  player.src = playlist.at(currentIndex)?.file ?? '';
}

function loadSong(file?: string | number) {
  if (!player) {
    console.error('No player found');
    return;
  }

  if (Number.isNaN(file) && file !== undefined) {
    player.src = file as string;
  } else if (Number.isInteger(file)) {
    const nextIndex = (file as number) % playlist.length;
    currentIndex = nextIndex;
    const src = playlist.at(currentIndex)?.file;

    if (src && player.src !== src) {
      player.src = src;
    }
  } else {
    const nextIndex = ++currentIndex % playlist.length;
    currentIndex = nextIndex;
    player.src = '';
  }

  if (!player.src) {
    player.src = playlist.at(currentIndex)?.file ?? '';
  }

  player.play();
}

player?.addEventListener('ended', () => loadSong());

export function stopwatchSubscribe(
  {
    onTick,
    onError,
    onSuccess,
    onLimitReached,
  }: {
    onTick: TickTimerCallback;
    onError?: ErrorTimerCallback;
    onSuccess?: SuccessTimerCallback;
    onLimitReached?: TickTimerCallback;
  },
  initials?: InitialTimer[],
  singleton = false,
  overwriteSingleton = true,
  defaultTimerOptions: TimerOptionsInput = {
    offsetMs: 0,
    limitMs: 0,
    backwards: false,
    relativeTimers: [],
    relativeTimersLimitInMs: 120_000, // 2 mins
    backwardsRelativeTimers: true,
    intervalTimeMs: 250,
  }
) {
  const timer = TimerWorker(
    {
      onTick,
      onError,
      onSuccess,
      onLimitReached,
    },
    singleton,
    overwriteSingleton,
    defaultTimerOptions
  );

  const realtime = ablyAuthTokenRealtime();

  // Set initial stopwatchs
  const rInitials = initials?.toReversed() ?? []; // Reversed because first one will be the actived one
  for (const opts of rInitials) {
    const { name, start = 0, active = false, ...options } = opts;
    timer.createOrSet(name, options);

    if (start > 0) {
      const offset = Date.now() - start;
      timer.addOffset(name, offset, options);
    }

    if (active) {
      timer.resume(name);
    }
  }

  realtime.channels.get(liveGraphicsStopwatchChannelName).subscribe((message: unknown) => {
    try {
      const { data } = message as AblyStopwatchActionMessage;
      const { type, name } = data;

      switch (type) {
        case TimerAction.CREATE_OR_SET: {
          const { payload } = data as StartCreateActionTimer;
          timer.createOrSet(name, payload);
          break;
        }

        case TimerAction.START: {
          const { payload } = data as StartCreateActionTimer;
          timer.start(name, payload);
          break;
        }

        case TimerAction.PAUSE:
          timer.pause(name, data.opts);
          break;

        case TimerAction.RESUME:
          timer.resume(name, data.opts);
          break;

        case TimerAction.RESET:
          timer.reset(name, data.opts);
          break;

        case TimerAction.TOGGLE:
          timer.toggle(name, data.opts);
          break;

        case TimerAction.STOP:
          timer.stop(name, data.opts);
          break;

        case TimerAction.DELETE_TIMER:
          timer.deleteTimer(name);
          break;

        case TimerAction.ADD_OFFSET: {
          const { payload, opts } = data as OffsetActionTimer;
          timer.addOffset(name, payload, opts);
          break;
        }

        case TimerAction.SET_OFFSET: {
          const { payload, opts } = data as OffsetActionTimer;
          timer.setOffset(name, payload, opts);
          break;
        }

        case TimerAction.ADD_RELATIVE_TIMERS: {
          const { payload, opts } = data as AddRelativeActionTimer;
          timer.addRelativeTimers(name, payload, opts);
          break;
        }

        case TimerAction.REMOVE_RELATIVE_TIMERS: {
          const { payload, opts } = data as RemoveRelativeActionTimer;
          timer.removeRelativeTimers(name, payload, opts);
          break;
        }

        case TimerAction.GET_RELATIVE_TIMERS: {
          timer.getRelativeTimers(name, data.opts);
          break;
        }

        default:
          throw new Error('No TimerAction, this should never happen');
      }
    } catch (error) {
      console.error(error);
    }
  });

  realtime.channels.get(liveGraphicsSceneChannelName).subscribe((message: Message) => {
    const { data = {} } = message;
    /**
     {
      "type": "MUSIC",
      "action": "PLAY", // "PAUSE"
      "file"?: "file or number"
     }
     */

    if (player && data.type === 'MUSIC') {
      const isPlaying = !player.paused;
      const isPlayAction = data.action === 'PLAY' || (data.action === 'TOGGLE' && !isPlaying);
      const isPauseAction =
        data.action === 'PAUSE' ||
        data.action === 'STOP' ||
        (data.action === 'TOGGLE' && isPlaying);

      if (isPlayAction) {
        player.volume = 1;
        const canSetFile = !isPlaying && data.file;
        if (canSetFile) {
          loadSong(data.file);
        }

        if (!data.file && !player.src) {
          loadSong();
        }

        player.play();
      }

      if (isPauseAction) {
        player.pause();
      }
    }

    /**
     {
      "type": "SCENE",
      "value": "any scene name",
      "text": "optional text info"
     }
     */
    /**
     {
      "type": "TEXT_INFO", // But works with any object that has "text"
      "text": "any text..."
     }
     */
    if (data.type === 'SCENE' || data.type === 'TEXT_INFO') {
      sceneSwitcher(data);
    }

    /**
     {
      "type": "TITLE", // But works with any object that has "text",
      "description": "any text...",
      "title": "any text...",
      "subtitle": "any text...",
      "description": "any text...",
      "time": 5_000
     }
     */
    if (data.type === 'TITLES') {
      titleGraphics(data);
    }
  });

  window.addEventListener('beforeunload', () => {
    realtime.close();
    timer.worker.terminate();
  });
}
