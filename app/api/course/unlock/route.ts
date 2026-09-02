import { NextResponse } from "next/server";
import {
  COURSE_ACCESS_COOKIE,
  cookieMaxAgeForAccess,
  normalizeAccessCode,
  resolveCourseAccess,
  startCourseAccessClock,
} from "@/lib/backend/course-access";

export const runtime = "nodejs";

/**
 * Redeems an access code from the course gate. On a valid code the code
 * itself becomes the httpOnly cookie value — it is the bearer secret, and
 * every /course request re-validates it (and its expiry) against Supabase,
 * so the cookie needs no signature of its own. Expired or unknown codes get
 * a distinct message for expired so the buyer knows renewal, not support,
 * is the fix.
 *
 * A "pending" grant — a demo link nobody has opened yet — is accepted here.
 * Whether that also STARTS its clock depends on who is calling:
 *
 *   start: true   The handoff page's "Open the course" button. That click is
 *                 the person opening it, so the window begins now. It has to
 *                 happen here rather than on the /course render because a POST
 *                 is the only signal a link scanner or a router prefetch
 *                 cannot produce — and headers() in a Server Component cannot
 *                 see prefetch markers at all (measured on Next 16.3.2).
 *
 *   otherwise     Someone typed their code into the inline form on
 *                 /lead-generation. Redeeming is not reading; their window
 *                 starts when they actually reach the course.
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
  if (status.state === "revoked") {
    return NextResponse.json({ success: false, error: "revoked" });
  }
  if (status.state === "none") {
    return NextResponse.json({ success: false, error: "invalid" });
  }

  let access = status.access;
  const startNow = (body as Record<string, unknown>)?.start === true;
  if (startNow && status.state === "pending") {
    try {
      // Null means another tab won the race; that row is already started, so
      // the caller is let in either way.
      access = (await startCourseAccessClock(access)) ?? access;
    } catch (error) {
      console.error("course clock start failed", error);
      return NextResponse.json({ success: false, error: "server" }, { status: 500 });
    }
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: COURSE_ACCESS_COOKIE,
    value: access.accessCode,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: cookieMaxAgeForAccess(access),
  });
  return response;
}
