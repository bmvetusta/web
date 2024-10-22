type TickStartMessage = { ok: boolean; action: 'start'; tick: number; tickTime: number };
type TickWorkerMessage = TickStartMessage | { ok: boolean; action: 'tick' | 'stop'; tick: number };

export function tickWorker(
  onTick: (tick: number) => void,
  onMessage?: (message: TickWorkerMessage) => void,
  startTick: boolean = false,
  tickIntervalInMs?: number
) {
  // biome-ignore lint/suspicious/noExplicitAny: Can not get the type of WorkerGlobalScope
  type WorkerGlobalScope = /* unresolved */ any;

  function tickInterval(self: WorkerGlobalScope) {
    let tick = 0;
    let tickTime = 0;

    function startTicking(intervalTimeMs: number) {
      if (intervalTimeMs < 10) {
        return null;
      }
      self.postMessage({ ok: true, action: 'start', tick, tickTime });
      return setInterval(() => {
        tick += 1;
        self.postMessage({ ok: true, action: 'tick', tick });
      }, tickTime);
    }

    let interval: ReturnType<typeof setInterval> | null = null;

    self.addEventListener(
      'message',
      (event: { data: { action: string; tickTimeInMs?: number } }) => {
        if (event.data.action === 'stop') {
          if (interval) {
            clearInterval(interval);
            interval = null;
            self.postMessage({ ok: true, action: 'stop', tick });
          }
        }

        if (event.data.action === 'start') {
          tickTime = event.data?.tickTimeInMs ?? tickTime;
          if (interval === null && tickTime >= 10) {
            interval = startTicking(tickTime);
          }
        }
      }
    );
  }

  const worker = new Worker(
    URL.createObjectURL(
      new Blob([`(${tickInterval.toString()})(self)`], {
        type: 'application/javascript',
      })
    )
  );

  worker.addEventListener(
    'message',
    (event: {
      data: { ok: boolean; action: 'tick' | 'start' | 'stop'; tick: number; tickTime?: number };
    }) => {
      if (event.data.action === 'tick') {
        onTick(event.data.tick);
      }
      if (onMessage) {
        onMessage(event.data as TickWorkerMessage);
      }
    }
  );

  function start(tickTimeInMs?: number) {
    worker.postMessage({ action: 'start', tickTimeInMs });
  }

  function stop() {
    worker.postMessage({ action: 'stop' });
  }

  if (startTick) {
    start(tickIntervalInMs);
  }

  return { worker, start, stop };
}
