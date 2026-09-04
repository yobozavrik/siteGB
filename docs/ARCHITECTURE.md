# Архітектура сайту «Галя Балувана»

Онлайн-вітрина магазину домашніх напівфабрикатів: перегляд меню, кошик, оформлення
замовлення (доставка або самовивіз), карта точок, рецепти, франшиза.

## 1. Стек і чому саме він

| Шар | Вибір | Роль |
|---|---|---|
| Збірка | Vite 5 + `@vitejs/plugin-react-swc` | швидкий dev, стандартний білд у статику |
| UI | React 18 + Tailwind + shadcn/ui (Radix) | компонентна база, доступні примітиви |
| Роутинг | React Router 6 | клієнтські маршрути + редіректи |
| Стан | React Context (кошик) + TanStack Query (майб. серверні дані) | кошик живе в пам'яті + `localStorage` |
| Дані каталогу/точок/рецептів | типізовані TS-модулі в `src/data` | контент без БД, миттєвий рендер, SEO-friendly |
| Бекенд | Supabase — Postgres + RLS + Deno edge functions | замовлення, звернення, адмінка, Telegram, AI |
| SEO | `react-helmet-async` + `scripts/prerender.ts` | пер-маршрутні `<meta>` + статичні HTML |
| Тести | Vitest + Testing Library (unit), Playwright (e2e) | інваріанти даних, кошик, наскрізні сценарії |
| Хостинг | Vercel (статика `dist/`) + Supabase (керовано) | автодеплой з `main` |

**Принцип:** каталог, точки, рецепти, лендінги — **статичні дані в репозиторії**.
База потрібна лише для того, що створює користувач: `orders`, `contact_messages`.
Це дає нульовий час до першого рендеру, повний контроль SEO і просте локальне середовище.

## 2. Карта маршрутів

```
/                     Головна — hero, категорії, хіти, «як працюємо», доставка, точки
/menu                 Каталог — усі категорії + сітка товарів
/menu/:category       Категорія — фільтри (теги/ціна/сорт), сітка
/product/:slug        Товар — галерея, ціна за упаковку і за 100 г, склад, КБЖУ,
                      приготування, зберігання, алергени, «з цим беруть»
/cart                 Кошик — рядки, лічильники, підсумок, промокод, → checkout
/checkout             Оформлення — контакти, доставка/самовивіз, зона/магазин,
                      дата+слот, оплата, коментар, липкий підсумок
/order/:id            Підтвердження — номер замовлення, що далі
/delivery             Доставка та оплата — зони, тарифи, способи оплати, самовивіз
/shops                Магазини — SVG-мапа України + список точок, фільтр за містом
/about                Про нас — «кухня за склом», історія, факти
/contacts             Контакти + форма зворотного зв'язку (→ contact_messages)
/blog                 Рецепти та поради (статичні статті)
/blog/:slug           Стаття
/franchise            Франшиза — оффер + форма заявки
/admin                Адмінка замовлень (за server-side секретом, edge-функція)
/<city|keyword>       SEO-лендінги з src/data/landingPages.ts
*                     404

Редіректи (спадок Kratea): /where-to-buy→/shops · /collaboration→/franchise · /contact→/contacts
```

## 3. Дерево файлів (цільове)

```
src/
├─ config/
│  └─ site.ts                 # SITE_URL, бренд, телефон, соцмережі, умови доставки — єдине джерело
├─ pages/                     # один файл на маршрут
│  ├─ Index.tsx  MenuPage.tsx  CategoryPage.tsx  ProductPage.tsx
│  ├─ CartPage.tsx  CheckoutPage.tsx  OrderPage.tsx
│  ├─ DeliveryPage.tsx  ShopsPage.tsx  AboutPage.tsx  ContactsPage.tsx
│  ├─ BlogPage.tsx  BlogPostPage.tsx  FranchisePage.tsx  LandingPage.tsx
│  ├─ AdminPage.tsx  NotFound.tsx
├─ components/
│  ├─ SiteLayout.tsx          # Header + CartDrawer + main + Footer + SEO-слот
│  ├─ Header.tsx  Footer.tsx  SEO.tsx  ScrollToTop.tsx
│  ├─ HeroSection.tsx  GalyaSections.tsx   # блоки головної
│  ├─ catalog/                # ProductCard, CategoryTile, Price, Tag, ProductGallery, ProductTabs
│  ├─ cart/                   # CartDrawer, CartLine, OrderSummary
│  ├─ checkout/               # CheckoutForm, DeliveryToggle, TimeSlots, PaymentChoice
│  ├─ shops/                  # UkraineMap, ShopList
│  ├─ admin/                  # AnalyticsCharts, ContactMessagesSection, MarketingAISection
│  └─ ui/                     # shadcn примітиви (не чіпаємо)
├─ context/
│  └─ CartContext.tsx         # items, add/remove/update, totals, isCartOpen, localStorage
├─ data/                      # СТАТИЧНИЙ КОНТЕНТ
│  ├─ catalog.ts              # Category[], Product[], гелпери (pricePer100g, getProduct…)
│  ├─ shops.ts                # Shop[], деривати (totalShops, cities, citiesWithCounts)
│  ├─ delivery.ts             # zones[], paymentMethods[], pickupNote
│  ├─ blogPosts.ts            # рецепти/поради
│  └─ landingPages.ts         # SEO city/keyword сторінки
├─ lib/
│  ├─ orders.ts               # zod-схема замовлення, createOrder(), статуси
│  └─ utils.ts                # cn() тощо
├─ integrations/supabase/
│  ├─ client.ts               # createClient з VITE_* env
│  └─ types.ts                # згенеровані типи БД (правимо руками при міграції)
├─ hooks/  test/  assets/
supabase/
├─ migrations/                # історія схеми — застосовувати по порядку
└─ functions/                 # telegram-order-notify · admin-orders · customer-support · marketing-ai
scripts/prerender.ts          # генерує статичні HTML + sitemap.xml на кожен маршрут
e2e/storefront.spec.ts        # Playwright
docs/                         # PLAN.md, ARCHITECTURE.md, screenshots/
```

## 4. Доменні моделі

### Product (`src/data/catalog.ts`)
```ts
type ProductTag = 'hit' | 'new' | 'lenten' | 'spicy';
interface Category { slug: string; title: string; blurb: string; sort: number }
interface Product {
  id: string;
  slug: string;                 // /product/:slug
  categorySlug: string;         // FK → Category.slug
  title: string;
  weightGrams: number;
  unitLabel: string;            // «упаковка 0,5 кг · ~28 шт»
  priceUAH: number;             // за упаковку
  tags: ProductTag[];
  composition: string;
  kbju: { kcal: number; protein: number; fat: number; carb: number }; // на 100 г
  cooking: string;
  storage: string;              // «−18 °C до 30 діб»
  allergens: string;
  images: string[];             // шляхи; порожньо → placeholder-dish.svg
  isActive: boolean;
}
// pricePer100g(p) = Math.round(p.priceUAH / p.weightGrams * 100)
```

### Shop (`src/data/shops.ts`)
```ts
interface Shop {
  id: string; city: string; district?: string;
  address: string; hours: string; phone: string;
  features: string[];              // «виробництво за склом», «паркінг»
  x: number; y: number;            // % на SVG-мапі
  isProduction: boolean;
}
```

### Order (`src/lib/orders.ts` + таблиця `orders`)
```ts
interface OrderForm {
  name: string; phone: string; email?: string;
  deliveryType: 'delivery' | 'pickup';
  city?: string; address?: string; zone?: string;   // для delivery
  shopId?: string;                                   // для pickup (обов'язково)
  timeSlot: string;                                  // «Завтра 12:00–14:00»
  paymentMethod: 'cash' | 'card_courier' | 'online';
  comment?: string;
}
// createOrder(): insert у public.orders → invoke('telegram-order-notify') fire-and-forget
```

## 5. Потік замовлення

```
Меню / Товар ──addItem──▶ CartContext(items, localStorage)
      │                         │
      ▼                         ▼
   /cart ────────────────▶ /checkout ──orderFormSchema.parse──▶ createOrder()
                                               │
                        supabase.from('orders').insert(...)   [RLS: INSERT дозволено, SELECT — ні]
                                               │
                        supabase.functions.invoke('telegram-order-notify')  [токен лише в секретах]
                                               │
                                               ▼
                                      navigate('/order/:id')  — «Дякуємо»
```

Адмін читає замовлення **лише** через edge-функцію `admin-orders` (service-role ключ,
захищено `ADMIN_SECRET_KEY`). Клієнт ніколи не має доступу на читання `orders`.

## 6. Модель безпеки (Supabase RLS)

| Таблиця | INSERT (anon) | SELECT (anon) | UPDATE/DELETE (anon) |
|---|---|---|---|
| `orders` | ✅ (публічний checkout) | ❌ (тільки edge-функція) | ❌ |
| `contact_messages` | ✅ (форми) | ❌ | ❌ |

- `anon` ключ безпечно потрапляє в бандл — його захищає RLS.
- `service_role` ключ — **лише** в секретах edge-функцій, ніколи в клієнті.
- Секрети (`TELEGRAM_BOT_TOKEN`, `ADMIN_SECRET_KEY`, `AI_API_KEY`) — Supabase function secrets.
- Міграції `20260403111927`/`112255` знімають дозвільні read-політики, `112322` додає явні
  denies — застосовувати **строго по порядку**.

## 7. SEO

- **Пер-маршрутні мета** — `SEO.tsx` через `react-helmet-async`: `title`, `description`,
  `canonical`, OG, Twitter, JSON-LD.
- **Prerender** (`scripts/prerender.ts`, postbuild) — на кожен маршрут пише
  `dist/<route>/index.html` з правильними `<title>/<meta>/canonical/OG` і прихованим
  above-the-fold блоком (`h1` + intro) для краулерів без JS. React гідратується поверх.
- **JSON-LD:** `Organization` + `FoodEstablishment` (сайт), `Product` (сторінки товарів),
  `BreadcrumbList` (категорії/товар/стаття).
- **`sitemap.xml`** генерується білдом з повного списку маршрутів (статика +
  категорії + товари + лендінги + рецепти).
- Канонічний домен — `VITE_SITE_URL` (Vercel env), фолбек у коді.

## 8. Оточення (env)

| Змінна | Де | Призначення |
|---|---|---|
| `VITE_SUPABASE_PROJECT_ID` | Vercel, `.env` | ідентифікатор проєкту |
| `VITE_SUPABASE_URL` | Vercel, `.env` | endpoint Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Vercel, `.env` | anon public ключ (безпечний у бандлі) |
| `VITE_SITE_URL` | Vercel, `.env` | канонічний домен для SEO/prerender |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Supabase secrets | сповіщення про замовлення |
| `ADMIN_SECRET_KEY` | Supabase secrets | захист `admin-orders` |
| `AI_API_KEY` (+ overrides) | Supabase secrets | опційні AI-функції (чат, копірайт) |

## 9. Розгортання

1. Push у `main` → Vercel build (`npm run build` = `vite build` + prerender) → деплой `dist/`.
2. Vercel env — 4 `VITE_*` змінні (див. §8).
3. `vercel.json` — SPA-rewrite на `/index.html` (prerendered-теки віддаються як є).
4. Supabase — `supabase db push` для нових міграцій; edge-функції задеплоєні; секрети виставлені.
5. CI (`.github/workflows/ci.yml`) — `verify` (typecheck/lint/test/build) + `e2e` на кожен push/PR.

## 10. Продуктивність

- Статичні дані → миттєвий контент, prerender → швидкий FCP без меж-фреймворка.
- Кошик у пам'яті + `localStorage`, без мережевих запитів до оформлення.
- SVG-мапа України замість тайл-провайдера — 0 сторонніх запитів, 0 ключів.
- Роботи: розбити vendor-чанк (`react`, `router`, `framer-motion`, `supabase`),
  стиснути hero-зображення (< 400 КБ / `.webp`), `loading`/`width`/`height` на медіа.
