export async function isYoutubeChannelLive(channel: string): Promise<boolean | string> {
  let url = `https://www.youtube.com/channel/${channel}/live`;

  // If channel is full url
  if (channel.startsWith('http')) {
    url = channel;
  }

  if (channel.startsWith('@')) {
    url = `https://www.youtube.com/${channel}/live`;
  }

  const data = await fetch(url, {
    headers: {
      'Accept-Language': 'es;q=0.7',
    },
  })
    .then((res) => res.text())
    .catch(() => '');
  const isLive = data.includes('usuarios viéndolo ahora');

  if (isLive) {
    // Try to get the video from url if provided full url
    if (channel.includes('v=')) {
      const videoId = new URL(channel).searchParams.get('v');
      if (videoId) {
        return videoId;
      }
    }

    // Another kind of youtube url
    if (channel.includes('youtube.com/live/')) {
      const videoUrl = new URL(channel);
      const videoId = videoUrl.pathname.split('/').at(-1);

      if (videoId) {
        return videoId;
      }
    }

    const start = data.indexOf('<link rel="canonical" href="https://www.youtube.com/watch?v=');
    const end = data.indexOf('">', start);
    const videoId = data.substring(start + 60, end);

    return start > -1 && videoId.length > 0 ? videoId : true;
  }

  return isLive;
}
