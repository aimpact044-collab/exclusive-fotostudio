import { createClient } from "@supabase/supabase-js";

/**
 * Public, anonymous Supabase client. Respects Row Level Security and is only
 * ever able to read published projects/photos and the settings row. Safe to
 * use from Server Components for public pages.
 */
export function getSupabasePublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
  }

  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}
