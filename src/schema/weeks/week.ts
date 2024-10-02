import { z } from 'zod';

export const weekSchema = z
  .object({
    jornada: z.coerce.number(),
    fecha: z.string(),
  })
  .transform((v) => ({
    week: v.jornada,
    date: v.fecha,
  }));
