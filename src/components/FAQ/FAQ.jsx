/* ===== СЕКЦИЯ "ЧАСТЫЕ ВОПРОСЫ" ===== */
// Аккордеон — вопрос виден всегда, ответ раскрывается по клику
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ } from "../../config/siteData";
import { useClickSound } from "../../hooks/useClickSound";
import { useVibration } from "../../hooks/useVibration";
import styles from "./FAQ.module.css";

function FAQSection() {
    const [openIndex, setOpenIndex] = useState(null);
    const playClick = useClickSound();
    const vibrate = useVibration();

    /* ===== ПЕРЕКЛЮЧЕНИЕ ОТКРЫТОГО ВОПРОСА ===== */
    const toggleQuestion = (index) => {
        playClick();
        vibrate();
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className={styles.faq}>
            <div className={styles.inner}>
                <motion.h2
                    className={styles.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    Частыя пытанні
                </motion.h2>

                {/* ===== СПИСОК ВОПРОСОВ-ОТВЕТОВ ===== */}
                <div className={styles.list}>
                    {FAQ.map((item, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div key={index} className={styles.item}>
                                <button
                                    className={styles.question}
                                    onClick={() => toggleQuestion(index)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{item.question}</span>
                                    <motion.span
                                        className={styles.icon}
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        +
                                    </motion.span>
                                </button>

                                {/* ===== АНИМИРОВАННОЕ РАСКРЫТИЕ ОТВЕТА ===== */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            className={styles.answerWrapper}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                        >
                                            <p className={styles.answer}>{item.answer}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default FAQSection;