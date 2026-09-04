<div align="center">

<h1>Галя Балувана</h1>

<p><strong>Вітрина магазину домашніх напівфабрикатів ручного ліплення.</strong><br>
React 18 · Vite · Tailwind · shadcn/ui · Supabase — каталог, кошик, оформлення
з доставкою або самовивозом, карта магазинів, рецепти, франшиза.</p>

</div>

---

## Що це

Онлайн-вітрина: перегляд меню (вареники, пельмені, млинці, сирники, чебуреки, голубці,
котлети, десерти), кошик, що переживає перезавантаження, оформлення замовлення з вибором
доставки чи самовивозу, часовим слотом і способом оплати. Замовлення пишуться в Postgres
і надсилають сповіщення в Telegram через edge-функцію, тому токен ніколи не потрапляє в
браузер. Каталог, точки продажу, рецепти й SEO-лендінги — типізовані статичні дані, тому
контент рендериться миттєво, а prerender-крок віддає ~60 статичних HTML на кожен маршрут.

Детально: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). План перебудови й тест-гейти:
[`docs/PLAN.md`](docs/PLAN.md).

## Стек

| Шар | Вибір |
|---|---|
| Збірка | Vite 5 + `@vitejs/plugin-react-swc` |
| UI | React 18, Tailwind CSS, shadcn/ui (Radix) |
| Роутинг | React Router 6 |
| Бекенд | Supabase — Postgres, RLS, Deno edge functions |
| Тести | Vitest + Testing Library (unit), Playwright (e2e) |
| Prerender | `scripts/prerender.ts` → per-route HTML + `sitemap.xml` |
| Хостинг | Vercel (статика `dist/`) |

## Швидкий старт

```bash
npm install
cp .env.example .env      # плейсхолдерів достатньо, щоб дивитися сайт
npm run dev               # http://localhost:8080
```

Каталог, меню, кошик працюють одразу (кошик — клієнтський стан + localStorage).
Оформлення замовлення й форми пишуть у Supabase — див. **[SETUP.md](SETUP.md)**.

| Скрипт | Робить |
|---|---|
| `npm run dev` | Vite dev-сервер |
| `npm run build` | Продакшн-збірка + prerender у `dist/` |
| `npm run preview` | Віддає зібраний сайт |
| `npm test` | Юніт-тести (Vitest) |
| `npm run typecheck` | `tsc -b` (реальна перевірка типів по проєкту) |
| `npm run lint` | ESLint |
| `npx playwright test` | End-to-end |

Node 22 (див. `.nvmrc`).

## Тести

**Юніт** (`src/test/`) — бренд-конфіг, інваріанти каталогу (`pricePer100g`, унікальні
слаги, повний КБЖУ), інваріанти точок продажу, антирегрес Kratea-лексики в контенті,
кошик з localStorage-персистом, zod-схема замовлення (гілки доставка/самовивіз),
route↔prerender drift-guard.

```bash
npm test
```

**End-to-end** (`e2e/storefront.spec.ts`) — збирає й віддає прод-бандл, перевіряє:
заголовки з брендом, усі маршрути `< 400`, редіректи старих URL, 404-сторінку,
додавання товару в кошик, перемикання вкладок на сторінці товару, відсутність битих
зображень на ключових сторінках.

```bash
npx playwright install chromium   # перший раз
npx playwright test
```

## Структура

```
src/
├─ config/site.ts       # бренд, телефон, соцмережі, SITE_URL, економіка замовлення
├─ pages/               # один файл на маршрут
├─ components/
│  ├─ SiteLayout · Header · Footer · SEO · CartDrawer
│  ├─ catalog/          # ProductCard, Tag
│  └─ ui/               # shadcn примітиви
├─ context/CartContext.tsx   # кошик + localStorage
├─ data/                # catalog · shops · delivery · blogPosts · landingPages
├─ lib/orders.ts        # zod-схема замовлення, createOrder()
└─ integrations/supabase # client + типи БД
supabase/
├─ migrations/          # історія схеми — застосовувати по порядку
└─ functions/           # telegram-order-notify · admin-orders · customer-support · marketing-ai
scripts/prerender.ts    # per-route HTML + sitemap.xml
e2e/                    # Playwright
```

## Дані, які треба замінити перед продом

> [!NOTE]
> Адреси, телефони й фото магазинів у `src/data/shops.ts`, телефон/пошта/соцмережі в
> `src/config/site.ts`, а також фото товарів (зараз `/placeholder.svg`) — демонстраційні.
> Замініть реальними даними мережі. Hero-зображення варто стиснути у WebP.

## Ліцензія

[MIT](LICENSE)
