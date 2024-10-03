import { z } from 'zod';
import { transformableDateSchema } from '../generics/datetime';
import { matchSchema } from '../generics/match';
import { shieldImageUrl } from '../generics/shield-image-url';
import { stadiumSchema } from '../generics/stadium';
import { teamSchema } from '../generics/team';

// const stadiumPreviousSchema = z.object({
//   name: z.string(),
//   address: z.string(),
// });

const stadiumPreviousSchema = stadiumSchema
  .omit({
    id: true,
    latitude: true,
    longitude: true,
    capacity: true,
    province: true,
  })
  .required({
    name: true,
    address: true,
  });

export const matchPreviousSchema = matchSchema
  .omit({
    groupId: true,
    stadiumId: true,
    uploadedReport: true,
    week: true,
    urlStreaming: true,
  })
  .extend({
    stadium: stadiumPreviousSchema,
    seasonId: z.number(),
    phaseName: z.string(),
    groupName: z.string(),
  });

export const transformableMatchPreviousSchema = z
  .object(
    {
      id_partido: z.coerce.number(),
      temporada: z.coerce.number(),
      competicion: z.string(),
      fase: z.string(),
      grupo: z.string(),
      fecha: transformableDateSchema,
      estadio: z.string().nullable().default(null),
      direccion: z.string().nullable().default(null),
      // tipo_partido: z.coerce.number().default(1), // 1 pista, 2 playa
      // resultado: z.string().nullable().default(null),

      id_local: z.coerce.number(),
      nombreLocal: z.string(),
      escudoVisitante: shieldImageUrl,
      resultado_local: z.coerce.number().nullable().default(null),
      // resultado_local_penaltis: z.any().optional(),

      id_visitante: z.coerce.number(),
      nombreVisitante: z.string(),
      escudoLocal: shieldImageUrl,
      resultado_visitante: z.coerce.number().nullable().default(null),
      // resultado_visitante_penaltis: z.any().optional(),
    },
    { message: 'Error in match' }
  )
  .transform((m) => {
    const stadium = stadiumPreviousSchema.parse({
      name: m.estadio,
      address: m.direccion,
    });

    const localTeam = teamSchema.parse({
      id: m.id_local,
      name: m.nombreLocal,
      shieldUrl: m.escudoLocal,
      score: m.resultado_local,
      category: m.competicion,
    });

    const visitorTeam = teamSchema.parse({
      id: m.id_visitante,
      name: m.nombreVisitante,
      shieldUrl: m.escudoVisitante,
      score: m.resultado_visitante,
      category: m.competicion,
    });

    return {
      id: m.id_partido,
      seasonId: m.temporada,
      competitionName: m.competicion,
      phaseName: m.fase,
      groupName: m.grupo,
      ...m.fecha,
      status: 'ENDED',
      stadium,
      localTeam,
      visitorTeam,
    };
  })
  .pipe(matchPreviousSchema);
