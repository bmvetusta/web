// Weights: 900, 700, 600

export function YoutubeCover({
  baseUrlHref,
  weekNumber,
  weekDate,
  time,
  visitorShieldSrc,
}: {
  baseUrlHref: string;
  weekNumber: number | string;
  weekDate?: string | null;
  time?: string | null;
  visitorShieldSrc: string;
}) {
  if (!visitorShieldSrc) {
    throw new Error('You need to define a visitorShieldSrc and must be a valid Image URL');
  }

  const bgImageUrl = new URL(baseUrlHref);
  bgImageUrl.pathname = '/assets/images/base-bg.png';

  return (
    <div
      id='cover'
      style={{
        display: 'flex',
        backgroundImage: `url("${bgImageUrl.href}")`,
        width: 1280,
        height: 720,
        fontFamily: 'Alumni Sans, sans-serif',
        fontStyle: 'italic',
        fontWeight: 700,
      }}
    >
      <div
        data-name='week'
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          top: 180,
          left: 640,
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: '100%',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 62,
            fontWeight: 700,
          }}
        >
          Jornada {weekNumber?.toString().padStart(2, '0')}
        </span>
      </div>

      {weekDate ? (
        <div
          data-name='date-time'
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0,
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
            top: 300,
            left: 640,
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: '100%',
            fontSize: 52,
            fontWeight: 700,
            color: 'white',
          }}
        >
          <span>{weekDate}</span>
          {time ? <span>{time}</span> : ''}
        </div>
      ) : (
        ''
      )}

      <img
        src={visitorShieldSrc}
        alt='Visitor'
        style={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          top: 380,
          left: 1035,
          objectFit: 'contain',
          height: 300,
          maxWidth: 300,
          maxHeight: 300,
          borderRadius: '50%',
        }}
      />
    </div>
  );
}
