import { ImageResponse } from '@vercel/og';
import type { APIContext } from 'astro';
import { PRIMERA_GROUP_ID, PRIMERA_TEAM_ID } from 'astro:env/server';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { YoutubeCover } from '../../../components/youtube-cover/react';
import { rfebmGetCalendar } from '../../../services/rfebm/get-calendar';

export const prerender = false;

const getWeightNumber = (fileLower: string) => {
  if (fileLower.includes('extrablack') || fileLower.includes('ultrablack')) return 950;
  if (fileLower.includes('black') || fileLower.includes('heavy')) return 900;
  if (fileLower.includes('extrabold') || fileLower.includes('extrabold')) return 800;
  if (fileLower.includes('bold')) return 700;
  if (fileLower.includes('emibold')) return 600; // Semi || Demi
  if (fileLower.includes('medium')) return 500;
  if (fileLower.includes('normal') || fileLower.includes('regular')) return 400;
  if (fileLower.includes('light')) return 300;
  if (fileLower.includes('extralight') || fileLower.includes('ultralight')) return 200;
  if (fileLower.includes('thin') || fileLower.includes('hairline')) return 100;

  return 400;
};

async function getFontOptionsFromFontPaths(...fontPaths: string[]) {
  return await Promise.all(
    fontPaths.map(async (fontPath) => {
      const fontFilePathLowerCase = fontPath
        .toString()
        .toLocaleLowerCase('es-ES')
        .replaceAll(' ', '');
      const name = 'Alumni Sans';
      const weight = getWeightNumber(fontPath.toString());
      const style = fontFilePathLowerCase.includes('italic') ? 'italic' : 'normal';
      const require = createRequire(import.meta.url);
      const resolvedFontPath = require.resolve(fontPath);
      const data = await readFile(resolvedFontPath); // Font as buffer

      return {
        name,
        data,
        weight,
        style,
      } as any;
    })
  );
}

async function getWeekData(week?: number | string | null) {
  if (!week) {
    return;
  }

  const weekNumber = +week;
  if (Number.isNaN(weekNumber) || !Number.isFinite(weekNumber) || weekNumber < 1) {
    return;
  }

  const data = await rfebmGetCalendar(PRIMERA_GROUP_ID);
  if (!data) {
    return;
  }

  const match = data.find((m) => m.week === weekNumber);
  if (!match) {
    return;
  }

  return match;
}

export async function GET({ site, params }: APIContext<{ week: number }>) {
  try {
    if (!site) {
      throw new Error('No site url configured');
    }

    const match = await getWeekData(params.week);

    if (!match) {
      throw new Error('No match found');
    }

    const isLocal = match.localTeam.id === PRIMERA_TEAM_ID;

    const isVercel = process.env.VERCEL === '1' || false;
    const fontPath = isVercel ? `./public` : '../../../../public';

    const fonts = await getFontOptionsFromFontPaths(
      join(fontPath, 'assets/fonts/alumni/AlumniSans-BoldItalic.ttf'),
      join(fontPath, 'assets/fonts/alumni/AlumniSans-Bold.ttf')
    );
    const imgUrl = match.visitorTeam.shieldUrl;

    return new ImageResponse(
      YoutubeCover({
        baseUrlHref: site.href,
        visitorShieldSrc: imgUrl,
        weekNumber: match.week,
        weekDate: match.date,
        time: match.time,
        isLocal,
      }),
      {
        fonts,
        width: 1280,
        height: 720,
        headers: {
          'Cache-Control':
            'public, max-age=604800, stale-while-revalidate=86400, stale-if-error=86400',
        },
      }
    );
  } catch (error) {
    console.error(error);

    return new Response('Not found', { status: 404 });
  }
}
