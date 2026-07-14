/* ================================================================
   СЕКЦИЯ "КОНТАКТЫ"
   Telegram (синяя кнопка), телефон (кнопка другого цвета),
   "Поделиться" (золотая) — все три с постоянной мерцающей анимацией,
   иконки и текст внутри белые
   ================================================================ */
import { motion } from "framer-motion";
import { CONTACTS } from "../../config/siteData";
import { useShare } from "../../hooks/useShare";
import { primaryFeedback, secondaryFeedback } from "../../utils/buttonFeedback";
import ShareIcon from "../../assets/icons/ShareIcon";
import TelegramIcon from "../../assets/icons/TelegramIcon";
import PhoneIcon from "../../assets/icons/PhoneIcon";
import styles from "./Contacts.module.css";

function Contacts() {
    const { share, copied } = useShare();

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

                <div className={styles.buttonsGrid}>

                    <a href={CONTACTS.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.telegramButton}
                        onClick={primaryFeedback}
                    >
                        <TelegramIcon size={18} />
                        Telegram
                    </a>


                    <a href={`tel:${CONTACTS.phone}`}
                        className={styles.phoneButton}
                        onClick={primaryFeedback}
                    >
                        <PhoneIcon size={18} />
                        {CONTACTS.phone}
                    </a>

                    <button className={styles.shareButton} onClick={handleShareClick}>
                        <ShareIcon size={18} />
                        {copied ? "Спасылка скапіравана!" : "Падзяліцца"}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Contacts;