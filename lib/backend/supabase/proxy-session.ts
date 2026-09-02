import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Where an unauthenticated admin request gets sent. */
const LOGIN_PATH = "/admin/login";

/** Paths this runs for. Kept as an explicit allowlist — see proxy.ts. */
function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

/**
 * Refreshes the admin's Supabase session and bounces signed-out visitors to
 * the login page.
 *
 * This is UX, not the security boundary. Next 16 documents that a proxy
 * matcher which excludes a path also skips proxy coverage for server functions
 * on that path, so every admin route handler calls requireAdmin() itself. The
 * redirect here exists so Sampath sees a login form instead of a bare 401.
 *
 * The redirect condition is an explicit /admin allowlist rather than the
 * upstream example's "redirect unless the path is /login". That inversion
 * matters: if the matcher in proxy.ts is ever widened, this still cannot
 * redirect anything outside /admin — the upstream shape would send every
 * anonymous visitor of the marketing site, and every course recipient, to a
 * login page they have no account for.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // These carry Cache-Control: private, no-store. Without them a CDN can
        // cache a response that sets auth cookies and serve one person's
        // session to another.
        for (const [header, value] of Object.entries(headers)) {
          response.headers.set(header, value);
        }
      },
    },
  });

  // Nothing between createServerClient and getClaims().
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  if (!signedIn && isAdminPath(pathname) && pathname !== LOGIN_PATH) {
    const target = request.nextUrl.clone();
    target.pathname = LOGIN_PATH;
    target.search = "";
    return NextResponse.redirect(target);
  }

  // @supabase/ssr only supplies its no-store headers through setAll, which
  // runs only when a token is actually refreshed. Measured without this line,
  // an ordinary signed-in render of /admin returned "no-cache, must-revalidate"
  // — no `private`, so a shared proxy is permitted to store a page listing
  // recipient emails. Set it unconditionally on every admin response.
  response.headers.set("Cache-Control", "private, no-store, max-age=0");

  // Otherwise returned as-is; rebuilding the response here would drop the
  // refreshed cookies and desynchronise the browser from the server.
  return response;
}
