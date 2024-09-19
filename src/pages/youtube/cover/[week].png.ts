import { ImageResponse } from '@vercel/og';
import type { APIContext } from 'astro';
import { PRIMERA_GROUP_ID, PRIMERA_TEAM_ID } from 'astro:env/server';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
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
    fontPaths.map(async (fontFilePath) => {
      const fontFilePathLowerCase = fontFilePath.toLocaleLowerCase('es-ES').replaceAll(' ', '');
      const name = 'Alumni Sans';
      const weight = getWeightNumber(fontFilePath);
      const style = fontFilePathLowerCase.includes('italic') ? 'italic' : 'normal';

      const require = createRequire(import.meta.url);
      const fontPath = require.resolve(fontFilePath);
      const data = await readFile(fontPath);

      return {
        name,
        data,
        weight,
        style,
      } as any;
    })
  );
}

export async function GET({ site, params }: APIContext<{ week: number }>) {
  try {
    if (!site) {
      throw new Error('No site url configured');
    }

    const { week } = params;
    const data = await rfebmGetCalendar(PRIMERA_GROUP_ID);

    if (!data) {
      throw new Error(`No calendar found ${PRIMERA_GROUP_ID}`);
    }

    if (!week) {
      throw new Error('Not week provided');
    }

    const match = data.find((m) => m.week === +week && m.localTeam.id === PRIMERA_TEAM_ID);

    if (!match) {
      throw new Error('No match found');
    }

    console.log('local file url', import.meta.url);

    const fonts = await getFontOptionsFromFontPaths(
      '../../../assets/fonts/alumni-sans/AlumniSans-BoldItalic.ttf',
      '../../../assets/fonts/alumni-sans/AlumniSans-Bold.ttf'
    );
    const imgUrl = match.visitorTeam.shieldUrl;

    return new ImageResponse(
      YoutubeCover({
        baseUrlHref: site.href,
        visitorShieldSrc: imgUrl,
        weekNumber: week,
        weekDate: match.date,
        time: match.time,
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
