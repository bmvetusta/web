import Ably from 'ably';
import { actions } from 'astro:actions';
import {
  TimerAction,
  TimerWorker,
  type CreateTimerOptions,
  type ErrorCallback,
  type RelativeTime,
  type RelativeTimeId,
  type SuccessCallback,
  type TickCallback,
} from 'src/lib/stopwatch-worker';

import { ablyClientIdKey, liveGraphicsStopwatchChannelName } from 'src/services/ably/constants';

export function ablyStopwatchReceiver({
  onTick,
  onError,
  onSuccess,
  onLimitReached,
}: {
  onTick: TickCallback;
  onError?: ErrorCallback;
  onSuccess?: SuccessCallback;
  onLimitReached?: TickCallback;
}) {
  const timer = TimerWorker({
    onTick,
    onError,
    onSuccess,
    onLimitReached,
  });

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

  realtime.channels.get(liveGraphicsStopwatchChannelName).subscribe((message) => {
    switch (message.name as TimerAction) {
      case TimerAction.DELETE_TIMER: {
        const timerName = message.data.name as string;
        if (!timerName) {
          return;
        }
        timer.deleteTimer(timerName);
        break;
      }
      case TimerAction.CREATE_SET: {
        const timerName = message.data.name as string;
        const timerOptions = (message.data?.payload ?? {}) as CreateTimerOptions;
        if (!timerName) {
          return;
        }
        timer.createOrSet(timerName, timerOptions);
        break;
      }
      case TimerAction.PAUSE: {
        const timerName = message.data.name as string;
        if (!timerName) {
          return;
        }
        timer.pause(timerName);
        break;
      }
      case TimerAction.RESUME: {
        const timerName = message.data.name as string;
        if (!timerName) {
          return;
        }
        timer.resume(timerName);
        break;
      }
      case TimerAction.START: {
        const timerName = message.data.name as string;
        const timerOptions = (message.data?.payload ?? {}) as CreateTimerOptions;
        if (!timerName) {
          return;
        }
        timer.start(timerName, timerOptions);
        break;
      }
      case TimerAction.STOP: {
        const timerName = message.data.name as string;
        if (!timerName) {
          return;
        }
        timer.stop(timerName);
        break;
      }
      case TimerAction.RESET: {
        const timerName = message.data.name as string;
        if (!timerName) {
          return;
        }
        timer.reset(timerName);
        break;
      }
      case TimerAction.ADD_OFFSET: {
        const timerName = message.data.payload.name as string;
        const payload = message.data.payload.payload as number;
        if (!timerName) {
          return;
        }
        timer.addOffset(timerName, payload);
        break;
      }
      case TimerAction.SET_OFFSET: {
        const timerName = message.data.payload.name as string;
        const payload = message.data.payload.payload as number;
        if (!timerName) {
          return;
        }
        timer.setOffset(timerName, payload);
        break;
      }
      case TimerAction.ADD_RELATIVE_TIMERS: {
        const timerName = message.data.name as string;
        const relatimeTimerIdx = message.data.index as number;
        const relativeTimer = message.data.payload as RelativeTime[];
        if (!timerName) {
          return;
        }
        timer.addRelativeTimers(timerName, relatimeTimerIdx, relativeTimer);
        break;
      }
      case TimerAction.REMOVE_RELATIVE_TIMERS: {
        const timerName = message.data.name as string;
        const relatimeTimerIdx = message.data.index as number;
        const relativeTimerIds = message.data.payload as RelativeTimeId[];
        if (!timerName) {
          return;
        }
        timer.removeRelativeTimers(timerName, relatimeTimerIdx, relativeTimerIds);
        break;
      }
      case TimerAction.GET_RELATIVE_TIMERS: {
        const timerName = message.data.name as string;
        if (!timerName) {
          return;
        }
        timer.getRelativeTimers(timerName);
        break;
      }
    }
  });

  window.addEventListener('beforeunload', () => {
    realtime.close();
  });
}
