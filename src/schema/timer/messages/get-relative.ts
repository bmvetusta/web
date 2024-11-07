import { TimerMessageAction } from 'src/schema/timer/messages/action';
import { RelativeTimer } from 'src/schema/timer/relative';
import { z } from 'zod';
import { timerNameSchema } from '../store';

export const GetRelativeTimerMessage = z.object({
  ok: z.literal(true),
  action: z.literal(TimerMessageAction.GET_RELATIVE_TIMERS),
  type: z.literal('success'),
  success: z.literal('Relative Timers'),
  name: timerNameSchema,
  payload: RelativeTimer.array(),
});

export type GetRelativeTimerMessage = z.infer<typeof GetRelativeTimerMessage>;
