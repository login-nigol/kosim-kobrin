/* ===== СЕКЦИЯ "УСЛУГИ" ===== */
// Карточки услуг из единого источника данных (siteData.js)
import { motion } from "framer-motion";
import { SERVICES } from "../../config/siteData";
import styles from "./Services.module.css";

function Services() {
  return (
    <section id="services" className={styles.services}>
      <div className={styles.inner}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Паслугі
        </motion.h2>

        {/* ===== СЕТКА КАРТОЧЕК УСЛУГ ===== */}
        <div className={styles.grid}>
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              className={styles.card}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className={styles.cardTitle}>{service.titleBy}</h3>
              <p className={styles.cardText}>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;