import { z } from 'zod';
import { transformableDateSchema } from '../generics/datetime';
import { transformableMatchStatusSchema } from '../generics/match-status';
import { stringToBooleanSchema } from '../generics/string-to-boolean';

export const transformableTeamMatchSchema = z
  .object({
    id: z.coerce.number(),
    id_grupo: z.coerce.number(),
    fecha: transformableDateSchema.innerType(),
    estado_partido: transformableMatchStatusSchema.innerType(),
    acta_subida: stringToBooleanSchema.innerType(),
    jornada: z.coerce.number(),
    nombre_competicion: z.string(),

    id_local: z.coerce.number(),
    url_escudo_local: z.string().url(),
    nombre_local: z.string(),
    resultado_local: z.coerce.number().nullable(),
    posicion_local: z.coerce.number(),

    id_visitante: z.coerce.number(),
    nombre_visitante: z.string(),
    url_escudo_visitante: z.string().url(),
    resultado_visitante: z.coerce.number().nullable(),
    posicion_visitante: z.coerce.number(),
  })
  .transform((result) => {
    const localTeam = {
      id: result.id_local,
      shieldUrl: result.url_escudo_local,
      name: result.nombre_local,
      score: result.resultado_local,
      position: result.posicion_local,
    };

    const visitorTeam = {
      id: result.id_visitante,
      shieldUrl: result.url_escudo_visitante,
      name: result.nombre_visitante,
      score: result.resultado_visitante,
      position: result.posicion_visitante,
    };

    const fecha = transformableDateSchema.safeParse(result.fecha).data;
    return {
      id: result.id,
      groupId: result.id_grupo,
      uploadedReport: stringToBooleanSchema.safeParse(result.acta_subida).data,
      competitionName: result.nombre_competicion,
      week: result.jornada,
      urlStreaming: null,
      status: transformableMatchStatusSchema.safeParse(result.estado_partido).data,
      date: fecha?.date,
      time: fecha?.time,
      localTeam,
      visitorTeam,
    };
  });
