export function getYoutubeVideoIdFromURL(url: string | URL) {
  const urlAsUrl = new URL(url);

  const videoId = urlAsUrl.searchParams.get('v');

  if (videoId) {
    return videoId;
  }

  if (urlAsUrl.pathname.startsWith('/live')) {
    return urlAsUrl.pathname.split('/').at(-1);
  }

  return null;
}
