/* ===== СЕКЦИЯ "ПРИМЕРЫ РАБОТ" ===== */
// Пока заглушки вместо реальных фото — заменим когда парень скинет примеры
import { motion } from "framer-motion";
import styles from "./Portfolio.module.css";

/* ===== ЗАГЛУШКИ РАБОТ (замена на реальные фото/видео позже) ===== */
const PORTFOLIO_ITEMS = [
  { id: 1, label: "Дачны ўчастак", emoji: "🌾" },
  { id: 2, label: "Прыдамавая тэрыторыя", emoji: "🌿" },
  { id: 3, label: "Ускоснуты бур'ян", emoji: "🌱" },
  { id: 4, label: "Газон пасля стрыжкі", emoji: "🍃" },
];

function Portfolio() {
  return (
    <section id="portfolio" className={styles.portfolio}>
      <div className={styles.inner}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Прыклады работ
        </motion.h2>

        <p className={styles.note}>
          Фото и видео появятся здесь совсем скоро — первые заказы уже в работе
        </p>

        {/* ===== СЕТКА ЗАГЛУШЕК ===== */}
        <div className={styles.grid}>
          {PORTFOLIO_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              className={styles.card}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className={styles.emoji}>{item.emoji}</span>
              <span className={styles.label}>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Portfolio;