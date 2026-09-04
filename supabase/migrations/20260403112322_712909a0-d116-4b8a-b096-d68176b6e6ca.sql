
CREATE POLICY "Deny public select on orders"
  ON public.orders FOR SELECT
  TO public
  USING (false);

CREATE POLICY "Deny public select on contact_messages"
  ON public.contact_messages FOR SELECT
  TO public
  USING (false);

CREATE POLICY "Deny public update on orders"
  ON public.orders FOR UPDATE
  TO public
  USING (false);

CREATE POLICY "Deny public delete on orders"
  ON public.orders FOR DELETE
  TO public
  USING (false);

CREATE POLICY "Deny public delete on contact_messages"
  ON public.contact_messages FOR DELETE
  TO public
  USING (false);
