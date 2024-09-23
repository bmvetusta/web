import { file } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { trainingPlaceSchema } from 'src/schema/training-places';

const trainingPlaces = defineCollection({
  loader: file('src/assets/data/training-schedules.json'),
  schema: trainingPlaceSchema,
});

export const collections = { trainingPlaces };
