import { liveGraphicsStopwatchChannelName } from './constants';

// Stopwatch
export const stopwatchChannelAddRelativeTimers = `${liveGraphicsStopwatchChannelName}:addRelativeTimer`;
export const stopwatchChannelRemoveRelativeTimers = `${liveGraphicsStopwatchChannelName}:RemoveRelativeTimer`;
export const stopwatchChannelRelativeTimer = `${liveGraphicsStopwatchChannelName}:addRelativeTimer`;
export const stopwatchChannelSetOffset = `${liveGraphicsStopwatchChannelName}:setOffset`;
export const stopwatchChannelAddOffset = `${liveGraphicsStopwatchChannelName}:addOffset`;
export const stopwatchChannelReset = `${liveGraphicsStopwatchChannelName}:reset`;
export const stopwatchChannelStop = `${liveGraphicsStopwatchChannelName}:stop`;
export const stopwatchChannelStart = `${liveGraphicsStopwatchChannelName}:start`;
export const stopwatchChannelResume = `${liveGraphicsStopwatchChannelName}:resume`;
export const stopwatchChannelPause = `${liveGraphicsStopwatchChannelName}:pause`;
export const stopwatchChannelCreate = `${liveGraphicsStopwatchChannelName}:create`;
export const stopwatchChannelDelete = `${liveGraphicsStopwatchChannelName}:delete`;
