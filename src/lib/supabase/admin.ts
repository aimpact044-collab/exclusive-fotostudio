import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Privileged Supabase client using the `service_role` key. Bypasses Row Level
 * Security entirely. Must only ever be imported from Server Actions / Route
 * Handlers (never from a Client Component) — the `server-only` import above
 * makes any accidental client-side import fail at build time.
 */
export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
