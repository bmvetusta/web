import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'node_modules/zod';
import { OffsetActionTimer } from 'src/schema/timer/actions/offset';
import { TimerAction } from 'src/schema/timer/actions/type';
import { stopwatchPublishMessage } from 'src/services/stopwatch/publish-message';
import { isAuth } from '../_is-auth-action';

const input = OffsetActionTimer.merge(
  z.object({
    type: OffsetActionTimer.shape.type.default(TimerAction.ADD_OFFSET),
  })
);

export const offset = defineAction({
  accept: 'json',
  input,
  handler: async (payload, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    return stopwatchPublishMessage(payload);
  },
});
