import { z } from 'zod';
import { transformableDateSchema } from '../generics/datetime';
import { matchSchema } from '../generics/match';
import { transformableMatchStatusSchema } from '../generics/match-status';
import { teamSchema } from '../generics/team';
import { transformableCalendarTeamSchema } from './team';

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

const finalTeamSchema = teamSchema.extend({
  score: z.number().nullable(),
});

export const calendarMatchSchema = matchSchema
  .omit({
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
    estado_partido: transformableMatchStatusSchema.innerType(),
    fecha: transformableDateSchema.innerType(),
    jornada: z.coerce.number(),
    url_streaming: z.string().url().nullable().default(null),

    nombre_local: z.string(),
    url_escudo_local: z.string().url(),
    resultado_local: z.coerce.number().nullable(),

    nombre_visitante: z.string(),
    url_escudo_visitante: z.string().url(),
    resultado_visitante: z.coerce.number().nullable(),

    equipo_local: transformableCalendarTeamSchema.innerType(),
    equipo_visitante: transformableCalendarTeamSchema.innerType(),
  })
  .transform((result) => {
    const fecha = transformableDateSchema.safeParse(result.fecha).data ?? {
      date: null,
      time: null,
    };
    return {
      id: result.id,
      status: transformableMatchStatusSchema.safeParse(result.estado_partido).data ?? 'UNKNOWN',
      week: result.jornada,
      urlStreaming: result.url_streaming,
      date: fecha.date,
      time: fecha.time,
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
    };
  });
