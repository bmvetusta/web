export function sceneSwitcher({ scene, text }: { scene?: string; text?: string }) {
  const $info = document.querySelector('div#info') as HTMLElement;
  const $root = document.querySelector(':root') as HTMLElement;

  if (!$root) {
    return;
  }

  if (scene) {
    $root.setAttribute('data-scene', scene);
  }

  if (!$info) {
    return;
  }

  /**
     {
      "type": "TEXT_INFO", // But works with any object that has "text"
      "text": "any text..."
     }
     */
  if (text) {
    $info.textContent = text ?? '';
  }

  const textLen = $info.textContent?.length ?? 0;
  const showText = $root.getAttribute('data-scene') === 'timeout' && textLen > 0;
  $info.style.display = showText ? 'block' : 'none';
}
