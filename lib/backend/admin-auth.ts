import { createSupabaseAuthClient } from "@/lib/backend/supabase/auth-client";

export interface AdminIdentity {
  email: string;
}

/** Emails permitted to use the admin console. Empty means the console is shut. */
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * The single answer to "may this request use the admin console?".
 *
 * Note what this does NOT ask: whether the request is authenticated. Supabase
 * Auth will happily mint a valid session for anyone who reaches the signup
 * endpoint, so "is signed in" is not authorization here. The question is
 * whether the *verified* email claim appears in ADMIN_EMAILS. A stranger with
 * a real Supabase session still gets null from this function and 401 from
 * every route that calls it.
 *
 * Disabling signup in the Supabase dashboard is a second lock, not this one.
 *
 * getClaims() and not getSession(): getSession() reads the cookie without
 * revalidating the JWT, and the cookie is attacker-supplied. getClaims()
 * verifies the signature against the project's published keys on every call.
 */
export async function requireAdmin(): Promise<AdminIdentity | null> {
  const allowed = adminEmails();
  if (allowed.length === 0) return null;

  let supabase;
  try {
    supabase = await createSupabaseAuthClient();
  } catch (error) {
    console.error("admin auth client unavailable", error);
    return null;
  }

  // Nothing between the client and getClaims(): interleaving other awaits here
  // is a known source of tokens being refreshed against a stale cookie store.
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;

  const email = typeof data.claims.email === "string" ? data.claims.email.toLowerCase() : null;
  if (!email || !allowed.includes(email)) return null;
  return { email };
}

/**
 * Rejects cross-site form posts. Server Actions get this check for free;
 * plain route handlers do not. The auth cookies are SameSite=Lax, which
 * already blocks the practical attack, but that is a default set by a
 * dependency — this makes the guarantee ours.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Same-origin fetches may omit it entirely.
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
