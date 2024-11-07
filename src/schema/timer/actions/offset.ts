import { TimerAction } from 'src/schema/timer/actions/type';
import { timerNameSchema } from 'src/schema/timer/store';
import { z } from 'zod';
import { optionsTimerSchema } from '../options';

// TODO: Use of schema and not just types in addEventListener message & postMessage
// TODO: Toggle
// TODO: Get Timer status

export const OffsetActionTimer = z.object({
  type: z.union([z.literal(TimerAction.SET_OFFSET), z.literal(TimerAction.ADD_OFFSET)]),
  name: timerNameSchema,
  payload: z.coerce.number(),
  opts: optionsTimerSchema.optional(),
});
export type OffsetActionTimer = z.infer<typeof OffsetActionTimer>;
