import { z } from 'astro:schema';
import { datetime } from './utils/datetime';
import { pipedRefereeSchema, refereeSchema } from './utils/referee';
import { stadiumSchema } from './utils/stadium';

export const pipedPreviousSchema = z.object({
  stadium: stadiumSchema,
  date: z.string().nullable().default(null),
  time: z.string().nullable().default(null),
  category: z.string(),
  referees: z.array(pipedRefereeSchema),
  localTeamId: z.coerce.number(),
  visitorTeamId: z.coerce.number(),
});

export const previousSchema = z
  .object({
    id_estadio: z.coerce.number(),
    id_local: z.coerce.number(),
    id_visitante: z.coerce.number(),
    estado_partido: z.string(),
    fecha: datetime.nullable().default(null),
    aforo: z.coerce.number().nullable().default(null),
    direccion: z.string().nullable().default(null),
    modalidad: z.string(),
    latitud: z.string().nullable().default(null),
    longitud: z.string().nullable().default(null),
    // url_imagen: z.string().url().nullable().default(null),
    municipio: z.string().nullable().default(null),
    nombre_estadio: z.string(),
    arbitros: z.array(refereeSchema),
  })
  .transform((p) => ({
    stadium: {
      id: p.id_estadio,
      name: p.nombre_estadio,
      address: p.direccion,
      latitude: p.latitud,
      longitude: p.longitud,
      city: p.municipio || null, // Prefer null over empty string
      capacity: p.aforo || null, // Prefer null over 0
    },
    date: p.fecha?.date ?? null,
    time: p.fecha?.time ?? null,
    category: p.modalidad,
    referees: p.arbitros,
    localTeamId: p.id_local,
    visitorTeamId: p.id_visitante,
  }))
  .pipe(pipedPreviousSchema);
