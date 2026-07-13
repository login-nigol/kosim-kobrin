/* ================================================================
   ЗВУК + ВИБРО ДЛЯ КНОПОК (buttonFeedback)
   Звук синтезируется через Web Audio API — никаких mp3-файлов,
   тон генерируется прямо в коде. Вибрация — через navigator.vibrate().
   ================================================================ */

/* ===== КЛЮЧ ДЛЯ ХРАНЕНИЯ СОСТОЯНИЯ МЬЮТА ===== */
const MUTE_STORAGE_KEY = "kosim_kobrin_sound_muted";

/* ===== ПРОВЕРКА: ВЫКЛЮЧЕН ЛИ ЗВУК ===== */
// Читаем состояние из localStorage — сохраняется между визитами
export function isMuted() {
  return localStorage.getItem(MUTE_STORAGE_KEY) === "true";
}

/* ===== УСТАНОВКА СОСТОЯНИЯ МЬЮТА ===== */
// Вызывается из кнопки MuteButton при переключении
export function setMuted(value) {
  localStorage.setItem(MUTE_STORAGE_KEY, String(value));
}

/* ===== ВИБРАЦИЯ ===== */
// pattern — либо число (мс), либо массив чисел (паттерн вибро/пауза)
// Молча выходим если звук выключен или браузер не поддерживает вибро
function vibrate(pattern) {
  if (isMuted()) return;
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

/* ===== АУДИО-КОНТЕКСТ (создаём один раз на всё приложение) ===== */
// Браузеры разрешают создавать AudioContext только один экземпляр
// на страницу без лишних предупреждений — переиспользуем его
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

/* ===== ГЕНЕРАЦИЯ ОДНОГО ТОНА ===== */
// frequency  — частота звука в герцах (выше = "тоньше" звук)
// durationMs — сколько длится звук
// volume     — громкость от 0 до 1 (держим тихо, это UI-звук, не музыка)
function playTone(frequency, durationMs, volume = 0.15) {
  if (isMuted()) return;

  const context = getAudioContext();

  // Осциллятор — генератор самой звуковой волны
  const oscillator = context.createOscillator();
  // Gain-узел — управляет громкостью и плавным затуханием
  const gainNode = context.createGain();

  oscillator.type = "sine";                 // чистый, мягкий тон без "зубцов"
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;

  // Соединяем цепочку: осциллятор → громкость → выход (динамики)
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();

  // Плавное затухание к почти нулю — без этого в конце слышен резкий щелчок
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    context.currentTime + durationMs / 1000
  );
  oscillator.stop(context.currentTime + durationMs / 1000);
}

/* ================================================================
   ПРЕСЕТЫ ОБРАТНОЙ СВЯЗИ
   Каждый пресет — фиксированная комбинация вибро + тон под тип кнопки
   ================================================================ */

/* ===== ОСНОВНЫЕ КНОПКИ ===== */
// Заказать в Telegram, написать на почту — самые важные действия на сайте
export function primaryFeedback() {
  vibrate(60);
  playTone(880, 120);
}

/* ===== ВТОРИЧНЫЕ КНОПКИ ===== */
// Навигация, "Поделиться", раскрытие FAQ — менее значимые действия,
// поэтому звук и вибро короче и тише
export function secondaryFeedback() {
  vibrate(30);
  playTone(660, 80, 0.1);
}