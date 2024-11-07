import { z } from 'zod';
import { optionsTimerSchema } from '../options';
import { timerNameSchema } from '../store';

export const SuccessTimerMessage = z.object({
  ok: z.literal(true),
  action: z.string(),
  type: z.literal('success'),
  success: z.string(),
  name: timerNameSchema,
  timerOptions: optionsTimerSchema,
});
export type SuccessTimerMessage = z.infer<typeof SuccessTimerMessage>;
