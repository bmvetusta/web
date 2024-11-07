import { z } from 'zod';

export const RelativeTimer = z.object({
  id: z.coerce.string().default(crypto.randomUUID()),
  start: z.number(),
  extra: z.any().optional(),
});

export const RelativeTimerElapsed = RelativeTimer.extend({
  elapsedMs: z.number(),
});

export type RelativeTimer = z.output<typeof RelativeTimer>;
export type RelativeTimers = RelativeTimer[];
export type RelativeTimerElapsed = z.output<typeof RelativeTimerElapsed>;
export type RelativeTimerId = z.infer<typeof RelativeTimer>['id'];
