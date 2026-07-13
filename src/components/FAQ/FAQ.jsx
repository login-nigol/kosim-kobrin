/* ================================================================
   СЕКЦИЯ "ЧАСТЫЕ ВОПРОСЫ"
   Аккордеон — вопрос виден всегда, ответ раскрывается по клику
   ================================================================ */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ } from "../../config/siteData";
import { secondaryFeedback } from "../../utils/buttonFeedback";
import styles from "./FAQ.module.css";

function FAQSection() {
    /* ===== ИНДЕКС ОТКРЫТОГО ВОПРОСА ===== */
    // null — все вопросы закрыты, число — индекс открытого
    const [openIndex, setOpenIndex] = useState(null);

    /* ===== ПЕРЕКЛЮЧЕНИЕ ОТКРЫТОГО ВОПРОСА ===== */
    // Клик по уже открытому вопросу — закрывает его (переключатель)
    const toggleQuestion = (index) => {
        secondaryFeedback();
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

                {/* ===== СПИСОК ВОПРОСОВ-ОТВЕТОВ ИЗ siteData.js ===== */}
                <div className={styles.list}>
                    {FAQ.map((item, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div key={index} className={styles.item}>
                                {/* Кнопка-вопрос — кликабельна целиком, не только иконка */}
                                <button
                                    className={styles.question}
                                    onClick={() => toggleQuestion(index)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{item.question}</span>

                                    {/* Плюсик поворачивается на 45° и превращается в крестик */}
                                    <motion.span
                                        className={styles.icon}
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        +
                                    </motion.span>
                                </button>

                                {/* ===== ОТВЕТ — плавно раскрывается/схлопывается по высоте ===== */}
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