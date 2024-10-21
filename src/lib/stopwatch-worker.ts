type TimerName = string;
export type RelativeTimeId = string | number;
export type RelativeTime = { id: RelativeTimeId; start: number };
type RelativeTimerElapsed = RelativeTime & { elapsedMs: number };
type RelativeTimers = Array<RelativeTime[]>;
type Timer = {
  start: number;
  offsetMs: number;
  limitMs: number;
  backwards: boolean;
  relativeTimers: RelativeTimers;
  relativeTimersLimitInMs: number;
  lastCalculatedElapsedMs: number;
  backwardsRelativeTimers: boolean;
  intervalTimeMs: number;
  interval: ReturnType<typeof setInterval> | null; // SetInterval it is not the same type in node and browser
};
export type CreateTimerOptions = Partial<
  Omit<Timer, 'start' | 'lastCalculatedElapsedMs' | 'interval'>
>;

export type TickCallback = (message: TickMessage) => void;
export type ErrorCallback = (message: ErrorMessage) => void;
export type SuccessCallback = (message: SuccessMessage) => void;

export enum TimerAction {
  START = 'START',
  STOP = 'STOP',
  RESET = 'RESET',
  SET_OFFSET = 'SET_OFFSET',
  ADD_OFFSET = 'ADD_OFFSET',
  ADD_RELATIVE_TIMERS = 'ADD_RELATIVE_TIMERS',
  REMOVE_RELATIVE_TIMERS = 'REMOVE_RELATIVE_TIMERS',
  GET_RELATIVE_TIMERS = 'GET_RELATIVE_TIMERS',
  CREATE_SET = 'CREATE_OR_SET_TIMER_OPTIONS',
  RESUME = 'RESUME',
  PAUSE = 'PAUSE',

  DELETE_TIMER = 'DELETE_TIMER',
}

export enum TimerMessageAction {
  UNKNOWN = 'UNKNOWN',
  TICK = 'TICK',
  TICK_LIMIT_REACHED = 'TICK_LIMIT_REACHED',
  CREATE_SET = 'CREATE_OR_SET_TIMER_OPTIONS',
  START = 'START',
  RESUME = 'RESUME',
  PAUSE = 'PAUSE',
  RESET = 'RESET',
  STOP = 'STOP',
  SET_OFFSET = 'SET_OFFSET',
  ADD_OFFSET = 'ADD_OFFSET',
  ADD_RELATIVE_TIMERS = 'ADD_RELATIVE_TIMERS',
  REMOVE_RELATIVE_TIMERS = 'REMOVE_RELATIVE_TIMERS',
  GET_RELATIVE_TIMERS = 'GET_RELATIVE_TIMERS',
  DELETE_TIMER = 'DELETE_TIMER',
}

type TickMessage = {
  ok: true;
  type: TimerMessageAction.TICK | TimerMessageAction.TICK_LIMIT_REACHED;
  action: TimerMessageAction.TICK;
  payload: {
    name: TimerName;
    elapsed: {
      // days: number;
      // hours: number;
      minutes: number;
      seconds: number;
      milliseconds: number;
    };
    elapsedMs: number;
    limitReached: boolean;
    relativeTimers: Array<RelativeTimerElapsed[]>;
    timerOptions: CreateTimerOptions;
  };
};

type ErrorMessage = {
  ok: false;
  action: Exclude<TimerMessageAction, TimerMessageAction.TICK>;
  name: TimerName;
  type: 'error';
  error: string;
  timerOptions?: CreateTimerOptions;
};

type SuccessMessage = {
  ok: true;
  action: Omit<
    TimerMessageAction,
    | TimerMessageAction.TICK
    | TimerMessageAction.TICK_LIMIT_REACHED
    | TimerMessageAction.GET_RELATIVE_TIMERS
    | TimerMessageAction.DELETE_TIMER
  >;
  type: 'success';
  success: string;
  name: TimerName;
  timerOptions: CreateTimerOptions;
};

type GetRelativeTimersMessage = {
  ok: true;
  action: TimerMessageAction.GET_RELATIVE_TIMERS;
  type: 'success';
  success: 'Relative timers';
  payload: RelativeTimers;
};

type DeleteTimerMessage = {
  ok: true;
  action: TimerMessageAction.DELETE_TIMER;
  type: 'success';
  success: string;
};

type Message =
  | TickMessage
  | ErrorMessage
  | SuccessMessage
  | GetRelativeTimersMessage
  | DeleteTimerMessage;

type CreateAction = {
  type: TimerAction.CREATE_SET;
  name: TimerName;
  payload: CreateTimerOptions;
};

type StartAction = {
  // Create + Resume
  type: TimerAction.START;
  name: TimerName;
  payload: CreateTimerOptions;
};

type ResumeAction = {
  type: TimerAction.RESUME;
  name: TimerName;
};

type StopAction = {
  type: TimerAction.STOP; // Stop means pause and reset
  name: TimerName;
};

type PauseAction = {
  type: TimerAction.PAUSE;
  name: TimerName;
};

type ResetAction = {
  type: TimerAction.RESET;
  name: TimerName;
};

type SetOffsetAction = {
  type: TimerAction.SET_OFFSET;
  name: TimerName;
  payload: number;
};

type AddOffsetAction = {
  type: TimerAction.ADD_OFFSET;
  name: TimerName;
  payload: number;
};

type AddRelativeTimers = {
  type: TimerAction.ADD_RELATIVE_TIMERS;
  name: TimerName;
  index: number;
  payload: RelativeTime[];
};

type RemoveRelativeTimers = {
  type: TimerAction.REMOVE_RELATIVE_TIMERS;
  name: TimerName;
  index: number;
  payload: RelativeTimeId[]; //
};

type GetRelativeTimers = {
  type: TimerAction.GET_RELATIVE_TIMERS;
  name: TimerName;
};

type DeleteTimer = {
  type: TimerAction.DELETE_TIMER;
  name: TimerName;
};

type Action =
  | CreateAction
  | ResumeAction
  | PauseAction
  | StartAction // Create + Resume
  | StopAction // Pause + Reset
  | ResetAction
  | SetOffsetAction
  | AddOffsetAction
  | AddRelativeTimers
  | RemoveRelativeTimers
  | GetRelativeTimers
  | DeleteTimer;

// biome-ignore lint/suspicious/noExplicitAny: Can not get the type of WorkerGlobalScope
type WorkerGlobalScope = /* unresolved */ any;

function timerMillisecondsWorker(self: WorkerGlobalScope) {
  const timersStore: {
    [key: TimerName]: Timer;
  } = {}; // { name: { start: timestamp, offsetMs: 0, limit: 0, backwards: boolean, interval: <Interval> } }

  // const DAY_IN_MS = 86_400_000;
  // const HOUR_IN_MS = 3_600_000;
  const MINUTE_IN_MS = 60_000;
  const SECOND_IN_MS = 1_000;

  function getElapsedObjectFromMs(ms: number) {
    // This should be configurable by choosing the max unit
    // const days = Math.floor(ms / DAY_IN_MS);
    // const daysOdd = ms % DAY_IN_MS;

    //const hours = Math.floor(daysOdd / HOUR_IN_MS);
    //const hoursOdd = daysOdd % HOUR_IN_MS;

    //const minutes = Math.floor(hoursOdd / MINUTE_IN_MS);
    //const minutesOdd = hoursOdd % MINUTE_IN_MS;
    const minutes = Math.floor(ms / MINUTE_IN_MS);
    const minutesOdd = ms % MINUTE_IN_MS;

    const seconds = Math.floor(minutesOdd / SECOND_IN_MS);
    const milliseconds = Math.floor(ms % SECOND_IN_MS);

    return {
      // days,
      // hours,
      minutes,
      seconds,
      milliseconds,
    };
  }

  function calculateRelativeTimes(
    relativeTimers: RelativeTime[],
    elapsedWithOffset: number,
    relativeTimersLimitInMs: number,
    backwarsRelativeTimers: boolean
  ): RelativeTimerElapsed[] {
    return relativeTimers
      .filter(
        ({ start: startTimeMs }: RelativeTime) =>
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
        type: TimerMessageAction.TICK,
        action: TimerMessageAction.TICK,
        payload: {
          name,
          elapsedMs,
          elapsed: getElapsedObjectFromMs(elapsedMs),
          limitReached: false,
          relativeTimers: relativeTimers.map((relativeTimersForIndex) =>
            calculateRelativeTimes(
              relativeTimersForIndex,
              elapsedWithOffset,
              relativeTimersLimitInMs,
              backwardsRelativeTimers
            )
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
        message.type = TimerMessageAction.TICK_LIMIT_REACHED; // Send also a limit reached message
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
  function deleteTimer(name: TimerName): Message {
    if (timersStore?.[name]) {
      stop(name);
      delete timersStore[name];
    }

    return {
      ok: true,
      action: TimerMessageAction.DELETE_TIMER,
      type: 'success',
      success: `Timer "${name}" deleted`,
    };
  }

  function createOrSetTimer(
    name: TimerName,
    {
      offsetMs,
      limitMs,
      backwards,
      relativeTimers = [],
      relativeTimersLimitInMs,
      backwardsRelativeTimers,
      intervalTimeMs,
    }: CreateTimerOptions = {}
  ): Message {
    if (backwards && !limitMs) {
      return {
        ok: false,
        action: TimerMessageAction.CREATE_SET,
        type: 'error',
        error: `Backwards Timer "${name}" requires a limit`,
        name,
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

    timersStore[name] = {
      start: timersStore[name]?.start ?? 0,
      offsetMs: offsetMs ?? timersStore[name]?.offsetMs ?? 0,
      limitMs: limitMs ?? timersStore[name]?.limitMs ?? 0,
      backwards: backwards ?? timersStore[name]?.backwards ?? false,
      relativeTimers: relativeTimers ?? timersStore[name]?.relativeTimers ?? [],
      relativeTimersLimitInMs:
        relativeTimersLimitInMs ?? timersStore[name]?.relativeTimersLimitInMs ?? 0,
      lastCalculatedElapsedMs: timersStore[name]?.lastCalculatedElapsedMs ?? 0,
      backwardsRelativeTimers:
        timersStore[name]?.backwardsRelativeTimers ?? backwardsRelativeTimers ?? true,
      intervalTimeMs: timersStore[name]?.intervalTimeMs ?? intervalTimeMs ?? 200,
      interval: timersStore[name]?.interval ?? null,
    };

    // If there is a limit but the offset is greater than the limit, return an error
    if (limitMs && offsetMs && limitMs > 0 && offsetMs >= limitMs) {
      return {
        ok: false,
        action: TimerMessageAction.CREATE_SET,
        type: 'error',
        error: 'OffsetMs can not be greater than limitMs',
        name,
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

    return {
      ok: true,
      action: TimerMessageAction.CREATE_SET,
      type: 'success',
      name,
      success: `Timer "${name}" created or new options applied`,
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

  function resume(name: TimerName): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.RESUME,
        type: 'error',
        name,
        error: `Timer "${name}" does not exist`,
      };
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
      action: TimerMessageAction.RESUME,
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

  function pause(name: TimerName): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.PAUSE,
        type: 'error',
        name,
        error: `Timer "${name}" does not exist`,
      };
    }

    if (timersStore[name].start > 0) {
      if (timersStore[name].interval) {
        clearInterval(timersStore[name].interval);
      }

      timersStore[name].start = 0;
      timersStore[name].offsetMs = timersStore[name].lastCalculatedElapsedMs;
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
        action: TimerMessageAction.PAUSE,
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
      action: TimerMessageAction.PAUSE,
      type: 'success',
      name,
      success: `Timer "${name}" already stopped`,
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

  function reset(name: TimerName): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.RESET,
        type: 'error',
        name,
        error: `Timer "${name}" does not exist`,
      };
    }

    // Reset values
    timersStore[name].offsetMs = 0;
    timersStore[name].lastCalculatedElapsedMs = 0;
    timersStore[name].relativeTimers = [];

    const isRunning = timersStore[name].start > 0;
    const {
      offsetMs,
      limitMs,
      backwards,
      relativeTimers,
      relativeTimersLimitInMs,
      backwardsRelativeTimers,
      intervalTimeMs,
    } = timersStore[name];
    if (isRunning) {
      timersStore[name].start = Date.now();
      return {
        ok: true,
        action: TimerMessageAction.RESET,
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

    timersStore[name].start = Date.now();
    timersStore[name].lastCalculatedElapsedMs = 0;

    intervalCallback(name)(); // Tick once
    timersStore[name].start = 0; // Stop the timer

    return {
      ok: true,
      action: TimerMessageAction.RESET,
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

  // Create & Resume
  function start(name: TimerName, payload: CreateTimerOptions): Message {
    const createResult = createOrSetTimer(name, payload);
    if (!createResult.ok) {
      createResult.action = TimerMessageAction.START;
      return createResult;
    }

    const resumeResult = resume(name);
    if (!resumeResult.ok) {
      resumeResult.action = TimerMessageAction.START;
      return resumeResult;
    }

    return {
      ok: true,
      action: TimerMessageAction.START,
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
  function stop(name: TimerName): Message {
    const pauseMessage = pause(name);
    if (!pauseMessage.ok) {
      return pauseMessage;
    }
    const resetMessage = reset(name);

    if (!resetMessage.ok) {
      resetMessage.action = TimerMessageAction.STOP;
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
      action: TimerMessageAction.STOP,
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

  function setOffset(name: TimerName, offsetMs: number): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.SET_OFFSET,
        type: 'error',
        name,
        error: `Timer "${name}" does not exist`,
      };
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
      action: TimerMessageAction.SET_OFFSET,
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

  function addOffset(name: TimerName, offsetMs: number): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.ADD_OFFSET,
        type: 'error',
        name,
        error: `Timer "${name}" does not exist`,
      };
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
        action: TimerMessageAction.ADD_OFFSET,
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
      action: TimerMessageAction.ADD_OFFSET,
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

  function addRelativeTimer(
    name: TimerName,
    index: number,
    relativeTimers: RelativeTime[]
  ): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.ADD_RELATIVE_TIMERS,
        type: 'error',
        name,
        error: `Timer "${name}" does not exist`,
      };
    }

    const idx = Number(index);

    if (isNaN(idx)) {
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
        ok: false,
        action: TimerMessageAction.ADD_RELATIVE_TIMERS,
        type: 'error',
        name,
        error: `Team index "${index}" is not a number`,
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

    timersStore[name].relativeTimers ??= [];
    timersStore[name].relativeTimers[idx] ??= [];
    timersStore[name].relativeTimers[idx].push(...relativeTimers);

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
      action: TimerMessageAction.ADD_RELATIVE_TIMERS,
      type: 'success',
      name,
      success: `Timer "${name}" added ${relativeTimers.length} timers to ${index}`,
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
    index: number,
    timersIds: RelativeTimeId[]
  ): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.REMOVE_RELATIVE_TIMERS,
        type: 'error',
        name,
        error: `Timer "${name}" does not exist`,
      };
    }

    const idx = Number(index);

    if (isNaN(idx)) {
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
        ok: false,
        action: TimerMessageAction.REMOVE_RELATIVE_TIMERS,
        type: 'error',
        name,
        error: `Team index "${index}" is not a number`,
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

    if (!timersStore?.[name]?.relativeTimers?.[idx]) {
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
        ok: false,
        action: TimerMessageAction.REMOVE_RELATIVE_TIMERS,
        type: 'error',
        name,
        error: `Team "${index}" does not exist`,
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

    timersStore[name].relativeTimers[idx] = timersStore[name].relativeTimers[idx].filter(
      ({ id }: RelativeTime) => !timersIds.includes(id)
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
      action: TimerMessageAction.REMOVE_RELATIVE_TIMERS,
      type: 'success',
      name,
      success: `Timer "${name}" removed ${timersIds.length} timers from ${index}`,
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

  self.addEventListener('message', (event: { data: Action }) => {
    switch (event.data.type as Action['type']) {
      case TimerAction.CREATE_SET: {
        const { name, payload = {} } = event.data as StartAction;
        self.postMessage(createOrSetTimer(name, payload));
        break;
      }
      case TimerAction.RESUME:
        self.postMessage(resume(event.data.name));
        break;

      case TimerAction.PAUSE:
        self.postMessage(pause(event.data.name));
        break;

      case TimerAction.RESET:
        self.postMessage(reset(event.data.name));
        break;

      case TimerAction.START: {
        const { name, payload } = event.data as StartAction;
        self.postMessage(start(name, payload));
        break;
      }

      case TimerAction.STOP:
        self.postMessage(stop(event.data.name));
        break;

      case TimerAction.SET_OFFSET: {
        const { name, payload } = event.data as SetOffsetAction;
        self.postMessage(setOffset(name, payload));
        break;
      }

      case TimerAction.ADD_OFFSET: {
        const { name, payload } = event.data as AddOffsetAction;
        self.postMessage(addOffset(name, payload));
        break;
      }
      case TimerAction.ADD_RELATIVE_TIMERS: {
        const { name, index, payload } = event.data as AddRelativeTimers;
        self.postMessage(addRelativeTimer(name, index, payload));
        break;
      }
      case TimerAction.REMOVE_RELATIVE_TIMERS: {
        const { name, index, payload } = event.data as RemoveRelativeTimers;
        self.postMessage(removeRelativeTimers(name, index, payload));
        break;
      }

      case TimerAction.GET_RELATIVE_TIMERS: {
        const { name } = event.data as GetRelativeTimers;
        const message: Message = {
          ok: true,
          action: TimerMessageAction.GET_RELATIVE_TIMERS,
          type: 'success',
          success: 'Relative timers',
          payload: timersStore?.[name]?.relativeTimers ?? [],
        };
        self.postMessage(message);
        break;
      }

      case TimerAction.DELETE_TIMER: {
        const { name } = event.data as Action;
        self.postMessage(deleteTimer(name));
        break;
      }

      default:
        self.postMessage({
          ok: false,
          action: TimerMessageAction.UNKNOWN,
          type: 'error',
          error: `Unknown action ${(event.data as Action).type}`,
        });
    }
  });
}

export function TimerWorker({
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
  const worker = new Worker(
    URL.createObjectURL(
      new Blob([`(${timerMillisecondsWorker.toString()})(self)`], {
        type: 'application/javascript',
      })
    )
  );

  worker.addEventListener('message', (event: { data: Message }) => {
    if (event.data.ok) {
      if (event.data.action === TimerMessageAction.TICK) {
        onTick(event.data as TickMessage);
      } else if (event.data.action === TimerMessageAction.TICK_LIMIT_REACHED) {
        onLimitReached?.(event.data as TickMessage);
      } else {
        onSuccess?.(event.data as SuccessMessage);
      }
    } else {
      onError?.(event.data as ErrorMessage);
    }
  });

  function deleteTimer(name: TimerName) {
    worker.postMessage({
      type: TimerAction.DELETE_TIMER,
      name,
    });
  }

  function createOrSet(name: TimerName, payload: CreateTimerOptions = {}) {
    worker.postMessage({
      type: TimerAction.CREATE_SET,
      name,
      payload,
    });
  }

  function pause(name: TimerName) {
    worker.postMessage({
      type: TimerAction.PAUSE,
      name,
    });
  }

  function reset(name: TimerName) {
    worker.postMessage({
      type: TimerAction.RESET,
      name,
    });
  }

  function resume(name: TimerName) {
    worker.postMessage({
      type: TimerAction.RESUME,
      name,
    });
  }

  function start(name: TimerName, payload: CreateTimerOptions = {}) {
    worker.postMessage({
      type: TimerAction.START,
      name,
      payload,
    });
  }

  function stop(name: TimerName) {
    worker.postMessage({
      type: TimerAction.STOP,
      name,
    });
  }

  function setOffset(name: TimerName, offsetMs: number) {
    worker.postMessage({
      type: TimerAction.SET_OFFSET,
      name,
      payload: offsetMs,
    });
  }

  function addOffset(name: TimerName, offset: number) {
    worker.postMessage({
      type: TimerAction.ADD_OFFSET,
      name,
      payload: offset,
    });
  }

  function addRelativeTimers(name: TimerName, index: number, relativeTimers: RelativeTime[]) {
    worker.postMessage({
      type: TimerAction.ADD_RELATIVE_TIMERS,
      name,
      index,
      payload: relativeTimers,
    });
  }

  function removeRelativeTimers(name: TimerName, index: number, timerIds: RelativeTimeId[]) {
    worker.postMessage({
      type: TimerAction.REMOVE_RELATIVE_TIMERS,
      name,
      index,
      payload: timerIds,
    });
  }

  function getRelativeTimers(name: TimerName) {
    worker.postMessage({
      type: TimerAction.GET_RELATIVE_TIMERS,
      name,
    });
  }

  return {
    worker,
    deleteTimer,
    createOrSet,
    pause,
    resume,
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
