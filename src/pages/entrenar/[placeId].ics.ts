import type { APIContext } from 'astro';
import trainings from 'src/content/trainings/trainings.json' with { type: 'json' };
import { generateTrainingICS } from 'src/services/generate-training-ics';

function findPlace(placeId?: string) {
  if (placeId) {
    return trainings.find((t) => t.id === placeId);
  }
}

export async function GET({ params: { placeId } }: APIContext<{ placeId: string }>) {
  const placeToTrain = findPlace(placeId);

  if (placeToTrain) {
    const ics = generateTrainingICS(placeToTrain);

    if (ics) {
      const filename = `entrenamientos-${placeToTrain.id}.ics`;

      return new Response(ics, {
        headers: {
          'Content-Description': 'File Transfer',
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename=${filename}`,
        },
      });
    }
  }

  return new Response('', {
    status: 204,
  });
}

export function getStaticPaths() {
  return trainings.map((t) => ({ params: { placeId: t.id } }));
}
