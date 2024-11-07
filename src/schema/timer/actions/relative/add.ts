import { TimerAction } from 'src/schema/timer/actions/type';
import { RelativeTimer } from 'src/schema/timer/relative';
import { timerNameSchema } from 'src/schema/timer/store';
import { z } from 'zod';
import { optionsTimerSchema } from '../../options';

// TODO: Use of schema and not just types in addEventListener message & postMessage
// TODO: Toggle
// TODO: Get Timer status

export const AddRelativeActionTimer = z.object({
  type: z.literal(TimerAction.ADD_RELATIVE_TIMERS),
  name: timerNameSchema,
  payload: RelativeTimer.array().or(RelativeTimer.transform((t) => [t])),
  opts: optionsTimerSchema.optional(),
});
export type AddRelativeActionTimer = z.infer<typeof AddRelativeActionTimer>;
