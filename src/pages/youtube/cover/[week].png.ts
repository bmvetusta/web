import { ImageResponse } from '@vercel/og';
import type { APIContext } from 'astro';
import { PRIMERA_TEAM_ID } from 'astro:env/server';
import { YoutubeCover } from '../../../components/youtube-cover/react';
import { getFontOptionsFromFontPaths } from '../../../lib/get-font-options-from-font-paths';
import { getWeekData } from '../../../services/get-week-data';

export const prerender = false;

export async function GET({ site, params }: APIContext<{ week: number }>) {
  try {
    if (!site) {
      throw new Error('No site url configured');
    }

    const match = await getWeekData(params.week);

    console.log({ match });

    if (!match) {
      throw new Error('No match found');
    }

    const isLocal = match.localTeam.id === PRIMERA_TEAM_ID;
    const imgUrl = isLocal ? match.visitorTeam.shieldUrl : match.localTeam.shieldUrl;

    const fonts = await getFontOptionsFromFontPaths(
      new URL('../../../../public/assets/fonts/alumni/AlumniSans-Bold.ttf', import.meta.url),
      new URL('../../../../public/assets/fonts/alumni/AlumniSans-BoldItalic.ttf', import.meta.url)
    );

    console.log({ fonts });

    const dateParts = match.date?.split('-');
    const isFirstPartYear = match.date !== null && dateParts?.at(0)?.length === 4;
    const weekDate = isFirstPartYear ? dateParts?.reverse().join('-') : match.date;

    console.log('Previous to return', { weekDate });

    return new ImageResponse(
      YoutubeCover({
        baseUrlHref: site.href,
        visitorShieldSrc: imgUrl,
        weekNumber: match.week,
        weekDate,
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
