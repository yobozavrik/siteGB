import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/** True only when both Supabase env vars are present. */
export const supabaseConfigured = Boolean(url && key);

if (!supabaseConfigured && typeof console !== "undefined") {
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are not set. " +
      "The storefront renders, but checkout and forms will not submit until they are configured.",
  );
}

// Fall back to a syntactically valid placeholder so createClient() does not throw
// at module load — a missing env var must not blank the whole app. Network calls
// against the placeholder fail, and every caller already handles that.
export const supabase = createClient<Database>(
  url || "https://placeholder.supabase.co",
  key || "placeholder-anon-key",
  {
    auth: {
      storage: typeof localStorage !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
