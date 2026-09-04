# Contributing

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Node 20+. Cart and checkout need a Supabase project — see [SETUP.md](SETUP.md).

## Before opening a pull request

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

CI runs the same four plus the Playwright suite.

## Conventions

- **UI copy is Ukrainian.** Keep new strings consistent with surrounding pages.
- **Never commit `.env`**, and never put a secret in a `VITE_*` variable — those are compiled into the
  public bundle. Server-side secrets belong in Supabase function secrets.
- **New tables need RLS.** Enable it and add explicit policies in the same migration. Public SELECT on
  anything holding customer data will be rejected.
- **Migrations are append-only.** Never edit an applied migration; add a new one.
- Cart behaviour changes need a test in `src/test/CartContext.test.tsx`.

## Commit messages

Short, imperative, one concern per commit.
