/* ================================================================
   ШАПКА САЙТА
   Лого, навигация по секциям, кнопка мьюта, кнопка "Поделиться",
   мобильное бургер-меню на весь экран
   ================================================================ */
import { useState } from "react";
import { motion } from "framer-motion";
import { useShare } from "../../hooks/useShare";
import { secondaryFeedback } from "../../utils/buttonFeedback";
import MuteButton from "../MuteButton/MuteButton";
import styles from "./Header.module.css";

/* ===== ССЫЛКИ НАВИГАЦИИ (id секции + подпись на белорусском) ===== */
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

    /* ===== ОБЁРТКА ДЕЙСТВИЯ: сначала звук+вибро, потом сама логика ===== */
    // Используется для всех второстепенных кликов в шапке
    // (открыть/закрыть меню, поделиться)
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
                {/* ===== ЛОГОТИП (ведёт наверх страницы) ===== */}
                <a href="#top" className={styles.logo}>
                    🌱 КосимКобрин
                </a>

                {/* ===== НАВИГАЦИЯ — видна только на планшете/десктопе ===== */}
                <nav className={styles.navDesktop}>
                    {NAV_LINKS.map((link) => (
                        <a key={link.id} href={`#${link.id}`} className={styles.navLink}>
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* ===== БЛОК КНОПОК СПРАВА ===== */}
                <div className={styles.actions}>
                    {/* Переключатель звука — стоит первым, чтобы легко нашли */}
                    <MuteButton />

                    {/* Кнопка "Поделиться" — видна только на планшете/десктопе,
              на мобилке она дублируется внутри бургер-меню отдельно не нужна,
              потому что там уже видно всё меню */}
                    <button
                        className={styles.shareButton}
                        onClick={() => handleAction(share)}
                        aria-label="Поделиться сайтом"
                    >
                        🔗 Падзяліцца
                    </button>

                    {/* Бургер-кнопка — видна только на мобилке */}
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
                    {/* Кнопка закрытия — в углу, крупная, легко попасть пальцем */}
                    <button
                        className={styles.closeButton}
                        onClick={() => handleAction(() => setIsMenuOpen(false))}
                        aria-label="Закрыть меню"
                    >
                        ✕
                    </button>

                    {/* При клике на ссылку меню сразу закрывается —
              не нужно тыкать в крестик после перехода */}
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