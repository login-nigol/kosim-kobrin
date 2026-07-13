/* ================================================================
   ПАСХАЛКА: КОСИЛКА, ЕЗДЯЩАЯ ПО ЭКРАНУ
   Canvas-оверлей поверх всей страницы (клики сквозь него проходят).
   Косилка выезжает то по горизонтали, то по вертикали в случайных
   местах, за ней "скошенная" полоса на весь путь — когда косилка
   уезжает за край экрана, полоса плавно исчезает
   ================================================================ */
import { useEffect, useRef } from "react";
import styles from "./MowerEasterEgg.module.css";

const MOWER_SIZE = 36;              // размер тела косилки в пикселях
const MOWER_SPEED = 4;              // скорость движения, px за кадр
const SWATH_WIDTH = 60;             // ширина скошенной полосы
const SWATH_FADE_DURATION_MS = 900; // сколько исчезает полоса после проезда
const PASS_PAUSE_RANGE_MS = [5000, 12000]; // пауза между проездами (рандом в диапазоне)

function MowerEasterEgg() {
    const canvasRef = useRef(null);

    useEffect(() => {
        // Уважаем настройку "уменьшить анимацию" в системе пользователя —
        // не показываем пасхалку тем, кто явно попросил меньше движения на экране
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
        let mower = null; // текущий проезд: {x, y, dx, dy, angle}
        let swath = null; // текущая скошенная полоса: {axis, fixed, start, current, fadeStartedAt}
        let passTimeoutId;

        /* ===== ЗАПУСК НОВОГО ПРОЕЗДА ===== */
        function startNewPass() {
            const isHorizontal = Math.random() > 0.5;

            if (isHorizontal) {
                const y = Math.random() * canvas.height;
                const leftToRight = Math.random() > 0.5;
                mower = {
                    x: leftToRight ? -MOWER_SIZE : canvas.width + MOWER_SIZE,
                    y,
                    dx: leftToRight ? MOWER_SPEED : -MOWER_SPEED,
                    dy: 0,
                    angle: leftToRight ? 0 : Math.PI,
                };
                swath = { axis: "horizontal", fixed: y, start: mower.x, current: mower.x, fadeStartedAt: null };
            } else {
                const x = Math.random() * canvas.width;
                const topToBottom = Math.random() > 0.5;
                mower = {
                    x,
                    y: topToBottom ? -MOWER_SIZE : canvas.height + MOWER_SIZE,
                    dx: 0,
                    dy: topToBottom ? MOWER_SPEED : -MOWER_SPEED,
                    angle: topToBottom ? Math.PI / 2 : -Math.PI / 2,
                };
                swath = { axis: "vertical", fixed: x, start: mower.y, current: mower.y, fadeStartedAt: null };
            }
        }

        /* ===== ПЛАНИРОВАНИЕ СЛЕДУЮЩЕГО ПРОЕЗДА ПОСЛЕ ПАУЗЫ ===== */
        function scheduleNextPass() {
            const [min, max] = PASS_PAUSE_RANGE_MS;
            const delay = min + Math.random() * (max - min);
            passTimeoutId = setTimeout(startNewPass, delay);
        }

        scheduleNextPass(); // первый проезд — тоже после случайной паузы, не сразу при загрузке

        /* ===== ОТРИСОВКА РОБОТА-КОСИЛКИ (вид сверху) ===== */
        function drawMower() {
            ctx.save();
            ctx.translate(mower.x, mower.y);
            ctx.rotate(mower.angle);

            const bodyLength = MOWER_SIZE;
            const bodyWidth = MOWER_SIZE * 0.75;

            /* --- колёса (рисуем первыми, чтобы корпус лёг поверх) --- */
            ctx.fillStyle = "#1c2b1e";
            ctx.beginPath();
            ctx.roundRect(-bodyLength / 2 + 2, -bodyWidth / 2 - 3, bodyLength * 0.4, 6, 3);
            ctx.roundRect(-bodyLength / 2 + 2, bodyWidth / 2 - 3, bodyLength * 0.4, 6, 3);
            ctx.fill();

            /* --- основной корпус: скруглённый овал --- */
            ctx.fillStyle = "#2f7d32";
            ctx.beginPath();
            ctx.roundRect(-bodyLength / 2, -bodyWidth / 2, bodyLength, bodyWidth, bodyWidth / 2);
            ctx.fill();

            /* --- верхняя светлая панель (крышка корпуса) --- */
            ctx.fillStyle = "#6cbf5f";
            ctx.beginPath();
            ctx.roundRect(-bodyLength / 2 + 4, -bodyWidth / 2 + 4, bodyLength - 8, bodyWidth - 8, (bodyWidth - 8) / 2);
            ctx.fill();

            /* --- вращающийся нож под корпусом (полупрозрачный, намёк на кошение) --- */
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

            /* --- сенсоры-"глаза" спереди --- */
            ctx.fillStyle = "#4fa8d8";
            ctx.beginPath();
            ctx.arc(bodyLength / 2 - 6, -4, 2.5, 0, Math.PI * 2);
            ctx.arc(bodyLength / 2 - 6, 4, 2.5, 0, Math.PI * 2);
            ctx.fill();

            /* --- антенна сзади --- */
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

        /* ===== ГЛАВНЫЙ ЦИКЛ АНИМАЦИИ ===== */
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (swath) {
                // Пока косилка едет — растягиваем полосу до её текущей позиции
                if (mower) {
                    swath.current = swath.axis === "horizontal" ? mower.x : mower.y;
                }

                const isFading = swath.fadeStartedAt !== null;
                const fadeAlpha = isFading
                    ? Math.max(0, 1 - (performance.now() - swath.fadeStartedAt) / SWATH_FADE_DURATION_MS)
                    : 1;

                ctx.fillStyle = `rgba(242, 248, 240, ${fadeAlpha * 0.9})`;

                if (swath.axis === "horizontal") {
                    const from = Math.min(swath.start, swath.current);
                    const to = Math.max(swath.start, swath.current);
                    ctx.fillRect(from, swath.fixed - SWATH_WIDTH / 2, to - from, SWATH_WIDTH);
                } else {
                    const from = Math.min(swath.start, swath.current);
                    const to = Math.max(swath.start, swath.current);
                    ctx.fillRect(swath.fixed - SWATH_WIDTH / 2, from, SWATH_WIDTH, to - from);
                }

                // Полоса полностью растворилась — убираем её совсем
                if (isFading && fadeAlpha <= 0) {
                    swath = null;
                }
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
                    if (swath) swath.fadeStartedAt = performance.now(); // запускаем исчезновение полосы
                    scheduleNextPass();
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        }

        animationFrameId = requestAnimationFrame(draw);

        // Чистим таймеры и подписки при размонтировании компонента
        return () => {
            cancelAnimationFrame(animationFrameId);
            clearTimeout(passTimeoutId);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}

export default MowerEasterEgg;