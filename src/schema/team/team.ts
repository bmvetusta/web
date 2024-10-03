import { z } from 'zod';
import { matchSchema } from '../generics/match';
import { seasonSchema, transformableSeasonSchema } from '../generics/season';
import { shieldImageUrl } from '../generics/shield-image-url';
import { stadiumSchema } from '../generics/stadium';
import { transformableMatchTeamSchema } from './match';
import { transformablePlayerTeamSchema } from './player';
import { sportsWearTeamSchema, transformableSportsWearTeamSchema } from './sports-wear-schema';
import { statsTeamSchema, transformableStatsTeamSchema } from './stats';

const defaultNullableString = z.string().nullable().default(null);

const commaStringValues = z
  .string()
  .nullable()
  .default(null)
  .transform((v) => v?.split(',') ?? []);
const commaNumberValues = z.string().transform((v) => v?.split(',')?.map((v) => +v) ?? []);

const group = z.object({
  id: z.coerce.number(),
  phaseId: z.coerce.number(),
  competitionId: z.coerce.number(),
  name: z.string(),
  phase: z.string(),
  competition: z.string(),
});

export const teamSchema = z.object({
  id: z.coerce.number(),
  federationId: z.coerce.number(),
  name: z.string(),
  shieldImageUrl,
  phone: z.string(),

  shirtRgb: defaultNullableString,
  pantsRgb: defaultNullableString,
  socksRgb: defaultNullableString,
  // shirtType: defaultNullableString,

  stadium: stadiumSchema,
  preferredDate: z.object({
    dayOfWeek: defaultNullableString,
    hour: defaultNullableString,
  }),
  groups: z.array(group),
  sportsWear: sportsWearTeamSchema,
  matches: z.array(matchSchema),
  stats: z.array(statsTeamSchema),
  seasons: z.array(seasonSchema),
});

export const transformTeamSchema = z
  .object({
    id: z.coerce.number(),
    nombre: z.string(),
    imagen: shieldImageUrl,

    direccion: z.string(),
    // localidad: z.boolean().or(z.string()), // I havent seen anything different than false
    provincia: z.string(),

    idFederacion: z.coerce.number(),

    telefono: z.string(),
    camiseta_rgb: defaultNullableString, // If there are multiple colors is separated with slash (/)
    pantalon_rgb: defaultNullableString,
    medias_rgb: defaultNullableString,
    // tipo_camiseta: defaultNullableString,

    estadio: z.string(),
    diaDeseado: z.string(),
    horaDeseada: z.string().optional(),
    // url_imagen_stadio: defaultNullableString,
    id_estadio: z.coerce.number(),
    longitud: z.string(),
    latitud: z.string(),

    competicion_ids: commaNumberValues.innerType(),
    competicion: commaStringValues.innerType(),

    fase_ids: commaNumberValues.innerType(),
    fase: commaStringValues.innerType(),

    grupo_ids: commaNumberValues.innerType(),
    grupo: commaStringValues.innerType(),

    equipos_totales: z.string(),
    modalidad: z.string(), // This is the category name

    equipaciones: transformableSportsWearTeamSchema.innerType(),
    plantilla: z.array(transformablePlayerTeamSchema.innerType()),
    trayectoria: z.array(transformableMatchTeamSchema.innerType()),
    estadisticas: z.array(transformableStatsTeamSchema.innerType()),
    temporadas: z.array(transformableSeasonSchema.innerType()),
  })
  .transform((v) => {
    // Stadium
    //   export const pipedStadiumSchema = z.object({
    //   id: z.coerce.number(),
    //   name: z.string(),
    //   address: z.string().nullable(),
    //   latitude: z.string().nullable(),
    //   longitude: z.string().nullable(),
    //   city: z.string().nullable().default(null).optional(),
    //   capacity: n.nullable().default(null),
    // });

    const stadium = {
      id: v.id_estadio,
      name: v.estadio,
      address: v.direccion,
      // imageUrl: v.url_imagen_stadio,
      latitude: v.latitud,
      longitude: v.longitud,
      // city: v.localidad,
      province: v.provincia,
      capacity: null,
    };

    const groups = [];

    const groupIds = commaNumberValues.safeParse(v.grupo_ids).data ?? [];
    const phaseIds = commaNumberValues.safeParse(v.fase_ids).data ?? [];
    const competitionIds = commaNumberValues.safeParse(v.competicion_ids).data ?? [];

    const groupNames = commaStringValues.safeParse(v.grupo).data ?? [];
    const phaseNames = commaStringValues.safeParse(v.fase).data ?? [];
    const competitionNames = commaStringValues.safeParse(v.competicion).data ?? [];

    for (const idx in groupIds) {
      const index = +idx;
      const group = {
        id: groupIds.at(index),
        phaseId: phaseIds.at(index),
        competitionId: competitionIds.at(index),
        name: groupNames.at(index),
        phase: phaseNames.at(index),
        competition: competitionNames.at(index),
      };

      groups.push(group);
    }

    const prefDate = v.diaDeseado?.includes(':') ? v.diaDeseado.split(' ') : [v.diaDeseado];
    const preferredDate = {
      dayOfWeek: prefDate?.[0] ?? null,
      time: prefDate?.[1] ?? null,
    };

    const sportsWear = transformableSportsWearTeamSchema.safeParse(v.equipaciones).data ?? {};
    const players = z.array(transformablePlayerTeamSchema).safeParse(v.plantilla).data ?? [];
    const matches = z.array(transformableMatchTeamSchema).safeParse(v.trayectoria).data ?? [];
    const stats = z.array(transformableStatsTeamSchema).safeParse(v.estadisticas).data ?? [];
    const seasons = z.array(transformableSeasonSchema).safeParse(v.temporadas).data ?? [];

    return {
      id: v.id,
      federationId: v.idFederacion,
      name: v.nombre,
      shieldImageUrl: v.imagen,
      // address: v.direccion,
      // city: v.localidad,
      // province: v.provincia,
      phone: v.telefono,
      shirtRgb: v.camiseta_rgb,
      pantsRgb: v.pantalon_rgb,
      socksRgb: v.medias_rgb,
      // shirtType: v.tipo_camiseta,
      stadium,
      preferredDate,
      groups,
      sportsWear,
      players,
      matches,
      stats,
      seasons,
    };
  });
