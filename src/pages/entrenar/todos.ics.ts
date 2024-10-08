import trainings from 'src/content/trainings/data.json' with { type: 'json' };
import { generateTrainingICS } from 'src/services/generate-training-ics';

export async function GET() {
  const ics = trainings.map((placeToTrain) => generateTrainingICS(placeToTrain)).join('\n\n');

  if (ics) {
    // const filename = `todos.ics`;

    return new Response(
      ics
      //   {
      //   headers: {
      //     'Content-Description': 'File Transfer',
      //     'Content-Type': 'application/octet-stream',
      //     'Content-Disposition': `attachment; filename=${filename}`,
      //   },
      // }
    );
  }
}
