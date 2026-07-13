/* ================================================================
   АНИМИРОВАННЫЕ ШЕСТЕРЁНКИ
   Декоративный элемент для дропдаун-меню — большая шестерня крутится
   по часовой, маленькая (пересекающаяся с ней) — против часовой,
   имитируя работающий механизм
   ================================================================ */
import styles from "./GearsIcon.module.css";

/* ===== ОДНА ШЕСТЕРНЯ КАК ПЕРЕИСПОЛЬЗУЕМЫЙ SVG-ЭЛЕМЕНТ ===== */
function GearShape({ className }) {
    return (
        <svg viewBox="0 0 100 100" className={className}>
            <path
                d="M50 6 L58 6 L61 18 L71 21 L81 13 L87 19 L79 29 L82 39 L94 42 L94 50 L82 53 L79 63 L87 73 L81 79 L71 71 L61 74 L58 86 L50 86 L47 74 L37 71 L27 79 L21 73 L29 63 L26 53 L14 50 L14 42 L26 39 L29 29 L21 19 L27 13 L37 21 L47 18 Z"
                fill="#4a5568"
            />
            <circle cx="50" cy="46" r="24" fill="none" stroke="#6cbfae" strokeWidth="4" />
            <circle cx="50" cy="46" r="17" fill="#ffffff" />
        </svg>
    );
}

function GearsIcon() {
    return (
        <div className={styles.wrapper} aria-hidden="true">
            <GearShape className={styles.gearBig} />
            <GearShape className={styles.gearSmall} />
        </div>
    );
}

export default GearsIcon;