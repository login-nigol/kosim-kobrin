/* ===== ШАПКА САЙТА ===== */
// Лого, навигация по секциям, кнопка "Поделиться", мобильное бургер-меню
import { useState } from "react";
import { motion } from "framer-motion";
import { useShare } from "../../hooks/useShare";
import { useClickSound } from "../../hooks/useClickSound";
import { useVibration } from "../../hooks/useVibration";
import styles from "./Header.module.css";

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
    const playClick = useClickSound();
    const vibrate = useVibration();

    /* ===== ОБРАБОТЧИК КЛИКА ПО КНОПКЕ (звук + вибро) ===== */
    const handleAction = (action) => {
        playClick();
        vibrate();
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

                <a href="#top"
                    className={styles.logo}
                >
                    🌱 КосимКобрин
                </a>

                {/* ===== НАВИГАЦИЯ (десктоп) ===== */}
                <nav className={styles.navDesktop}>
                    {NAV_LINKS.map((link) => (

                        <a key={link.id}
                            href={`#${link.id}`}
                            className={styles.navLink}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* ===== КНОПКИ СПРАВА ===== */}
                <div className={styles.actions}>
                    <button
                        className={styles.shareButton}
                        onClick={() => handleAction(share)}
                        aria-label="Поделиться сайтом"
                    >
                        🔗 Падзяліцца
                    </button>

                    {/* ===== БУРГЕР-КНОПКА (мобилка) ===== */}
                    <button
                        className={styles.burger}
                        onClick={() => handleAction(() => setIsMenuOpen(true))}
                        aria-label="Открыть меню"
                    >
                        ☰
                    </button>
                </div>
            </div>

            {/* ===== МОБИЛЬНОЕ МЕНЮ НА ВЕСЬ ЭКРАН ===== */}
            {isMenuOpen && (
                <motion.div
                    className={styles.mobileMenu}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <button
                        className={styles.closeButton}
                        onClick={() => handleAction(() => setIsMenuOpen(false))}
                        aria-label="Закрыть меню"
                    >
                        ✕
                    </button>

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
            )}
        </motion.header>
    );
}

export default Header;