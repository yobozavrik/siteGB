# Архітектура «Галя Балувана»

Онлайн-вітрина магазину домашніх напівфабрикатів: меню з цінами, кошик,
оформлення (доставка / самовивіз), карта магазинів, рецепти, франшиза, чат
підтримки, адмін-панель.

## 1. Стек і принцип

| Шар | Вибір | Роль |
|---|---|---|
| Збірка | Vite 5 + `@vitejs/plugin-react-swc` | dev-сервер, білд у статику |
| UI | React 18 + Tailwind + shadcn/ui (Radix) | компоненти, доступні примітиви |
| Роутинг | React Router 6 | клієнтські маршрути + редіректи |
| Анімація | framer-motion (+ `MotionConfig reducedMotion="user"`) | reveal-секції головної, мікровзаємодії |
| Стан кошика | React Context + `localStorage` | живе в памʼяті, переживає перезавантаження |
| Серверні дані | TanStack Query | зарезервовано (адмінка); сторінки — статичні |
| Контент | типізовані TS-модулі в `src/data` | миттєвий рендер, повний контроль SEO |
| Бекенд | Supabase — Postgres + RLS + Deno edge functions | замовлення, звернення, адмінка, Telegram, AI |
| SEO | `react-helmet-async` + `scripts/prerender.ts` | пер-маршрутні `<meta>` + статичні HTML + `sitemap.xml` |
| Тести | Vitest + Testing Library (unit), Playwright (e2e) | інваріанти даних, кошик, наскрізні сценарії |
| Хостинг | Vercel (статика `dist/`) + Supabase | автодеплой із `main` |

**Принцип:** каталог, магазини, доставка, FAQ, рецепти, лендінги — **статичні
дані в репозиторії**. База потрібна лише для того, що створює користувач:
`orders`, `contact_messages`. Нульовий час до першого рендеру, повний контроль
SEO, просте локальне середовище (сайт працює без бекенду).

## 2. Карта маршрутів

```
/                     Головна — hero, категорії, хіти, «чому ми», «кухня за склом»,
                      магазини, рецепти, FAQ, зворотний звʼязок, франшиза
/menu                 Каталог — усі категорії + сітка товарів
/menu/:category       Категорія — фільтри (мітки / ціна / сорт)
/product/:slug        Товар — ціна за упаковку і за 100 г, склад, КБЖУ,
                      приготування, зберігання, алергени, «з цим беруть»
/cart                 Кошик — рядки, лічильники, підказка про безкоштовну доставку
/checkout             Оформлення — контакти, доставка/самовивіз, зона/магазин,
                      дата + слот, оплата, коментар, липкий підсумок
/order/:id            Підтвердження — короткий номер, що далі
/delivery             Доставка та оплата — зони, тарифи, оплата, самовивіз
/shops                Магазини — SVG-мапа України + список, фільтр за містом
/about                Про нас — «кухня за склом», факти
/contacts             Контакти + форма зворотного звʼязку (→ contact_messages)
/franchise            Франшиза — оффер + форма заявки (→ contact_messages, тег)
/blog  /blog/:slug    Рецепти та поради (статичні статті)
/admin                Адмінка замовлень (за server-side секретом, lazy-chunk)
/<city|keyword>       SEO-лендінги з src/data/landingPages.ts
*                     404

Редіректи (спадок Kratea): /where-to-buy→/shops · /collaboration→/franchise · /contact→/contacts
```

Маршрути товарів, категорій, статей і лендінгів — з масивів даних; так само в
`scripts/prerender.ts` і в `sitemap.xml`.

## 3. Дерево файлів

```
src/
├─ config/site.ts            # SITE_URL, бренд, телефон, соцмережі, економіка замовлення
├─ pages/                    # один файл на маршрут
│  ├─ Index MenuPage CategoryPage ProductPage
│  ├─ CartPage CheckoutPage OrderPage
│  ├─ DeliveryPage ShopsPage AboutPage ContactsPage FranchisePage
│  ├─ BlogPage BlogPostPage LandingPage AdminPage NotFound
├─ components/
│  ├─ SiteLayout             # Header + CartDrawer + <main pb-24 sm:pb-0> + Footer
│  │                         #   + (lazy, якщо supabaseConfigured) CustomerSupportChat
│  ├─ Header Footer SEO ScrollToTop
│  ├─ HeroSection GalyaSections FAQSection      # блоки головної
│  ├─ ContactForm CustomerSupportChat UkraineMap
│  ├─ catalog/  ProductCard Tag
│  ├─ admin/    AnalyticsCharts ContactMessagesSection MarketingAISection
│  └─ ui/       shadcn примітиви (не редагуємо вручну; ESLint їх ігнорує)
├─ context/CartContext.tsx   # items, add/remove/update, totals, isCartOpen, localStorage
├─ data/                     # СТАТИЧНИЙ КОНТЕНТ (див. docs/CONTENT.md)
│  └─ catalog shops delivery faq blogPosts landingPages
├─ lib/orders.ts             # zod-схема замовлення, createOrder(), статуси
├─ integrations/supabase/
│  ├─ client.ts              # createClient з VITE_* + export supabaseConfigured
│  └─ types.ts               # згенеровані типи БД (правимо руками при міграції)
├─ hooks/  test/  assets/
supabase/
├─ migrations/               # історія схеми — застосовувати по порядку
└─ functions/                # telegram-order-notify · admin-orders · customer-support · marketing-ai
scripts/
├─ prerender.ts              # postbuild: per-route HTML + sitemap.xml
└─ screenshots.mjs           # README-скріншоти з піднятого preview (dev-тулінг)
e2e/storefront.spec.ts       # Playwright
_incoming/                   # тека-приймач для сирих фото (у git не йде)
```

## 4. Композиція головної

`Index.tsx` → `SiteLayout` (без відступу під шапку) → секції з
`src/components/GalyaSections.tsx` + `HeroSection` + `FAQSection`:

```
HeroSection      full-bleed фото + градієнт, анімований reveal, великий заголовок
MenuSection      8 категорій, tilt-in картки, hover-lift
HitsSection      3 хіти — великі glass-картки з теплим свіченням, «в кошик»
WhySection       4 glass-картки з іконками (відкрите виробництво / ручна ліпка / …)
ProcessShowcase  2 full-bleed банери («Ліпимо руками» / «30 діб») + 3 USP-картки
ShopsSection     темний stone-банер + CTA «Обрати місто»
BlogSection      3 останні рецепти
FAQSection       анімований акордеон (shadcn) з src/data/faq.ts
FeedbackSection  CTA на /contacts
FranchiseSection темний stone-банер + CTA на /franchise
```

Секції зʼявляються через `whileInView` + `viewport={{ once: true }}`; hero — через
`animate` (видимий одразу). `MotionConfig reducedMotion="user"` вимикає рухомі
трансформації для користувачів із `prefers-reduced-motion`.

## 5. Потік замовлення

```
Меню / Товар ──addItem──▶ CartContext(items, localStorage "gb.cart.v1")
      │                         │
      ▼                         ▼
   /cart ────────────────▶ /checkout ──orderFormSchema.parse──▶ createOrder()
                                               │
                        supabase.from('orders').insert(...)   [RLS: INSERT так, SELECT ні]
                                               │
                        supabase.functions.invoke('telegram-order-notify')  [токен лише в секретах]
                                               │
                                               ▼
                                      navigate('/order/:id')  — «Дякуємо»
```

Адмін читає замовлення **лише** через edge-функцію `admin-orders` (service-role +
`ADMIN_SECRET_KEY`). Клієнт ніколи не має доступу на читання `orders`.

Деталі схеми форми, таблиць і статусів — [DATA-MODEL.md](DATA-MODEL.md).

## 6. Модель безпеки (RLS)

| Таблиця | INSERT (anon) | SELECT (anon) | UPDATE/DELETE (anon) |
|---|---|---|---|
| `orders` | ✅ | ❌ (лише edge-функція) | ❌ |
| `contact_messages` | ✅ | ❌ | ❌ |

- Anon-ключ безпечний у бандлі — його захищає RLS.
- Service-role ключ — лише в секретах edge-функцій.
- Секрети (`TELEGRAM_BOT_TOKEN`, `ADMIN_SECRET_KEY`, `AI_API_KEY`) — Supabase
  function secrets, у бандлі їх нема.
- Міграції `20260403111927` / `112255` / `112322` — строго по порядку.

## 7. SEO

- **Пер-маршрутні мета** — `SEO.tsx` через `react-helmet-async`: `title`,
  `description`, `canonical`, OG, Twitter, JSON-LD.
- **Prerender** (`scripts/prerender.ts`, postbuild) — на кожен маршрут пише
  `dist/<route>/index.html` з правильними `<title>/<meta>/canonical/OG` і
  прихованим above-the-fold блоком (`h1` + intro) для краулерів без JS; React
  гідратується поверх. Разом ~60 сторінок (статика + категорії + товари +
  рецепти + лендінги).
- **JSON-LD:** `Organization` + `WebSite` + `FoodEstablishment` + `FAQPage` +
  `Product` (на головній та сторінках товарів), `BreadcrumbList` (категорії,
  товар, стаття).
- **`sitemap.xml`** генерується білдом із повного списку маршрутів.
- Канонічний домен — `VITE_SITE_URL` (Vercel env), фолбек у коді
  (`prerender.ts`, `SEO`/`config/site`).

## 8. Оточення

| Змінна | Де | Призначення |
|---|---|---|
| `VITE_SUPABASE_PROJECT_ID` | Vercel, `.env` | ідентифікатор проєкту |
| `VITE_SUPABASE_URL` | Vercel, `.env` | endpoint Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vercel, `.env` | anon public ключ |
| `VITE_SITE_URL` | Vercel, `.env` | канонічний домен для SEO/prerender |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Supabase secrets | сповіщення про замовлення |
| `ADMIN_SECRET_KEY` | Supabase secrets | захист `admin-orders` |
| `AI_API_KEY` (+ overrides) | Supabase secrets | опційні AI-функції (чат, копірайт) |

**Стійкість до відсутньої конфігурації:** `client.ts` підставляє валідний
плейсхолдер, якщо `VITE_SUPABASE_*` не задані, і експортує `supabaseConfigured:
boolean`. Вітрина рендериться завжди; `CheckoutPage` показує банер, а
`CustomerSupportChat` ховається, коли бекенд не налаштований.

## 9. Розгортання

1. Push у `main` → Vercel build (`npm run build` = `vite build` + prerender) →
   деплой `dist/`.
2. Vercel env — 4 `VITE_*` (scope All Environments).
3. `vercel.json` — framework `vite`, SPA-rewrite на `/index.html`, immutable-кеш
   для `/assets/*`.
4. Supabase — `supabase db push`; edge-функції задеплоєні; секрети виставлені.
5. CI (`.github/workflows/ci.yml`) — `verify` (typecheck/lint/test/build) + `e2e`
   на кожен push/PR.

Повний чек-лист — [DEPLOYMENT.md](DEPLOYMENT.md).

## 10. Продуктивність

- Статичні дані → миттєвий контент; prerender → швидкий FCP без меж-фреймворка.
- Кошик у памʼяті + `localStorage`, без мережевих запитів до оформлення.
- SVG-мапа України замість тайл-провайдера — 0 сторонніх запитів, 0 ключів.
- Vendor-чанки розбиті (`react-vendor` / `motion` / `supabase` / `charts`);
  `AdminPage` і `CustomerSupportChat` — `React.lazy` (recharts і react-markdown
  поза стартовим бандлом).
- **Відомий борг:** `src/assets/galya-hero-food.png` ≈ 2.8 МБ — стиснути у WebP
  (~200 КБ), коли буде фінальне hero-фото.

## 11. Адаптив

- `SiteLayout` додає `pb-24` на мобільному, щоб остання CTA сторінки не ховалася
  під FAB чату.
- Аудит: немає горизонтального скролу на 12 сторінках × {375, 768, 1280}.
- Playwright ганяє два профілі: Desktop Chrome і Pixel 7.
