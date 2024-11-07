import { ActionTimer } from 'src/schema/timer/actions/action';
import type { OffsetActionTimer } from 'src/schema/timer/actions/offset';
import type { AddRelativeActionTimer } from 'src/schema/timer/actions/relative/add';
import { GetRelativeActionTimer } from 'src/schema/timer/actions/relative/get';
import type { RemoveRelativeActionTimer } from 'src/schema/timer/actions/relative/remove';
import type { StartCreateActionTimer } from 'src/schema/timer/actions/start-create';
import { TimerAction } from 'src/schema/timer/actions/type';
import type {
  ErrorTimerCallback,
  SuccessTimerCallback,
  TickTimerCallback,
} from 'src/schema/timer/messages/callbacks';
import type { SuccessTimerMessage } from 'src/schema/timer/messages/success';
import { TickMessage } from 'src/schema/timer/messages/tick';
import { TimerMessage } from 'src/schema/timer/messages/timer';
import { type TimerOptions, type TimerOptionsInput } from 'src/schema/timer/options';
import {
  RelativeTimer,
  RelativeTimerElapsed,
  type RelativeTimerId,
} from 'src/schema/timer/relative';
import { type StoreTimer, type TimerName } from 'src/schema/timer/store';

// biome-ignore lint/suspicious/noExplicitAny: Can not get the type of WorkerGlobalScope
type WorkerGlobalScope = /* unresolved */ any;

function timerMillisecondsWorker(self: WorkerGlobalScope) {
  const timersStore: StoreTimer = {};

  // const DAY_IN_MS = 86_400_000;
  const HOUR_IN_MS = 3_600_000;
  const MINUTE_IN_MS = 60_000;
  const SECOND_IN_MS = 1_000;

  const DEFAULT_TIMER_OPTIONS: TimerOptions = {
    start: 0,
    offsetMs: 0,
    limitMs: 0,
    backwards: false,
    relativeTimers: [],
    relativeTimersLimitInMs: 120_000, // 2 mins
    backwardsRelativeTimers: true,
    intervalTimeMs: 250,
  };

  function getElapsedObjectFromMs(ms: number) {
    // This should be configurable by choosing the max unit
    const hours = Math.floor(ms / HOUR_IN_MS);
    const hoursOdd = ms % HOUR_IN_MS;

    const minutes = Math.floor(hoursOdd / MINUTE_IN_MS);
    const minutesOdd = hoursOdd % MINUTE_IN_MS;

    const seconds = Math.floor(minutesOdd / SECOND_IN_MS);
    const milliseconds = Math.floor(ms % SECOND_IN_MS);

    return {
      // days,
      hours,
      minutes,
      seconds,
      milliseconds,
    };
  }

  function calculateRelativeTimes(
    relativeTimers: RelativeTimer[],
    elapsedWithOffset: number,
    relativeTimersLimitInMs: number,
    backwarsRelativeTimers: boolean
  ): RelativeTimerElapsed[] {
    return relativeTimers
      .filter(
        ({ start: startTimeMs }: RelativeTimer) =>
          relativeTimersLimitInMs > 0 && elapsedWithOffset <= startTimeMs + relativeTimersLimitInMs
      )
      .map((relative) => {
        const elapsedMs = backwarsRelativeTimers
          ? relativeTimersLimitInMs - (elapsedWithOffset - relative.start)
          : elapsedWithOffset - relative.start;
        const elapsed = getElapsedObjectFromMs(elapsedMs);

        return {
          ...relative,
          elapsedMs,
          elapsed,
        };
      });
  }

  function intervalCallback(name: TimerName) {
    return () => {
      const now = Date.now();
      const {
        start,
        offsetMs,
        limitMs,
        backwards,
        relativeTimers,
        relativeTimersLimitInMs,
        backwardsRelativeTimers,
        intervalTimeMs,
      } = timersStore[name];

      const elapsed = now - start;
      const elapsedWithOffset = elapsed + offsetMs;
      const elapsedMs = backwards && limitMs ? limitMs - elapsedWithOffset : elapsedWithOffset;
      timersStore[name].lastCalculatedElapsedMs = elapsedMs;

      // Message
      const message: TickMessage = {
        ok: true,
        type: 'TICK',
        action: 'TICK',
        name,
        payload: {
          name,
          elapsedMs,
          elapsed: getElapsedObjectFromMs(elapsedMs),
          limitReached: false,
          relativeTimers: calculateRelativeTimes(
            relativeTimers,
            elapsedWithOffset,
            relativeTimersLimitInMs,
            backwardsRelativeTimers
          ),
          timerOptions: {
            offsetMs,
            limitMs,
            backwards,
            relativeTimers,
            relativeTimersLimitInMs,
            backwardsRelativeTimers,
            intervalTimeMs,
          },
        },
      };

      // Limit
      const isLimitReached = limitMs > 0 && elapsedWithOffset >= limitMs;

      if (isLimitReached) {
        message.payload.elapsedMs = limitMs;
        message.payload.limitReached = true;
        message.payload.elapsed = getElapsedObjectFromMs(limitMs); // Recalculate elapsed time
        self.postMessage(message); // Send last tick
        message.type = 'TICK_LIMIT_REACHED'; // Send also a limit reached message
        timersStore[name].start = 0; // Stop the timer
      }

      // Send message
      self.postMessage(message);

      // Cancel next interval if limit is reached
      if (message.payload.limitReached && timersStore[name].interval) {
        clearInterval(timersStore[name].interval);
      }
    };
  }

  // Stop & delete
  function deleteTimer(name: TimerName): TimerMessage {
    if (timersStore?.[name]) {
      stop(name);
      delete timersStore[name];
    }

    return {
      ok: true,
      action: 'DELETE_TIMER',
      type: 'success',
      name,
      success: `Timer "${name}" deleted`,
    };
  }

  function setTimerOptions(
    action: string,
    name: TimerName,
    timerOptions: TimerOptions = DEFAULT_TIMER_OPTIONS
  ): TimerMessage {
    const {
      start = 0,
      backwards = DEFAULT_TIMER_OPTIONS.backwards,
      offsetMs = DEFAULT_TIMER_OPTIONS.offsetMs,
      limitMs = DEFAULT_TIMER_OPTIONS.limitMs,
      relativeTimers = DEFAULT_TIMER_OPTIONS.relativeTimers,
      relativeTimersLimitInMs = DEFAULT_TIMER_OPTIONS.relativeTimersLimitInMs,
      backwardsRelativeTimers = DEFAULT_TIMER_OPTIONS.backwardsRelativeTimers,
      intervalTimeMs = DEFAULT_TIMER_OPTIONS.intervalTimeMs,
    } = timerOptions;
    if (start < 0) {
      return {
        ok: false,
        action,
        type: 'error',
        error: `Timer "${name}" start option if provided must be a positive integer number`,
        name,
        timerOptions,
      };
    }

    if (backwards && limitMs <= 0) {
      return {
        ok: false,
        action,
        type: 'error',
        error: `Timer "${name}" backwards required a limit in Ms greater than 0`,
        name,
        timerOptions,
      };
    }

    if (backwardsRelativeTimers && relativeTimersLimitInMs <= 0) {
      return {
        ok: false,
        action,
        type: 'error',
        error: `Timer "${name}" relative time backwards required a relative timer limit in Ms greater than 0`,
        name,
        timerOptions,
      };
    }

    if (offsetMs > limitMs) {
      return {
        ok: false,
        action,
        type: 'error',
        error: `Timer "${name}" offset is greater than the limit`,
        name,
        timerOptions,
      };
    }

    timersStore[name] = {
      start,
      offsetMs,
      limitMs,
      backwards,
      relativeTimers,
      relativeTimersLimitInMs,
      backwardsRelativeTimers,
      intervalTimeMs,
      lastCalculatedElapsedMs: 0,
    };

    if (start > 0) {
      timersStore[name].interval = setInterval(
        intervalCallback(name),
        timersStore[name].intervalTimeMs
      );
    }

    return {
      ok: true,
      action,
      success: 'Options set',
      type: 'success',
      name,
      timerOptions,
    };
  }

  function resume(name: TimerName, opts?: TimerOptions): TimerMessage {
    if (!timersStore[name]) {
      const msg = setTimerOptions('RESUME', name, opts);

      if (!msg.ok) {
        return msg;
      }
    }

    if (timersStore[name].offsetMs < 0) {
      timersStore[name].offsetMs = 0;
    }

    if (timersStore[name].start === 0) {
      timersStore[name].start = Date.now();
      timersStore[name].interval = setInterval(
        intervalCallback(name),
        timersStore[name].intervalTimeMs
      );
    }

    const {
      offsetMs,
      limitMs,
      backwards,
      relativeTimers,
      relativeTimersLimitInMs,
      backwardsRelativeTimers,
      intervalTimeMs,
    } = timersStore[name];
    return {
      ok: true,
      action: 'RESUME',
      type: 'success',
      name,
      success: `Timer "${name}" resumed`,
      timerOptions: {
        offsetMs,
        limitMs,
        backwards,
        relativeTimers,
        relativeTimersLimitInMs,
        backwardsRelativeTimers,
        intervalTimeMs,
      },
    };
  }

  function pause(name: TimerName, opts?: TimerOptions): TimerMessage {
    if (!timersStore[name]) {
      const msg = setTimerOptions('PAUSE', name, opts);
      if (!msg.ok) {
        return msg;
      }
    }

    const {
      limitMs,
      backwards,
      relativeTimers,
      relativeTimersLimitInMs,
      backwardsRelativeTimers,
      intervalTimeMs,
    } = timersStore[name];

    if (timersStore[name].start > 0) {
      if (timersStore[name].interval) {
        clearInterval(timersStore[name].interval);
      }

      timersStore[name].start = 0;
      timersStore[name].offsetMs = timersStore[name].lastCalculatedElapsedMs;
    }

    return {
      ok: true,
      action: 'PAUSE',
      type: 'success',
      name,
      success: `Timer "${name}" already stopped`,
      timerOptions: {
        offsetMs: timersStore[name].lastCalculatedElapsedMs,
        limitMs,
        backwards,
        relativeTimers,
        relativeTimersLimitInMs,
        backwardsRelativeTimers,
        intervalTimeMs,
      },
    };
  }

  function reset(name: TimerName, opts: TimerOptions = DEFAULT_TIMER_OPTIONS): TimerMessage {
    const start = opts?.start ?? -1;
    const isRunning = start > 0 || (start < 0 && timersStore?.[name]?.start > 0);

    const msg = setTimerOptions('RESET', name, opts);
    if (!msg.ok) {
      return msg;
    }

    // Tick
    const {
      offsetMs,
      limitMs,
      backwards,
      relativeTimers,
      relativeTimersLimitInMs,
      backwardsRelativeTimers,
      intervalTimeMs,
    } = timersStore[name];

    timersStore[name].start = Date.now();
    if (!isRunning) {
      intervalCallback(name)(); // Tick once
      timersStore[name].start = 0; // Stop the timer
    }
    timersStore[name].lastCalculatedElapsedMs = 0;

    // Result
    return {
      ok: true,
      action: 'RESET',
      type: 'success',
      name,
      success: `Timer "${name}" reset`,
      timerOptions: {
        offsetMs,
        limitMs,
        backwards,
        relativeTimers,
        relativeTimersLimitInMs,
        backwardsRelativeTimers,
        intervalTimeMs,
      },
    };
  }

  function createOrSetTimer(
    name: TimerName,
    opts: TimerOptions = DEFAULT_TIMER_OPTIONS
  ): TimerMessage {
    const msg = setTimerOptions('CREATE_OR_SET', name, opts);

    if (!msg.ok) {
      return msg;
    }

    // Tick once
    reset(name, opts);

    return {
      ok: true,
      action: 'CREATE_OR_SET',
      type: 'success',
      name,
      success: `Timer "${name}" created or new options applied`,
      timerOptions: opts,
    };
  }

  // toggle
  function toggle(name: TimerName, opts?: TimerOptions) {
    const started = timersStore[name]?.start ?? 0;
    const isRunning = started > 0;
    if (isRunning) {
      return pause(name, opts);
    }

    return resume(name, opts);
  }

  // Create & Resume
  function start(name: TimerName, payload?: TimerOptions): TimerMessage {
    const createResult = createOrSetTimer(name, payload);
    if (!createResult.ok) {
      return createResult;
    }

    const resumeResult = resume(name, payload);
    if (!resumeResult.ok) {
      return resumeResult;
    }

    return {
      ok: true,
      action: 'START',
      type: 'success',
      name,
      success: `Timer "${name}" started`,
      timerOptions: {
        offsetMs: timersStore[name].offsetMs,
        limitMs: timersStore[name].limitMs,
        backwards: timersStore[name].backwards,
        relativeTimers: timersStore[name].relativeTimers,
        relativeTimersLimitInMs: timersStore[name].relativeTimersLimitInMs,
        backwardsRelativeTimers: timersStore[name].backwardsRelativeTimers,
        intervalTimeMs: timersStore[name].intervalTimeMs,
      },
    };
  }

  // Pause & Reset
  function stop(name: TimerName, opts?: TimerOptions): TimerMessage {
    const pauseMessage = pause(name, opts);
    if (!pauseMessage.ok) {
      return pauseMessage;
    }
    const resetMessage = reset(name, opts);

    if (!resetMessage.ok) {
      return resetMessage;
    }

    const {
      offsetMs,
      limitMs,
      backwards,
      relativeTimers,
      relativeTimersLimitInMs,
      backwardsRelativeTimers,
      intervalTimeMs,
    } = timersStore[name];
    return {
      ok: true,
      action: 'STOP',
      type: 'success',
      name,
      success: `Timer "${name}" stopped`,
      timerOptions: {
        offsetMs,
        limitMs,
        backwards,
        relativeTimers,
        relativeTimersLimitInMs,
        backwardsRelativeTimers,
        intervalTimeMs,
      },
    };
  }

  function setOffset(name: TimerName, offsetMs: number, opts?: TimerOptions): TimerMessage {
    if (!timersStore[name]) {
      const msg = setTimerOptions('SET_OFFSET', name, opts);
      if (!msg.ok) {
        return msg;
      }
    }

    const isRunning = timersStore[name].start > 0;

    const oldOffset = timersStore[name].offsetMs; // To use later to retrieve the message
    timersStore[name].offsetMs = offsetMs + timersStore[name].intervalTimeMs;
    timersStore[name].start = Date.now();
    timersStore[name].lastCalculatedElapsedMs = 0;

    if (!isRunning) {
      timersStore[name].start = Date.now();
      intervalCallback(name)(); // Recalculate elapsed time
      timersStore[name].start = 0; // Stop the timer
    }

    const {
      limitMs,
      backwards,
      relativeTimers,
      relativeTimersLimitInMs,
      backwardsRelativeTimers,
      intervalTimeMs,
    } = timersStore[name];
    return {
      ok: true,
      action: 'SET_OFFSET',
      type: 'success',
      name,
      success: `Timer "${name}" offset set from "${oldOffset}" to "${offsetMs}". Changes will happen on next tick`,
      timerOptions: {
        offsetMs,
        limitMs,
        backwards,
        relativeTimers,
        relativeTimersLimitInMs,
        backwardsRelativeTimers,
        intervalTimeMs,
      },
    };
  }

  function addOffset(name: TimerName, offsetMs: number, opts?: TimerOptions): TimerMessage {
    if (!timersStore[name]) {
      const msg = setTimerOptions('ADD_OFFSET', name, opts);
      if (!msg.ok) {
        return msg;
      }
    }

    const isRunning = timersStore[name].start > 0;
    const oldOffset = timersStore[name].offsetMs;
    const newOffset = +oldOffset + offsetMs;

    // Fail in case elapsed - newOffset is negative
    // for reset should use reset option
    const probablyElapseIfStopped = timersStore[name].lastCalculatedElapsedMs + newOffset;
    const probablyElapse = isRunning
      ? Date.now() - timersStore[name].start + newOffset + timersStore[name].intervalTimeMs
      : probablyElapseIfStopped;
    if (probablyElapse < 0) {
      return {
        ok: false,
        action: 'ADD_OFFSET',
        type: 'error',
        name,
        error: `Timer "${name}" total offset can not be negative`,
        timerOptions: {
          offsetMs: oldOffset,
          limitMs: timersStore[name].limitMs,
          backwards: timersStore[name].backwards,
          relativeTimers: timersStore[name].relativeTimers,
          relativeTimersLimitInMs: timersStore[name].relativeTimersLimitInMs,
          backwardsRelativeTimers: timersStore[name].backwardsRelativeTimers,
          intervalTimeMs: timersStore[name].intervalTimeMs,
        },
      };
    }

    timersStore[name].offsetMs = newOffset;

    if (!isRunning) {
      timersStore[name].start = Date.now();
      intervalCallback(name)(); // Recalculate elapsed time
      timersStore[name].start = 0; // Stop the timer
    }

    const {
      offsetMs: storedOffset,
      limitMs,
      backwards,
      relativeTimers,
      relativeTimersLimitInMs,
      backwardsRelativeTimers,
      intervalTimeMs,
    } = timersStore[name];
    return {
      ok: true,
      action: 'ADD_OFFSET',
      type: 'success',
      name,
      success: `Timer "${name}" offset has changed from "${oldOffset}" to "${newOffset}". Changes will happen on next tick`,
      timerOptions: {
        offsetMs: storedOffset,
        limitMs,
        backwards,
        relativeTimers,
        relativeTimersLimitInMs,
        backwardsRelativeTimers,
        intervalTimeMs,
      },
    };
  }

  function addRelativeTimers(
    name: TimerName,
    relativeTimers: RelativeTimer[],
    opts?: TimerOptions
  ): TimerMessage {
    if (!timersStore[name]) {
      const msg = setTimerOptions('ADD_RELATIVE_TIMERS', name, opts);
      if (!msg.ok) {
        return msg;
      }
    }

    timersStore[name].relativeTimers ??= [];
    timersStore[name].relativeTimers.push(...relativeTimers);

    intervalCallback(name)();

    const {
      offsetMs,
      limitMs,
      backwards,
      relativeTimers: storedRelativeTimers,
      relativeTimersLimitInMs,
      backwardsRelativeTimers,
      intervalTimeMs,
    } = timersStore[name];
    return {
      ok: true,
      action: 'ADD_RELATIVE_TIMERS',
      type: 'success',
      name,
      success: `Timer "${name}" added ${relativeTimers.length} timers`,
      timerOptions: {
        offsetMs,
        limitMs,
        backwards,
        relativeTimers: storedRelativeTimers,
        relativeTimersLimitInMs,
        backwardsRelativeTimers,
        intervalTimeMs,
      },
    };
  }

  function removeRelativeTimers(
    name: TimerName,
    timersIds: RelativeTimerId[],
    opts?: TimerOptions
  ): TimerMessage {
    if (!timersStore[name]) {
      const msg = setTimerOptions('REMOVE_RELATIVE_TIMERS', name, opts);
      if (!msg.ok) {
        return msg;
      }
    }

    timersStore[name].relativeTimers = timersStore[name].relativeTimers.filter(
      ({ id }: RelativeTimer) => !timersIds.includes(id)
    );

    intervalCallback(name)(); // Recalculate elapsed time
    const {
      offsetMs,
      limitMs,
      backwards,
      relativeTimers,
      relativeTimersLimitInMs,
      backwardsRelativeTimers,
      intervalTimeMs,
    } = timersStore[name];
    return {
      ok: true,
      action: 'REMOVE_RELATIVE_TIMERS',
      type: 'success',
      name,
      success: `Timer "${name}" removed ${timersIds.length} timers`,
      timerOptions: {
        offsetMs,
        limitMs,
        backwards,
        relativeTimers,
        relativeTimersLimitInMs,
        backwardsRelativeTimers,
        intervalTimeMs,
      },
    };
  }

  self.addEventListener('message', (event: { data: ActionTimer }) => {
    try {
      const { type, name } = event.data;

      switch (type) {
        case 'CREATE_OR_SET': {
          const { payload } = event.data as StartCreateActionTimer;
          self.postMessage(createOrSetTimer(name, payload));
          break;
        }
        case 'START': {
          const { payload } = event.data as StartCreateActionTimer;
          self.postMessage(start(name, payload));
          break;
        }

        case 'RESUME': {
          const { opts: timerOptions } = event.data;
          self.postMessage(resume(name, timerOptions));
          break;
        }

        case 'PAUSE': {
          const { opts: timerOptions } = event.data;
          self.postMessage(pause(name, timerOptions));
          break;
        }

        case 'RESET': {
          const { opts: timerOptions } = event.data;
          self.postMessage(reset(name, timerOptions));
          break;
        }

        case 'TOGGLE': {
          const { opts: timerOptions } = event.data;
          self.postMessage(toggle(name, timerOptions));
          break;
        }

        case 'STOP': {
          const { opts: timerOptions } = event.data;
          self.postMessage(stop(name, timerOptions));
          break;
        }

        case 'SET_OFFSET': {
          const { payload, opts: timerOptions } = event.data as OffsetActionTimer;
          self.postMessage(setOffset(name, payload, timerOptions));
          break;
        }

        case 'ADD_OFFSET': {
          const { payload, opts: timerOptions } = event.data as OffsetActionTimer;
          self.postMessage(addOffset(name, payload, timerOptions));
          break;
        }

        case 'ADD_RELATIVE_TIMERS': {
          const { payload, opts: timerOptions } = event.data as AddRelativeActionTimer;
          self.postMessage(addRelativeTimers(name, payload, timerOptions));
          break;
        }

        case 'REMOVE_RELATIVE_TIMERS': {
          const { payload, opts: timerOptions } = event.data as RemoveRelativeActionTimer;
          self.postMessage(removeRelativeTimers(name, payload, timerOptions));
          break;
        }

        case 'GET_RELATIVE_TIMERS': {
          const { name } = event.data as GetRelativeActionTimer;
          const message: TimerMessage = {
            ok: true,
            action: 'GET_RELATIVE_TIMERS',
            type: 'success',
            success: 'Relative Timers',
            name,
            payload: timersStore?.[name]?.relativeTimers ?? [],
          };
          self.postMessage(message);
          break;
        }

        case 'DELETE_TIMER': {
          const { name } = event.data as ActionTimer;
          self.postMessage(deleteTimer(name));
          break;
        }

        default:
          self.postMessage({
            ok: false,
            action: 'UNKNOWN',
            type: 'error',
            error: `Unknown action ${(event.data as ActionTimer).type}`,
          });
      }
    } catch (error) {
      console.error('Wrong message received');
      console.error(error);
    }
  });
}

export function TimerWorker(
  {
    onTick,
    onError: onTimerError,
    onSuccess,
    onLimitReached,
  }: {
    onTick: TickTimerCallback;
    onError?: ErrorTimerCallback;
    onSuccess?: SuccessTimerCallback;
    onLimitReached?: TickTimerCallback;
  },
  singleton = false,
  overwriteSingleton = true,
  DEFAULT_TIMER_OPTIONS: TimerOptionsInput = {
    offsetMs: 0,
    limitMs: 0,
    backwards: false,
    relativeTimers: [],
    relativeTimersLimitInMs: 120_000, // 2 mins
    backwardsRelativeTimers: true,
    intervalTimeMs: 250,
  }
) {
  let activeTimer = '';

  const worker = new Worker(
    URL.createObjectURL(
      new Blob([`(${timerMillisecondsWorker.toString()})(self)`], {
        type: 'application/javascript',
      })
    )
  );

  worker.addEventListener('message', (event: { data: TimerMessage }) => {
    try {
      const message = TimerMessage.parse(event.data);

      if (message.type === 'TICK' || message.type === 'TICK_LIMIT_REACHED') {
        onTick(message);

        if (message.type === 'TICK') {
          return;
        }
      }

      if ('TICK_LIMIT_REACHED' === message.type) {
        onLimitReached?.(message);
      } else if (message.type === 'success') {
        onSuccess?.(message as SuccessTimerMessage);
      } else if (message.type === 'error') {
        onTimerError?.(message);
      }
    } catch (error) {
      console.error('Received and invalid message', event.data);
    }
  });

  function deleteTimer(name: TimerName) {
    if (activeTimer === name) {
      pause(name);
      activeTimer = '';
    }

    worker.postMessage({
      type: TimerAction.DELETE_TIMER,
      name,
    });

    return name;
  }

  function createOrSet(name: TimerName, payload: TimerOptionsInput = DEFAULT_TIMER_OPTIONS) {
    worker.postMessage({
      type: TimerAction.CREATE_OR_SET,
      name,
      payload,
    });

    return name;
  }

  function pause(name: TimerName, opts: TimerOptionsInput = DEFAULT_TIMER_OPTIONS) {
    activeTimer = '';

    worker.postMessage({
      type: TimerAction.PAUSE,
      name,
      opts,
    });

    return name;
  }

  function reset(name: TimerName, opts: TimerOptionsInput = DEFAULT_TIMER_OPTIONS) {
    if (singleton && !overwriteSingleton && activeTimer !== name) {
      return activeTimer;
    }

    if (singleton && overwriteSingleton && activeTimer !== name) {
      pause(activeTimer);
    }

    activeTimer = name;

    worker.postMessage({
      type: TimerAction.RESET,
      name,
      opts,
    });

    return name;
  }

  function resume(name: TimerName, opts: TimerOptionsInput = DEFAULT_TIMER_OPTIONS) {
    if (singleton && !overwriteSingleton && activeTimer !== name) {
      return activeTimer;
    }

    if (singleton && overwriteSingleton && activeTimer !== name) {
      pause(activeTimer);
    }

    activeTimer = name;

    worker.postMessage({
      type: TimerAction.RESUME,
      name,
      opts,
    });
  }

  function toggle(name: TimerName, opts: TimerOptionsInput = DEFAULT_TIMER_OPTIONS) {
    if (singleton && !overwriteSingleton && activeTimer !== name) {
      return activeTimer;
    }

    if (singleton && overwriteSingleton && activeTimer !== name) {
      pause(activeTimer);
    }

    activeTimer = name;

    worker.postMessage({
      type: TimerAction.TOGGLE,
      name,
      opts,
    });

    return name;
  }

  function start(name: TimerName, payload: TimerOptionsInput = DEFAULT_TIMER_OPTIONS) {
    if (singleton && !overwriteSingleton && activeTimer !== name) {
      return activeTimer;
    }

    if (singleton && overwriteSingleton && activeTimer !== name) {
      pause(activeTimer);
    }

    activeTimer = name;

    worker.postMessage({
      type: TimerAction.START,
      name,
      payload,
    });

    return name;
  }

  function stop(name: TimerName, opts: TimerOptionsInput = DEFAULT_TIMER_OPTIONS) {
    if (singleton && !overwriteSingleton && activeTimer !== name) {
      return activeTimer;
    }

    if (singleton && overwriteSingleton && activeTimer !== name) {
      pause(activeTimer);
    }

    activeTimer = '';

    worker.postMessage({
      type: TimerAction.STOP,
      name,
      opts,
    });

    return name;
  }

  function setOffset(
    name: TimerName,
    offsetMs: number,
    opts: TimerOptionsInput = DEFAULT_TIMER_OPTIONS
  ) {
    if (singleton && !overwriteSingleton && activeTimer !== name) {
      return activeTimer;
    }

    if (singleton && overwriteSingleton && activeTimer !== name) {
      pause(activeTimer);
    }

    activeTimer = name;

    worker.postMessage({
      type: TimerAction.SET_OFFSET,
      name,
      payload: offsetMs,
      opts,
    });

    return name;
  }

  function addOffset(
    name: TimerName,
    offset: number,
    opts: TimerOptionsInput = DEFAULT_TIMER_OPTIONS
  ) {
    if (singleton && !overwriteSingleton && activeTimer !== name) {
      return activeTimer;
    }

    if (singleton && overwriteSingleton && activeTimer !== name) {
      pause(activeTimer);
    }

    activeTimer = name;

    worker.postMessage({
      type: TimerAction.ADD_OFFSET,
      name,
      payload: offset,
      opts,
    });

    return name;
  }

  function addRelativeTimers(
    name: TimerName,
    relativeTimers: RelativeTimer[],
    opts: TimerOptionsInput = DEFAULT_TIMER_OPTIONS
  ) {
    if (singleton && !overwriteSingleton && activeTimer !== name) {
      return activeTimer;
    }

    if (singleton && overwriteSingleton && activeTimer !== name) {
      pause(activeTimer);
    }

    activeTimer = name;

    worker.postMessage({
      type: TimerAction.ADD_RELATIVE_TIMERS,
      name,
      payload: relativeTimers,
      opts,
    });

    return name;
  }

  function removeRelativeTimers(
    name: TimerName,
    timerIds: RelativeTimerId[],
    opts: TimerOptionsInput = DEFAULT_TIMER_OPTIONS
  ) {
    if (singleton && !overwriteSingleton && activeTimer !== name) {
      return activeTimer;
    }

    if (singleton && overwriteSingleton && activeTimer !== name) {
      pause(activeTimer);
    }

    activeTimer = name;

    worker.postMessage({
      type: TimerAction.REMOVE_RELATIVE_TIMERS,
      name,
      payload: timerIds,
      opts,
    });

    return name;
  }

  function getRelativeTimers(name: TimerName, opts: TimerOptionsInput = DEFAULT_TIMER_OPTIONS) {
    worker.postMessage({
      type: TimerAction.GET_RELATIVE_TIMERS,
      name,
      opts,
    });
  }

  return {
    worker,
    deleteTimer,
    createOrSet,
    pause,
    resume,
    toggle,
    reset,
    start,
    stop,
    setOffset,
    addOffset,
    addRelativeTimers,
    removeRelativeTimers,
    getRelativeTimers,
  };
}
