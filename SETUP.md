# Setup

Каталог, меню й кошик працюють без бекенда. **Оформлення замовлення, форма контактів,
форма франшизи та адмінка** потребують Supabase. Цей документ покриває обидва випадки.

## 1. Тільки фронтенд (2 хвилини)

```bash
npm install
cp .env.example .env      # плейсхолдерів достатньо, щоб дивитися сайт
npm run dev               # http://localhost:8080
```

Усе рендериться, додавання в кошик працює (клієнтський стан + localStorage).
Підтвердження замовлення впаде — його нема куди відправити. Це очікувано до кроку 2.

## 2. Повний стек із Supabase (~15 хвилин)

### 2.1 Створити проєкт

Увійдіть на [supabase.com](https://supabase.com) → **New project**. Запишіть project ref
з URL (`https://supabase.com/dashboard/project/<ref>`).

### 2.2 Застосувати схему

```bash
npm i -g supabase
supabase login
supabase link --project-ref <your-ref>
supabase db push
```

`supabase/migrations/` містить повну історію: таблиці `orders` та `contact_messages` з
RLS-політиками (див. [Модель безпеки](#модель-безпеки)). Остання міграція
`20260904120000_galya_order_fields.sql` додає до `orders` колонки `delivery_type`,
`shop_id`, `time_slot`, `payment_method` і робить `customer_email` необов'язковим.

### 2.3 Задеплоїти edge-функції

```bash
supabase functions deploy telegram-order-notify
supabase functions deploy admin-orders
supabase functions deploy customer-support     # опційно, AI-чат
supabase functions deploy marketing-ai         # опційно, генерація копірайту
```

### 2.4 Виставити секрети функцій

Ніколи не в `.env` — вони живуть тільки на сервері.

```bash
# Сповіщення про замовлення в Telegram
supabase secrets set TELEGRAM_BOT_TOKEN="123456:ABC..." TELEGRAM_CHAT_ID="-1001234567890"

# Захищає функцію admin-orders
supabase secrets set ADMIN_SECRET_KEY="$(openssl rand -hex 32)"

# Лише якщо деплоїте AI-функції. Підходить будь-який OpenAI-сумісний endpoint.
supabase secrets set AI_API_KEY="sk-or-..."
```

`SUPABASE_URL` та `SUPABASE_SERVICE_ROLE_KEY` підставляються автоматично — не задавайте їх.

### 2.5 Вказати фронтенду, куди дивитися

Скопіюйте значення з **Project Settings → API** у `.env`:

```bash
VITE_SUPABASE_PROJECT_ID="your-ref"
VITE_SUPABASE_URL="https://your-ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key"
VITE_SITE_URL="https://your-domain"
```

Перезапустіть `npm run dev`. Оформлення тепер пише в `orders` і пінгує Telegram.

## Модель безпеки

| Таблиця | Public INSERT | Public SELECT | Public UPDATE / DELETE |
|---|---|---|---|
| `orders` | ✅ checkout | ❌ (лише edge-функція) | ❌ |
| `contact_messages` | ✅ форми | ❌ | ❌ |

Будь-хто з anon-ключем може *створити* замовлення — це і є публічний checkout. Прочитати
його назад не може ніхто. Читання — тільки через edge-функцію `admin-orders`, яка працює
з service-role ключем і вимагає `ADMIN_SECRET_KEY`.

> [!IMPORTANT]
> Міграції `20260403111927` та `20260403112255` **знімають** дозвільні read-політики
> перед тим, як `20260403112322` додає явні denies. Застосовуйте по порядку.

anon-ключ безпечно потрапляє в бандл — його захищає RLS. **service-role ключ — ні**, він
живе лише в секретах функцій.

## Деплой (Vercel)

```bash
npm run build     # → dist/ + ~60 prerendered HTML + sitemap.xml
```

1. Push у `main` → Vercel запускає `npm run build` і деплоїть `dist/`.
2. **Project → Settings → Environment Variables** — ті самі 4 `VITE_*` змінні.
3. `vercel.json` уже налаштований: framework `vite`, SPA-rewrite на `/index.html`,
   незмінний кеш для `/assets/*`. Prerendered-теки віддаються файловою системою до rewrite.
4. Supabase — `supabase db push` для нових міграцій; edge-функції задеплоєні; секрети виставлені.

## Траблшутинг

**Порожня сторінка, у консолі `Invalid supabaseUrl`** — `.env` відсутній або не прочитаний.
Vite читає його лише на старті; перезапустіть dev-сервер.

**Замовлення створюється, але в Telegram нічого** — `supabase functions logs
telegram-order-notify`. Зазвичай неправильний `TELEGRAM_CHAT_ID` (id груп від'ємні,
починаються з `-100`).

**Адмінка нічого не показує** — `admin-orders` не задеплоєна, або `ADMIN_SECRET_KEY` не
збігається з ключем, який вводите в панелі.

**Playwright падає з «no h1» на всіх тестах** — на порту 4173 висить сторонній сервер;
`reuseExistingServer` підхоплює його замість `vite preview`. Звільніть порт.
