/* ===== ХУК: ВИБРО-ОТКЛИК ===== */
// Мягкая вибрация на мобильных при нажатии (если поддерживается)
const VIBRATION_DURATION_MS = 15;

export function useVibration() {
  return function vibrate() {
    if (navigator.vibrate) {
      navigator.vibrate(VIBRATION_DURATION_MS);
    }
  };
}