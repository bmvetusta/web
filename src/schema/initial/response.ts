import { z } from 'zod';

const n = z.coerce.number();
const b = z.coerce.boolean();
const s = z.string();
const sexSchema = z
  .enum(['M', 'Masc.', 'Masculino', 'F', 'Fem.', 'Femenino', 'X', 'Otro'])
  .transform((sex) => (sex === 'M' || sex === 'Masc.' || sex === 'Masculino' ? 'MALE' : 'FEMALE'));

const seasonSchema = z
  .object({
    id: n,
    nombre: z.string(),
    activa: b,
  })
  .transform(({ id, nombre: name, activa: active }) => ({
    id,
    name,
    active,
  }));

const groupSchema = z
  .object({
    id: n,
    nombre: s,
    id_tipo_torneo: n,
  })
  .transform(({ id, nombre: name, id_tipo_torneo: idTournamentType }) => ({
    id,
    name,
    idTournamentType,
  }));

const phaseSchema = z
  .object({
    id: n,
    nombre: s,
    orden: n,
    grupos: groupSchema.array(),
  })
  .transform(({ id, nombre: name, orden: order, grupos: groups }) => ({
    id,
    name,
    order,
    groups,
  }));

const competitionsSchema = z
  .object({
    id: n,
    nombre: s,
    categoria: s,
    id_categoria: n,
    orden_categoria: n,
    orden_competicion: n,
    id_superficie: n,
    sexo: sexSchema,
    minutos_parte: n,
    fases: phaseSchema.array(),
  })
  .transform(
    ({
      id,
      nombre: name,
      categoria: category,
      id_categoria: categoryId,
      orden_categoria: categoryOrder,
      orden_competicion: competitionOrder,
      id_superficie: modalityId,
      sexo: sex,
      minutos_parte: timeDurationInMinutes,
      fases: phases,
    }) => ({
      id,
      name,
      category,
      categoryId,
      categoryOrder,
      competitionOrder,
      modalityId,
      sex,
      timeDuration: { minutes: timeDurationInMinutes },
      phases,
    })
  );

const categorySchema = z
  .object({
    idCategoria: n,
    nombre: s,
    sexo: sexSchema,
    idSuperficie: n,
  })
  .transform(({ idCategoria: id, nombre: name, sexo: sex, idSuperficie: modalityId }) => ({
    id,
    name,
    sex,
    modalityId,
  }));

const modalitySchema = z
  .object({
    id: n,
    nombre: s,
  })
  .transform(({ id, nombre: name }) => ({
    id,
    name,
  }));

const eventSchema = z
  .object({
    nombre: s,
    icono: s.url(),
    iconoNegro: s.url(),
    numeroTantos: n.nullable().default(null),
  })
  .transform(
    ({ nombre: name, icono: icon, iconoNegro: iconDark, numeroTantos: addGoalsQuantity }) => ({
      name,
      icon,
      iconDark,
      addGoalsQuantity,
    })
  );

const tournamentSchema = z
  .object({
    id: s,
    nombre: s,
    descripcion: s,
    fechaIni: s
      .transform((d) => d.split(' '))
      .transform((d) => ({
        date: d.at(0),
        time: d.at(1),
      })),
    fechaFin: s
      .transform((d) => d.split(' '))
      .transform((d) => ({
        date: d.at(0),
        time: d.at(1),
      })),
    fechaIniInscripcion: s
      .transform((d) => d.split(' '))
      .transform((d) => ({
        date: d.at(0),
        time: d.at(1),
      })),
    fechaFinInscripcion: s
      .transform((d) => d.split(' '))
      .transform((d) => ({
        date: d.at(0),
        time: d.at(1),
      })),
    direccion: s,
    codigoPostal: s.nullable(),
    poblacion: s,
    latitud: s.nullable(),
    longitud: s.nullable(),
    personaContacto: s
      .transform((people) => (people?.length ? people.split(' / ') : []))
      .pipe(z.string().array()),
    emailContacto: s
      .email()
      .or(s)
      .nullable()
      .transform((e) => (e?.length ? e : null)),
    precio: s.nullable().default(null),
    urlEvento: s
      .url()
      .or(s.transform((s) => (s.length ? s : null)))
      .nullable(),
    observacion: s.nullable().transform((o) => (o?.length ? o : null)),
    urlInscripcion: s
      .url()
      .or(s.transform((s) => (s.length ? s : null)))
      .nullable(),
    documentos: z.string().array(),
  })
  .transform(
    ({
      id,
      nombre: name,
      descripcion: description,
      fechaIni: start,
      fechaFin: end,
      direccion: address,
      codigoPostal: postalCode,
      poblacion: city,
      personaContacto: contactPeopleName,
      emailContacto: contactEmail,
    }) => ({
      id,
      name,
      description,
      start,
      end,
      address,
      postalCode,
      city,
      contactPeopleName,
      contactEmail,
    })
  );

const tournamentTypeSchema = z
  .object({
    id: n,
    nombre: s,
    tieneCruces: b.nullable(),
  })
  .transform(({ id, nombre: name, tieneCruces: hasChampionship }) => ({
    id,
    name,
    hasChampionship,
  }));

const provincesSchema = z
  .object({
    id: n,
    nombre: s,
    idComunidad: n,
  })
  .transform(({ id, nombre: name, idComunidad: comunityId }) => ({
    id,
    name,
    comunityId,
  }));

const provinceFederationSchema = z
  .object({
    id: n,
    idFederacion: n,
    idTerritorial: n,
    isTerritorial: b,
    nombre: s,
    nombreMovil: s,
    activa: b,
    urlImagen: s.url(),
    // idClienteIspot: z.any(),
    // urlNoticias: z.any(),
    // idYoutube: z.any(),
    // es_toools: b,
  })
  .transform(
    ({
      id,
      idFederacion: federationId,
      idTerritorial,
      isTerritorial,
      nombre: name,
      activa: active,
      urlImagen: shieldImage,
    }) => ({
      id,
      federationId,
      idTerritorial,
      isTerritorial,
      name,
      active,
      shieldImage,
    })
  );

const territorialFederationSchema = z
  .object({
    id: n,
    idTerritorial: n,
    isTerritorial: b,
    nombre: s
      .nullable()
      .or(z.boolean())
      .transform((n) => (typeof n === 'boolean' ? null : n)),
    nombreMovil: s.nullable(),
    emailSoporte: s.email().nullable(),
    asunto: s.nullable(),
    activa: b,
    urlImagen: s.url(),
    // idClienteIspot: z.any(),
    // urlNoticias: z.any(),
    // idYoutube: z.any(),
    // es_toools: b,
    // tipoNoticia: n,
  })
  .transform(
    ({
      id,
      idTerritorial,
      isTerritorial,
      nombre: name,
      activa: active,
      urlImagen: shieldImage,
    }) => ({
      id,
      idTerritorial,
      isTerritorial,
      name,
      active,
      shieldImage,
    })
  );

const countrySchema = z
  .object({
    codigo: s.min(2).max(2),
    nombre: s,
    nombreIngles: s,
  })
  .transform(({ codigo: code, nombre: nameES, nombreIngles: name }) => ({
    code,
    name,
    nameES,
  }));

// const documentTypeSchema = z
//   .object({ id: s, nombre: s })
//   .transform(({ id, nombre: name }) => ({ id, name }));

export const responseInitialSchema = z
  .object({
    status: z.literal('OK'),
    temporadas: seasonSchema.array(),
    competiciones: competitionsSchema.array(),
    categorias: categorySchema.array(),
    modalidades: modalitySchema.array(),
    eventos: eventSchema.array(),
    pruebas: tournamentSchema.array(),
    tipos_torneo: tournamentTypeSchema.array(),
    provincias: provincesSchema.array(),
    federacionProvincial: provinceFederationSchema.array(),
    federacionTerritorial: territorialFederationSchema.array(),
    paises: countrySchema.array(),
    // tipoDocumento: documentTypeSchema.array(),
    // sexo: z
    // 	.object({ id: s, nombre: s })
    // 	.transform(({ id, nombre: name }) => ({ id, name }))
    // 	.array(),
    // url_autorizacion_paterna: s.url(),
  })
  .transform((input) => ({
    seasons: input.temporadas,
    tournaments: input.competiciones,
    categories: input.categorias,
    modalities: input.modalidades,
    events: input.eventos,
    championships: input.pruebas,
    provinces: input.provincias,
    provinceFederations: input.federacionProvincial,
    territorialFederations: input.federacionTerritorial,
    countries: input.paises,
  }));
