import { ErrorTimerMessage } from 'src/schema/timer/messages/error';
import { SuccessTimerMessage } from 'src/schema/timer/messages/success';
import { TickMessage } from 'src/schema/timer/messages/tick';
import { z } from 'zod';

export const TickTimerCallback = z.function().args(TickMessage).returns(z.undefined());
export type TickTimerCallback = z.infer<typeof TickTimerCallback>;

export const ErrorTimerCallback = z.function().args(ErrorTimerMessage).returns(z.undefined());
export type ErrorTimerCallback = z.infer<typeof ErrorTimerCallback>;

export const SuccessTimerCallback = z.function().args(SuccessTimerMessage).returns(z.undefined());
export type SuccessTimerCallback = (message: SuccessTimerMessage) => void;
