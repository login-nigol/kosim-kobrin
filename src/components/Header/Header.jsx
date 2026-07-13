/* ================================================================
   ШАПКА САЙТА
   Лого, навигация (десктоп), кнопка "Поделиться", бургер-дропдаун
   (мобилка) — выпадает под шапкой на всю ширину, закрывается кликом
   вне через невидимый оверлей (правило проекта — не через document
   addEventListener, клик иначе проваливается на элемент под меню)
   ================================================================ */
import { useState } from "react";
import { motion } from "framer-motion";
import { useShare } from "../../hooks/useShare";
import { secondaryFeedback } from "../../utils/buttonFeedback";
import MuteButton from "../MuteButton/MuteButton";
import ShareIcon from "../../assets/icons/ShareIcon";
import GearsIcon from "../GearsIcon/GearsIcon";
import styles from "./Header.module.css";

/* ===== ССЫЛКИ НАВИГАЦИИ ===== */
const NAV_LINKS = [
    { id: "about", label: "Пра нас" },
    { id: "services", label: "Паслугі" },
    { id: "portfolio", label: "Работы" },
    { id: "pricing", label: "Цэны" },
    { id: "contacts", label: "Кантакты" },
];

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { share } = useShare();

    /* ===== ОБЁРТКА ДЕЙСТВИЯ: звук+вибро перед самим действием ===== */
    const handleAction = (action) => {
        secondaryFeedback();
        action();
    };

    return (
        <motion.header
            className={styles.header}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <div className={styles.inner}>
                {/* ===== ЛОГОТИП ===== */}
                <a href="#top" className={styles.logo}>
                    🌱 КосимКобрин
                </a>

                {/* ===== НАВИГАЦИЯ — только десктоп/планшет ===== */}
                <nav className={styles.navDesktop}>
                    {NAV_LINKS.map((link) => (
                        <a key={link.id} href={`#${link.id}`} className={styles.navLink}>
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* ===== БЛОК КНОПОК СПРАВА ===== */}
                <div className={styles.actions}>
                    {/* Кнопка "Поделиться" — теперь тут, вместо мьюта.
              Фон — тот же зелёный оттенок, что используется в тенях секций */}
                    <button
                        className={styles.shareButton}
                        onClick={() => handleAction(share)}
                        aria-label="Поделиться сайтом"
                    >
                        <ShareIcon size={18} />
                    </button>

                    {/* Бургер-кнопка — открывает дропдаун-меню */}
                    <button
                        className={styles.burger}
                        onClick={() => handleAction(() => setIsMenuOpen(true))}
                        aria-label="Открыть меню"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* ===== ДРОПДАУН-МЕНЮ (только когда открыто) ===== */}
            {isMenuOpen && (
                <>
                    {/* Невидимый оверлей — перехватывает клик вне меню и закрывает его.
              z-index на единицу меньше самого меню, чтобы не перекрывать его */}
                    <div
                        className={styles.overlay}
                        onClick={() => handleAction(() => setIsMenuOpen(false))}
                    />

                    <motion.div
                        className={styles.dropdownMenu}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        // Останавливаем всплытие — клик внутри меню не должен
                        // добираться до оверлея и закрывать меню
                        onClick={(e) => e.stopPropagation()}
                    >

                        <GearsIcon />

                        {/* Мьют — теперь первым пунктом меню */}
                        <div className={styles.menuMuteRow}>
                            <span className={styles.menuMuteLabel}>Гук</span>
                            <MuteButton />
                        </div>

                        {NAV_LINKS.map((link) => (

                            <a key={link.id}
                                href={`#${link.id}`}
                                className={styles.mobileNavLink}
                                onClick={() => handleAction(() => setIsMenuOpen(false))}
                            >
                                {link.label}
                            </a>
                        ))}
                    </motion.div>
                </>
            )
            }
        </motion.header >
    );
}

export default Header;