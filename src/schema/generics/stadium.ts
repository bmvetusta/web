import { z } from 'zod';

// "id_estadio": "1000095",
// "aforo": "900",
// "direccion": "C. Vald\u00c3\u00a9s, 2, 33012 Oviedo, Asturias, Espa\u00c3\u00b1a",
// "modalidad": null,
// "latitud": "43.36563874569288",
// "longitud": "-5.874707605279583",
// "url_imagen": null,
// "localidad": null,
// "codigo_postal": null,
// "nombre_estadio": "POLIDEPORTIVO MUNICIPAL FLORIDA ARENA",
// "superficie": null,
// "luz": null,
// "altitud": "0"

// Comented lines of schema are properties that I haven't seen any value for

export const stadiumSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  address: z.string().nullable(),
  latitude: z.string().nullable(),
  longitude: z.string().nullable(),
  // imageUrl: z.string().url().nullable().default(null),
  // city: z.string().nullable().default(null).optional(),
  // zip: z.number().min(0).max(99999),
  capacity: z.coerce.number().nullable().default(null),
  // floor: z.string().nullable().default(null),
  // light: z.string().nullable().default(null),
  // altitude: z.coerce.number().default(0),
  // modality: z.any()
  province: z.string().nullable().default(null),
});
