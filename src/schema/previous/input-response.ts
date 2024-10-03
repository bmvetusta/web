import { z } from 'zod';
import { transformableDateSchema } from '../generics/datetime';
import { transformableRefereeSchema } from '../generics/referee';
import { stadiumSchema } from '../generics/stadium';
import { transformableMatchPreviousSchema } from './match';

const transformableArrayOfMatches = z.array(transformableMatchPreviousSchema);

export const inputResponsePreviousSchema = z
  .object({
    id_estadio: z.coerce.number(),
    id_local: z.coerce.number(),
    id_visitante: z.coerce.number(),
    estado_partido: z.string(),
    fecha: transformableDateSchema.innerType().nullable().default(null),
    aforo: z.coerce.number().nullable().default(null),
    direccion: z.string().nullable().default(null),
    modalidad: z.string(),
    latitud: z.string().nullable().default(null),
    longitud: z.string().nullable().default(null),
    municipio: z.string().nullable().default(null),
    nombre_estadio: z.string(),
    arbitros: z.array(transformableRefereeSchema),
    enfrentamientosPrevios: z.object({
      partidos: z.array(z.any()),
      ganados_local: z.coerce.number(),
      empates: z.coerce.number(),
      ganados_visitante: z.coerce.number(),
    }),
    partidosPreviosLocal: z.array(z.any()),
    partidosPreviosVisitante: z.array(z.any()),
    estadisticas: z.array(z.any()),
  })
  .transform((p) => {
    const datetime = transformableDateSchema.parse(p.fecha);
    const referees = p.arbitros;
    const stadium = stadiumSchema.parse({
      id: p.id_estadio,
      name: p.nombre_estadio,
      address: p.direccion,
      latitude: p.latitud,
      longitude: p.longitud,
      capacity: p.aforo || null, // Prefer null over 0, because 0 seems unreal so it can be that they don't know the capacity
    });

    const statsBetween = {
      localWins: p.enfrentamientosPrevios.ganados_local,
      draws: p.enfrentamientosPrevios.empates,
      visitorWins: p.enfrentamientosPrevios.ganados_visitante,
      matches: transformableArrayOfMatches.parse(p.enfrentamientosPrevios.partidos),
    };

    const localMatches = transformableArrayOfMatches.parse(p.partidosPreviosLocal);
    const visitorMatches = transformableArrayOfMatches.parse(p.partidosPreviosVisitante);

    const tournamentStats = p.estadisticas;

    return {
      stadium,
      date: datetime.date,
      time: datetime.time,
      category: p.modalidad,
      referees,
      localTeamId: p.id_local,
      visitorTeamId: p.id_visitante,
      statsBetween,
      tournamentStats,
      localMatches,
      visitorMatches,
    };
  });
