# Редагування контенту

Увесь контент сайту (крім замовлень) — це звичайні текстові файли в теці
`src/`. Змінив → закомітив → запушив у `main` → Vercel за 1–2 хв оновлює сайт.

> Якщо не працюєш із git — передай зміни розробнику текстом за зразками нижче.

## Зміст

- [Що де лежить](#що-де-лежить)
- [Товари й категорії](#товари-й-категорії) — `src/data/catalog.ts`
- [Фото товарів](#фото-товарів)
- [Магазини](#магазини) — `src/data/shops.ts`
- [Доставка й оплата](#доставка-й-оплата) — `src/data/delivery.ts`
- [Контакти, телефон, соцмережі](#контакти-телефон-соцмережі) — `src/config/site.ts`
- [FAQ на головній](#faq-на-головній) — `src/data/faq.ts`
- [Рецепти / блог](#рецепти--блог) — `src/data/blogPosts.ts`
- [SEO-лендінги](#seo-лендінги) — `src/data/landingPages.ts`
- [Як опублікувати зміни](#як-опублікувати-зміни)

---

## Що де лежить

| Що змінити | Файл |
|---|---|
| Товар, ціна, склад, КБЖУ, мітки | `src/data/catalog.ts` |
| Фото товарів | `public/img/products/` + поле `images` у `catalog.ts` |
| Категорії меню | `src/data/catalog.ts` → масив `categories` |
| Магазини: адреси, графік, телефони | `src/data/shops.ts` |
| Зони й тарифи доставки, способи оплати, часові слоти | `src/data/delivery.ts` |
| Телефон бренду, пошта, Instagram/Telegram, години | `src/config/site.ts` |
| Питання-відповіді на головній | `src/data/faq.ts` |
| Статті «Рецепти та поради» | `src/data/blogPosts.ts` |
| SEO-сторінки під міста / запити | `src/data/landingPages.ts` |
| Логотип | `public/logo.svg` — заміни на офіційний файл франшизи (той самий шлях, бажано білий варіант для темної шапки) |
| Тексти секцій головної | `src/components/GalyaSections.tsx`, `HeroSection.tsx` |
| Публічні показники (20 магазинів у Чернівцях / 200+ робочих місць / 200+ страв) | `src/config/site.ts` → `NETWORK_STATS` |
| Тексти «Про нас» | `src/pages/AboutPage.tsx` |
| Промо-рядок під шапкою | зараз нема окремого — у `HeroSection`/шапці |
| `<title>` / опис головної для Google | `src/pages/Index.tsx` (компонент `<SEO>`) та `index.html` |

---

## Товари й категорії

Файл: **`src/data/catalog.ts`**.

### Додати товар

Скопіюй будь-який блок у масиві `products` і зміни поля:

```ts
{
  id: "vareniki-z-chornytseyu",          // унікальний, латиниця-цифри-дефіс
  slug: "vareniki-z-chornytseyu",        // так само; це шлях /product/<slug>
  categorySlug: "vareniki",              // має збігатися з c.slug у categories
  title: "Вареники з чорницею",
  weightGrams: 500,                       // вага упаковки в грамах
  unitLabel: "упаковка 0,5 кг",          // як показувати під назвою
  priceUAH: 158,                          // ціна за упаковку, грн
  tags: ["new"],                          // будь-які з: "hit" | "new" | "lenten" | "spicy"
  composition: "Борошно пшеничне в/ґ, чорниця, цукор, крохмаль, вода.",
  kbju: { kcal: 220, protein: 4, fat: 2, carb: 46 }, // на 100 г
  cooking: "У киплячу підсолену воду, 4–5 хв після спливання.",
  storage: "Зберігати за −18 °C до 30 діб. Повторне заморожування не допускається.",
  allergens: "Глютен (пшениця).",
  images: ["/img/products/vareniki-z-chornytseyu.jpg"], // або ["/placeholder.svg"]
  isActive: true,                         // false — сховати з сайту, не видаляючи
},
```

Правила:
- `id` та `slug` — **унікальні**, лише латиниця, цифри, дефіс. Без пробілів і кирилиці.
- `priceUAH`, `weightGrams` — числа більше 0. «Ціна за 100 г» рахується сама.
- `kbju` — усі чотири числа обовʼязкові (можна `0`).
- `composition`, `cooking`, `storage`, `allergens` — не порожні (хоч коротко).
- Прибрати товар: постав `isActive: false` (краще, ніж видаляти — не ламає посилання).

### Змінити ціну

Знайди товар за `title`, зміни `priceUAH`. Все.

### Категорії

Масив `categories` вгорі файлу:

```ts
{ slug: "vareniki", title: "Вареники", blurb: "Класика української кухні.", sort: 2 },
```

`slug` — латиниця (шлях `/menu/<slug>`), `sort` — порядок у меню. У кожній
категорії має бути хоча б один активний товар (інакше впаде тест).

---

## Фото товарів

Зараз усі товари показують заглушку `/placeholder.svg`.

**Простий шлях:** поклади фото в `_incoming/products/` з будь-якими іменами
(можна кирилицею) і скажи розробнику — він стисне, перейменує й пропише шляхи.

**Якщо робиш сам:**
1. Формат JPG або WebP, приблизно 1000×750 (4:3), до ~400–500 КБ.
2. Назва файлу = `slug` товару: `public/img/products/<slug>.jpg`.
3. У `catalog.ts` постав `images: ["/img/products/<slug>.jpg"]`.
4. Кілька фото: `images: ["/img/products/x-1.jpg", "/img/products/x-2.jpg"]`
   (перше — головне; галерея з кількох поки не реалізована на сторінці товару).

`public/` віддається як є: файл `public/img/products/a.jpg` доступний за
`/img/products/a.jpg`.

---

## Магазини

Файл: **`src/data/shops.ts`**, масив `shops`.

```ts
{
  id: "chernivtsi-holovna",              // унікальний, латиниця
  city: "Чернівці",
  district: "Центр",                     // опційно
  address: "вул. Головна, 122",
  hours: "Щодня 09:00–21:00",
  phone: "+380 68 123 45 67",
  features: ["Виробництво за склом", "Паркінг", "Оплата карткою"],
  x: 14, y: 46,                          // % на SVG-мапі України (див. нижче)
  isProduction: true,                    // true — є цех «за склом»
},
```

**Координати `x` / `y`** — відсотки на мальованій мапі України (0–100).
Найпростіше: дай розробнику посилання Google Maps — він порахує. Приблизні
орієнтири: Київ `x50 y30`, Львів `x18 y32`, Одеса `x40 y72`, Дніпро `x64 y52`,
Харків `x75 y28`, **Чернівці `x14 y46`**, Ужгород `x9 y44`.

Похідні числа («N магазинів у M містах», лічильники по містах, мітки на мапі)
рахуються автоматично з цього масиву — вручну ніде не дублюються.

> Якщо мережа працює **в одному місті** — лишаємо одну-кілька точок цього
> міста; мапу України на `/shops` розробник може замінити на список / мапу міста.

---

## Доставка й оплата

Файл: **`src/data/delivery.ts`**.

- `deliveryZones` — зони: назва, вартість (`costUAH`, або `null` = «за тарифом
  перевізника»), безкоштовно від (`freeFromUAH`, або `null`), орієнтовний час,
  примітка.
- `paymentMethods` — способи оплати; `forPickup` / `forDelivery` вмикають метод
  для самовивозу / доставки.
- `timeSlots` — часові інтервали у формі оформлення.
- `pickupNote` — текст про самовивіз на `/delivery`.
- `MIN_ORDER_UAH`, `DELIVERY_FREE_FROM_UAH` — задаються в `src/config/site.ts`.

Приклад зони під одне місто:

```ts
{ id: "chernivtsi-center", name: "Чернівці, центр", costUAH: 50,
  freeFromUAH: 700, eta: "45–75 хв" },
{ id: "chernivtsi-outskirts", name: "Чернівці, околиці", costUAH: 80,
  freeFromUAH: 1000, eta: "60–90 хв" },
```

---

## Контакти, телефон, соцмережі

Файл: **`src/config/site.ts`** — єдине джерело правди. Змінюється в одному місці,
підхоплюється в шапці, футері, на `/contacts`, у SEO і в чеклісті оформлення.

```ts
export const PHONE = "+380681234567";          // без пробілів
export const PHONE_DISPLAY = "+380 68 123 45 67"; // як показувати
export const EMAIL = "hello@galya-baluvana.ua";
export const FRANCHISE_EMAIL = "partner@galya-baluvana.ua";
export const SOCIALS = {
  instagram: "https://www.instagram.com/...",
  facebook:  "https://www.facebook.com/...",
  telegram:  "https://t.me/...",
  viber:     "viber://chat?number=%2B380681234567",
};
export const WORK_HOURS = "Щодня 09:00–21:00";
export const DELIVERY_HOURS = "Щодня 10:00–20:30";
export const MIN_ORDER_UAH = 300;
export const DELIVERY_FREE_FROM_UAH = 1500;
export const CITY_PRIMARY = "Київ";            // головне місто (для текстів/SEO)
```

`SITE_URL` береться з env `VITE_SITE_URL` (налаштовується на Vercel), з фолбеком
у коді. Домен для канонікалів і `sitemap.xml`.

Домен у статичних місцях, які треба поправити один раз при запуску:
`index.html` (JSON-LD, hreflang, og:image), `scripts/prerender.ts` (фолбек
`BASE_URL`), `public/robots.txt`, `public/llms.txt`.

---

## FAQ на головній

Файл: **`src/data/faq.ts`**, масив `faqItems` — `{ q, a }`. Питання має
закінчуватися знаком `?`, відповідь — змістовна (більше ~30 символів).
Ці ж питання йдуть у розмітку `FAQPage` для Google.

---

## Рецепти / блог

Файл: **`src/data/blogPosts.ts`**, масив `blogPosts`. Кожен пост:

```ts
{
  slug: "yak-zamorozyty-vareniki-vdoma",
  title: "Як заморозити вареники вдома, щоб не злиплися",
  metaTitle: "Заморозка вареників вдома",     // опційно, для <title>
  description: "...",                          // для SEO, 1–2 речення
  date: "2026-04-10",
  readingTime: "4 хв",
  category: "Поради",                          // Рецепти / Поради / Зберігання
  tags: ["заморозка", "вареники"],
  excerpt: "Короткий анонс для картки й списку.",
  content: [
    { type: "p", text: "Абзац." },
    { type: "h2", text: "Підзаголовок" },
    { type: "ul", items: ["пункт", "пункт"] },
    { type: "quote", text: "Виділена думка." },
  ],
}
```

Нова стаття зʼявляється в `/blog`, отримує сторінку `/blog/<slug>`, потрапляє в
`sitemap.xml` і в prerender автоматично.

---

## SEO-лендінги

Файл: **`src/data/landingPages.ts`**, масив `landingPages`. Це окремі
посадкові сторінки під пошукові запити / міста (`/napivfabrykaty-chernivtsi`
тощо). Поля: `slug`, `path`, `category` (`"keyword"` або `"city"`), `title`,
`h1`, `description`, `keywords[]`, `intro`, `sections[]` (ті ж блоки, що в блозі,
плюс `cta`), `ctaText`. Маршрут і prerender підхоплюються автоматично.

---

## Як опублікувати зміни

```bash
git add -A
git commit -m "content: оновив ціни на вареники + фото"
git push origin main
```

Vercel побачить пуш у `main` і за 1–2 хвилини оновить прод. Перед пушем варто
локально прогнати:

```bash
npm run typecheck && npm test && npm run build
```

Якщо `npm test` червоний — щось у даних не так (порожнє обовʼязкове поле,
дубль `slug`, категорія без товарів, залишок старої лексики). Повідомлення тесту
каже, де саме.
