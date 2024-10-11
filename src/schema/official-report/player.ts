import { z } from 'zod';
import { profilePhotoUrl } from '../generics/profile-photo-url';
import { stringToBooleanSchema } from '../generics/string-to-boolean';

export const playerOfficialReportSchema = z
  .object({
    id: z.coerce.number(),
    nombre: z.string(), // capitalizedStringSchema(true, 'es-ES'), // This can be a limit because there are players from many nationalities
    imagen: profilePhotoUrl,
    clase: z.string().default('DESCONOCIDO'), // z.enum(['JUGADOR', 'INVITADO', 'OFICIAL', 'STAFF ADICIONAL']), // Sure there are more
    id_equipo: z.coerce.number(),
    nombre_equipo: z.string(),
    tipo_humano: stringToBooleanSchema,
    titular: stringToBooleanSchema,
    es_portero: stringToBooleanSchema,
    es_capitan: stringToBooleanSchema,
    dorsal: z.coerce.number().default(0),
  })
  .transform((player) => ({
    id: player.id,
    name: player.nombre,
    image: player.imagen,
    class: player.clase,
    teamId: player.id_equipo,
    teamName: player.nombre_equipo,
    isHuman: player.tipo_humano,
    isInitial: player.titular,
    isGoalkeeper: player.es_portero,
    isCaptain: player.es_capitan,
    number: player.dorsal,
  }));
