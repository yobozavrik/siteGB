# Документація проєкту «Галя Балувана»

Онлайн-вітрина магазину домашніх напівфабрикатів: меню, кошик, оформлення
(доставка / самовивіз), карта магазинів, рецепти, франшиза, чат підтримки,
адмін-панель.

## Куди дивитися

| Документ | Для кого | Про що |
|---|---|---|
| [CONTENT.md](CONTENT.md) | контент-менеджер, власник | **Як міняти товари, ціни, фото, магазини, доставку, тексти** — без програміста |
| [DEVELOPMENT.md](DEVELOPMENT.md) | розробник | Стек, структура, скрипти, конвенції, як додати сторінку / товар / тест |
| [ARCHITECTURE.md](ARCHITECTURE.md) | розробник, тех-лід | Маршрути, дерево файлів, потік замовлення, продуктивність |
| [DATA-MODEL.md](DATA-MODEL.md) | розробник | Усі моделі даних, таблиці БД, RLS, edge-функції |
| [DEPLOYMENT.md](DEPLOYMENT.md) | dev-ops | Vercel + Supabase: env, міграції, функції, секрети, домен |
| [PLAN.md](PLAN.md) | історія | Пофазовий план перебудови з форку Kratea (виконано) |

Кореневі файли репозиторію: [`../README.md`](../README.md) (огляд + скріншоти),
[`../SETUP.md`](../SETUP.md) (швидкий старт бекенду), [`../CONTRIBUTING.md`](../CONTRIBUTING.md),
[`../SECURITY.md`](../SECURITY.md).

## Швидкі факти

- **Стек:** Vite 5 + React 18 + TypeScript + Tailwind + shadcn/ui + React Router 6.
- **Бекенд:** Supabase — Postgres + RLS + Deno edge functions. Потрібен лише для
  замовлень, форм, адмінки й чату. Каталог/магазини/рецепти — статичні дані в репо.
- **Хостинг:** Vercel (статика `dist/`), автодеплой із гілки `main`.
- **Контент** живе у `src/data/*.ts` і `src/config/site.ts` — звичайні TS-файли.
- **SEO:** postbuild-скрипт `scripts/prerender.ts` пише ~60 статичних HTML +
  `sitemap.xml`.
- **Тести:** Vitest (юніт) + Playwright (e2e). CI — `.github/workflows/ci.yml`.

## Команди

```bash
npm install
npm run dev          # http://localhost:8080
npm run build        # dist/ + prerender + sitemap
npm run preview      # віддати зібране
npm test             # юніт
npm run typecheck    # tsc -b
npm run lint         # eslint
npx playwright test  # e2e (сам збирає й піднімає preview)
```
