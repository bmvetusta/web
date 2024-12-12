import { z } from 'zod';
import { transformableMatchStatusSchema } from '../generics/match-status';
import { eventOfficialReportSchema } from './event';
import { faultOfficialReportSchema } from './fault';
import { goalOfficialReportSchema } from './goal';
import { matchStatsOfficialReportSchema } from './match-stats';
import { playerOfficialReportSchema } from './player';

export const responseOfficialReportSchema = z
  .object({
    acta: z.object({
      estado: transformableMatchStatusSchema,
      jugadores: playerOfficialReportSchema.array().default([]),
      goles: goalOfficialReportSchema.array().default([]),
      admonestaciones: faultOfficialReportSchema.array().default([]),
      eventos: eventOfficialReportSchema.array().default([]),
      sustituciones: z.array(z.any()).default([]),
      minutos_jugados: z.coerce.number().default(0),
      numero_partes: z.coerce.number().default(2),
      urlActaPartido: z.string().url().nullable().default(null),
      estadisticasPartido: matchStatsOfficialReportSchema.array().default([]),
      resultado: z.string().nullable().default(null),
      resultado_local: z.coerce.number().nullable().default(null),
      resultado_local_penaltis: z.coerce.number().nullable().default(null),
      resultado_visitante: z.coerce.number().nullable().default(null),
      resultado_visitante_penaltis: z.coerce.number().nullable().default(null),
      tipo_partido: z.coerce
        .number()
        .default(1)
        .transform((type) => (type === 1 ? 'Pista' : 'Playa'))
        .pipe(z.enum(['Pista', 'Playa'])),
    }),
  })
  .transform((data) => ({
    status: data.acta.estado,
    players: data.acta.jugadores,
    goals: data.acta.goles,
    faults: data.acta.admonestaciones,
    events: data.acta.eventos,
    substitutions: data.acta.sustituciones,
    playedMinutes: data.acta.minutos_jugados,
    partsNumber: data.acta.numero_partes,
    reportUrl: data.acta.urlActaPartido,
    matchStats: data.acta.estadisticasPartido,
    result: data.acta.resultado,
    localResult: data.acta.resultado_local,
    localPenaltiesResult: data.acta.resultado_local_penaltis,
    visitorResult: data.acta.resultado_visitante,
    visitorPenaltiesResult: data.acta.resultado_visitante_penaltis,
    matchType: data.acta.tipo_partido,
  }));
