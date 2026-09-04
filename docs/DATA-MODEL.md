# Моделі даних

Дві категорії:

1. **Статичний контент** — типізовані TS-масиви в `src/data/`. Не БД. Редагування
   — [CONTENT.md](CONTENT.md).
2. **Дані користувача** — таблиці Postgres у Supabase: `orders`, `contact_messages`.

---

## Статичний контент

### Category — `src/data/catalog.ts`

```ts
interface Category {
  slug: string;   // /menu/:category, латиниця
  title: string;
  blurb: string;  // підзаголовок категорії
  sort: number;   // порядок у меню
}
```

### Product — `src/data/catalog.ts`

```ts
type ProductTag = "hit" | "new" | "lenten" | "spicy";

interface Product {
  id: string;
  slug: string;            // /product/:slug
  categorySlug: string;    // FK → Category.slug
  title: string;
  weightGrams: number;
  unitLabel: string;       // "упаковка 0,5 кг · ~28 шт"
  priceUAH: number;        // за упаковку
  tags: ProductTag[];
  composition: string;
  kbju: { kcal: number; protein: number; fat: number; carb: number }; // на 100 г
  cooking: string;
  storage: string;
  allergens: string;
  images: string[];        // шляхи; [0] головне; порожньо → "/placeholder.svg"
  isActive: boolean;
}
```

Гелпери: `pricePer100g(p)` = `Math.round(priceUAH / weightGrams * 100)`,
`getProduct(slug)`, `getCategory(slug)`, `productsByCategory(slug)`,
`relatedProducts(slug, limit)`, `productImage(p)`, `activeProducts`,
`categoriesSorted`, `totalProducts`, `TAG_LABELS`.

### Shop — `src/data/shops.ts`

```ts
interface Shop {
  id: string;
  city: string;
  district?: string;
  address: string;
  hours: string;
  phone: string;
  features: string[];      // "Виробництво за склом", "Паркінг", …
  x: number; y: number;    // % на SVG-мапі України (0–100)
  isProduction: boolean;   // цех «за склом» на місці
}
```

Похідні (обчислюються, не дублюються): `totalShops`, `cities`, `totalCities`,
`citiesWithCounts` (`{ city, count, x, y, hasProduction }`), `shopsByCity(city)`,
`getShop(id)`, `productionShops`.

### DeliveryZone / PaymentMethod — `src/data/delivery.ts`

```ts
interface DeliveryZone {
  id: string; name: string;
  costUAH: number | null;      // null = за тарифом перевізника
  freeFromUAH: number | null;  // null = не буває безкоштовно
  eta: string; note?: string;
}
interface PaymentMethod {
  id: "cash" | "card_courier" | "online";
  label: string; note?: string;
  forPickup: boolean; forDelivery: boolean;
}
```
Плюс `timeSlots: string[]`, `pickupNote: string`, реекспорт `MIN_ORDER`,
`FREE_DELIVERY_FROM` з `config/site`.

### FaqItem / BlogPost / LandingPage

- `src/data/faq.ts` — `faqItems: { q, a }[]` → секція FAQ + `FAQPage` JSON-LD.
- `src/data/blogPosts.ts` — `blogPosts: BlogPost[]`; `content` = масив блоків
  `p | h2 | h3 | ul | quote`.
- `src/data/landingPages.ts` — `landingPages: LandingPage[]`; `category:
  "keyword" | "city"`; `sections` = ті ж блоки + `cta`.

---

## Кошик — `src/context/CartContext.tsx`

```ts
interface CartItem {
  id: string;        // = Product.id
  slug: string;      // для посилання назад на товар
  title: string;
  unitLabel: string;
  priceUAH: number;  // за одиницю
  quantity: number;
  image: string;
}
```

- `addItem(item, qty = 1)` — злиття за `id`, відкриває drawer.
- `updateQuantity(id, n)` — `n <= 0` видаляє рядок (regression-guard, є тест).
- `removeItem`, `clearCart`, `totalItems`, `totalPrice`, `isCartOpen`.
- Персист: `localStorage["gb.cart.v1"]`, гідрація на старті, `try/catch` на
  биту/недоступну сторедж, фільтр невалідних записів.

---

## Замовлення

### Форма — `src/lib/orders.ts` (`orderFormSchema`, zod)

```ts
interface OrderForm {
  name: string;                 // min 2
  phone: string;                // обовʼязковий, нормалізується → +380XXXXXXXXX
  email?: string;               // опційний
  deliveryType: "delivery" | "pickup";
  city?: string;                // потрібне для delivery
  address?: string;             // потрібне для delivery
  zone?: string;                // id зони
  shopId?: string;              // потрібне для pickup
  timeSlot: string;             // "Завтра 12:00–14:00"
  paymentMethod: "cash" | "card_courier" | "online";
  comment?: string;
}
```

`superRefine`: для `delivery` вимагає `city` + `address`; для `pickup` — `shopId`.
Гелпер `getFieldErrors(zodError)` → `{ field: message }`.

### `createOrder({ form, items })`

1. Нормалізує позиції кошика → валідує `orderItemsSchema`.
2. Рахує суму, перевіряє `> 0`.
3. Для `pickup` підставляє місто/адресу магазину (щоб NOT NULL колонки були
   заповнені й адмін бачив, куди видавати).
4. `supabase.from("orders").insert({...})`.
5. Fire-and-forget `supabase.functions.invoke("telegram-order-notify", {...})` —
   не блокує замовлення.
6. Повертає `{ orderId }` або `{ error }`.

### Таблиця `public.orders`

| Колонка | Тип | Нотатка |
|---|---|---|
| `id` | uuid PK | |
| `customer_name` | text NOT NULL | |
| `customer_email` | text NULL | `DROP NOT NULL` міграцією `20260904120000` |
| `customer_phone` | text NULL | фактично завжди є |
| `country` | text NOT NULL default `'Україна'` | |
| `city` | text NOT NULL | для pickup — місто магазину |
| `address` | text NOT NULL | для pickup — `"Самовивіз: <місто>, <адреса>"` |
| `comment` | text NULL | |
| `delivery_type` | text NULL | `'delivery'` \| `'pickup'` (міграція `20260904120000`) |
| `shop_id` | text NULL | id магазину для pickup |
| `time_slot` | text NULL | |
| `payment_method` | text NULL | `'cash'` \| `'card_courier'` \| `'online'` |
| `items` | jsonb NOT NULL | `[{ id, slug?, name, unit?, price, quantity }]` |
| `total_price` | numeric NOT NULL | |
| `status` | text NOT NULL default `'pending'` | `pending \| processing \| shipped \| delivered \| cancelled` |
| `created_at` / `updated_at` | timestamptz | тригер `update_updated_at_column` |

`OrderStatus`, `ORDER_STATUS_LABELS`, `ORDER_STATUS_OPTIONS`, `PAYMENT_LABELS` —
у `src/lib/orders.ts`.

### Таблиця `public.contact_messages`

| Колонка | Тип |
|---|---|
| `id` | uuid PK |
| `name` | text NOT NULL |
| `email` | text NOT NULL |
| `phone` | text NULL |
| `message` | text NULL — для франшизи з префіксом `[Франшиза] …` |
| `created_at` | timestamptz |

Пише компонент `src/components/ContactForm.tsx` (використовується на `/contacts`
і `/franchise` з різним `subjectTag`).

---

## Модель безпеки (RLS)

| Таблиця | INSERT (anon) | SELECT (anon) | UPDATE / DELETE (anon) |
|---|---|---|---|
| `orders` | ✅ публічний checkout | ❌ | ❌ |
| `contact_messages` | ✅ форми | ❌ | ❌ |

- Anon-ключ безпечний у бандлі — його захищає RLS.
- **Service-role ключ** — лише в секретах edge-функцій, ніколи в клієнті.
- Читання замовлень — тільки через edge-функцію `admin-orders` (service-role +
  `ADMIN_SECRET_KEY`).
- Міграції `20260403111927` / `112255` знімають дозвільні read-політики, `112322`
  додає явні denies — застосовувати **строго по порядку** (`supabase db push`).
- `src/integrations/supabase/types.ts` — згенеровані типи БД; при зміні схеми
  правити руками синхронно з міграцією.

---

## Edge-функції — `supabase/functions/`

| Функція | Тригер | Секрети | Що робить |
|---|---|---|---|
| `telegram-order-notify` | `createOrder` (invoke) | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | шле картку замовлення в Telegram |
| `admin-orders` | адмін-панель `/admin` | `ADMIN_SECRET_KEY` | список замовлень + зміна статусу (service-role) |
| `customer-support` | чат `CustomerSupportChat` | `AI_API_KEY` (+ `AI_GATEWAY_URL`, `AI_MODEL`) | стрімить відповіді з OpenAI-сумісного шлюзу; системний промпт знає меню/ціни/доставку |
| `marketing-ai` | адмін → `MarketingAISection` | `AI_API_KEY` | генерує описи товарів / кампаній |

`SUPABASE_URL` і `SUPABASE_SERVICE_ROLE_KEY` доступні функціям автоматично.
