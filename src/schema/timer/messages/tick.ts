import { z } from 'zod';
import { ElapsedTime } from '../elapsed';
import { optionsTimerSchema } from '../options';
import { RelativeTimerElapsed } from '../relative';
import { storeTimerSchema } from '../store';
import { TimerMessageAction } from './action';

export const TickMessage = z.object({
  ok: z.literal(true),
  type: z.literal('TICK').or(z.literal('TICK_LIMIT_REACHED')),
  action: z.literal(TimerMessageAction.TICK),
  name: storeTimerSchema.keySchema,
  payload: z.object({
    name: storeTimerSchema.keySchema,
    elapsed: ElapsedTime,
    elapsedMs: z.number(),
    limitReached: z.boolean().default(false),
    relativeTimers: RelativeTimerElapsed.array(),
    timerOptions: optionsTimerSchema,
  }),
});

export type TickMessage = z.infer<typeof TickMessage>;
