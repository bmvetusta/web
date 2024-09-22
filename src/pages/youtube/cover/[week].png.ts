import { ImageResponse } from '@vercel/og';
import type { APIContext } from 'astro';
import { PRIMERA_TEAM_ID } from 'astro:env/server';
import { YoutubeCover } from '../../../components/youtube-cover/react';
import { getFontOptionsFromFontPaths } from '../../../lib/get-font-options-from-font-paths';
import { getRelativeAppRootPath } from '../../../lib/get-relative-app-root-path';
import { getWeekData } from '../../../services/get-week-data';

export const prerender = false;

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
    const imgUrl = isLocal ? match.visitorTeam.shieldUrl : match.localTeam.shieldUrl;

    const fonts = await getFontOptionsFromFontPaths(
      getRelativeAppRootPath('public', 'assets', 'fonts', 'alumni', 'AlumniSans-BoldItalic.ttf'),
      getRelativeAppRootPath('public', 'assets', 'fonts', 'alumni', 'AlumniSans-Bold.ttf')
    );

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
