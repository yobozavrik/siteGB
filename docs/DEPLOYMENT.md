# Розгортання

Фронт — статика на **Vercel** (автодеплой із `main`). Бекенд — **Supabase**
(Postgres + RLS + edge functions). Репозиторій: `github.com/yobozavrik/siteGB`.

## Vercel

### Налаштування проєкту

- **Framework preset:** Vite (у репо є `vercel.json` з `framework: "vite"`).
- **Build command:** `npm run build` (робить `vite build` + `scripts/prerender.ts`).
- **Output directory:** `dist`.
- **Install command:** дефолтний (`npm ci`).
- `vercel.json` також задає SPA-rewrite на `/index.html` (prerendered-теки
  віддаються файловою системою до rewrite) і незмінний кеш для `/assets/*`.

### Змінні оточення

**Project → Settings → Environment Variables**, обовʼязково scope **All
Environments** (Production + Preview + Development), інакше preview-деплої
відкриваються без бекенду:

| Змінна | Значення |
|---|---|
| `VITE_SUPABASE_PROJECT_ID` | ref проєкту Supabase |
| `VITE_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | anon public key (Project Settings → API) |
| `VITE_SITE_URL` | продакшн-домен, напр. `https://sitegbv12.vercel.app` або власний |

Після зміни env — **Redeploy** (Vercel не перебудовує сам).

### Деплой

- Push у `main` → Production.
- Push у будь-яку іншу гілку / PR → Preview (URL за Vercel-авторизацією).
- Prod відкривати по **основному домену** (Project → Domains) — на нього не діє
  Deployment Protection.

### Домен при зміні

Крім `VITE_SITE_URL` на Vercel, разово поправити статичні згадки:
`index.html` (JSON-LD `url`/`image`, `hreflang`, `og:image`),
`scripts/prerender.ts` (`BASE_URL` фолбек), `public/robots.txt` (рядок `Sitemap:`),
`public/llms.txt`.

## Supabase

### Схема

```bash
npm i -g supabase
supabase login
supabase link --project-ref <ref>
supabase db push      # застосує всі міграції з supabase/migrations/ по порядку
```

Актуальні таблиці: `orders`, `contact_messages`. Остання міграція
`20260904120000_galya_order_fields.sql` додає `delivery_type`, `shop_id`,
`time_slot`, `payment_method` і робить `customer_email` необовʼязковим.

> Міграції `20260403111927` → `112255` → `112322` мусять іти по порядку: перші дві
> знімають дозвільні read-політики, третя додає явні denies. Пропуск лишає
> замовлення публічно читабельними.

### Edge-функції

```bash
supabase functions deploy telegram-order-notify
supabase functions deploy admin-orders
supabase functions deploy customer-support   # опційно (AI-чат)
supabase functions deploy marketing-ai       # опційно (AI-копірайт)
```

### Секрети функцій (ніколи не в `.env`)

```bash
supabase secrets set TELEGRAM_BOT_TOKEN="123456:ABC..." TELEGRAM_CHAT_ID="-1001234567890"
supabase secrets set ADMIN_SECRET_KEY="$(openssl rand -hex 32)"
# лише якщо деплоїш AI-функції:
supabase secrets set AI_API_KEY="sk-or-..."
# опційні перевизначення:
supabase secrets set AI_GATEWAY_URL="https://openrouter.ai/api/v1/chat/completions"
supabase secrets set AI_MODEL="google/gemini-2.5-flash"
```

`SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` підставляються автоматично — не задавати.

## Чек-лист першого продакшн-запуску

- [ ] Vercel env — 4 `VITE_*` для All Environments
- [ ] `supabase db push` (перевір, що `orders` має нові 4 колонки)
- [ ] `supabase functions deploy` для потрібних функцій
- [ ] `supabase secrets set` — Telegram, admin (AI — за потреби)
- [ ] Домен на Vercel + оновити статичні згадки домену (див. вище)
- [ ] `src/config/site.ts` — реальні телефон, пошта, соцмережі, `CITY_PRIMARY`
- [ ] `src/data/shops.ts` — реальні адреси/графіки/телефони
- [ ] `src/data/delivery.ts` — реальні зони й тарифи
- [ ] фото товарів у `public/img/products/` (замість `/placeholder.svg`)
- [ ] `public/og-image.jpg`, `public/favicon.png` — реальні
- [ ] `index.html` — свій `google-site-verification` (зараз прибрано)

## Приймання (прод)

- [ ] `/` відкривається, hero без битих зображень, `<title>` містить «Галя Балувана»
- [ ] `/menu` → категорія → товар → «Додати в кошик» → лічильник росте
- [ ] `/cart` → `/checkout`: валідація працює; тестове замовлення створюється;
      приходить Telegram
- [ ] `/shops` — мапа/список фільтрується
- [ ] `/delivery`, `/about`, `/contacts`, `/blog`, `/franchise` — рендеряться
- [ ] 404 на невідомому URL
- [ ] `view-source` головної й товару: коректні `meta` / OG / JSON-LD, канонікал
      на прод-домен
- [ ] `<домен>/sitemap.xml` містить menu/product/landing URL
- [ ] чат підтримки відповідає (якщо задано `AI_API_KEY`)
- [ ] мобільний: додавання в кошик, оформлення, немає горизонтального скролу
- [ ] CI на `main` зелений (`verify` + `e2e`)

## Траблшутинг

**Білий екран на проді** — не задані `VITE_SUPABASE_*` (або лише для Production, а
відкрито Preview). Додай для All Environments → Redeploy. Клієнт не кидає
виняток (плейсхолдер), але без env checkout/форми/чат не працюють.

**Замовлення створюється, у Telegram нічого** —
`supabase functions logs telegram-order-notify`. Зазвичай `TELEGRAM_CHAT_ID`
(id груп відʼємні, `-100...`).

**Адмінка порожня** — `admin-orders` не задеплоєна або `ADMIN_SECRET_KEY` не
збігається з ключем у панелі.

**Vercel не підхопив пуш** — перевір Vercel commit-status на HEAD `main`
(`pending` → ще будує), або перевʼязку GitHub-інтеграції.
