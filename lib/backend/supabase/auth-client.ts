import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client carrying the ADMIN's login session. Used only by /admin and
 * /api/admin — never by the course path.
 *
 * The two access systems in this app are deliberately separate:
 *
 *   admin  → this client, publishable key, Supabase Auth session cookies,
 *            subject to RLS.
 *   course → getSupabaseAdmin(), service-role key, an opaque access code in
 *            its own cookie, bypasses RLS.
 *
 * Do not "unify" them. course_access has RLS enabled with zero policies, so
 * reading it through this client returns zero rows — which would not error, it
 * would silently lock out every buyer and every demo recipient at once.
 *
 * The key is intentionally NOT prefixed NEXT_PUBLIC_. No Supabase code runs in
 * the browser in this app, so the publishable key never ships to a client
 * bundle and the PostgREST endpoint is unreachable from a browser.
 *
 * Built per request, not cached: it closes over this request's cookies.
 */
export async function createSupabaseAuthClient(): Promise<SupabaseClient> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase auth credentials are not configured.");
  }

  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            store.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, which cannot write cookies. The
          // proxy refreshes the session on every /admin request, so the
          // refreshed token still reaches the browser from there.
        }
      },
    },
  });
}
