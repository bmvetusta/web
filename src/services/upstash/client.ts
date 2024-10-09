import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;
let client: Redis | undefined;

function getCommandTimeout(): number {
  const timeoutString = process.env.REDIS_COMMAND_TIMEOUT ?? '2';
  try {
    return parseInt(timeoutString, 10) * 1000;
  } catch (e) {}

  return 1_500;
}

function getConnectTimeout(): number {
  const timeoutString = process.env.REDIS_CONNECT_TIMEOUT ?? '3';
  try {
    return parseInt(timeoutString, 10) * 1000;
  } catch (e) {}

  return 3_000;
}

function getMaxRetriesPerRequest(): number {
  const retriesString = process.env.REDIS_MAX_RETRIES_PER_REQUEST ?? '1';
  try {
    return parseInt(retriesString, 10);
  } catch (e) {}

  return 1;
}

const commandTimeout = getCommandTimeout();
const connectTimeout = getConnectTimeout();
const maxRetriesPerRequest = getMaxRetriesPerRequest();

export function clientUpstash() {
  if (!client && REDIS_URL) {
    client = new Redis(REDIS_URL);
    client.options.keepAlive = 0;
    client.options.commandTimeout = commandTimeout;
    client.options.connectTimeout = connectTimeout;
    client.options.maxRetriesPerRequest = maxRetriesPerRequest;
  }

  return client;
}
