import { z } from 'zod';
import { transformableDateSchema } from '../generics/datetime';
import { matchSchema } from '../generics/match';
import { matchStatusSchema, transformableMatchStatusSchema } from '../generics/match-status';
import { stringToBooleanSchema } from '../generics/string-to-boolean';
import { teamSchema } from '../generics/team';
import { teamWeekSchema } from './team';

export const weekMatchSchema = z
  .object({
    id: z.coerce.number(),
    id_estadio: z.coerce.number(),
    id_grupo: z.coerce.number(),
    estado_partido: transformableMatchStatusSchema.innerType(),
    fecha: transformableDateSchema.innerType(),
    acta_subida: stringToBooleanSchema.innerType(),
    jornada: z.coerce.number().min(1).default(1),
    tipo_partido: z.coerce.number(), // 1 => Pista, 2 => Playa
    url_streaming: z.string().url().nullable().default(null),

    // id_local: z.coerce.number(),
    // nombre_local_default:z.string(),
    // nombre_local:z.string(),
    // url_escudo_local: z.string().url().nullable().default(null),
    resultado_local: z.coerce.number().nullable().default(null),
    resultado_local_penaltis: z.any().nullable().default(null),

    // id_visitante: z.coerce.number(),
    // nombre_visitante_default:z.string(),
    // nombre_visitante:z.string(),
    // url_escudo_visitante: z.string().url().nullable().default(null),
    resultado_visitante: z.coerce.number().nullable().default(null),
    resultado_visitante_penaltis: z.any().nullable().default(null),

    equipo_local: teamWeekSchema.innerType(),
    equipo_visitante: teamWeekSchema.innerType(),
  })
  .transform((v) => {
    // id: z.number(),
    // groupId: z.coerce.number().nullable().default(null),
    // uploadedReport: z.boolean().nullable().default(null),
    // competitionName: z.string().nullish(),
    // week: z.number(),
    // urlStreaming: z.string().nullable().default(null),
    // status: matchStatusSchema,
    // date: z.string().nullable().default(null),
    // time: z.string().nullable().default(null),
    // localTeam: teamSchema,
    // visitorTeam: teamSchema,
    const { date = null, time = null } = transformableDateSchema.safeParse(v.fecha).data ?? {};

    const localTeam = teamWeekSchema.pipe(teamSchema).parse({
      ...v.equipo_local,
      score: v.resultado_local,
    });

    const visitorTeam = teamWeekSchema.pipe(teamSchema).parse({
      ...v.equipo_visitante,
      score: v.resultado_visitante,
    });

    return matchSchema.parse({
      id: v.id,
      groupId: v.id_grupo,
      stadiumId: v.id_estadio,
      week: v.jornada,
      date,
      time,
      urlStreaming: v.url_streaming,
      status: transformableMatchStatusSchema.pipe(matchStatusSchema).parse(v.estado_partido),
      uploadedReport: stringToBooleanSchema.pipe(z.boolean()).parse(v.acta_subida) || false,
      localTeam,
      visitorTeam,
    });
  });
