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

type InitialTimer = TimerOptionsInput & { name: string; start?: number; active?: boolean };

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

  // TODO Move this to other part
  const $info = document.querySelector('div#info') as HTMLElement;
  const $root = document.querySelector(':root') as HTMLElement;
  const $title = document.querySelector('div#title');
  const $titleH3 = $title?.querySelector('h3');
  const $titleH4 = $title?.querySelector('h4');
  const $bannerImage = document.getElementById('banner');

  realtime.channels.get(liveGraphicsSceneChannelName).subscribe((message: Message) => {
    const { data = {} } = message;
    /**
     {
      "type": "SCENE",
      "value": "any scene name",
      "text": "optional text info"
     }
     */
    if ($root) {
      if (data.type === 'SCENE') {
        $root.setAttribute('data-scene', data.value ?? 'live');
      }

      if (data.text !== undefined && $info) {
        $info.nodeValue = data.text;
      }
    }

    /**
     {
      "type": "TEXT_INFO", // But works with any object that has "text"
      "text": "any text..."
     }
     */
    if ($info) {
      $info.textContent = data.text ?? '';

      const textLen = $info.textContent?.length ?? 0;
      const showText = $root.getAttribute('data-scene') === 'timeout' && textLen > 0;
      $info.style.display = showText ? 'block' : 'none';
    }

    /**
     {
      "type": "TITLE", // But works with any object that has "text"
      "title": "any text...",
      "subtitle": "any text..."
     }
     */
    if ($title) {
      const display = $bannerImage?.style.display ?? 'none';
      const isAdvertisingVisible = display !== 'none';
      if (data.type === 'TITLES') {
        if ($titleH3 && data.title) {
          $titleH3.textContent = data.title;
        }

        if ($titleH4 && data.subtitle) {
          $titleH4.textContent = data.subtitle;
        }

        if ($bannerImage && isAdvertisingVisible) {
          $bannerImage.style.display = 'none';
        }

        $title.classList.add('view');

        setTimeout(() => {
          if ($bannerImage) {
            setTimeout(() => ($bannerImage.style.display = display), 1000);
          }
          $title.classList.remove('view');
        }, 5000);
      }
    }
  });

  window.addEventListener('beforeunload', () => {
    realtime.close();
    timer.worker.terminate();
  });
}
