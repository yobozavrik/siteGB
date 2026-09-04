# План перебудови сайту «Галя Балувана»

> Пошаговый план з тестами і перевірками. Кожен крок закінчується **зеленим гейтом**
> (typecheck + lint + test + build, де застосовно) і **комітом**. Пуш у `origin/main`
> робимо в кінці кожної фази — Vercel піднімає новий деплой автоматично.

## Статус

| Фаза | Стан |
|---|---|
| Ф0 — гігієна репо, `site.ts`, `vercel.json` | ✅ |
| Ф1 — контентний шар (catalog / shops / delivery / recipes / landings) | ✅ |
| Ф2 — модель кошика + localStorage + схема замовлення | ✅ |
| Ф3 — маршрути, `SiteLayout`, редіректи | ✅ |
| Ф4 — каталог: меню, категорія, товар | ✅ |
| Ф5 — кошик і оформлення (delivery/pickup), підтвердження | ✅ |
| Ф6 — контентні сторінки (доставка, магазини, про нас, контакти, франшиза, блог) | ✅ |
| Ф7 — SEO / prerender / sitemap | ✅ |
| Ф8 — ассети: прибрано медіа Kratea, розбито vendor-чанк, lazy admin | ✅ (hero-webp — TODO) |
| Ф9 — README / SETUP / ARCHITECTURE / CI | ✅ |
| Ф10 — деплой і приймання | ⏳ мерж у `main` + env на Vercel + `supabase db push` |

Гейт станом на кінець Ф9: `typecheck` (tsc -b) + `lint` + `test` (48) + `build`
(64 prerendered) + `playwright` (7) — усе зелено.

---

## Контекст

Репозиторій — форк сторфронту **Kratea** (енергетики), частково перелицьований під
«Галя Балувана». Стек лишається: **Vite 5 + React 18 + TypeScript + Tailwind + shadcn/ui +
React Router + Supabase (Postgres, RLS, edge functions) + Vitest + Playwright + prerender**.

**Що вже є:** головна (`Index.tsx`) зі стабовими секціями Галі; кошик (React context);
checkout → Supabase `orders` → Telegram edge-функція; адмінка за секретом; SVG-мапа України;
22 prerendered-сторінки.

**Що не так:** усі внутрішні сторінки (`/about`, `/contact`, `/where-to-buy`,
`/collaboration`, `/blog`, лендінги) — контент Kratea (GABA, кава-кава, пиво-рітейл);
немає каталогу товарів і сторінки товару; `CartItem` — «напоєвий» (`flavor`);
SEO/prerender/JSON-LD прибиті до `kratea-official.com`; `storeData.ts` — мережі пивних
магазинів, не точки «Галя Балувана».

**Цільова архітектура** — див. [ARCHITECTURE.md](ARCHITECTURE.md).

### Базова лінія (зафіксовано перед стартом)

| Перевірка | Команда | Стан |
|---|---|---|
| Типи | `npm run typecheck` | ✅ 0 помилок |
| Лінт | `npm run lint` | ❌ локально падає через `.reference-kratea/` (у CI зелено — теки в `.gitignore`) |
| Юніт | `npm test` | ✅ 10 тестів (`CartContext`) |
| Білд | `npm run build` | ✅ 22 HTML, але маршрути ще Kratea; hero-png 2.8 МБ |

---

## Умовні позначення

- **Файли:** `+` новий, `~` змінити, `−` видалити.
- **Гейт** = послідовно `npm run typecheck && npm run lint && npm test && npm run build`.
  Для фаз з UI додається `npx playwright test`.
- Команди білда локально потребують env: `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_URL`,
  `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SITE_URL` (для локалі згодяться плейсхолдери).

---

## Фаза 0 — Гігієна репозиторію та конфіг

**Мета:** локальні перевірки = CI; єдине джерело правди для бренд-констант; SPA-роутинг на Vercel.

### 0.1 Полагодити локальний лінт
- `~ eslint.config.js` — додати в `ignores`: `.reference-kratea/**`, `.previous-landing/**`,
  `.playwright-cli/**`, `dist/**`, `docs/**`.
- **Перевірка:** `npm run lint` → exit 0 локально.

### 0.2 Бренд-константи
- `+ src/config/site.ts` — експорт: `SITE_URL` (з `import.meta.env.VITE_SITE_URL` +
  фолбек `https://galya-baluvana.vercel.app`), `BRAND` (`"Галя Балувана"`), `PHONE`, `EMAIL`,
  `SOCIALS` (instagram/facebook/telegram/viber), `WORK_HOURS`, `DELIVERY_FREE_FROM`,
  `MIN_ORDER`, `SUPPORT_HOURS`.
- **Тест:** `+ src/test/config.test.ts` — `SITE_URL` починається з `http`, `PHONE` матчить
  `/^\+380/`, усі соцлінки — валідні URL.

### 0.3 Vercel + метадані пакета
- `+ vercel.json` — `buildCommand: "npm run build"`, `outputDirectory: "dist"`,
  `rewrites: [{ "source": "/(.*)", "destination": "/index.html" }]` (SPA-фолбек, але
  prerendered-теки віддаються як є, бо мають власний `index.html`),
  `headers` для `assets/*` (`cache-control: immutable`).
- `~ package.json` — `name: "galya-baluvana"`, прибрати `repository/bugs/homepage` Kratea або
  замінити на `yobozavrik/siteGB`; `description` під Галю.
- `~ index.html` — `lang="uk"` вже є; `google-site-verification` — прибрати (додати свій потім).
- **Перевірка:** `npm run build` → exit 0; `grep -ri kratea package.json vercel.json` → пусто.

### Гейт 0 + коміт: `chore: repo hygiene, brand config, vercel SPA rewrites`

---

## Фаза 1 — Контентний шар (доменні дані)

**Мета:** типізовані статичні дані для всього сайту. Жодного UI ще.

### 1.1 Каталог
- `+ src/data/catalog.ts`:
  - `Category` = `{ slug, title, blurb, sort }` — 8 категорій: пельмені-хінкалі, вареники,
    млинці, сирники, чебуреки, голубці-перці, котлети-тефтелі, десерти.
  - `Product` = `{ id, slug, categorySlug, title, weightGrams, unitLabel, priceUAH,
    tags: ('hit'|'new'|'lenten'|'spicy')[], composition, kbju: {kcal,protein,fat,carb},
    cooking, storage, allergens, images: string[], isActive }`.
  - Гелпер `pricePer100g(p)` і `getProduct(slug)`, `productsByCategory(slug)`.
  - Сід: **≥ 24 товари** з реалістичними ГБ-стравами і цінами (₴ за упаковку).
- `+ src/data/delivery.ts` — `zones` (Лівий берег / Правий берег / Приміська / Інші міста —
  вартість, безкоштовно від, час), `paymentMethods`, `pickupNote`.
- **Тест:** `+ src/test/catalog.test.ts`:
  - усі `slug` унікальні; `categorySlug` існує в `categories`;
  - `priceUAH > 0`, `weightGrams > 0`, `images.length >= 1`, `kbju` всі поля `>= 0`;
  - `pricePer100g` рахує вірно на відомому прикладі;
  - кожна категорія має ≥ 1 активний товар.

### 1.2 Точки продажу
- `~ src/data/storeData.ts` → `+ src/data/shops.ts` (старий лишити тимчасово, щоб не ламати
  імпорти; видалити у Фазі 6):
  - `Shop` = `{ id, city, address, district?, hours, phone, features: string[],
    x, y, isProduction }` — `x/y` у % для SVG-мапи (координати міст переносимо зі `storeData`).
  - Сід: **≥ 6 міст**, у кожному 1–5 точок «Галя Балувана» (не сторонні мережі).
  - Деривати: `totalShops`, `cities`, `citiesWithCounts`.
- **Тест:** `+ src/test/shops.test.ts` — усі `id` унікальні; `x,y ∈ [0,100]`; кожна точка
  має `city`, `hours`, `phone`; `totalShops` = сумі; є ≥ 1 `isProduction`.

### 1.3 Рецепти (заміна блогу)
- `~ src/data/blogPosts.ts` — той самий тип `BlogPost`, новий контент: 6 статей про
  домашню кухню з напівфабрикатів (як зварити вареники, скільки зберігати, меню на тиждень,
  соуси, підморожування, святковий стіл). `category` → «Рецепти» / «Поради» / «Зберігання».
- **Тест:** `~` наявний прогін prerender не ламається; `+ src/test/content.test.ts` —
  у `blogPosts` немає рядків `KRATEA|GABA|кава-кава|канна` (антирегрес Kratea-контенту).

### 1.4 Лендінги (SEO)
- `~ src/data/landingPages.ts` — переписати під:
  - keyword: «вареники з вишнею купити», «пельмені ручного ліплення», «домашні
    напівфабрикати з доставкою»;
  - city: «Домашні напівфабрикати Київ / Львів / Одеса / Дніпро / Харків».
  - Прибрати `compare` (Red Bull).
- **Тест:** `~ src/test/content.test.ts` — те саме антирегрес-правило на `landingPages`.

### Гейт 1 (`typecheck + lint + test`) + коміт: `feat(data): catalog, shops, recipes, SEO landings for Galya`

---

## Фаза 2 — Модель кошика й замовлення

**Мета:** кошик під їжу + збереження + розширена схема замовлення.

### 2.1 `CartItem` під їжу
- `~ src/context/CartContext.tsx`:
  - `CartItem` = `{ id, slug, title, unitLabel, priceUAH, quantity, image }`
    (замість `name/flavor/price`).
  - Додати **persist у `localStorage`** (`try/catch`, ключ `gb.cart.v1`),
    гідрація на старті, запис на зміну.
  - `updateQuantity(id, 0)` — лишити видалення рядка.
- `~ src/test/CartContext.test.tsx` — оновити під нові поля; додати тести:
  «стан читається з localStorage», «битий localStorage не валить провайдер».

### 2.2 Схема замовлення
- `~ src/lib/orders.ts`:
  - `orderFormSchema` додати: `deliveryType: 'delivery'|'pickup'`, `shopId?` (обов'язковий
    при `pickup`), `timeSlot: string`, `paymentMethod: 'cash'|'card_courier'|'online'`.
  - `email` зробити **необов'язковим** (для їжі критичніший телефон) — `phone` зробити
    обов'язковим `min(10)`.
  - `createOrder` — прокинути нові поля в `insert` і в тіло `telegram-order-notify`.
- `+ supabase/migrations/<ts>_galya_order_fields.sql` — `ALTER TABLE public.orders ADD COLUMN
  IF NOT EXISTS delivery_type text, ADD COLUMN IF NOT EXISTS shop_id text, ADD COLUMN
  IF NOT EXISTS time_slot text, ADD COLUMN IF NOT EXISTS payment_method text;` (усі nullable —
  безпечно для наявних даних).
- `~ src/integrations/supabase/types.ts` — руками додати 4 колонки в `orders.Row/Insert/Update`.
- **Тест:** `+ src/test/orders.test.ts`:
  - валідна доставка / валідний самовивіз проходять; `pickup` без `shopId` — помилка;
  - порожній `phone` — помилка; сума ≤ 0 — помилка;
  - `getFieldErrors` повертає перше повідомлення на поле.

### Гейт 2 (`typecheck + lint + test`) + коміт: `feat(cart,orders): food cart model, localStorage persist, delivery/pickup schema`

---

## Фаза 3 — Маршрутизація та каркаси сторінок

**Мета:** усі реальні маршрути існують і віддають 200; спільний layout; хедер/футер під реальні лінки.

### 3.1 Маршрути
- `~ src/App.tsx` — маршрути:
  `/`, `/menu`, `/menu/:category`, `/product/:slug`, `/cart`, `/checkout`, `/order/:id`,
  `/delivery`, `/shops`, `/about`, `/contacts`, `/blog`, `/blog/:slug`, `/franchise`,
  + city/keyword лендінги з `landingPages`, `*` → `NotFound`.
- **Редіректи** старих Kratea-URL (`<Navigate replace>`): `/where-to-buy`→`/shops`,
  `/collaboration`→`/franchise`, `/contact`→`/contacts`.
- `+ src/components/SiteLayout.tsx` — `<Header/><CartDrawer/><main>{children}</main><Footer/>`
  + приймає проп для `<SEO/>`.

### 3.2 Хедер/футер
- `~ src/components/Header.tsx` — навігація на `Link`-и: Меню, Доставка, Магазини, Про нас,
  Блог, Контакти; кнопка кошика веде на `/cart` на мобільному, відкриває drawer на десктопі.
- `~ src/components/Footer.tsx` — колонки з реальними `Link`-ами + контакти з `site.ts`.
- `~ src/components/GalyaSections.tsx` — секції головної перевести з `#anchor` на `Link` до
  реальних сторінок (частину лишити як прев'ю-блоки на головній).

### 3.3 Каркаси нових сторінок (мінімальний рендер даних + `<SEO>`)
- `+ src/pages/MenuPage.tsx`, `CategoryPage.tsx`, `ProductPage.tsx`, `CartPage.tsx`,
  `CheckoutPage.tsx`, `OrderPage.tsx`, `DeliveryPage.tsx`, `ShopsPage.tsx`, `ContactsPage.tsx`,
  `FranchisePage.tsx`. (`AboutPage`, `BlogPage`, `BlogPostPage`, `LandingPage`, `NotFound` — ~).

### 3.4 E2E під нові маршрути
- `~ e2e/storefront.spec.ts`:
  - `toHaveTitle(/Галя Балувана/i)`;
  - список маршрутів → усі `< 400`: `/menu /menu/vareniki /product/<будь-який> /cart
    /checkout /delivery /shops /about /blog /contacts /franchise`;
  - невідомий маршрут → 404-сторінка;
  - «немає битих зображень» на `/`, `/menu`, `/product/<slug>`.

### Гейт 3 (повний + `playwright`) + коміт + **push** → `feat(routing): real multi-page structure, shared layout, redirects`

---

## Фаза 4 — Каталог (UX)

**Мета:** робочі меню, категорія, сторінка товару, додавання в кошик.

- `+ src/components/catalog/ProductCard.tsx`, `CategoryTile.tsx`, `Price.tsx`, `Tag.tsx`.
- `~ MenuPage` — усі категорії плиткою + сітка товарів.
- `~ CategoryPage` — фільтри (теги, діапазон ціни, сорт), сітка, порожній стан.
- `~ ProductPage` — галерея, ціна за упаковку + за 100 г, лічильник, «Додати в кошик»,
  вкладки (Склад / Приготування / Зберігання / Алергени) на `@/components/ui/tabs`,
  таблиця КБЖУ, блок «З цим беруть» (3–4 товари тієї ж/суміжної категорії).
- **Тести:**
  - `+ src/test/ProductCard.test.tsx` — рендерить назву, ціну, «за 100 г», мітки.
  - `~ e2e` — «клік `Додати` на `/menu` збільшує лічильник кошика»; «вкладки на товарі
    перемикають контент»; «на `/product` є `h1` і ціна».

### Гейт 4 (повний + `playwright`) + коміт + **push** → `feat(catalog): menu, category filters, product page`

---

## Фаза 5 — Кошик і оформлення

- `~ CartPage` — рядки з лічильниками, підсумок, поле промокоду (візуальний стаб),
  підказка «до безкоштовної доставки лишилось …», кнопка «Оформити» → `/checkout`,
  порожній стан із лінком у меню.
- `~ CheckoutPage` — форма з `react-hook-form` + `orderFormSchema`:
  контакти → перемикач Доставка/Самовивіз → (адреса+зона | вибір магазину) →
  дата+слот (чіпи) → оплата (радіо) → коментар; **липкий підсумок** збоку;
  сабміт → `createOrder` → `navigate('/order/'+id)`.
- `~ CartDrawer` — кнопка «Оформлення» тепер `Link` на `/checkout` (модалку `CheckoutModal`
  прибрати з дерева; файл лишити до Фази 8).
- `+ OrderPage` — «Дякуємо», номер замовлення, що далі, лінк у меню; читає `:id` з URL
  (без запиту в БД — RLS її не віддасть).
- **Тести:**
  - `+ src/test/checkout.schema.test.ts` — сценарії форми (delivery/pickup/невалід).
  - `~ e2e` (guard: тільки якщо `VITE_SUPABASE_URL` не плейсхолдер — інакше `test.skip`):
    повний прохід меню→товар→кошик→checkout→`/order/:id`.
  - `~ e2e` без бекенда: сабміт з порожніми полями показує помилки валідації.

### Гейт 5 (повний + `playwright`) + коміт + **push** → `feat(checkout): cart page, delivery/pickup checkout, order confirmation`

---

## Фаза 6 — Контентні сторінки

- `~ DeliveryPage` — таблиця зон, способи оплати, самовивіз (з `delivery.ts`).
- `~ ShopsPage` — `UkraineMap` + список точок, фільтр за містом, лічильники.
- `~ src/components/UkraineMap.tsx` — прибрати `chains` Kratea, кружечки за кількістю
  точок ГБ у місті, клік по місту фільтрує список.
- `~ AboutPage` — «Кухня за склом»: історія, «відкрите виробництво», факти-числа
  (рік, к-сть магазинів, «0 консервантів»), без Kratea-лексики.
- `~ ContactsPage` — контакти з `site.ts` + форма (`contact_messages`), міні-мапа-заглушка.
- `~ FranchisePage` — оффер + форма заявки (пише в `contact_messages` з тегом, або
  reuse контактної форми з полем «тип звернення»).
- `~ BlogPage` / `BlogPostPage` — рендер рецептів, хлібні крихти, схожі статті.
- `~ LandingPage` — рендер нових city/keyword лендінгів, CTA → `/menu` або `/shops`.
- `− src/data/storeData.ts` — видалити, поправити останні імпорти.
- **Тести:** `~ e2e` — кожна сторінка має `h1`, рендериться без падінь; контактна форма —
  юніт на валідацію; `content.test.ts` розширити на `AboutPage`/`DeliveryPage` рядки.

### Гейт 6 (повний + `playwright`) + коміт + **push** → `feat(content): delivery, shops, about, contacts, franchise, recipes`

---

## Фаза 7 — SEO, метадані, prerender

- `~ index.html` — усі `<meta>`, OG, `theme-color` (тепла палітра), JSON-LD →
  `FoodEstablishment` + `Organization` (назва, телефон, `areaServed` міста, `sameAs` соцмережі),
  `og:site_name` = «Галя Балувана».
- `~ src/components/SEO.tsx` — `SITE_URL` з `site.ts`; `og:site_name` бренд; хелпер для
  `Product` JSON-LD (назва, ціна, `priceCurrency: "UAH"`, `availability`).
- `~ scripts/prerender.ts`:
  - `BASE_URL` з `process.env.VITE_SITE_URL` (фолбек — прод-домен);
  - `staticRoutes` = нові сторінки з правильними `title/description/h1/intro`;
  - додати маршрути `/menu`, `/menu/:category` (з `categories`), `/product/:slug`
    (з `catalog`), лендінги, рецепти;
  - генерувати `dist/sitemap.xml` з усього набору маршрутів (замість статичного файлу).
- `~ public/robots.txt`, `~ public/llms.txt` — під Галю; `~ public/sitemap.xml` — прибрати
  (генерується білдом) або лишити як фолбек.
- **Тести:**
  - `+ src/test/routes-prerender.test.ts` — кожен top-level маршрут з `App.tsx` присутній у
    списку prerender (антидрейф).
  - `~ e2e` — `/` та `/product/<slug>` мають `<title>` з брендом і не-порожній `meta[description]`.
  - Ручна перевірка: `npm run build` → у `dist/` є теки `menu/`, `product/<slug>/`,
    `sitemap.xml` містить нові URL, у HTML немає `kratea`.

### Гейт 7 (повний + `playwright`) + коміт + **push** → `feat(seo): Galya metadata, JSON-LD, dynamic prerender + sitemap`

---

## Фаза 8 — Ассети та чистка

- `− src/assets/can-*.png`, `hero-cans*`, `hero-forest*`, `power-of-nature*`, `pocket-cans*`,
  `kratea-logo-leaf.png` — прибрати; поправити імпорти.
- `+ src/assets/placeholder-dish.svg` (легкий) — фолбек для товарів без фото;
  `ProductCard`/`ProductPage` використовують його при відсутньому файлі.
- `~ galya-hero-food.png` — стиснути (ціль < 400 КБ) або замінити на `.webp`; додати
  `loading`/`width`/`height`.
- `~ public/og-image.jpg`, `favicon.png` — лишити плейсхолдер, позначити в README як «замінити».
- `~ vite.config.ts` — `build.rollupOptions.output.manualChunks` (розбити vendor: react,
  router, framer-motion, supabase) щоб прибрати попередження > 500 КБ.
- **Тести:** `~ e2e` «немає битих зображень» на `/`, `/menu`, `/product`, `/shops`;
  `npm run lint` — 0 unused-import; `npm run build` — без chunk-warning або з піднятим лімітом.

### Гейт 8 (повний + `playwright`) + коміт + **push** → `chore(assets): drop Kratea media, compress hero, split vendor chunks`

---

## Фаза 9 — Документація і CI

- `~ README.md`, `~ SETUP.md`, `~ CONTRIBUTING.md` — під «Галя Балувана», нові скріншоти
  (`docs/screenshots/*` перезняти або позначити застарілими).
- `~ .env.example` — без нових обов'язкових змінних (усі секрети лишаються у Supabase).
- `~ .github/workflows/ci.yml` — `node-version` вирівняти з `.nvmrc`; переконатись, що
  `npm run build` у CI отримує `VITE_*` (вже є).
- `~ docs/ARCHITECTURE.md` — фіналізувати за фактом реалізації.
- **Перевірка:** повний гейт локально; відкрити PR / пуш у `main`, дочекатись зеленого CI
  (`verify` + `e2e`).

### Гейт 9 + коміт + **push** → `docs: rewrite README/SETUP/ARCHITECTURE for Galya; align CI node`

---

## Фаза 10 — Деплой і приймання

**Vercel (Project → Settings → Environment Variables):**

| Змінна | Значення |
|---|---|
| `VITE_SUPABASE_PROJECT_ID` | ref проєкту Supabase |
| `VITE_SUPABASE_URL` | `https://<ref>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | anon public key |
| `VITE_SITE_URL` | продакшн-домен (напр. `https://galya-baluvana.vercel.app`) |

**Supabase:**
- `supabase db push` — застосувати нову міграцію `*_galya_order_fields.sql`.
- Перевірити, що edge-функції задеплоєні; секрети `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`,
  `ADMIN_SECRET_KEY` виставлені.

**Чек-лист приймання (прод):**
- [ ] `/` відкривається, hero без битих картинок, `<title>` містить «Галя Балувана»
- [ ] `/menu` → категорія → товар → «Додати в кошик» → лічильник росте
- [ ] `/cart` → `/checkout`: валідація працює; тестове замовлення створюється; приходить Telegram
- [ ] `/shops` — мапа клікабельна, список фільтрується за містом
- [ ] `/delivery`, `/about`, `/contacts`, `/blog`, `/franchise` — рендеряться, є `h1`
- [ ] 404 на невідомому URL
- [ ] `view-source` головної й товару: коректні `meta`/OG/JSON-LD, канонікал на прод-домен
- [ ] `/<домен>/sitemap.xml` містить menu/product/lending URL
- [ ] Lighthouse (mobile) Performance ≥ 80, SEO ≥ 95
- [ ] CI на `main` — зелений (`verify` + `e2e`)

---

## Матриця тестів (підсумок)

| Рівень | Файл | Покриває |
|---|---|---|
| Unit | `src/test/config.test.ts` | бренд-константи валідні |
| Unit | `src/test/catalog.test.ts` | інваріанти каталогу, `pricePer100g` |
| Unit | `src/test/shops.test.ts` | інваріанти точок, деривати |
| Unit | `src/test/content.test.ts` | немає Kratea-лексики в даних/сторінках |
| Unit | `src/test/CartContext.test.tsx` | кошик + localStorage-persist |
| Unit | `src/test/orders.test.ts` / `checkout.schema.test.ts` | схема замовлення, гілки delivery/pickup |
| Unit | `src/test/ProductCard.test.tsx` | рендер картки товару |
| Unit | `src/test/routes-prerender.test.ts` | маршрути ↔ prerender (антидрейф) |
| E2E | `e2e/storefront.spec.ts` | заголовки, усі маршрути 200, 404, биті картинки, funnel, вкладки товару |
| CI | `.github/workflows/ci.yml` | typecheck + lint + test + build, потім Playwright |

## Порядок робіт (швидка пам'ятка)

```
Ф0 конфіг ─▶ Ф1 дані ─▶ Ф2 кошик/замовлення ─▶ Ф3 маршрути ─▶ Ф4 каталог
   ─▶ Ф5 checkout ─▶ Ф6 контент ─▶ Ф7 SEO ─▶ Ф8 ассети ─▶ Ф9 доки/CI ─▶ Ф10 деплой
```
