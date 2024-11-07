import { z } from 'zod';
import { RelativeTimer } from './relative';

export const TimerData = z.object({
  start: z.number().min(0).default(0),
  offsetMs: z.number().default(0),
  limitMs: z.number().min(0).default(0),
  backwards: z.coerce.boolean().default(false),
  relativeTimers: RelativeTimer.array().default([]),
  relativeTimersLimitInMs: z.number().min(0).default(0),
  lastCalculatedElapsedMs: z.number().default(0),
  backwardsRelativeTimers: z.coerce.boolean(),
  intervalTimeMs: z.number().default(250),
  interval: z.any().optional(),
});
// .refine((v) => (v.backwards && v.limitMs) || !v.backwards, {
//   message: 'Backwards require a limit',
// })
// .refine(
//   (v) => (v.backwardsRelativeTimers && v.relativeTimersLimitInMs) || !v.backwardsRelativeTimers,
//   { message: 'Backwards for relative timer require a relative timer limit' }
// );

export type TimerData = z.infer<typeof TimerData>;
