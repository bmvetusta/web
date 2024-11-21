import type { APIContext } from 'astro';
import trainingsObj from 'src/content/trainings/data.json' with { type: 'json' };
import { generateTrainingICS } from 'src/services/generate-training-ics';

const trainings = Object.values(trainingsObj);

function findPlace(placeId?: string) {
  if (placeId) {
    return Object.values(trainings).find((t) => t.id === placeId);
  }
}

export async function GET({ params: { placeId } }: APIContext<{ placeId: string }>) {
  const placeToTrain = findPlace(placeId);

  if (placeToTrain) {
    const ics = generateTrainingICS(placeToTrain);

    if (ics) {
      // const filename = `entrenamientos-${placeToTrain.id}.ics`;

      return new Response(
        ics
        //    {
        //   headers: {
        //     'Content-Description': 'File Transfer',
        //     'Content-Type': 'application/octet-stream',
        //     'Content-Disposition': `attachment; filename=${filename}`,
        //   },
        // }
      );
    }
  }
}

export function getStaticPaths() {
  return trainings.map((t) => ({ params: { placeId: t.id } }));
}
