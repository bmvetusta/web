function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sceneSwitcher({ scene, text }: { scene?: string; text?: string }) {
  const $info = document.querySelector('div#info') as HTMLElement;
  const $root = document.querySelector(':root') as HTMLElement;
  const player = document.querySelector('audio#audioplayer') as HTMLAudioElement | null;

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

  if (scene?.toLocaleLowerCase() === 'live' && player) {
    setTimeout(async () => {
      if (!player) return;

      while (player.volume > 0) {
        if (player.volume > 0.1) {
          player.volume -= 0.1;
        } else {
          player.volume = 0;
        }
        await sleep(200);
      }

      player.pause();
    });
  }
}
