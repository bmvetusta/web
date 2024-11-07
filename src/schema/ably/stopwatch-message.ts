import { z } from 'zod';
import { TimerMessage } from '../timer/messages/timer';
import { ablyMessageSchema } from './message';

export const StopwatchMessage = ablyMessageSchema.merge(
  z.object({
    data: TimerMessage,
  })
);
export type StopwatchMessage = z.infer<typeof StopwatchMessage>;
