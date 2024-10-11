import { describe, expect, test } from 'bun:test';
import { responseOfficialReportSchema } from 'src/schema/official-report/response';
import reportPlaying from '../mock/acta-en-progreso.json' with { type: 'json' };
import reportEnded from '../mock/acta-finalizado.json' with { type: 'json' };
import reportPending from '../mock/acta-pendiente.json' with { type: 'json' };

test('Check for Official Report JSON Data', () => {
  describe('Check Ended Match Report', () => {
    const data = responseOfficialReportSchema.safeParse(reportEnded);

    // if (data.success === false) {
    //   console.error(data.error?.errors);
    // }

    expect(data.success).toBe(true);
    expect(data.data?.status).toBe('ENDED');
  });
  describe('Check Pending Match Report', () => {
    const data = responseOfficialReportSchema.safeParse(reportPending);

    if (data.success === false) {
      console.error(data.error?.errors);
    }

    expect(data.success).toBe(true);
    expect(data.data?.status).toBe('PENDING');
  });
  describe('Check Playing Match Report', () => {
    const data = responseOfficialReportSchema.safeParse(reportPlaying);

    if (data.success === false) {
      console.error(data.error?.errors);
    }

    expect(data.success).toBe(true);
    expect(data.data?.status).toBe('PLAYING');
  });
});
