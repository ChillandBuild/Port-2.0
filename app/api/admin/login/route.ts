import { NextResponse } from "next/server";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { isSameOrigin } from "@/lib/backend/admin-auth";

export const runtime = "nodejs";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Signs an admin in and writes the Supabase session cookies onto the response.
 *
 * Built directly here rather than through createSupabaseAuthClient() because
 * that helper writes through next/headers cookies(), and a route handler needs
 * the Set-Cookie headers on the NextResponse it returns.
 *
 * The allowlist is checked BEFORE signing in, so a non-admin with valid
 * Supabase credentials never gets a session cookie from this app at all.
 */
export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false, error: "origin" }, { status: 403 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error("admin login unavailable — Supabase auth env not configured");
    return NextResponse.json({ success: false, error: "server" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "invalid" }, { status: 400 });
  }
  const { email, password } = (body ?? {}) as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return NextResponse.json({ success: false, error: "invalid" }, { status: 400 });
  }

  if (!adminEmails().includes(email.trim().toLowerCase())) {
    // Same shape as a wrong password: never confirm which addresses are admins.
    return NextResponse.json({ success: false, error: "invalid" }, { status: 401 });
  }

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

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) {
    return NextResponse.json({ success: false, error: "invalid" }, { status: 401 });
  }

  return response;
}
