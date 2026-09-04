# Security Policy

## Reporting a vulnerability

**Do not open a public issue.** Use GitHub's [private advisory form](../../security/advisories/new), or
email the maintainer with the subject `SECURITY — Kratea`.

Expect an acknowledgement within 72 hours and an assessment within 7 days.

## Worth your attention

- **Row-level security** in `supabase/migrations/` — `orders` and `contact_messages` allow public INSERT
  and deny everything else. A policy change that re-opens SELECT would expose customer names, phone
  numbers and addresses.
- **`admin-orders`** — runs with the service-role key, guarded by `ADMIN_SECRET_KEY`. Any way to reach it
  without that key is critical.
- **`telegram-order-notify`** — the bot token must never reach the client bundle.
- **Checkout input** — `src/lib/orders.ts` and `CheckoutDialog.tsx`.

## Not in scope

The `VITE_SUPABASE_PUBLISHABLE_KEY` (anon key) is public by design and safe in the bundle; RLS is what
protects the data. Reports that it is "exposed" will be closed. A demonstrated RLS bypass using it is very
much in scope.
