import { AblyStopwatchActionMessage } from 'src/schema/ably/stopwatch-action-message';
import { ActionTimer } from 'src/schema/timer/actions/action';
import { liveGraphicsStopwatchChannelName } from '../ably/constants';
import { getAblyRestClient } from '../ably/server/rest-client';

export function stopwatchPublishMessage(data: ActionTimer) {
  const message: AblyStopwatchActionMessage = { data };
  const ably = getAblyRestClient();
  return ably.channels.get(liveGraphicsStopwatchChannelName).publish(message as any);
}
