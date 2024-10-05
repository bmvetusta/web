import { file } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { responseWeeksSchema } from 'src/schema/weeks/response';

export const weeks = defineCollection({
  loader: file('src/content/weeks/data.json'),
  schema: responseWeeksSchema._output,
});
