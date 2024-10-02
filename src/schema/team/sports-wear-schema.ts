import { z } from 'zod';

const nullableString = z.string().nullable().default(null);

const singleSportsWearSchema = z.object({
  shirtColor1: nullableString,
  shirtColor2: nullableString,
  pantsColor1: nullableString,
  pantsColor2: nullableString,
  // socksColor: nullableString,
  // type: nullableString,
});

const singleSportsWear = z
  .object({
    camisetaColor1: nullableString,
    camisetaColor2: nullableString,
    pantalonColor1: nullableString,
    pantalonColor2: nullableString,
    // mediasColor: nullableString,
    // tipo: nullableString,
  })
  .transform((v) => ({
    shirtColor1: v.camisetaColor1,
    shirtColor2: v.camisetaColor2,
    pantsColor1: v.pantalonColor1,
    pantsColor2: v.pantalonColor2,
    // socksColor: v.mediasColor,
    // type: v.tipo,
  }))
  .pipe(singleSportsWearSchema);

export const sportsWearSchema = z.object({
  player1: singleSportsWearSchema,
  player2: singleSportsWearSchema,
  goalkeeper1: singleSportsWearSchema,
  goalkeeper2: singleSportsWear,
});

export const transformableSportsWearSchema = z
  .object({
    primeraEquipacionJugador: singleSportsWear,
    segundaEquipacionJugador: singleSportsWear,
    primeraEquipacionPortero: singleSportsWear,
    segundaEquipacionPortero: singleSportsWear,
  })
  .transform((v) => ({
    player1: v.primeraEquipacionJugador,
    player2: v.segundaEquipacionJugador,
    goalkeeper1: v.primeraEquipacionPortero,
    goalkeeper2: v.segundaEquipacionPortero,
  }));
