/* ===== HERO-СЕКЦИЯ ===== */
// Главный экран: заголовок на белорусском, CTA-кнопка,
// летающие SVG-иконки (трава, косилка, лист) на фоне
import { motion } from "framer-motion";
import { CONTACTS } from "../../config/siteData";
import { useClickSound } from "../../hooks/useClickSound";
import { useVibration } from "../../hooks/useVibration";
import styles from "./Hero.module.css";

/* ===== НАБОР ИКОНОК ДЛЯ ФОНА (позиция/скорость/иконка) ===== */
const FLOATING_ICONS = [
  { icon: "🌿", top: "10%", left: "8%", duration: 6 },
  { icon: "🍃", top: "20%", left: "85%", duration: 8 },
  { icon: "🌱", top: "65%", left: "12%", duration: 7 },
  { icon: "🌾", top: "75%", left: "80%", duration: 5.5 },
  { icon: "🍂", top: "40%", left: "50%", duration: 9 },
  { icon: "🌿", top: "85%", left: "45%", duration: 6.5 },
];

function Hero() {
  const playClick = useClickSound();
  const vibrate = useVibration();

  const handleOrderClick = () => {
    playClick();
    vibrate();
    window.open(CONTACTS.telegram, "_blank");
  };

  return (
    <section id="top" className={styles.hero}>
      {/* ===== ЛЕТАЮЩИЕ ИКОНКИ НА ФОНЕ ===== */}
      <div className={styles.iconsLayer} aria-hidden="true">
        {FLOATING_ICONS.map((item, index) => (
          <motion.span
            key={index}
            className={styles.floatingIcon}
            style={{ top: item.top, left: item.left }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item.icon}
          </motion.span>
        ))}
      </div>

      {/* ===== ОСНОВНОЙ КОНТЕНТ HERO ===== */}
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <h1 className={styles.title}>
          Скосім траву хутка і якасна!
        </h1>
        <p className={styles.subtitle}>
          Покос травы, уход за газоном и территорией в Кобрине.
          Аккуратно, недорого, по договорённости на следующий день.
        </p>
        <button className={styles.ctaButton} onClick={handleOrderClick}>
          Замовіць у Telegram
        </button>
      </motion.div>
    </section>
  );
}

export default Hero;