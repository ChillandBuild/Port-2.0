import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/backend/supabase/admin";
import { COURSE_ACCESS_DAYS, generateAccessCode } from "@/lib/backend/razorpay";

/** httpOnly cookie that carries the access code across /course requests. */
export const COURSE_ACCESS_COOKIE = "course_access";
/** Cookie lifetime matches the longest possible access window. */
export const COURSE_ACCESS_COOKIE_MAX_AGE = COURSE_ACCESS_DAYS * 24 * 60 * 60;

export interface CourseAccess {
  accessCode: string;
  email: string;
  paidAt: string;
  expiresAt: string;
}

export type AccessStatus =
  | { state: "valid"; access: CourseAccess }
  | { state: "expired"; access: CourseAccess }
  | { state: "none" };

function rowToAccess(row: {
  access_code: string;
  email: string;
  paid_at: string;
  expires_at: string;
}): CourseAccess {
  return {
    accessCode: row.access_code,
    email: row.email,
    paidAt: row.paid_at,
    expiresAt: row.expires_at,
  };
}

function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}

/**
 * Grants 30 days of access for a captured payment. Idempotent: Razorpay
 * retries webhooks, and the unique index on payment_id means a retry either
 * finds the existing row (re-returned here) or lands cleanly.
 *
 * A buyer who pays again gets a fresh code and a fresh 30-day window —
 * renewal is just another enrollment.
 */
export async function grantCourseAccess(
  paymentId: string,
  email: string,
): Promise<CourseAccess> {
  const supabase = getSupabaseAdmin();
  const existing = await supabase
    .from("course_access")
    .select("access_code, email, paid_at, expires_at")
    .eq("payment_id", paymentId)
    .maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) return rowToAccess(existing.data);

  const accessCode = generateAccessCode();
  const expiresAt = new Date(Date.now() + COURSE_ACCESS_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("course_access")
    .insert({
      access_code: accessCode,
      email,
      payment_id: paymentId,
      expires_at: expiresAt,
    })
    .select("access_code, email, paid_at, expires_at")
    .single();
  if (error) {
    // Another webhook retry won the insert race — its row is the truth.
    const race = await supabase
      .from("course_access")
      .select("access_code, email, paid_at, expires_at")
      .eq("payment_id", paymentId)
      .maybeSingle();
    if (race.error) throw error;
    if (race.data) return rowToAccess(race.data);
    throw error;
  }
  return rowToAccess(data);
}

/** Buyers type codes from email; tolerate case and stray whitespace. */
export function normalizeAccessCode(code: string): string {
  return code.trim().toUpperCase();
}

/**
 * Resolves an access code (or the value of the access cookie) to its current
 * state. Expiry is evaluated here, on every call, so access lapses without
 * any scheduled job — and the course layout calls this per request.
 */
export async function resolveCourseAccess(code: string | undefined): Promise<AccessStatus> {
  if (!code) return { state: "none" };
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("course_access")
    .select("access_code, email, paid_at, expires_at")
    .eq("access_code", normalizeAccessCode(code))
    .maybeSingle();
  if (error) throw error;
  if (!data) return { state: "none" };
  const access = rowToAccess(data);
  return isExpired(access.expiresAt) ? { state: "expired", access } : { state: "valid", access };
}

export interface CurrentCourseAccess {
  state: "valid" | "expired" | "locked";
  expiresAt: string | null;
}

/**
 * The per-request gate check for /course pages. Reads the access cookie and
 * resolves it against Supabase; callers render the gate in place of content
 * unless state is "valid". Fail-closed: a Supabase error locks the gate.
 *
 * Lives in the pages (not the course layout) because App Router renders page
 * children even when the layout never mounts them — gating in the layout
 * would leak lesson content into the RSC payload.
 */
export async function getCurrentCourseAccess(): Promise<CurrentCourseAccess> {
  // cookies() stays outside the try: its build-time dynamic-usage signal must
  // reach Next so course routes render per request instead of prerendering a
  // static paywall. Only the Supabase lookup is fail-closed.
  const store = await cookies();
  try {
    const status = await resolveCourseAccess(store.get(COURSE_ACCESS_COOKIE)?.value);
    if (status.state === "valid") {
      return { state: "valid", expiresAt: status.access.expiresAt };
    }
    if (status.state === "expired") {
      return { state: "expired", expiresAt: status.access.expiresAt };
    }
    return { state: "locked", expiresAt: null };
  } catch (error) {
    console.error("course access check failed", error);
    return { state: "locked", expiresAt: null };
  }
}
