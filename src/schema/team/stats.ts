import { z } from 'zod';

const n = z.coerce.number().default(0);

export const statsTeamSchema = z.object({
  week: n,
  position: n,
  points: n,
  wins: n,
  draw: n,
  lost: n,
  groupId: z.number(),
  goals: n,
  goalsAgainst: n,
});

export const transformableStatsTeamSchema = z
  .object({
    jornada: n,
    posicion: n,
    puntos: n,
    ganados: n,
    empatados: n,
    perdidos: n,
    id_grupo: z.coerce.number(),
    goles_a_favor: n,
    goles_en_contra: n,
  })
  .transform((v) => ({
    week: v.jornada,
    position: v.posicion,
    points: v.puntos,
    wins: v.ganados,
    draw: v.empatados,
    lost: v.perdidos,
    groupId: v.id_grupo,
    goals: v.goles_a_favor,
    goalsAgainst: v.goles_en_contra,
  }));
