import { timerActionSchema } from 'src/schema/timer/actions/type';
import { optionsTimerSchema } from 'src/schema/timer/options';
import { timerNameSchema } from 'src/schema/timer/store';
import { z } from 'zod';

// TODO: Use of schema and not just types in addEventListener message & postMessage
// TODO: Toggle
// TODO: Get Timer status

// z.union([
//     z.literal(TimerAction.RESUME),
//     z.literal(TimerAction.RESET),
//     z.literal(TimerAction.TOGGLE),
//     z.literal(TimerAction.PAUSE),
//     z.literal(TimerAction.STOP),
//     z.literal(TimerAction.TOGGLE),
//   ]),
export const SimpleActionTimer = z.object({
  type: timerActionSchema,
  name: timerNameSchema,
  opts: optionsTimerSchema.optional(),
});
export type SimpleActionTimer = z.infer<typeof SimpleActionTimer>;
