/* ================================================================
   ПАСХАЛКА: РОБОТ-КОСИЛКА, ЕЗДЯЩАЯ ПО ЭКРАНУ ПОД СЛУЧАЙНЫМ УГЛОМ
   Canvas-оверлей поверх всей страницы (клики сквозь него проходят).
   Косилка выезжает из-за пределов экрана под случайным диагональным
   углом (20-160° и зеркально), едет по прямой, за ней остаётся полоса
   цвета земли с текстурой вдоль всего пройденного пути. Когда косилка
   уезжает за противоположный край экрана — полоса плавно исчезает
   ================================================================ */
import { useEffect, useRef } from "react";
import styles from "./MowerEasterEgg.module.css";

const MOWER_SIZE = 36;
const MOWER_SPEED = 4;
const SWATH_WIDTH = 60;
const OFFSCREEN_MARGIN_PX = 32; // 2em при базовых 16px — насколько косилка стартует за краем экрана
const SWATH_FADE_DURATION_MS = 900;
const PASS_PAUSE_RANGE_MS = [5000, 12000];
const SWATH_COLOR = "201, 168, 119"; // светло-коричневый, "земля"

function MowerEasterEgg() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        /* ===== POLYFILL: roundRect есть не во всех мобильных браузерах ===== */
        if (!ctx.roundRect) {
            ctx.roundRect = function (x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.arcTo(x + width, y, x + width, y + height, radius);
                this.arcTo(x + width, y + height, x, y + height, radius);
                this.arcTo(x, y + height, x, y, radius);
                this.arcTo(x, y, x + width, y, radius);
                this.closePath();
            };
        }

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let animationFrameId;
        let mower = null;
        let swath = null;
        let passTimeoutId;

        /* ===== ЗАПУСК НОВОГО ПРОЕЗДА ПОД СЛУЧАЙНЫМ ДИАГОНАЛЬНЫМ УГЛОМ ===== */
        function startNewPass() {
            // ===== УГОЛ ДВИЖЕНИЯ: ТОЛЬКО ДИАГОНАЛИ =====
            // Экран условно делим на 4 квадранта по 90° (0-90, 90-180, 180-270, 270-360).
            // В каждом квадранте исключаем по 20° у обеих границ (рядом с горизонталью
            // и рядом с вертикалью) — остаётся диагональная полоса 20°-70° внутри
            // каждого квадранта. Так угол никогда не окажется близко ни к 0°/180°
            // (горизонталь), ни к 90°/270° (вертикаль)
            const quadrant = Math.floor(Math.random() * 4);       // 0, 1, 2 или 3
            const angleWithinQuadrant = 20 + Math.random() * 50;  // от 20° до 70° внутри квадранта
            const angleDeg = quadrant * 90 + angleWithinQuadrant;
            const angle = (angleDeg * Math.PI) / 180;

            const directionX = Math.cos(angle);
            const directionY = Math.sin(angle);

            const perpendicularX = -directionY;
            const perpendicularY = directionX;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const halfWidth = canvas.width / 2;
            const halfHeight = canvas.height / 2;

            // ===== ЧЕСТНЫЙ РАСЧЁТ ГРАНИЦЫ ЭКРАНА =====
            // Считаем, на каком расстоянии от центра луч (в направлении -движения)
            // пересечёт левую/правую ИЛИ верхнюю/нижнюю границу экрана —
            // берём МЕНЬШЕЕ значение, это и есть реальный край по ходу движения
            const distanceToVerticalEdge = directionX !== 0 ? halfWidth / Math.abs(directionX) : Infinity;
            const distanceToHorizontalEdge = directionY !== 0 ? halfHeight / Math.abs(directionY) : Infinity;
            const distanceToScreenEdge = Math.min(distanceToVerticalEdge, distanceToHorizontalEdge);

            // Стартуем чуть дальше найденной границы — ровно на OFFSCREEN_MARGIN_PX,
            // а не на произвольный большой запас
            const startRadius = distanceToScreenEdge + OFFSCREEN_MARGIN_PX;

            // Разброс по перпендикуляру — держим траекторию ближе к центру экрана
            const maxPerpendicularOffset = Math.min(canvas.width, canvas.height) * 0.25;
            const perpendicularOffset = (Math.random() - 0.5) * 2 * maxPerpendicularOffset;

            const startX =
                centerX - directionX * startRadius + perpendicularX * perpendicularOffset;
            const startY =
                centerY - directionY * startRadius + perpendicularY * perpendicularOffset;

            mower = {
                x: startX,
                y: startY,
                dx: directionX * MOWER_SPEED,
                dy: directionY * MOWER_SPEED,
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

            ctx.fillStyle = `rgba(${SWATH_COLOR}, ${fadeAlpha * 0.5})`;
            ctx.fillRect(0, -SWATH_WIDTH / 2, swath.length, SWATH_WIDTH);

            const DIRT_STEP = 14;
            for (let dist = 0; dist < swath.length; dist += DIRT_STEP) {
                const seed = Math.floor(dist / DIRT_STEP);

                for (let i = 0; i < 2; i++) {
                    const offsetSeed = seed * 3 + i;
                    const localX = dist + pseudoRandom(offsetSeed) * DIRT_STEP;
                    const localY = (pseudoRandom(offsetSeed + 0.5) - 0.5) * (SWATH_WIDTH - 8);
                    const radius = 1.5 + pseudoRandom(offsetSeed + 0.7) * 2;

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
                    mower.x < -MOWER_SIZE * 2 ||
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