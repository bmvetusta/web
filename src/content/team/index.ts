import { file } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { responseTeamSchema } from 'src/schema/team/response';

export const team = defineCollection({
  loader: file('src/content/team/data.json'),
  schema: responseTeamSchema._output,
});
