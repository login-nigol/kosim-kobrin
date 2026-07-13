/* ================================================================
   ЭМБЛЕМА, СОБИРАЮЩАЯСЯ ИЗ ЧАСТИЦ
   Рисуем росток на невидимом canvas, читаем непрозрачные пиксели,
   для каждого создаём частицу со случайной стартовой позицией —
   через requestAnimationFrame частицы долетают до целевых мест,
   и на экране "собирается" картинка
   ================================================================ */
import { useEffect, useRef } from "react";
import styles from "./ParticleLogo.module.css";

const CANVAS_SIZE = 120;       // размер холста в пикселях
const PARTICLE_STEP = 3;       // шаг сетки — реже = меньше частиц = легче для слабых телефонов
const ANIMATION_DURATION_MS = 1400;

function ParticleLogo() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;

        /* ===== ШАГ 1: РИСУЕМ ЭМБЛЕМУ НА ВРЕМЕННОМ CANVAS ===== */
        // Тот же росток, что и в favicon — фон-круг + травинки
        const sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = CANVAS_SIZE;
        sourceCanvas.height = CANVAS_SIZE;
        const sourceCtx = sourceCanvas.getContext("2d");

        sourceCtx.fillStyle = "#2f7d32";
        sourceCtx.beginPath();
        sourceCtx.roundRect(0, 0, CANVAS_SIZE, CANVAS_SIZE, CANVAS_SIZE * 0.25);
        sourceCtx.fill();

        sourceCtx.strokeStyle = "#6cbf5f";
        sourceCtx.lineWidth = 6;
        sourceCtx.lineCap = "round";
        sourceCtx.beginPath();
        sourceCtx.moveTo(CANVAS_SIZE * 0.35, CANVAS_SIZE * 0.9);
        sourceCtx.quadraticCurveTo(
            CANVAS_SIZE * 0.35, CANVAS_SIZE * 0.4,
            CANVAS_SIZE * 0.5, CANVAS_SIZE * 0.15
        );
        sourceCtx.moveTo(CANVAS_SIZE * 0.55, CANVAS_SIZE * 0.9);
        sourceCtx.quadraticCurveTo(
            CANVAS_SIZE * 0.75, CANVAS_SIZE * 0.5,
            CANVAS_SIZE * 0.85, CANVAS_SIZE * 0.25
        );
        sourceCtx.stroke();

        /* ===== ШАГ 2: СЧИТЫВАЕМ ПИКСЕЛИ И СОЗДАЁМ ЧАСТИЦЫ ===== */
        const imageData = sourceCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const particles = [];

        for (let y = 0; y < CANVAS_SIZE; y += PARTICLE_STEP) {
            for (let x = 0; x < CANVAS_SIZE; x += PARTICLE_STEP) {
                const alphaIndex = (y * CANVAS_SIZE + x) * 4 + 3; // индекс alpha-канала
                const alpha = imageData.data[alphaIndex];

                if (alpha > 100) {
                    // Непрозрачный пиксель — значит здесь есть часть картинки,
                    // ставим частицу со случайной стартовой точкой вокруг
                    const colorIndex = (y * CANVAS_SIZE + x) * 4;
                    particles.push({
                        targetX: x,
                        targetY: y,
                        startX: x + (Math.random() - 0.5) * 200,
                        startY: y + (Math.random() - 0.5) * 200,
                        color: `rgba(${imageData.data[colorIndex]}, ${imageData.data[colorIndex + 1]}, ${imageData.data[colorIndex + 2]}, ${alpha / 255})`,
                    });
                }
            }
        }

        /* ===== ШАГ 3: АНИМАЦИЯ СБОРКИ ЧЕРЕЗ requestAnimationFrame ===== */
        let startTime = null;
        let animationFrameId;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
            // easeOutCubic — быстрый старт, плавное завершение (не резко "врезаются")
            const eased = 1 - Math.pow(1 - progress, 3);

            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

            for (const particle of particles) {
                const currentX = particle.startX + (particle.targetX - particle.startX) * eased;
                const currentY = particle.startY + (particle.targetY - particle.startY) * eased;

                ctx.fillStyle = particle.color;
                ctx.fillRect(currentX, currentY, PARTICLE_STEP, PARTICLE_STEP);
            }

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            }
        }

        animationFrameId = requestAnimationFrame(animate);

        // Чистим анимацию, если компонент размонтируется раньше времени
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}

export default ParticleLogo;