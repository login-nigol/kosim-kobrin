/* ================================================================
   СЕКЦИЯ "КОНТАКТЫ"
   Telegram, mailto-кнопка (открывает почтовый клиент пользователя),
   кнопка "Поделиться" сайтом
   ================================================================ */
import { motion } from "framer-motion";
import { CONTACTS } from "../../config/siteData";
import { useShare } from "../../hooks/useShare";
import { primaryFeedback, secondaryFeedback } from "../../utils/buttonFeedback";
import styles from "./Contacts.module.css";

function Contacts() {
    const { share, copied } = useShare();

    /* ===== КЛИК ПО КНОПКЕ "ПОДЕЛИТЬСЯ" ===== */
    // Второстепенное действие — используем secondaryFeedback
    const handleShareClick = () => {
        secondaryFeedback();
        share();
    };

    return (
        <section id="contacts" className={styles.contacts}>
            <div className={styles.inner}>
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    Кантакты
                </motion.h2>

                <p className={styles.subtitle}>
                    Пишите в Telegram — отвечаем быстро и договариваемся об удобном времени
                </p>

                {/* ===== КНОПКИ КОНТАКТОВ ===== */}
                <div className={styles.buttonsGrid}>
                    {/* Основной канал связи — тяжёлый фидбек, это ключевое действие */}

                    <a href={CONTACTS.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.telegramButton}
                        onClick={primaryFeedback}
                    >
                        ✈️ Telegram
                    </a>

                    {/* mailto: открывает дефолтный почтовый клиент пользователя
              с уже подставленным получателем — тоже основное действие */}

                    <a href={`mailto:${CONTACTS.email}`}
                        className={styles.emailButton}
                        onClick={primaryFeedback}
                    >
                        ✉️ {CONTACTS.email}
                    </a>

                    {/* "Поделиться" — второстепенное действие, лёгкий фидбек */}
                    <button className={styles.shareButton} onClick={handleShareClick}>
                        {copied ? "Спасылка скапіравана!" : "🔗 Падзяліцца"}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Contacts;