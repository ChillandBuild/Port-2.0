import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Server-only Supabase client, authenticated with the service-role key so it
 * bypasses RLS. Never import this from a "use client" file — the key must
 * never reach the browser.
 *
 * Built lazily, not as a module-level constant, so a missing env var only
 * throws when a request actually needs it — `next build` still succeeds with
 * no Supabase credentials configured.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase server credentials are not configured.");
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
