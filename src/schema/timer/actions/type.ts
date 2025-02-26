import { z } from 'zod';

export enum TimerAction {
  CREATE_OR_SET = 'CREATE_OR_SET',
  RESUME = 'RESUME',
  PAUSE = 'PAUSE',
  STOP = 'STOP',
  RESET = 'RESET',
  DELETE_TIMER = 'DELETE_TIMER',
  START = 'START',
  SET_OFFSET = 'SET_OFFSET',
  ADD_OFFSET = 'ADD_OFFSET',
  ADD_RELATIVE_TIMERS = 'ADD_RELATIVE_TIMERS',
  REMOVE_RELATIVE_TIMERS = 'REMOVE_RELATIVE_TIMERS',
  GET_RELATIVE_TIMERS = 'GET_RELATIVE_TIMERS',
  TOGGLE = 'TOGGLE',
}

export const timerActionSchema = z.nativeEnum(TimerAction);
