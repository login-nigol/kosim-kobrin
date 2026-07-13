/* ===== ХУК: ЗВУК КЛИКА ===== */
// Возвращает функцию playClick, которую вешаем на onClick кнопок
import { useCallback, useRef } from "react";

export function useClickSound(src = "/sounds/click.mp3") {
  const audioRef = useRef(null);

  const playClick = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(src);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // игнорируем, если браузер заблокировал автозапуск звука
    });
  }, [src]);

  return playClick;
}