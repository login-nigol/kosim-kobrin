/* ===== СЕКЦИЯ "О СЕРВИСЕ" ===== */
// Коротко рассказываем кто мы и почему нам можно доверять
import { motion } from "framer-motion";
import styles from "./About.module.css";

const TRUST_POINTS = [
  { icon: "⚡", text: "Приезжаем быстро — обычно на следующий день после заявки" },
  { icon: "🛠️", text: "Работаем профессиональным инструментом" },
  { icon: "💬", text: "Договариваемся о цене заранее, без сюрпризов" },
];

function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.inner}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Пра сэрвіс
        </motion.h2>

        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          Мы занимаемся покосом травы и уходом за участками в Кобрине и
          окрестностях. Молодая команда, которая ценит своё время и время
          заказчика — приезжаем, косим аккуратно, убираем за собой.
        </motion.p>

        {/* ===== БЛОКИ ДОВЕРИЯ ===== */}
        <div className={styles.trustGrid}>
          {TRUST_POINTS.map((point, index) => (
            <motion.div
              key={index}
              className={styles.trustCard}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <span className={styles.trustIcon}>{point.icon}</span>
              <p className={styles.trustText}>{point.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;