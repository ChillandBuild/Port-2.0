import { NextResponse } from "next/server";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { isSameOrigin } from "@/lib/backend/admin-auth";

export const runtime = "nodejs";

/**
 * Ends the admin's Supabase session.
 *
 * Only the sb-* auth cookies are cleared. The course_access cookie is a
 * different system entirely — clearing it here would sign the operator out of
 * any course access they happened to be holding, for no reason.
 */
export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false, error: "origin" }, { status: 403 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.json({ success: true });

  const response = NextResponse.json({ success: true });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("cookie") ?? "").map((cookie) => ({
          name: cookie.name,
          value: cookie.value ?? "",
        }));
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [header, value] of Object.entries(headers)) {
          response.headers.set(header, value);
        }
      },
    },
  });

  await supabase.auth.signOut();
  return response;
}
