
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages"
ON public.contact_messages FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Anyone can read contact messages"
ON public.contact_messages FOR SELECT TO public
USING (true);
