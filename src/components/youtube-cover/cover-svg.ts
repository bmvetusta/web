export function youtubeCoverSvgString({
  visitorShieldSrc,
  week,
  date,
  time,
}: {
  visitorShieldSrc: string;
  week: string | number;
  date?: string;
  time?: string;
}) {
  return `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g fill="none" fill-rule="evenodd">
    <path fill="#000" d="M0 0h1280v720H0z"/>
    <path fill-opacity=".5" fill="#E4C64C" d="M502 0h535L502 768H-34z"/>
    <path fill-opacity=".8" fill="#FFDD52" d="M1037 0h535l-535 768H501z"/>
    <path fill-opacity=".3" fill="#000" d="M0 0h1280v127H0z"/>
    <text font-family="Alumni Sans ExtraBold Italic, Alumni Sans" font-size="132" font-style="italic" fill="#FFF" transform="translate(0 -16)">
                <tspan x="201" y="119">TEMPORADA 2024/25</tspan>
            </text>
    <g fill="#FCEB00" fill-rule="nonzero">
      <path d="M79 348 68 458H48L37 348h17l4 74 5-74h16m38 42v15h-11v39h11v14H88V348h29v14h-11v28h11m34-28v96h-18v-96h-9v-14h35v14h-8m57-14-1 100-2 5-4 4-7 1h-17l-5-2c-2-2-3-3-3-5l-2-6v-97h18v95l2 1h1l1-1h1v-95h18m40 0c4 1 7 3 8 7l1 7v24h-17v-19l-1-3v-1l-1-1h-2l-1 1-1 2v21l2 3 2 2 11 6c5 4 8 8 8 13v27l-1 11-1 5-5 4-6 1h-17l-6-2-3-5-1-7v-32h17v27l1 3v1l2 1h2v-1l1-2v-28l-2-2-2-2-11-7c-6-3-8-8-8-15v-29l2-5c2-2 3-4 5-4l7-1h17m45 14v96h-18v-96h-9v-14h35v14h-8m33 7h-1l-3 50h6l-2-50Zm4 88-1-23h-7l-2 23h-17l10-109h24l11 109h-18Zm-78 110 21-24 41-32c-15 24-36 44-62 56ZM80 523l18-3 51 28 21 29h-1l-1 1a140 140 0 0 1-88-55Zm175 29-17 20-62 1-20-28 38-35 54-3 18 33-11 12Zm81-88c-2 0-4 1-4 3a155 155 0 0 1-14 37h-1l2-36c0-2-2-4-4-4s-4 2-4 4l-1 36-38 30-18-32 17-33c0-1 0-4-2-5h-2l-3 2-16 33-53 3-23-36c-1-2-4-3-5-1-2 1-2 3-1 5l22 35-38 35-47-26 4-46c0-2-2-4-4-4s-3 1-4 3l-3 46-22 3c-10-15-17-31-21-49 0-2-2-3-4-3-2 1-3 3-3 5 5 19 13 37 24 53v1a152 152 0 0 0 99 63l23 2c17 0 33-3 49-8 34-12 63-37 81-69a161 161 0 0 0 17-42c0-2-1-4-3-5Zm-29-129-7-4-16-21-2-1-9-5v-7c0-1-1-3-3-3-1-1-3 0-4 1l-2 4-22-112c0-2-1-3-3-3h-2l-3-8-3-2h-2l-14-39-3-2c-2 0-3 1-4 3l-9 35h-3l-2 3-12 100-50 3c-2 0-4 2-4 4l-1 23-4-4-2-2-3 1-6 7h-8l-2 1c-9 9-18 18-26 29a4 4 0 0 0 1 5c2 1 4 1 5-1 7-9 15-18 24-26l8-1 2-1 4-5 3 4 3 2h3l3-1 1-2 2-25 51-3c2 0 3-2 3-4v-2l11-93h1c1 0 3-1 3-3l8-31 13 36 4 2h1l3 6a4 4 0 0 0 3 2l22 113c0 2 1 3 3 3 1 1 3 0 3-1l2-2 2 2 11 6 16 21h1l8 5h2l3-2c1-2 0-4-2-5"/>
      <path d="M123 330h-2v9h1l1-1v-8Zm0-10v-1h-2v7h2v-6Zm5-3 1 1 1 3v3c0 2-1 3-3 4h1l1 2 1 2v6l-1 2-1 1-2 1h-11v-26h11l2 1Zm13 4-1 12h2l-1-12Zm2 21-1-6h-2l-1 6h-6l4-26h8l4 26h-6Zm18-3v3h-10v-26h6v23h4m12-19h-1v-1h-1v19l1 1v-1l1-18Zm5-3 1 4v18l-1 1c0 1-1 2-3 2h-8l-1-1-1-1v-22l3-2h8l2 1Zm18-1v26h-6l-3-13v13h-6v-26h6l3 13v-13h6m22 0v26h-5v-15l-2 15h-4l-2-15v15h-6v-26h8l2 12 2-12h7m12 5-1 12h2l-1-12Zm2 21-1-6h-3v6h-6l4-26h8l4 26h-6Zm24-26v26h-6l-3-13v13h-6v-26h6l3 13v-13h6m10 4v-1h-1v1l-1 18h1v1l1-1v-18Zm5-3 1 4v19l-3 2h-8l-2-1v-1l-1-21 1-1c0-1 1-2 3-2h7l2 1Z"/>
    </g>
    <text font-family="Alumni Sans Black" font-size="84" font-style="italic" fill="#FFF">
            <tspan x="487.5" y="208">JORNADA ${week.toString().padStart(2, '0')}</tspan>
        </text>
    ${
      time || date
        ? `    <text font-family="Alumni Sans Bold" font-size="48" font-style="italic" fill="#FFF">
            ${date ? `<tspan x="552.1" y="484">${date}</tspan>` : ''}
            ${time ? `<tspan x="599.9" y="541">${time}</tspan>` : ''}
        </text>`
        : ''
    }
    <text font-family="Alumni Sans Bold" font-size="128" font-style="italic" fill="#FFF">
            <tspan x="589" y="398">VS</tspan>
        </text>
    <image x="843" y="233" width="350" height="350" xlink:href="${visitorShieldSrc}" />
    <path fill-opacity=".3" fill="#FFF" d="M81 605h534l-80 115H0z"/>
    <path fill="#E4C64C" d="M160 605h85l-85 115H74z"/>
    <path fill="#000" d="M277 605h85l-85 115h-86z"/>
    <path fill="#FFF" d="M393 605h85l-85 115h-86z"/>
    <g fill="#4D4949" font-family="Alumni Sans Medium" font-size="42">
      <text transform="translate(757 611)">
                <tspan x=".4" y="38">#ContamosContigo</tspan>
            </text>
      <text transform="translate(757 611)">
                <tspan x=".6" y="88.4">#CrecemosContigo</tspan>
            </text>
    </g>
  </g>
</svg>`;
}
