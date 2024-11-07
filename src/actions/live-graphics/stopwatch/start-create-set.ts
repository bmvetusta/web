import { defineAction, type ActionAPIContext } from 'astro:actions';
import { StartCreateActionTimer } from 'src/schema/timer/actions/start-create';
import { TimerAction } from 'src/schema/timer/actions/type';
import { stopwatchPublishMessage } from 'src/services/stopwatch/publish-message';
import { z } from 'zod';
import { isAuth } from '../_is-auth-action';

const input = StartCreateActionTimer.merge(
  z.object({
    type: StartCreateActionTimer.shape.type.default(TimerAction.CREATE_OR_SET),
  })
);

export const startCreateSet = defineAction({
  accept: 'json',
  input,
  handler: async (payload, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    return stopwatchPublishMessage(payload);
  },
});
