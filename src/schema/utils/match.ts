import { z } from 'astro:schema';
import { datetime } from './datetime';
import { teamSchema } from './team';

export const pipedMatchSchema = z.object({
  matchId: z.number(),
  week: z.number(),
  urlStreaming: z.string().nullable().optional(),
  status: z.string(),
  date: z.string().nullable().default(null).optional(),
  time: z.string().nullable().default(null).optional(),
  localTeam: teamSchema,
  visitorTeam: teamSchema,
});

// {
//   "id": "1386013",
//   "id_estadio": "1000005",
//   "id_local": "209180",
//   "nombre_local_default": "CONGESA XXI BALONMANO CIUDAD DE SALAMANCA",
//   "nombre_local": "CONGESA XXI BALONMANO CIUDAD DE SALAMANCA",
//   "url_escudo_local": "http://balonmano.isquad.es/images/afiliacion_clubs/135/square_366a6b36366f3834316a.jpg",
//   "resultado_local": "",
//   "id_visitante": "201273",
//   "nombre_visitante_default": "UNIVERSIDAD DE LE\u00f3N ADEMAR",
//   "nombre_visitante": "UNIVERSIDAD DE LE\u00f3N ADEMAR",
//   "url_escudo_visitante": "http://balonmano.isquad.es/images/afiliacion_clubs/126/square_70636d736b6d31387577.jpg",
//   "resultado_visitante": "",
//   "estado_partido": "Pendiente",
//   "fecha": "",
//   "acta_subida": "0",
//   "jornada": "30",
//   "id_grupo": "1023856",
//   "tipo_partido": 1,
//   "resultado_local_penaltis": null,
//   "resultado_visitante_penaltis": null,
//   "url_streaming": null,
//   "equipo_local": {
//     "nombre": "CONGESA XXI BALONMANO CIUDAD DE SALAMANCA",
//     "categoria": "Primera Nacional",
//     "responsable": null,
//     "imagen": "http://balonmano.isquad.es/images/afiliacion_clubs/135/square_366a6b36366f3834316a.jpg",
//     "id": "209180"
//   },
//   "equipo_visitante": {
//     "nombre": "UNIVERSIDAD DE LE\u00f3N ADEMAR",
//     "categoria": "Primera Nacional",
//     "responsable": null,
//     "imagen": "http://balonmano.isquad.es/images/afiliacion_clubs/126/square_70636d736b6d31387577.jpg",
//     "id": "201273"
//   }
// }

export const matchSchema = z
  .object({
    id: z.coerce.number(),
    nombre_local: z.string(),
    url_escudo_local: z.string().url(),
    resultado_local: z.coerce.number().nullable(),
    nombre_visitante: z.string(),
    url_escudo_visitante: z.string().url(),
    resultado_visitante: z.coerce.number().nullable(),
    estado_partido: z.string(),
    fecha: datetime,
    jornada: z.coerce.number(),
    url_streaming: z.string().url().nullable(),
    equipo_local: z.object({
      id: z.coerce.number(),
    }),
    equipo_visitante: z.object({
      id: z.coerce.number(),
    }),
  })
  .transform((result) => ({
    matchId: result.id,
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
  }))
  .pipe(pipedMatchSchema);
