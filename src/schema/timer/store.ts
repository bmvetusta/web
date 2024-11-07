import { z } from 'zod';
import { TimerData } from './data';

export const storeTimerSchema = z.record(TimerData);
export const timerNameSchema = storeTimerSchema.keySchema;
export type StoreTimer = z.output<typeof storeTimerSchema>;
export type TimerName = keyof StoreTimer;
