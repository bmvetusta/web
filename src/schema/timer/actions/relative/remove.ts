import { TimerAction } from 'src/schema/timer/actions/type';
import { RelativeTimer } from 'src/schema/timer/relative';
import { timerNameSchema } from 'src/schema/timer/store';
import { z } from 'zod';
import { optionsTimerSchema } from '../../options';

// TODO: Use of schema and not just types in addEventListener message & postMessage
// TODO: Toggle
// TODO: Get Timer status

export const RemoveRelativeActionTimer = z.object({
  type: z.literal(TimerAction.REMOVE_RELATIVE_TIMERS),
  name: timerNameSchema,
  payload: RelativeTimer.shape.id.array().or(RelativeTimer.shape.id.transform((id) => [id])),
  opts: optionsTimerSchema.optional(),
});
export type RemoveRelativeActionTimer = z.infer<typeof RemoveRelativeActionTimer>;
