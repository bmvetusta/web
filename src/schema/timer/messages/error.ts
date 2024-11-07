import { z } from 'zod';
import { optionsTimerSchema } from '../options';
import { timerNameSchema } from '../store';

export const ErrorTimerMessage = z.object({
  ok: z.literal(false),
  action: z.string(),
  name: timerNameSchema,
  type: z.literal('error'),
  error: z.string(),
  timerOptions: optionsTimerSchema.optional(),
});
export type ErrorTimerMessage = z.infer<typeof ErrorTimerMessage>;
