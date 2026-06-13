import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Optional Supabase client. The app is local-first and fully usable signed-out;
 * cloud sync only activates when both env vars are present:
 *   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
 * (see .env.example). If they're missing, `supabase` is null and every auth/sync
 * call no-ops, so nothing breaks.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/** Postgres table that holds one JSON state blob per user (see .env.example SQL). */
export const SYNC_TABLE = "user_state";

if (import.meta.env.DEV) {
  // Quick sanity line in the browser console during `npm run dev`.
  console.info(
    `[Algolume] cloud sync: ${
      isSupabaseConfigured ? `configured (${url})` : "OFF — set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY in .env and restart dev"
    }`,
  );
}
