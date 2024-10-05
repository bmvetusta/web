import { file } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { trainingSchema } from 'src/schema/training';

export const trainings = defineCollection({
  loader: file('src/content/trainings/data.json'),
  schema: trainingSchema,
});
