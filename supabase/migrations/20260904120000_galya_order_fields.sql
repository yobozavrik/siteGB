-- Galya Baluvana checkout: delivery vs pickup, chosen shop, time slot, payment method.
-- All columns nullable so existing rows and the current RLS policies are unaffected.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_type   text,
  ADD COLUMN IF NOT EXISTS shop_id         text,
  ADD COLUMN IF NOT EXISTS time_slot       text,
  ADD COLUMN IF NOT EXISTS payment_method  text;

-- Email is optional for a food order — the phone is what matters.
ALTER TABLE public.orders
  ALTER COLUMN customer_email DROP NOT NULL;
