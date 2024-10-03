import type { APIContext } from 'astro';
import { capitalizeString } from 'src/lib/capitalize-string';
import { getWeekData } from '../../../services/get-week-data';
import { rfebmAPIGetPreviousData } from '../../../services/rfebm-api/get-previous';

const textLayout = ({
  localName,
  visitorName,
  court = 'Florida Arena',
  address = 'C/Valdés, 33012 Oviedo, Asturias',
  date = 'PENDIENTE',
  time = 'PENDIENTE',
  week = '<JORNADA>',
}: {
  localName: string;
  visitorName: string;
  court: string;
  address?: string | null;
  date?: string | null;
  time?: string | null;
  week: string | number;
}) => `Partido de balonmano disputado en el polideportivo ${court}, correspondiente a la jornada número ${week}.

${localName} - ${visitorName}
Categoría: Primera Nacional - España
Fecha: ${date}
Hora: ${time}
Lugar: ${court}
Dirección: ${address}

Ver otros partidos de la misma temporada:
https://www.youtube.com/playlist?list=PL98krSjmbnu7uiEZ2oix42p8HcPnHH3cA

#ContamosContigo #CrecemosContigo #Balonmano #Asturias #RFEBM #PrimeraNacional
---
¡Abónate y apóyanos! ¡Hazte simpatizante del club desde 20€!
🔗 http://balonmanovetusta.com/abonate

¡Síguenos en redes sociales y publica con el hashtag #SeguimosFozando !
📸 https://balonmanovetusta.com/instagram
𝕏 https://balonmanovetusta.com/x

---
Queremos agradecer a todos nuestros patrocinadores su colaboración:
 - https://www.oviedo.es
 - https://www.autocenterprincipado.com
 - https://www.almacenessilgar.com/
 - https://www.administraciones-lorca.es
 - Empresa y derecho asesores SL. Oviedo.
 - https://loscorzos.com
 - https://elpiguena.com
 - http://sidreriapichote.com
 - https://asadoselmaizal.com
 - https://foto-lab.es/
 - https://www.dominospizza.es
 - https://www.autocaresepifanio.com/
 - https://www.elgallodeoro.com/
 - Torrevarela
 - Ovicent Fisioterapia
`;

export async function GET({ params: { week } }: APIContext<{ week: string }>) {
  // Only works on localhost
  // if (!site?.hostname.includes('localhost')) {
  //   return new Response('Not allowed', { status: 401 });
  // }

  const match = await getWeekData(week);
  // console.log({ match }); // I got this point
  const previous = await rfebmAPIGetPreviousData(match?.id);
  console.log({ previous });

  if (!match || !previous) {
    // probably check previous should be enough
    return new Response('', {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  console.log('description/[week].png', { match });
  const localName = capitalizeString(match.localTeam.name, true, 'es-ES');
  const visitorName = capitalizeString(match.visitorTeam.name, true, 'es-ES');
  const weekString = match.week.toString().padStart(2, '0');

  const youtubeDescription = `Balonmano - J${weekString} - ${localName} - ${visitorName}

      
${textLayout({
  localName,
  visitorName,
  court: capitalizeString(previous.stadium.name, true, 'es-ES'),
  address: previous.stadium.address,
  date: match.date,
  time: match.time,
  week: weekString,
})}`.trim();

  return new Response(youtubeDescription, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400, stale-if-error=86400',
    },
  });
}
