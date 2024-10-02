import { describe, expect, test } from 'bun:test';
import { responseTeamSchema } from 'src/schema/team/response';
import teamj2 from '../mock/team-j2-end.json' with { type: 'json' };

test('Check Team JSON Response Data', () => {
  describe('First Response Schema parse test', () => {
    const data = responseTeamSchema.safeParse(teamj2);

    // if (data.success === false) {
    //   console.error(data.error?.errors);
    // }

    expect(data.success).toBe(true);
  });

  describe('Second Response Schema parse test', () => {
    const data = responseTeamSchema.safeParse(teamj2);

    // if (data.success === false) {
    //   console.error(data.error?.errors);
    // }

    expect(data.success).toBe(true);
  });
});
