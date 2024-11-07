import { TimerAction } from 'src/schema/timer/actions/type';
import { optionsTimerSchema } from 'src/schema/timer/options';
import { timerNameSchema } from 'src/schema/timer/store';
import { z } from 'zod';

// TODO: Get Timer status

export const StartCreateActionTimer = z.object({
  type: z.union([z.literal(TimerAction.START), z.literal(TimerAction.CREATE_OR_SET)]),
  name: timerNameSchema,
  payload: optionsTimerSchema.optional(),
});
export type StartCreateActionTimer = z.infer<typeof StartCreateActionTimer>;
