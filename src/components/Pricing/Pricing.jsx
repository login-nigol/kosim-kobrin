/* ================================================================
   СЕКЦИЯ "ЦЕНЫ"
   Карточки вместо скучной таблицы — каждая услуга со своей иконкой,
   крупной ценой как главным акцентом. Минимальный заказ — отдельный
   выделенный баннер снизу, чтобы не терялся мелким текстом
   ================================================================ */
import { motion } from "framer-motion";
import { PRICING, MIN_ORDER_RUB } from "../../config/siteData";
import styles from "./Pricing.module.css";

function Pricing() {
    return (
        <section id="pricing" className={styles.pricing}>
            <div className={styles.inner}>
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    Цэны
                </motion.h2>

                <p className={styles.subtitle}>
                    Дакладная цана залежыць ад плошчы і складанасці ўчастка
                </p>

                {/* ===== СЕТКА КАРТОЧЕК ЦЕН ===== */}
                <div className={styles.grid}>
                    {PRICING.map((row, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <span className={styles.icon}>{row.icon}</span>
                            <p className={styles.service}>{row.service}</p>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>{row.price}</span>
                                <span className={styles.unit}>/ {row.unit}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ===== БАННЕР С МИНИМАЛЬНЫМ ЗАКАЗОМ ===== */}
                <motion.div
                    className={styles.minOrderBanner}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <span className={styles.minOrderIcon}>💬</span>
                    Мінімальны заказ — {MIN_ORDER_RUB} руб. Дакладную цану ўзгадняем перад выездам
                </motion.div>
            </div>
        </section>
    );
}

export default Pricing;