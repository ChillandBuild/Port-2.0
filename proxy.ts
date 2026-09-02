import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/backend/supabase/proxy-session";

/**
 * Next 16 renamed middleware.ts to proxy.ts; the exported function is `proxy`.
 *
 * The matcher is deliberately a two-entry allowlist, not the wide pattern the
 * Supabase docs suggest. Everything outside /admin must stay untouched:
 *
 *  - Proxy runs on the Node.js runtime, so a site-wide matcher would turn every
 *    marketing page view into a function invocation.
 *  - Auth responses carry Cache-Control: no-store. Applied site-wide, that
 *    would make the landing, lead-generation and case-study pages uncacheable
 *    — silently, with nothing appearing to break.
 *  - /course must never be matched. Course recipients hold an access code, not
 *    a Supabase session, so a redirect rule here would bounce every one of them
 *    to a login page they cannot use.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
