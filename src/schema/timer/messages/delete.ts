import { TimerMessageAction } from 'src/schema/timer/messages/action';
import { z } from 'zod';

export const DeleteTimerMessage = z.object({
  ok: z.literal(true),
  action: z.literal(TimerMessageAction.DELETE_TIMER),
  type: z.literal('success'),
  success: z.string(),
});

type DeleteTimerMessage = z.infer<typeof DeleteTimerMessage>;
