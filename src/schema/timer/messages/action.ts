import { z } from 'zod';

// export enum TimerMessageAction {
//   UNKNOWN = 'UNKNOWN',
//   TICK = 'TICK',
//   TICK_LIMIT_REACHED = 'TICK_LIMIT_REACHED',
//   CREATE_OR_SET = 'CREATE_OR_SET',
//   START = 'START',
//   RESUME = 'RESUME',
//   PAUSE = 'PAUSE',
//   RESET = 'RESET',
//   STOP = 'STOP',
//   SET_OFFSET = 'SET_OFFSET',
//   ADD_OFFSET = 'ADD_OFFSET',
//   ADD_RELATIVE_TIMERS = 'ADD_RELATIVE_TIMERS',
//   REMOVE_RELATIVE_TIMERS = 'REMOVE_RELATIVE_TIMERS',
//   GET_RELATIVE_TIMERS = 'GET_RELATIVE_TIMERS',
//   DELETE_TIMER = 'DELETE_TIMER',
// }

export const timerMessageActionSchema = z.enum([
  'UNKNOWN',
  'TICK',
  'TICK_LIMIT_REACHED',
  'CREATE_OR_SET',
  'START',
  'RESUME',
  'PAUSE',
  'RESET',
  'STOP',
  'SET_OFFSET',
  'ADD_OFFSET',
  'ADD_RELATIVE_TIMERS',
  'REMOVE_RELATIVE_TIMERS',
  'GET_RELATIVE_TIMERS',
  'DELETE_TIMER',
]);

export const TimerMessageAction = timerMessageActionSchema.Enum;
export type TimerMessageAction = typeof TimerMessageAction;
