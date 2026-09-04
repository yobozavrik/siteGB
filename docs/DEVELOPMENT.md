# Розробка

## Локальне середовище

```bash
node -v            # потрібен 22 (див. .nvmrc)
npm install
cp .env.example .env
npm run dev        # http://localhost:8080
```

`.env` для перегляду сайту може містити плейсхолдери — каталог, меню, кошик
працюють без бекенду. Оформлення / форми / чат вмикаються, коли задані реальні
`VITE_SUPABASE_*` (див. [DEPLOYMENT.md](DEPLOYMENT.md) / `../SETUP.md`).

### Змінні оточення (`.env`)

| Змінна | Навіщо |
|---|---|
| `VITE_SUPABASE_PROJECT_ID` | ідентифікатор проєкту Supabase |
| `VITE_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | anon public ключ (безпечний у бандлі, захищає RLS) |
| `VITE_SITE_URL` | канонічний домен для SEO / prerender / sitemap |

Vite інлайнить `import.meta.env.VITE_*` **під час збірки**. Змінив `.env` —
перезапусти `npm run dev`. Клієнт Supabase (`src/integrations/supabase/client.ts`)
не падає без цих змінних — підставляє валідний плейсхолдер, сайт рендериться,
мережеві виклики просто не проходять (`supabaseConfigured === false`).

## Скрипти

| Команда | Дія |
|---|---|
| `npm run dev` | Vite dev-сервер, порт 8080 |
| `npm run build` | `vite build` + `tsx scripts/prerender.ts` → `dist/` + `sitemap.xml` |
| `npm run preview` | статичний сервер для `dist/` (порт за замовч. 4173) |
| `npm run typecheck` | `tsc -b` — **справжня** перевірка типів по проєкту |
| `npm run lint` | ESLint (`eslint.config.js`, flat config) |
| `npm test` | Vitest, один прогін |
| `npm run test:watch` | Vitest у watch |
| `npm run test:coverage` | Vitest + покриття |
| `npx playwright test` | e2e; сам робить `build` + `preview` і ганяє Chromium + Pixel 7 |
| `node scripts/screenshots.mjs` | перегенерувати `docs/screenshots/*` з піднятого preview (dev-тулінг) |

> `typecheck` = `tsc -b`, а не `tsc --noEmit`. Кореневий `tsconfig.json` —
> solution-style (`"files": []` + `references`), тому `tsc --noEmit` не перевіряє
> нічого. `tsc -b` збирає `tsconfig.app.json` (код) і `tsconfig.node.json`
> (`vite.config.ts`).

## Структура

```
src/
├─ config/site.ts            # бренд-константи (телефон, соцмережі, SITE_URL, економіка)
├─ pages/                    # один файл на маршрут
│  ├─ Index MenuPage CategoryPage ProductPage
│  ├─ CartPage CheckoutPage OrderPage
│  ├─ DeliveryPage ShopsPage AboutPage ContactsPage FranchisePage
│  ├─ BlogPage BlogPostPage LandingPage AdminPage NotFound
├─ components/
│  ├─ SiteLayout            # Header + CartDrawer + <main> + Footer + (lazy) CustomerSupportChat
│  ├─ Header Footer SEO ScrollToTop
│  ├─ HeroSection GalyaSections FAQSection   # блоки головної
│  ├─ ContactForm CustomerSupportChat UkraineMap
│  ├─ catalog/ ProductCard Tag
│  ├─ admin/  AnalyticsCharts ContactMessagesSection MarketingAISection
│  └─ ui/     shadcn/ui примітиви (не редагуємо вручну)
├─ context/CartContext.tsx   # кошик + localStorage ("gb.cart.v1")
├─ data/                     # СТАТИЧНИЙ КОНТЕНТ — див. docs/CONTENT.md
│  └─ catalog shops delivery faq blogPosts landingPages
├─ lib/orders.ts             # zod-схема замовлення + createOrder()
├─ integrations/supabase/    # client.ts (+supabaseConfigured), types.ts (типи БД)
├─ hooks/  test/  assets/
supabase/
├─ migrations/               # історія схеми — застосовувати по порядку
└─ functions/                # telegram-order-notify · admin-orders · customer-support · marketing-ai
scripts/
├─ prerender.ts              # postbuild: per-route HTML + sitemap.xml
└─ screenshots.mjs           # README-скріншоти (dev)
e2e/storefront.spec.ts       # Playwright
_incoming/                   # тека-приймач для сирих фото (у git не йде)
```

Маршрути та потік замовлення — [ARCHITECTURE.md](ARCHITECTURE.md).
Моделі даних і БД — [DATA-MODEL.md](DATA-MODEL.md).

## Конвенції

- **TypeScript**, шляхи з аліасом `@/` → `src/`.
- **Tailwind** utility-first; спільні патерни — у `@layer components` в
  `src/index.css` (`glass-card`, `glow-primary`, `glow-warm`, `section-accent`,
  `text-gradient-brand`, `section-padding`, `nav-link`, `.product-card-*`).
- Кольори — лише через CSS-змінні теми (`hsl(var(--primary))` тощо), задані в
  `:root` у `src/index.css`; палітра тепла (борошно / буряк / кріп).
- **shadcn/ui** — компоненти в `src/components/ui/**` згенеровані; правити не
  руками, а через власні обгортки. ESLint їх ігнорує.
- **Анімації** — `framer-motion`. `App.tsx` обгорнутий у
  `<MotionConfig reducedMotion="user">` — поважає `prefers-reduced-motion`.
  Секції головної зʼявляються через `whileInView` + `viewport={{ once: true }}`.
- **Компонент-провайдер і його хук** живуть в одному файлі (ESLint для
  `src/context/**` і `src/hooks/**` не свариться на fast-refresh).
- **SEO** на кожній сторінці — компонент `<SEO title description path jsonLd />`
  всередині `SiteLayout`.

## Як додати…

### …сторінку

1. `src/pages/FooPage.tsx` — обгорни в `<SiteLayout seo={<SEO .../>}>`.
2. `src/App.tsx` — додай `<Route path="/foo" element={<FooPage />} />`.
3. `scripts/prerender.ts` — додай запис у `staticRoutes` (інакше краулер побачить
   голий каркас; тест `routes-prerender.test.ts` це стереже).
4. `e2e/storefront.spec.ts` — додай `/foo` у перелік маршрутів.

### …товар / магазин / рецепт / FAQ

Тільки дані — див. [CONTENT.md](CONTENT.md). Маршрути товарів, категорій,
статей і лендінгів генеруються з масивів автоматично (і в роутері, і в
prerender, і в `sitemap.xml`).

### …юніт-тест

Файл `src/**/*.test.ts(x)`. Vitest з `globals: true`, jsdom, `setupFiles:
src/test/setup.ts`. Тестове оточення підставляє фейкові `VITE_SUPABASE_*`
(`vitest.config.ts` → `test.env`), тому модулі, що імпортують supabase-клієнт,
завантажуються без помилок.

Наявні тести:

| Файл | Що стереже |
|---|---|
| `config.test.ts` | бренд-константи валідні (телефон, email, соцлінки, пороги) |
| `catalog.test.ts` | унікальні slug/id, валідні числа, `pricePer100g`, кожна категорія непорожня |
| `shops.test.ts` | унікальні id, координати 0–100, є `isProduction`, похідні збігаються |
| `content.test.ts` | немає залишкової лексики Kratea в даних; форма blog/landing/faq |
| `CartContext.test.tsx` | додавання/злиття/видалення/нуль-guard + localStorage-персист |
| `orders.test.ts` | zod-схема: доставка/самовивіз, телефон, email, слот, оплата |
| `routes-prerender.test.ts` | кожен top-level маршрут присутній у `prerender.ts` та `App.tsx` |

### …edge-функцію

`supabase/functions/<name>/index.ts` (Deno). Локально не тайпчекається нашим
`tsc`. Деплой: `supabase functions deploy <name>`. Секрети:
`supabase secrets set KEY=...`.

## CI

`.github/workflows/ci.yml`, Node 22:

- job **verify** — `npm ci` → `typecheck` → `lint` → `test` → `build`.
- job **e2e** — `npx playwright install --with-deps chromium` → `playwright test
  --project=chromium`.

Обидва — на кожен push у `main` і кожен PR. `VITE_*` у CI — плейсхолдери, жоден
тест не ходить у реальний бекенд.

## Типові граблі

- **Порт 4173 зайнятий стороннім сервером** → Playwright з `reuseExistingServer`
  підхоплює його замість `vite preview`, усі тести падають із «no h1». Звільни порт.
- **`npm run lint` червоний локально, зелений у CI** → лінт чіпляє теки-знімки
  (`.reference-kratea/`, `.previous-landing/`), яких у CI нема. Вони вже в
  `ignores` в `eslint.config.js`.
- **Білий екран після деплою** → на хостингу не задані `VITE_SUPABASE_*`.
  Зараз клієнт не падає (плейсхолдер), але перевір env.
