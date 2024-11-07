import { z } from 'zod';
import { TimerData } from './data';
import { timeInMsSchema } from './time-in-ms';

const _TimerOptions = TimerData.pick({
  offsetMs: true,
  limitMs: true,
  backwards: true,
  relativeTimers: true,
  relativeTimersLimitInMs: true,
  backwardsRelativeTimers: true,
  intervalTimeMs: true,
}).merge(
  z.object({
    start: z.number().min(0).optional(),
  })
);

export const optionsTimerSchema = _TimerOptions
  .pick({
    backwards: true,
    relativeTimers: true,
    backwardsRelativeTimers: true,
    intervalTimeMs: true,
  })
  .extend({
    offset: timeInMsSchema.default(0),
    limit: timeInMsSchema.default(0),
    relativeTimersLimit: timeInMsSchema.default(0),
  })
  .partial()
  .transform((value: any) => {
    const offsetMs = value.offset;
    const limitMs = value.limit;
    const intervalTimeMs = value.intervalTimeMs;

    return {
      start: value?.start,
      offsetMs,
      limitMs,
      backwards: value.backwards,
      relativeTimers: value.relativeTimers,
      relativeTimersLimitInMs: value.relativeTimersLimit,
      backwardsRelativeTimers: value.backwardsRelativeTimers,
      intervalTimeMs,
    };
  })
  .or(_TimerOptions.partial())
  .pipe(_TimerOptions);

export type TimerOptionsInput = z.input<typeof optionsTimerSchema>;
export type TimerOptions = z.output<typeof optionsTimerSchema>;
