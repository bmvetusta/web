import { describe, expect, test } from 'bun:test';
import teamj2 from '../mock/team-j2-end.json' with { type: 'json' };

import { teamResponseSchema } from 'src/schema/team/response';
import { z } from 'zod';

const schema = z
  .object({
    equipo: z.any(),
  })
  .transform((v) => v.equipo);

test('Check if team schema parses well', () => {
  describe('First test', () => {
    const data = teamResponseSchema.safeParse(teamj2);

    // if (data.success === false) {
    //   console.error(data.error?.errors);
    // }

    expect(data.success).toBe(true);
  });

  describe('Second test', () => {
    const data = teamResponseSchema.safeParse(teamj2);

    // if (data.success === false) {
    //   console.error(data.error?.errors);
    // }

    expect(data.success).toBe(true);
  });
});
