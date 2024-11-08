import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'astro:schema';
import { RemoveRelativeActionTimer } from 'src/schema/timer/actions/relative/remove';
import { TimerAction } from 'src/schema/timer/actions/type';
import { stopwatchPublishMessage } from 'src/services/stopwatch/stopwatch-publish-message';
import { isAuth } from '../_is-auth-action';

const input = RemoveRelativeActionTimer.merge(
  z.object({
    type: RemoveRelativeActionTimer.shape.type.default(TimerAction.REMOVE_RELATIVE_TIMERS),
  })
);

export const removeRelativeTimers = defineAction({
  accept: 'json',
  input,
  handler: async (payload, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    return stopwatchPublishMessage(payload);
  },
});
