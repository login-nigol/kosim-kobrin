/* ===== РАЗДЕЛИТЕЛЬ МЕЖДУ СЕКЦИЯМИ ===== */
// Анимированная полоса травы — травинки покачиваются волнообразно
import { motion } from "framer-motion";
import styles from "./GrassDivider.module.css";

const BLADE_COUNT = 24; // количество травинок в полосе

function GrassDivider() {
    return (
        <div className={styles.divider} aria-hidden="true">
            {Array.from({ length: BLADE_COUNT }).map((_, index) => (
                <motion.span
                    key={index}
                    className={styles.blade}
                    animate={{ rotate: [-6, 6, -6] }}
                    transition={{
                        duration: 2.5 + (index % 4) * 0.4, // разная скорость — не синхронно
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: (index % 5) * 0.2,
                    }}
                >
                    🌾
                </motion.span>
            ))}
        </div>
    );
}

export default GrassDivider;