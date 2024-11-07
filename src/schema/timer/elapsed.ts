import { z } from 'zod';

export const ElapsedTime = z.object({
  hours: z.number().default(0),
  minutes: z.number().default(0),
  seconds: z.number().default(0),
  milliseconds: z.number().default(0),
});
export type ElapsedTime = z.output<typeof ElapsedTime>;
