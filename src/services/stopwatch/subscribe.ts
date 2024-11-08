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
  realtime.channels.get(liveGraphicsSceneChannelName).subscribe((message: Message) => {
    const { data = {} } = message;
    /**
     {
      "type": "TEXT_INFO",
      "value": "any text..."
     }
     */
    const $info = document.querySelector('div#info') as HTMLElement;
    if ($info) {
      if (data.type === 'TEXT_INFO' && data.value !== undefined) {
        $info.textContent = data.value;
      }
      if (data.type === 'TEXT_INFO' && !data.value) {
        $info.textContent = '';
        $info.style.display = 'none';
      }
    }

    /**
     {
      "type": "SCENE",
      "value": "any scene name",
      "text": "optional text info"
     }
     */
    const $root = document.querySelector(':root') as HTMLElement;
    if ($root) {
      if (data.type === 'SCENE') {
        $root.setAttribute('data-scene', data.value ?? 'live');
      }

      if (data.type === 'SCENE' && data.value === 'timeout' && data.text !== undefined) {
        $info.textContent = data.text;
        $info.style.display = 'block';
      }
      if ((data.type === 'SCENE' && data.text === undefined) || data.value !== 'timeout') {
        $info.style.display = 'none';
      }
    }
  });

  window.addEventListener('beforeunload', () => {
    realtime.close();
    timer.worker.terminate();
  });
}
