import { TimerAction } from 'src/schema/timer/actions/type';
import { timerNameSchema } from 'src/schema/timer/store';
import { z } from 'zod';
import { optionsTimerSchema } from '../../options';

// TODO: Use of schema and not just types in addEventListener message & postMessage
// TODO: Toggle
// TODO: Get Timer status

export const GetRelativeActionTimer = z.object({
  type: z.literal(TimerAction.GET_RELATIVE_TIMERS),
  name: timerNameSchema,
  opts: optionsTimerSchema.optional(),
});

export type GetRelativeActionTimer = z.infer<typeof GetRelativeActionTimer>;
