# Setup

The storefront runs without a backend — catalogue, blog and store locator are static data. The **cart,
checkout, contact form and admin panel** need Supabase. This document covers both.

## 1. Frontend only (2 minutes)

```bash
git clone https://github.com/STALK37/Kratea.git
cd Kratea
npm install
cp .env.example .env      # placeholder values are fine to browse the site
npm run dev               # http://localhost:8080
```

Everything renders. Adding to cart works — it's client-side state. Submitting an order fails, because
there's nowhere to send it. That's expected until step 2.

## 2. Full stack with Supabase (~15 minutes)

### 2.1 Create a project

Sign in at [supabase.com](https://supabase.com) → **New project**. Note the project ref from the URL
(`https://supabase.com/dashboard/project/<ref>`).

### 2.2 Apply the schema

```bash
npm i -g supabase
supabase login
supabase link --project-ref <your-ref>
supabase db push
```

`supabase/migrations/` contains the full history — two tables (`orders`, `contact_messages`) with
row-level security policies. See [Security model](#security-model).

### 2.3 Deploy the edge functions

```bash
supabase functions deploy telegram-order-notify
supabase functions deploy admin-orders
supabase functions deploy customer-support     # optional, AI chat
supabase functions deploy marketing-ai         # optional, AI copy generation
```

### 2.4 Set function secrets

Never in `.env` — these live server-side only.

```bash
# Order notifications to Telegram
supabase secrets set TELEGRAM_BOT_TOKEN="123456:ABC..." TELEGRAM_CHAT_ID="-1001234567890"

# Protects the admin-orders function
supabase secrets set ADMIN_SECRET_KEY="$(openssl rand -hex 32)"

# Only if you deploy the AI functions. Any OpenAI-compatible endpoint works;
# the default is OpenRouter, which uses the same "vendor/model" ids.
supabase secrets set AI_API_KEY="sk-or-..."
# optional overrides
supabase secrets set AI_GATEWAY_URL="https://openrouter.ai/api/v1/chat/completions"
supabase secrets set AI_MODEL="google/gemini-2.5-flash"
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected automatically — don't set them yourself.

### 2.5 Point the frontend at it

Copy your values from **Project Settings → API** into `.env`:

```bash
VITE_SUPABASE_PROJECT_ID="your-ref"
VITE_SUPABASE_URL="https://your-ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-public-key"
VITE_SITE_URL="https://your-domain.com"
```

Restart `npm run dev`. Checkout now writes to `orders` and pings Telegram.

## Security model

Worth understanding before you change a policy.

| Table | Public INSERT | Public SELECT | Public UPDATE / DELETE |
|---|---|---|---|
| `orders` | ✅ checkout | ❌ denied | ❌ denied |
| `contact_messages` | ✅ contact form | ❌ denied | ❌ denied |

Anyone with the anon key can *create* an order — that's what a public checkout is. Nobody can read one
back. Reads happen only through the `admin-orders` edge function, which runs with the service-role key and
requires `ADMIN_SECRET_KEY`.

> [!IMPORTANT]
> Migrations `20260403111927` and `20260403112255` **drop** the original permissive read policies before
> `20260403112322` adds explicit denies. Apply them in order — running the first migration alone leaves
> customer orders publicly readable.

The anon key is safe to ship in a frontend bundle; it's designed for that, and RLS is what protects the
data. **The service-role key is not** — it bypasses RLS entirely and belongs only in function secrets.

## Deploy

```bash
npm run build     # → dist/, plus 22 prerendered HTML files
```

Any static host works — Netlify, Vercel, Cloudflare Pages, S3. Set the `VITE_*` variables in the host's
environment, and configure a SPA fallback to `index.html` for client-side routes.

## Troubleshooting

**Blank page, console shows `Invalid supabaseUrl`** — `.env` is missing or unread. Vite only reads it at
startup; restart the dev server.

**Orders submit but nothing arrives in Telegram** — check `supabase functions logs telegram-order-notify`.
Usually a wrong `TELEGRAM_CHAT_ID`; group ids are negative and start with `-100`.

**Admin panel shows nothing** — `admin-orders` isn't deployed, or `ADMIN_SECRET_KEY` doesn't match the key
the panel sends.
