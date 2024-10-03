import { z } from 'zod';
import { matchSchema } from '../generics/match';
import { transformableMatchCalendarSchema } from './match';

export const responseCalendarSchema = z
  .object({
    calendarios: z.array(transformableMatchCalendarSchema.innerType()).default([]),
  })
  .transform((v) => v.calendarios.map((m) => transformableMatchCalendarSchema.parse(m)))
  .pipe(z.array(matchSchema));
