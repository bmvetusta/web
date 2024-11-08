import { defineAction, type ActionAPIContext } from 'astro:actions';
import { SimpleActionTimer } from 'src/schema/timer/actions/simple';
import { stopwatchPublishMessage } from 'src/services/stopwatch/stopwatch-publish-message';
import { isAuth } from '../_is-auth-action';

export const actionToTimerName = defineAction({
  accept: 'json',
  input: SimpleActionTimer,
  handler: async (payload, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    return stopwatchPublishMessage(payload);
  },
});
