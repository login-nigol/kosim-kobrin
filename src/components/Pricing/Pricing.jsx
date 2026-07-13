/* ===== СЕКЦИЯ "ЦЕНЫ" ===== */
// Таблица цен + минимальный заказ, всё из единого источника данных
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

                {/* ===== ТАБЛИЦА ЦЕН ===== */}
                <motion.div
                    className={styles.tableWrapper}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                >
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Услуга</th>
                                <th>Единица</th>
                                <th>Цена</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PRICING.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.service}</td>
                                    <td>{row.unit}</td>
                                    <td className={styles.priceCell}>{row.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                <p className={styles.note}>
                    Минимальный заказ — {MIN_ORDER_RUB} руб. Точная цена зависит от
                    площади и сложности участка — уточняем перед выездом.
                </p>
            </div>
        </section>
    );
}

export default Pricing;