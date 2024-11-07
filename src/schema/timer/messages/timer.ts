import { z } from 'zod';
import { DeleteTimerMessage } from './delete';
import { ErrorTimerMessage } from './error';
import { GetRelativeTimerMessage } from './get-relative';
import { SuccessTimerMessage } from './success';
import { TickMessage } from './tick';

export const TimerMessage = TickMessage.or(ErrorTimerMessage)
  .or(SuccessTimerMessage)
  .or(GetRelativeTimerMessage)
  .or(DeleteTimerMessage);

export type TimerMessage = z.infer<typeof TimerMessage>;
