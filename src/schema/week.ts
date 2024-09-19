import { z } from 'astro:schema';
import { matchSchema, pipedMatchSchema } from './utils/match';

const pipedWeeksDatesSchema = z.object({
  week: z.coerce.number(),
  date: z.string().date(),
});
const weeksDatesSchema = z.array(
  z
    .object({
      jornada: z.coerce.number(),
      fecha: z.string().transform((d) => d.split('-').reverse().join('-')),
    })
    .transform((w) => ({
      week: w.jornada,
      date: w.fecha,
    }))
    .pipe(pipedWeeksDatesSchema)
);

export const weekSchema = z
  .object({
    jornada_actual: z.coerce.number(),
    total_jornadas: z.coerce.number(),
    fechas_jornada: z.array(weeksDatesSchema),
    resultados: z.array(matchSchema),
  })
  .transform((w) => ({
    currentWeek: w.jornada_actual,
    totalWeeks: w.total_jornadas,
    weekDates: w.fechas_jornada,
    results: w.resultados,
  }))
  .pipe(
    z.object({
      currentWeek: z.coerce.number(),
      totalWeeks: z.coerce.number(),
      weeksDates: pipedWeeksDatesSchema,
      results: z.array(pipedMatchSchema),
    })
  );
