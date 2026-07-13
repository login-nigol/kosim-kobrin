/* ===== СЕКЦИЯ "КОНТАКТЫ" ===== */
// Telegram, mailto-кнопка (открывает почтовый клиент), кнопка "Поделиться"
import { motion } from "framer-motion";
import { CONTACTS } from "../../config/siteData";
import { useShare } from "../../hooks/useShare";
import { useClickSound } from "../../hooks/useClickSound";
import { useVibration } from "../../hooks/useVibration";
import styles from "./Contacts.module.css";

function Contacts() {
    const { share, copied } = useShare();
    const playClick = useClickSound();
    const vibrate = useVibration();

    /* ===== ОБРАБОТЧИК ДЛЯ ЛЮБОЙ КНОПКИ (звук + вибро) ===== */
    const handleAction = (action) => {
        playClick();
        vibrate();
        action();
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

                    <a href={CONTACTS.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.telegramButton}
                        onClick={() => {
                            playClick();
                            vibrate();
                        }}
                    >
                        ✈️ Telegram
                    </a>


                    <a href={`mailto:${CONTACTS.email}`}
                        className={styles.emailButton}
                        onClick={() => {
                            playClick();
                            vibrate();
                        }}
                    >
                        ✉️ {CONTACTS.email}
                    </a>

                    <button
                        className={styles.shareButton}
                        onClick={() => handleAction(share)}
                    >
                        {copied ? "Спасылка скапіравана!" : "🔗 Падзяліцца"}
                    </button>
                </div>
            </div >
        </section >
    );
}

export default Contacts;