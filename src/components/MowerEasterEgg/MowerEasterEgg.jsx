/* ================================================================
   ПАСХАЛКА: РОБОТ-КОСИЛКА, ЕЗДЯЩАЯ ПО ЭКРАНУ ПОД СЛУЧАЙНЫМ УГЛОМ
   Canvas-оверлей поверх всей страницы (клики сквозь него проходят).
   Косилка выезжает из случайной точки за краем экрана под случайным
   углом (0-360°), едет по прямой, за ней остаётся полоса цвета земли
   вдоль всего пройденного пути. Когда косилка уезжает за
   противоположный край экрана — полоса плавно исчезает
   ================================================================ */
import { useEffect, useRef } from "react";
import styles from "./MowerEasterEgg.module.css";

const MOWER_SIZE = 36;
const MOWER_SPEED = 4;
const SWATH_WIDTH = 60;
const SWATH_FADE_DURATION_MS = 900;
const PASS_PAUSE_RANGE_MS = [3000, 7000];
const SWATH_COLOR = "201, 168, 119"; // светло-коричневый, "земля" — RGB без alpha, чтобы переиспользовать в rgba()

function MowerEasterEgg() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let animationFrameId;
        let mower = null; // {x, y, dx, dy, angle}
        let swath = null; // {startX, startY, angle, length, fadeStartedAt}
        let passTimeoutId;

        /* ===== ЗАПУСК НОВОГО ПРОЕЗДА ПОД СЛУЧАЙНЫМ УГЛОМ ===== */
        function startNewPass() {
            // Случайный угол движения — полный круг, 0 до 360 градусов
            const angle = Math.random() * Math.PI * 2;

            // Стартовая точка — за пределами экрана, с запасом на диагональ,
            // чтобы при любом угле косилка гарантированно проехала через видимую область
            const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
            const startDistance = diagonal / 2 + MOWER_SIZE;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Стартуем с направления, противоположного движению —
            // тогда траектория точно пройдёт где-то через центр экрана
            const startX = centerX - Math.cos(angle) * startDistance + (Math.random() - 0.5) * canvas.width;
            const startY = centerY - Math.sin(angle) * startDistance + (Math.random() - 0.5) * canvas.height;

            mower = {
                x: startX,
                y: startY,
                dx: Math.cos(angle) * MOWER_SPEED,
                dy: Math.sin(angle) * MOWER_SPEED,
                angle,
            };

            swath = { startX, startY, angle, length: 0, fadeStartedAt: null };
        }

        function scheduleNextPass() {
            const [min, max] = PASS_PAUSE_RANGE_MS;
            const delay = min + Math.random() * (max - min);
            passTimeoutId = setTimeout(startNewPass, delay);
        }

        scheduleNextPass();

        /* ===== ОТРИСОВКА РОБОТА-КОСИЛКИ (вид сверху) ===== */
        function drawMower() {
            ctx.save();
            ctx.translate(mower.x, mower.y);
            ctx.rotate(mower.angle);

            const bodyLength = MOWER_SIZE;
            const bodyWidth = MOWER_SIZE * 0.75;

            ctx.fillStyle = "#1c2b1e";
            ctx.beginPath();
            ctx.roundRect(-bodyLength / 2 + 2, -bodyWidth / 2 - 3, bodyLength * 0.4, 6, 3);
            ctx.roundRect(-bodyLength / 2 + 2, bodyWidth / 2 - 3, bodyLength * 0.4, 6, 3);
            ctx.fill();

            ctx.fillStyle = "#2f7d32";
            ctx.beginPath();
            ctx.roundRect(-bodyLength / 2, -bodyWidth / 2, bodyLength, bodyWidth, bodyWidth / 2);
            ctx.fill();

            ctx.fillStyle = "#6cbf5f";
            ctx.beginPath();
            ctx.roundRect(-bodyLength / 2 + 4, -bodyWidth / 2 + 4, bodyLength - 8, bodyWidth - 8, (bodyWidth - 8) / 2);
            ctx.fill();

            const bladeAngle = (performance.now() / 60) % (Math.PI * 2);
            ctx.save();
            ctx.rotate(bladeAngle);
            ctx.strokeStyle = "rgba(28, 43, 30, 0.4)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-bodyWidth / 3, 0);
            ctx.lineTo(bodyWidth / 3, 0);
            ctx.stroke();
            ctx.restore();

            ctx.fillStyle = "#4fa8d8";
            ctx.beginPath();
            ctx.arc(bodyLength / 2 - 6, -4, 2.5, 0, Math.PI * 2);
            ctx.arc(bodyLength / 2 - 6, 4, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#1c2b1e";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-bodyLength / 2, 0);
            ctx.lineTo(-bodyLength / 2 - 6, 0);
            ctx.stroke();
            ctx.fillStyle = "#1c2b1e";
            ctx.beginPath();
            ctx.arc(-bodyLength / 2 - 6, 0, 1.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }

        /* ===== ПСЕВДОСЛУЧАЙНОЕ ЧИСЛО ПО ЦЕЛОМУ ИНДЕКСУ ===== */
        // Даёт стабильный, но "случайный на вид" результат — комочки земли
        // не будут дрожать/мерцать между кадрами, т.к. привязаны к позиции, не ко времени
        function pseudoRandom(seed) {
            const x = Math.sin(seed * 12.9898) * 43758.5453;
            return x - Math.floor(x);
        }

        /* ===== ОТРИСОВКА ПОЛОСЫ ПОД ПРОИЗВОЛЬНЫМ УГЛОМ ===== */
        function drawSwath() {
            const isFading = swath.fadeStartedAt !== null;
            const fadeAlpha = isFading
                ? Math.max(0, 1 - (performance.now() - swath.fadeStartedAt) / SWATH_FADE_DURATION_MS)
                : 1;

            ctx.save();
            ctx.translate(swath.startX, swath.startY);
            ctx.rotate(swath.angle);

            // Базовая заливка полосы
            ctx.fillStyle = `rgba(${SWATH_COLOR}, ${fadeAlpha * 0.5})`;
            ctx.fillRect(0, -SWATH_WIDTH / 2, swath.length, SWATH_WIDTH);

            // ===== ТЕКСТУРА "КОМОЧКОВ ЗЕМЛИ" =====
            // Идём вдоль полосы с фиксированным шагом, на каждом шаге рисуем
            // несколько пятен со случайным (но стабильным) смещением и размером
            const DIRT_STEP = 14;
            for (let dist = 0; dist < swath.length; dist += DIRT_STEP) {
                const seed = Math.floor(dist / DIRT_STEP);

                for (let i = 0; i < 2; i++) {
                    const offsetSeed = seed * 3 + i;
                    const localX = dist + pseudoRandom(offsetSeed) * DIRT_STEP;
                    const localY = (pseudoRandom(offsetSeed + 0.5) - 0.5) * (SWATH_WIDTH - 8);
                    const radius = 1.5 + pseudoRandom(offsetSeed + 0.7) * 2;

                    // Комочки чередуются темнее/светлее базового тона — создаёт объём
                    const isDark = pseudoRandom(offsetSeed + 0.3) > 0.5;
                    const shade = isDark ? "140, 110, 75" : "222, 196, 150";

                    ctx.fillStyle = `rgba(${shade}, ${fadeAlpha * 0.35})`;
                    ctx.beginPath();
                    ctx.ellipse(localX, localY, radius, radius * 0.7, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.restore();

            if (isFading && fadeAlpha <= 0) {
                swath = null;
            }
        }

        /* ===== ГЛАВНЫЙ ЦИКЛ АНИМАЦИИ ===== */
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (swath) {
                if (mower) {
                    // Длина полосы — пройденное расстояние от стартовой точки до косилки
                    const traveledX = mower.x - swath.startX;
                    const traveledY = mower.y - swath.startY;
                    swath.length = Math.sqrt(traveledX ** 2 + traveledY ** 2);
                }
                drawSwath();
            }

            if (mower) {
                mower.x += mower.dx;
                mower.y += mower.dy;
                drawMower();

                const offScreen =
                    mower.x < -MOWER_SIZE * 2 || PASS_PAUSE_RANGE_MS
                mower.x > canvas.width + MOWER_SIZE * 2 ||
                    mower.y < -MOWER_SIZE * 2 ||
                    mower.y > canvas.height + MOWER_SIZE * 2;

                if (offScreen) {
                    mower = null;
                    if (swath) swath.fadeStartedAt = performance.now();
                    scheduleNextPass();
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        }

        animationFrameId = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(passTimeoutId);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}

export default MowerEasterEgg;