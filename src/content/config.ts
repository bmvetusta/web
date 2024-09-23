import { file } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { trainingSchema } from 'src/schema/training';

const trainings = defineCollection({
  loader: file('src/content/trainings/trainings.json'),
  schema: trainingSchema,
});

export const collections = { trainings };
