type TimerName = string;
type RelativeTimeId = string | number;
type RelativeTime = { id: RelativeTimeId; start: number };
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

export enum TimerAction {
  START = 'START',
  STOP = 'STOP',
  RESET = 'RESET',
  SET_OFFSET = 'SET_OFFSET',
  ADD_OFFSET = 'ADD_OFFSET',
  ADD_RELATIVE_TIMER = 'ADD_RELATIVE_TIMER',
  REMOVE_RELATIVE_TIMER = 'REMOVE_RELATIVE_TIMER',

  CREATE = 'CREATE',
  RESUME = 'RESUME',
  PAUSE = 'PAUSE',
}

export enum TimerMessageAction {
  UNKNOWN = 'UNKNOWN',
  TICK = 'TICK',
  CREATE = 'CREATE',
  START = 'START',
  RESUME = 'RESUME',
  PAUSE = 'PAUSE',
  RESET = 'RESET',
  STOP = 'STOP',
  SET_OFFSET = 'SET_OFFSET',

  ADD_OFFSET = 'ADD_OFFSET',
  ADD_RELATIVE_TIMER = 'ADD_RELATIVE_TIMER',
  REMOVE_RELATIVE_TIMER = 'REMOVE_RELATIVE_TIMER',
}

type TickMessage = {
  ok: true;
  type: 'tick';
  action: TimerMessageAction.TICK;
  payload: {
    name: TimerName;
    elapsedMs: number;
    relativeTimers: Array<RelativeTimerElapsed[]>;
    limitMs: number;
    backwards: boolean;
    limitReached: boolean;
  };
  timer: Timer | null;
};

type ErrorMessage = {
  ok: false;
  action: Exclude<TimerMessageAction, TimerMessageAction.TICK>;
  type: 'error';
  error: string;
};

type SuccessMessage = {
  ok: true;
  action: Exclude<TimerMessageAction, TimerMessageAction.TICK>;
  type: 'success';
  success: string;
  timer: Timer | null;
};

type Message = TickMessage | ErrorMessage | SuccessMessage;

type CreateAction = {
  type: TimerAction.CREATE;
  name: TimerName;
  payload: Timer;
};

type StartAction = {
  // Create + Resume
  type: TimerAction.START;
  name: TimerName;
  payload: Timer;
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
  type: TimerAction.ADD_RELATIVE_TIMER;
  name: TimerName;
  index: number;
  payload: RelativeTime[];
};

type RemoveRelativeTimers = {
  type: TimerAction.REMOVE_RELATIVE_TIMER;
  name: TimerName;
  index: number;
  payload: RelativeTimeId[]; //
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
  | RemoveRelativeTimers;

// biome-ignore lint/suspicious/noExplicitAny: Can not get the type of WorkerGlobalScope
type WorkerGlobalScope = /* unresolved */ any;

function timerMillisecondsWorker(self: WorkerGlobalScope) {
  const timersStore: {
    [key: TimerName]: Timer;
  } = {}; // { name: { start: timestamp, offsetMs: 0, limit: 0, backwards: boolean, interval: <Interval> } }

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
      .map((relative) => ({
        ...relative,
        elapsedMs: backwarsRelativeTimers
          ? relativeTimersLimitInMs - (elapsedWithOffset - relative.start)
          : elapsedWithOffset - relative.start,
      }));
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
      } = timersStore[name];

      const elapsed = now - start;
      const elapsedWithOffset = elapsed + offsetMs;
      const elapsedMs = backwards && limitMs ? limitMs - elapsedWithOffset : elapsedWithOffset;

      // Message
      const message: Message = {
        ok: true,
        type: 'tick',
        action: TimerMessageAction.TICK,
        payload: {
          name,
          elapsedMs,
          relativeTimers: relativeTimers.map((relativeTimersForIndex) =>
            calculateRelativeTimes(
              relativeTimersForIndex,
              elapsedWithOffset,
              relativeTimersLimitInMs,
              backwardsRelativeTimers
            )
          ),
          limitMs,
          backwards,
          limitReached: false,
        },
        timer: timersStore?.[name] ?? null,
      };

      // Limit
      if (elapsedWithOffset >= limitMs) {
        message.payload.elapsedMs = limitMs;
        message.payload.limitReached = true;
      }

      // Send message
      self.postMessage(message);

      // Cancel next interval if limit is reached
      if (limitMs && message.payload.limitReached && timersStore[name].interval) {
        clearInterval(timersStore[name].interval);
      }
    };
  }

  function createTimer(
    name: TimerName,
    {
      offsetMs = 0,
      limitMs = 0,
      backwards = false,
      relativeTimers = [],
      relativeTimersLimitInMs = 120_000,
      backwardsRelativeTimers = true,
      intervalTimeMs = 200,
    }: Timer
  ): Message {
    if (timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.CREATE,
        type: 'error',
        error: `Timer "${name}" already exists`,
      };
    }

    if (backwards && !limitMs) {
      return {
        ok: false,
        action: TimerMessageAction.CREATE,
        type: 'error',
        error: `Backwards Timer "${name}" requires a limit`,
      };
    }

    timersStore[name] = {
      start: Date.now(),
      offsetMs,
      limitMs,
      backwards,
      relativeTimers,
      relativeTimersLimitInMs,
      lastCalculatedElapsedMs: 0,
      backwardsRelativeTimers,
      intervalTimeMs,
      interval: null,
    };

    // If there is a limit but the offset is greater than the limit, return an error
    if (offsetMs >= limitMs) {
      return {
        ok: false,
        action: TimerMessageAction.CREATE,
        type: 'error',
        error: 'OffsetMs can not be greater than limitMs',
      };
    }

    return {
      ok: true,
      action: TimerMessageAction.CREATE,
      type: 'success',
      success: `Timer "${name}" created`,
      timer: timersStore?.[name] ?? null,
    };
  }

  function resume(name: TimerName): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.RESUME,
        type: 'error',
        error: `Timer "${name}" does not exist`,
      };
    }

    if (!timersStore[name].start) {
      timersStore[name].start = Date.now();
    }

    timersStore[name].interval = setInterval(
      intervalCallback(name),
      timersStore[name].intervalTimeMs
    );
    return {
      ok: true,
      action: TimerMessageAction.RESUME,
      type: 'success',
      success: `Timer "${name}" resumed`,
      timer: timersStore?.[name] ?? null,
    };
  }

  function pause(name: TimerName): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.PAUSE,
        type: 'error',
        error: `Timer "${name}" does not exist`,
      };
    }

    if (timersStore[name].interval) {
      clearInterval(timersStore[name].interval);
      timersStore[name].start = 0;
      timersStore[name].offsetMs = timersStore[name].lastCalculatedElapsedMs ?? 0;
      return {
        ok: true,
        action: TimerMessageAction.PAUSE,
        type: 'success',
        success: `Timer "${name}" stopped`,
        timer: timersStore?.[name] ?? null,
      };
    }

    return {
      ok: true,
      action: TimerMessageAction.PAUSE,
      type: 'success',
      success: `Timer "${name}" already stopped`,
      timer: timersStore?.[name] ?? null,
    };
  }

  function reset(name: TimerName): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.RESET,
        type: 'error',
        error: `Timer "${name}" does not exist`,
      };
    }

    // Reset values
    timersStore[name].offsetMs = 0;
    timersStore[name].lastCalculatedElapsedMs = 0;
    timersStore[name].relativeTimers = [];

    const isRunning = timersStore[name].start > 0;
    if (isRunning) {
      timersStore[name].start = Date.now();
      return {
        ok: true,
        action: TimerMessageAction.RESET,
        type: 'success',
        success: `Timer "${name}" reset`,
        timer: timersStore?.[name] ?? null,
      };
    }

    timersStore[name].start = 0;
    timersStore[name].lastCalculatedElapsedMs = 0;
    return {
      ok: true,
      action: TimerMessageAction.RESET,
      type: 'success',
      success: `Timer "${name}" reset`,
      timer: timersStore?.[name] ?? null,
    };
  }

  function start(name: TimerName, payload: Timer): Message {
    const createResult = createTimer(name, payload);
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
      success: `Timer "${name}" started`,
      timer: timersStore?.[name] ?? null,
    };
  }

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

    return {
      ok: true,
      action: TimerMessageAction.STOP,
      type: 'success',
      success: `Timer "${name}" stopped`,
      timer: timersStore?.[name] ?? null,
    };
  }

  function setOffset(name: TimerName, offsetMs: number): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.SET_OFFSET,
        type: 'error',
        error: `Timer "${name}" does not exist`,
      };
    }

    const oldOffset = timersStore[name].offsetMs;
    timersStore[name].offsetMs = offsetMs;

    return {
      ok: true,
      action: TimerMessageAction.SET_OFFSET,
      type: 'success',
      success: `Timer "${name}" offset set from "${oldOffset}" to "${offsetMs}". Changes will happen on next tick`,
      timer: timersStore?.[name] ?? null,
    };
  }

  function addOffset(name: TimerName, offset: number): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.ADD_OFFSET,
        type: 'error',
        error: `Timer "${name}" does not exist`,
      };
    }

    const oldOffset = timersStore[name].offsetMs;
    timersStore[name].offsetMs += offset;
    const newOffset = timersStore[name].offsetMs;

    return {
      ok: true,
      action: TimerMessageAction.ADD_OFFSET,
      type: 'success',
      success: `Timer "${name}" offset has changed from "${oldOffset}" to "${newOffset}". Changes will happen on next tick`,
      timer: timersStore?.[name] ?? null,
    };
  }

  function addRelativeTimer(
    name: TimerName,
    index: RelativeTimeId,
    relativeTimers: RelativeTime[]
  ): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.ADD_RELATIVE_TIMER,
        type: 'error',
        error: `Timer "${name}" does not exist`,
      };
    }

    const idx = Number(index);

    if (isNaN(idx)) {
      return {
        ok: false,
        action: TimerMessageAction.ADD_RELATIVE_TIMER,
        type: 'error',
        error: `Team index "${index}" is not a number`,
      };
    }

    timersStore[name].relativeTimers ??= [];
    timersStore[name].relativeTimers[idx] ??= [];
    timersStore[name].relativeTimers[idx].push(...relativeTimers);

    intervalCallback(name)();

    return {
      ok: true,
      action: TimerMessageAction.ADD_RELATIVE_TIMER,
      type: 'success',
      success: `Timer "${name}" added ${relativeTimers.length} timers to ${index}`,
      timer: timersStore?.[name] ?? null,
    };
  }

  function removeRelativeTimers(
    name: TimerName,
    index: RelativeTimeId,
    timersIds: RelativeTimeId[]
  ): Message {
    if (!timersStore[name]) {
      return {
        ok: false,
        action: TimerMessageAction.REMOVE_RELATIVE_TIMER,
        type: 'error',
        error: `Timer "${name}" does not exist`,
      };
    }

    const idx = Number(index);

    if (isNaN(idx)) {
      return {
        ok: false,
        action: TimerMessageAction.REMOVE_RELATIVE_TIMER,
        type: 'error',
        error: `Team index "${index}" is not a number`,
      };
    }

    if (!timersStore?.[name]?.relativeTimers?.[idx]) {
      return {
        ok: false,
        action: TimerMessageAction.REMOVE_RELATIVE_TIMER,
        type: 'error',
        error: `Team "${index}" does not exist`,
      };
    }

    timersStore[name].relativeTimers[idx] = timersStore[name].relativeTimers[idx].filter(
      ({ id }: RelativeTime) => !timersIds.includes(id)
    );

    intervalCallback(name)(); // Recalculate elapsed time

    return {
      ok: true,
      action: TimerMessageAction.REMOVE_RELATIVE_TIMER,
      type: 'success',
      success: `Timer "${name}" removed ${timersIds.length} timers from ${index}`,
      timer: timersStore?.[name] ?? null,
    };
  }

  self.addEventListener('message', (event: { data: Action }) => {
    switch (event.data.type as Action['type']) {
      case TimerAction.CREATE: {
        const { name, payload } = event.data as StartAction;
        self.postMessage(createTimer(name, payload));
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
      case TimerAction.ADD_RELATIVE_TIMER: {
        const { name, index: team, payload } = event.data as AddRelativeTimers;
        self.postMessage(addRelativeTimer(name, team, payload));
        break;
      }
      case TimerAction.REMOVE_RELATIVE_TIMER: {
        const { name, index: team, payload } = event.data as RemoveRelativeTimers;
        self.postMessage(removeRelativeTimers(name, team, payload));
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

export function TimerWorker(
  onTick: (message: TickMessage) => void,
  onError: (message: ErrorMessage) => void,
  onSuccess: (message: SuccessMessage) => void
) {
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
      } else {
        onSuccess(event.data as SuccessMessage);
      }
    } else {
      onError(event.data as ErrorMessage);
    }
  });

  function create(name: TimerName, payload: Timer) {
    worker.postMessage({
      type: TimerAction.CREATE,
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

  function start(name: TimerName, payload: Timer) {
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

  function addRelativeTimers(
    name: TimerName,
    team: 'local' | 'visitor',
    relativeTimers: RelativeTime[]
  ) {
    worker.postMessage({
      type: TimerAction.ADD_RELATIVE_TIMER,
      name,
      team,
      payload: relativeTimers,
    });
  }

  function removeRelativeTimers(
    name: TimerName,
    team: 'local' | 'visitor',
    timerIds: RelativeTimeId[]
  ) {
    worker.postMessage({
      type: TimerAction.REMOVE_RELATIVE_TIMER,
      name,
      team,
      payload: timerIds,
    });
  }

  return {
    worker,
    create,
    pause,
    reset,
    start,
    stop,
    setOffset,
    addOffset,
    addRelativeTimers,
    removeRelativeTimers,
  };
}
