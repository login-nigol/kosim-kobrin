/* ===== ХУК: КНОПКА "ПОДЕЛИТЬСЯ" ===== */
// Использует нативное меню шаринга на мобильных (Web Share API),
// а если браузер не поддерживает — копирует ссылку в буфер обмена
import { useCallback, useState } from "react";

export function useShare() {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async () => {
    const shareData = {
      title: "КосимКобрин",
      text: "Покос травы и уход за газоном в Кобрине",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // пользователь закрыл окно шаринга — ничего не делаем
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return { share, copied };
}