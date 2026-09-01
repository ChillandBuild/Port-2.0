import { NextResponse } from "next/server";
import {
  COURSE_ACCESS_COOKIE,
  COURSE_ACCESS_COOKIE_MAX_AGE,
  normalizeAccessCode,
  resolveCourseAccess,
} from "@/lib/backend/course-access";

export const runtime = "nodejs";

/**
 * Redeems an access code from the course gate. On a valid code the code
 * itself becomes the httpOnly cookie value — it is the bearer secret, and
 * every /course request re-validates it (and its expiry) against Supabase,
 * so the cookie needs no signature of its own. Expired or unknown codes get
 * a distinct message for expired so the buyer knows renewal, not support,
 * is the fix.
 */
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const code = typeof (body as Record<string, unknown>)?.code === "string"
    ? (body as { code: string }).code
    : "";
  if (!normalizeAccessCode(code)) {
    return NextResponse.json({ success: false, error: "Enter your access code." }, { status: 400 });
  }

  let status;
  try {
    status = await resolveCourseAccess(code);
  } catch (error) {
    console.error("course unlock lookup failed", error);
    return NextResponse.json({ success: false, error: "server" }, { status: 500 });
  }

  if (status.state === "expired") {
    return NextResponse.json({ success: false, error: "expired" });
  }
  if (status.state === "none") {
    return NextResponse.json({ success: false, error: "invalid" });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: COURSE_ACCESS_COOKIE,
    value: status.access.accessCode,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COURSE_ACCESS_COOKIE_MAX_AGE,
  });
  return response;
}
