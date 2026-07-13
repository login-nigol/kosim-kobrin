/* ================================================================
   КНОПКА ВКЛ/ВЫКЛ ЗВУКА
   Переключает состояние мьюта, хранит его в localStorage
   через buttonFeedback.js, чтобы настройка не сбрасывалась при заходе
   ================================================================ */
import { useState } from "react";
import { isMuted, setMuted, secondaryFeedback } from "../../utils/buttonFeedback";
import styles from "./MuteButton.module.css";

function MuteButton() {
    /* ===== ЛОКАЛЬНОЕ СОСТОЯНИЕ ДЛЯ ПЕРЕРИСОВКИ ИКОНКИ ===== */
    // localStorage сам по себе не триггерит ре-рендер компонента,
    // поэтому дублируем значение в useState
    const [muted, setMutedState] = useState(isMuted());

    /* ===== ПЕРЕКЛЮЧЕНИЕ ЗВУКА ===== */
    const toggleMute = () => {
        const nextValue = !muted;

        setMuted(nextValue);       // сохраняем в localStorage
        setMutedState(nextValue);  // обновляем локальный стейт для иконки

        // Проигрываем звук-подтверждение только когда ВКЛЮЧАЕМ звук обратно —
        // если выключаем, звук проигрывать бессмысленно (his только что попросил тишину)
        if (!nextValue) {
            secondaryFeedback();
        }
    };

    return (
        <button
            className={styles.muteButton}
            onClick={toggleMute}
            aria-label={muted ? "Уключыць гук" : "Выключыць гук"}
        >
            {muted ? "🔇" : "🔊"}
        </button>
    );
}

export default MuteButton;