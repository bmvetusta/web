import { z } from 'zod';
import { matchSchema } from '../generics/match';
import { weekSchema } from './week';
import { weekMatchSchema } from './week-match';

export const responseWeeksSchema = z
  .object({
    status: z.literal('OK'),
    jornada_actual: z.coerce.number(),
    total_jornadas: z.coerce.number(),
    fechas_jornadas: z.array(z.any()),
    resultados: z.array(weekMatchSchema.innerType()),
  })
  .transform((v) => {
    return {
      week: v.jornada_actual,
      totalWeeks: v.total_jornadas,
      weekDates: z
        .array(weekSchema.innerType())
        .default([])
        .transform((v) => v.map((w) => weekSchema.parse(w)))
        .pipe(
          z.array(
            z.object({
              week: z.number(),
              date: z.string(),
            })
          )
        )
        .parse(v.fechas_jornadas),
      results: v.resultados.map((m) => weekMatchSchema.pipe(matchSchema).parse(m)),
    };
  });
