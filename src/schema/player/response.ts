import { z } from 'zod';
const n = z.coerce.number();
const str = z.string();
const strnll = str.nullable();
export const responsePlayerSchema = z
  .object({
    detalles: z.object({
      id: n,
      nombre: str,
      clase: str, // TODO: What kinds of "clases" exists?
      imagen: str.url(),
      fecha_nacimiento: str.transform((datetime) => datetime.split(' ').at(0)),
      apodo: strnll,
      altura_jugador: strnll,
      peso_jugador: strnll,
      temporadas: z
        .object({
          id: n,
          nombre: str,
        })
        .transform((t) => ({
          id: t.id,
          name: t.nombre,
        }))
        .array(),
      estadisticas: z
        .object({
          nombre: str,
          idCompeticion: n,
          goles: n.default(0),
          amarillas: n.default(0),
          dobles_amarillas: n.default(0), // 2'
          rojas: n.default(0),
          estadisticas1: n.default(0),
          estadisticas2: n.default(0),
          estadisticas3: n.default(0),
          nombreEstadisticas1: str,
          nombreEstadisticas2: str,
          nombreEstadisticas3: str,
          minutos: n.default(0),
          partidos: n.default(0),
        })
        .transform((stat) => ({
          tournamentId: stat.idCompeticion,
          tournament: stat.nombre,
          goals: stat.goles,
          yellowCards: stat.estadisticas1,
          suspensions: stat.estadisticas2,
          redCards: stat.estadisticas3,
          minutes: stat.minutos,
          matches: stat.partidos,
        }))
        .array(),
      estadisticas_temporada: z
        .object({
          idTemporada: n,
          nombre: str,
          goles: n.default(0),
          estadisticas1: n.default(0),
          estadisticas2: n.default(0),
          estadisticas3: n.default(0),
          nombreEstadisticas1: str,
          nombreEstadisticas2: str,
          nombreEstadisticas3: str,
          minutos: n.default(0),
          partidos: n.default(0),
        })
        .transform((stat) => ({
          seasonId: stat.idTemporada,
          season: stat.nombre,
          goals: stat.goles,
          yellowCards: stat.estadisticas1,
          suspensions: stat.estadisticas2,
          redCards: stat.estadisticas3,
          minutes: stat.minutos,
          matches: stat.partidos,
        }))
        .array(),
      sanciones: z.any().array(),
      datos_equipos: z
        .object({
          id: n,
          nombre: str,
          imagen: str.url(),
        })
        .transform((t) => ({
          id: t.id,
          name: t.nombre,
          shieldImageUrl: t.imagen,
        }))
        .array(),
    }),
  })
  .transform((data) => {
    const { id, nombre, ...player } = data.detalles;
    const [lastNames, name] = nombre.split(',');

    return {
      id,
      name,
      lastNames,
      role: player.clase,
      profilePhotoUrl: player.imagen,
      birthDate: player.fecha_nacimiento,
      nickname: player.apodo,
      hight: player.altura_jugador,
      weight: player.peso_jugador,
      activeSeasons: player.temporadas,
      statsByTournament: player.estadisticas,
      statsBySeason: player.estadisticas_temporada,
      teams: player.datos_equipos,
    };
  });
