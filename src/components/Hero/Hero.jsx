/* ================================================================
   HERO-СЕКЦИЯ
   Главный экран сайта: заголовок на белорусском, кнопка заказа,
   летающие SVG-иконки (трава/лист/зерно) плавающие на фоне
   ================================================================ */
import { motion } from "framer-motion";
import { CONTACTS } from "../../config/siteData";
import { primaryFeedback } from "../../utils/buttonFeedback";
import styles from "./Hero.module.css";

/* ===== НАБОР ФОНОВЫХ ИКОНОК ===== */
// top/left — позиция в процентах, duration — скорость покачивания (разная,
// чтобы иконки двигались не синхронно и не выглядели "механически")
const FLOATING_ICONS = [
  { icon: "🌿", top: "10%", left: "8%", duration: 6 },
  { icon: "🍃", top: "20%", left: "85%", duration: 8 },
  { icon: "🌱", top: "65%", left: "12%", duration: 7 },
  { icon: "🌾", top: "75%", left: "80%", duration: 5.5 },
  { icon: "🍂", top: "40%", left: "50%", duration: 9 },
  { icon: "🌿", top: "85%", left: "45%", duration: 6.5 },
];

function Hero() {
  /* ===== КЛИК ПО КНОПКЕ ЗАКАЗА ===== */
  // Основное действие сайта — используем "тяжёлый" primaryFeedback
  const handleOrderClick = () => {
    primaryFeedback();
    window.open(CONTACTS.telegram, "_blank");
  };

  return (
    <section id="top" className={styles.hero}>
      {/* ===== СЛОЙ С ЛЕТАЮЩИМИ ИКОНКАМИ (декоративный, не мешает кликам) ===== */}
      <div className={styles.iconsLayer} aria-hidden="true">
        {FLOATING_ICONS.map((item, index) => (
          <motion.span
            key={index}
            className={styles.floatingIcon}
            style={{ top: item.top, left: item.left }}
            animate={{
              y: [0, -20, 0],       // лёгкое покачивание вверх-вниз
              rotate: [0, 10, -10, 0], // и покачивание по кругу
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

      {/* ===== ОСНОВНОЙ КОНТЕНТ: заголовок, подзаголовок, кнопка ===== */}
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        {/* Главный заголовок — на белорусском, как договаривались
            для самых важных элементов страницы */}
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