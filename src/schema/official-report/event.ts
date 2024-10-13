import { z } from 'zod';
import { stringToBooleanSchema } from '../generics/string-to-boolean';

const minuteWithSecondSchema = z
  .string()
  .transform((t) => t.split(':').map((n) => parseInt(n, 10)))
  .transform((t) => ({
    min: t?.[0] ?? -1,
    sec: t?.[1] ?? -1,
  }));

// [
//   {
//     "id": "1",
//     "nombre": "7 METROS",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon1.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon1.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "2",
//     "nombre": "AMONESTACI\u00f3N",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon2.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon2.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "5",
//     "nombre": "AVISO PASIVO",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon5.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon5.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "6",
//     "nombre": "BLOCAJE",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon6.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon6.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "7",
//     "nombre": "CAMBIO PORTERO",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon7.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon7.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "8",
//     "nombre": "DESCALIFICACI\u00f3N",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon8.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon8.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "10",
//     "nombre": "DOBLES",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon10.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon10.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "11",
//     "nombre": "ERROR PASE",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon11.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon11.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "12",
//     "nombre": "ERROR RECEPCI\u00f3N",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon12.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon12.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "13",
//     "nombre": "EXCLUSI\u00f3N",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon13.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon13.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "14",
//     "nombre": "FALTA ATAQUE",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon14.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon14.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "15",
//     "nombre": "GOL",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon15.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon15.png",
//     "numeroTantos": "1"
//   },
//   {
//     "id": "19",
//     "nombre": "PASE DE GOL",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon19.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon19.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "20",
//     "nombre": "PASIVO",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon20.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon20.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "21",
//     "nombre": "PASOS",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon21.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon21.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "30",
//     "nombre": "TIEMPO MUERTO",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon30.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon30.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "31",
//     "nombre": "VIOLACI\u00f3N \u00e1REA",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon31.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon31.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "37",
//     "nombre": "FALTA T\u00e9CNICA",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon37.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon37.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "101",
//     "nombre": "GOL DOBLE",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon15.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon15.png",
//     "numeroTantos": "2"
//   },
//   {
//     "id": "1000",
//     "nombre": "TARJETA AZUL",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon1000.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon1000.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "1001",
//     "nombre": "ROBO",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon1001.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon1001.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "1002",
//     "nombre": "P\u00e9RDIDA",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon1002.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon1002.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "1003",
//     "nombre": "LANZAMIENTO",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon15.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon15.png",
//     "numeroTantos": null
//   },
//   {
//     "id": "1004",
//     "nombre": "LANZAMIENTO FALLADO",
//     "icono": "https://balonmano.misquad.es/img/eventos/icon1002.png",
//     "iconoNegro": "https://balonmano.misquad.es/img/eventos/icon1002.png",
//     "numeroTantos": null
//   }
// ]

export const eventOfficialReportSchema = z
  .object({
    bloque: z.string(), // "Primera parte" | "Segunda parte
    minuto: minuteWithSecondSchema,
    idTipo: z.coerce.number(),
    evento: z.string(),
    idEvento: z.coerce.number(),
    idEquipo: z.coerce.number(),
    idJugador: z.coerce.number(),
    nombreJugador: z.string().nullable().default(null),
    es_propia: stringToBooleanSchema,
  })
  .transform((e) => ({
    part: e.bloque,
    min: e.minuto.min,
    sec: e.minuto.sec,
    type: e.idTipo,
    event: e.evento,
    eventId: e.idEvento,
    teamId: e.idEquipo,
    isOwn: e.es_propia,
    player: {
      teamId: e.idEquipo,
      playerId: e.idJugador,
      playerName: e.nombreJugador,
    },
  }));
