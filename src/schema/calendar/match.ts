import { z } from 'zod';
import { transformableDateSchema } from '../generics/datetime';
import { matchSchema } from '../generics/match';
import { transformableMatchStatusSchema } from '../generics/match-status';
import { calendarTeamSchema, transformableCalendarTeamSchema } from './team';

// export const matchSchema = z.object({
//   id: z.number(),
//   week: z.number(),
//   urlStreaming: z.string().nullish(),
//   status: matchStatusSchema,
//   date: z.string().nullable().default(null).optional(),
//   time: z.string().nullable().default(null).optional(),
//   localTeam: teamSchema,
//   visitorTeam: teamSchema,
// });

const finalTeamSchema = calendarTeamSchema.extend({
  score: z.number().nullable(),
});

const calendarMatch = matchSchema
  .omit({
    urlStreaming: true,
    localTeam: true,
    visitorTeam: true,
  })
  .extend({
    localTeam: finalTeamSchema,
    visitorTeam: finalTeamSchema,
  });

export const transformableCalendarMatchSchema = z
  .object({
    id: z.coerce.number(),
    estado_partido: transformableMatchStatusSchema,
    fecha: transformableDateSchema,
    jornada: z.coerce.number(),
    url_streaming: z.string().url().nullish(),

    nombre_local: z.string(),
    url_escudo_local: z.string().url(),
    resultado_local: z.coerce.number().nullable(),

    nombre_visitante: z.string(),
    url_escudo_visitante: z.string().url(),
    resultado_visitante: z.coerce.number().nullable(),

    equipo_local: transformableCalendarTeamSchema,
    equipo_visitante: transformableCalendarTeamSchema,
  })
  .transform((result) => ({
    id: result.id,
    status: result.estado_partido,
    week: result.jornada,
    urlStreaming: result.url_streaming?.length ? result.url_streaming : null,
    date: result.fecha.date,
    time: result.fecha.time,
    localTeam: {
      id: result.equipo_local.id,
      name: result.nombre_local,
      shieldUrl: result.url_escudo_local,
      score: result.resultado_local,
    },
    visitorTeam: {
      id: result.equipo_visitante.id,
      name: result.nombre_visitante,
      shieldUrl: result.url_escudo_visitante,
      score: result.resultado_visitante,
    },
  }));
