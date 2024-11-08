import { defineAction, type ActionAPIContext } from 'astro:actions';
import { AddRelativeActionTimer } from 'src/schema/timer/actions/relative/add';
import { TimerAction } from 'src/schema/timer/actions/type';
import { stopwatchPublishMessage } from 'src/services/stopwatch/stopwatch-publish-message';
import { z } from 'zod';
import { isAuth } from '../_is-auth-action';

const input = AddRelativeActionTimer.merge(
  z.object({
    type: AddRelativeActionTimer.shape.type.default(TimerAction.ADD_RELATIVE_TIMERS),
  })
);

export const addRelativeTimers = defineAction({
  accept: 'json',
  input,
  handler: async (payload, context: ActionAPIContext) => {
    isAuth(context); // Throws if not authorized

    return stopwatchPublishMessage(payload);
  },
});
