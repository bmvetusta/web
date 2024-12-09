export function titleGraphics({
  time = 8_000,
  showBannerTime = 1_000,
  title = '',
  subtitle = '',
  description = '',
}: {
  title?: string;
  subtitle?: string;
  description?: string;
  time?: number;
  showBannerTime?: number;
} = {}) {
  // Title Graphics
  const $title = document.querySelector('div#title') as HTMLDivElement;
  const $titleTitle = $title?.querySelector('article:first-child main p') as HTMLParagraphElement;
  const $titleTitleDesc = $title?.querySelector(
    'article:first-child header p'
  ) as HTMLParagraphElement;
  const $titleDescription = $title?.querySelector(
    'article:last-child main p'
  ) as HTMLParagraphElement;
  const $bannerImage = document.getElementById('banner');

  if (
    (!title && !description) ||
    !$title ||
    !$titleDescription ||
    !$titleTitle ||
    !$titleTitleDesc
  ) {
    return;
  }

  const display = $bannerImage?.style.display ?? 'none';
  const isAdvertisingVisible = display !== 'none';
  $title.style.gap = '10px';

  $titleTitle.textContent = title ?? '';
  $titleTitleDesc.textContent = subtitle;
  $titleDescription.textContent = description;

  if (title) {
    $titleTitle.style.display = 'block';
  }

  if (!title) {
    $titleTitle.style.display = 'none';
  }

  if (subtitle) {
    $titleTitleDesc.style.display = 'block';
  }

  if (!subtitle) {
    $titleTitleDesc.style.display = 'none';
  }

  if (description) {
    $titleDescription.style.display = 'block';
  }

  if (!description) {
    $titleDescription.style.display = 'none';
    $title.style.gap = '0';
  }

  if ($bannerImage && isAdvertisingVisible) {
    $bannerImage.style.display = 'none';
  }

  $title.classList.add('view');

  setTimeout(() => {
    if ($bannerImage) {
      setTimeout(() => ($bannerImage.style.display = display), showBannerTime);
    }
    $title.classList.remove('view');
  }, time);
}
