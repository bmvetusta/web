import { ablyMessageSchema } from 'src/schema/ably/message';
import { z } from 'zod';
import { ActionTimer } from '../timer/actions/action';

export const AblyStopwatchActionMessage = ablyMessageSchema.merge(
  z.object({
    data: ActionTimer,
  })
);

export type AblyStopwatchActionMessage = z.infer<typeof AblyStopwatchActionMessage>;
