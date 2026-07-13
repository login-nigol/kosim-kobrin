# КосимКобрин 🌱

Лендинг для сервиса покоса травы и ухода за участками в Кобрине.

## Стек

- React 19 + Vite
- Framer Motion — анимации
- CSS Modules — стили компонентов

## Запуск проекта

npm install
npm run dev

Откроется на `http://localhost:5173` (или следующий свободный порт, если занят).

## Сборка для продакшена

npm run build

Собранные файлы попадут в папку `dist/`.

## Структура проекта

src/
├── components/       # Секции сайта, каждая — папка с .jsx + .module.css
│   ├── Header/
│   ├── Hero/
│   ├── About/
│   ├── Services/
│   ├── Portfolio/
│   ├── Pricing/
│   ├── FAQ/
│   ├── Contacts/
│   ├── Footer/
│   └── GrassDivider/  # анимированный разделитель между секциями
├── hooks/             # useClickSound, useVibration, useShare
├── config/
│   └── siteData.js    # ВСЕ тексты, цены и контакты — единый источник правды
├── styles/
│   └── variables.css  # цвета, шрифты, отступы
├── App.jsx            # сборка всех секций по порядку
└── main.jsx

## Как обновить контент

Почти весь текст (услуги, цены, контакты, FAQ) редактируется в одном месте:
`src/config/siteData.js` — не нужно лазить по компонентам.

## Деплой

Проект подключён к Vercel — каждый `git push` в `master` автоматически
пересобирает и обновляет сайт: https://kosim-kobrin.vercel.app

## TODO

- [ ] Реальные фото/видео работ (пока заглушки в Portfolio)
- [ ] Звуковой файл клика (`public/sounds/click.mp3`)
- [ ] Canvas-эффект растворения на лого в Hero
- [ ] Реальный Telegram-юзернейм и почта в `siteData.js`