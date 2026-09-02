import { cookies } from "next/headers";
import { getSupabaseAdmin } from "@/lib/backend/supabase/admin";
import { COURSE_ACCESS_DAYS, generateAccessCode } from "@/lib/backend/razorpay";

/**
 * IMPORTANT: this module talks to Supabase through getSupabaseAdmin() — the
 * service-role client — and it must stay that way. The course_access table has
 * RLS enabled with zero policies, so any client built from the publishable key
 * reads back zero rows. Switching this file to that client would not error; it
 * would silently resolve every buyer to "no access" and lock them all out.
 * The admin console's Supabase Auth session is a separate system that never
 * touches this path.
 */

/** httpOnly cookie that carries the access code across /course requests. */
export const COURSE_ACCESS_COOKIE = "course_access";
/** Floor for the cookie's lifetime; a longer grant extends it, never shortens it. */
export const COURSE_ACCESS_COOKIE_MAX_AGE = COURSE_ACCESS_DAYS * 24 * 60 * 60;

/** Columns every read of this table needs. One list so they cannot drift apart. */
const ACCESS_COLUMNS =
  "access_code, email, paid_at, expires_at, access_seconds, started_at, redeem_by, revoked_at, label, source";

export type CourseAccessSource = "payment" | "demo";

export interface CourseAccess {
  accessCode: string;
  /** Null on demo grants — a link is often pasted into a chat, with no email known. */
  email: string | null;
  /** Payment time for a purchase, grant time for a demo link. */
  paidAt: string;
  /** Null while dormant; set at first open, and authoritative from then on. */
  expiresAt: string | null;
  accessSeconds: number;
  /** Null until the recipient opens the course. */
  startedAt: string | null;
  redeemBy: string | null;
  revokedAt: string | null;
  /** Company name on a demo grant. */
  label: string | null;
  source: CourseAccessSource;
}

export type AccessStatus =
  | { state: "valid"; access: CourseAccess }
  /** Granted but never opened — the clock has not started. */
  | { state: "pending"; access: CourseAccess }
  | { state: "expired"; access: CourseAccess }
  | { state: "revoked"; access: CourseAccess }
  | { state: "none" };

interface AccessRow {
  access_code: string;
  email: string | null;
  paid_at: string;
  expires_at: string | null;
  access_seconds: number;
  started_at: string | null;
  redeem_by: string | null;
  revoked_at: string | null;
  label: string | null;
  source: string;
}

function rowToAccess(row: AccessRow): CourseAccess {
  return {
    accessCode: row.access_code,
    email: row.email,
    paidAt: row.paid_at,
    expiresAt: row.expires_at,
    accessSeconds: row.access_seconds,
    startedAt: row.started_at,
    redeemBy: row.redeem_by,
    revokedAt: row.revoked_at,
    label: row.label,
    source: row.source === "demo" ? "demo" : "payment",
  };
}

function hasPassed(timestamp: string | null): boolean {
  return timestamp !== null && new Date(timestamp).getTime() <= Date.now();
}

/**
 * Grants 30 days of access for a captured payment. Idempotent: Razorpay
 * retries webhooks, and the unique index on payment_id means a retry either
 * finds the existing row (re-returned here) or lands cleanly.
 *
 * A buyer who pays again gets a fresh code and a fresh 30-day window —
 * renewal is just another enrollment.
 *
 * Paid access starts at payment, so started_at and expires_at are both written
 * up front. Only demo grants are dormant.
 */
export async function grantCourseAccess(
  paymentId: string,
  email: string,
): Promise<CourseAccess> {
  const supabase = getSupabaseAdmin();
  const existing = await supabase
    .from("course_access")
    .select(ACCESS_COLUMNS)
    .eq("payment_id", paymentId)
    .maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) return rowToAccess(existing.data as AccessRow);

  const accessCode = generateAccessCode();
  const accessSeconds = COURSE_ACCESS_DAYS * 24 * 60 * 60;
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + accessSeconds * 1000);
  const { data, error } = await supabase
    .from("course_access")
    .insert({
      access_code: accessCode,
      email,
      payment_id: paymentId,
      source: "payment",
      access_seconds: accessSeconds,
      started_at: startedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .select(ACCESS_COLUMNS)
    .single();
  if (error) {
    // Another webhook retry won the insert race — its row is the truth.
    const race = await supabase
      .from("course_access")
      .select(ACCESS_COLUMNS)
      .eq("payment_id", paymentId)
      .maybeSingle();
    if (race.error) throw error;
    if (race.data) return rowToAccess(race.data as AccessRow);
    throw error;
  }
  return rowToAccess(data as AccessRow);
}

/** Buyers type codes from email; tolerate case and stray whitespace. */
export function normalizeAccessCode(code: string): string {
  return code.trim().toUpperCase();
}

/**
 * Resolves an access code (or the value of the access cookie) to its current
 * state. Nothing is scheduled — expiry is evaluated here, on every call.
 *
 * The precedence below is deliberate and not self-evident:
 *   1. Revoked wins over everything. Someone whose access was ended by hand
 *      should be told that, not shown a generic "expired".
 *   2. A dormant grant past its redeem_by never gets to start its clock.
 *   3. Dormant and still claimable is "pending" — the caller decides whether
 *      this is the moment to start the clock. Redeeming a link must not.
 *   4. Then the ordinary deadline check.
 */
export async function resolveCourseAccess(code: string | undefined): Promise<AccessStatus> {
  if (!code) return { state: "none" };
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("course_access")
    .select(ACCESS_COLUMNS)
    .eq("access_code", normalizeAccessCode(code))
    .maybeSingle();
  if (error) throw error;
  if (!data) return { state: "none" };

  const access = rowToAccess(data as AccessRow);
  if (access.revokedAt !== null) return { state: "revoked", access };
  if (access.startedAt === null) {
    return hasPassed(access.redeemBy) ? { state: "expired", access } : { state: "pending", access };
  }
  return hasPassed(access.expiresAt) ? { state: "expired", access } : { state: "valid", access };
}

/**
 * Starts a dormant grant's clock, once. The `.is("started_at", null)` predicate
 * lands in the UPDATE's WHERE clause, so Postgres serialises concurrent
 * attempts: two tabs opening at the same moment cannot both stamp. The loser
 * matches zero rows (maybeSingle returns null data, not an error) and the
 * caller re-reads whichever row the winner wrote.
 */
export async function startCourseAccessClock(access: CourseAccess): Promise<CourseAccess | null> {
  const supabase = getSupabaseAdmin();
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + access.accessSeconds * 1000);
  const { data, error } = await supabase
    .from("course_access")
    .update({
      started_at: startedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
    .eq("access_code", access.accessCode)
    .is("started_at", null)
    .is("revoked_at", null)
    .select(ACCESS_COLUMNS)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToAccess(data as AccessRow) : null;
}

/**
 * Cookie lifetime for a grant. The fixed 30 days this used to use would log a
 * longer grant out while it was still valid, and would drop a dormant link's
 * cookie before its redeem_by. Never shorter than the old default, so nothing
 * about the paid flow gets tighter.
 */
export function cookieMaxAgeForAccess(access: CourseAccess): number {
  const seconds =
    access.startedAt === null
      ? access.accessSeconds +
        (access.redeemBy
          ? Math.max(0, Math.floor((new Date(access.redeemBy).getTime() - Date.now()) / 1000))
          : 0)
      : Math.floor((new Date(access.expiresAt ?? 0).getTime() - Date.now()) / 1000);
  return Math.max(COURSE_ACCESS_COOKIE_MAX_AGE, seconds);
}

export interface CurrentCourseAccess {
  state: "valid" | "expired" | "revoked" | "locked";
  expiresAt: string | null;
}

/*
 * On detecting prefetches here: you cannot. Measured on Next 16.3.2 — a
 * Server Component's headers() sees only host, user-agent, accept, cookie and
 * the x-forwarded-* set. `next-router-prefetch`, `RSC`, `Sec-Purpose`,
 * `purpose` and `x-purpose` are all consumed by the framework before the page
 * runs, so a guard based on them is dead code that reads like protection.
 *
 * The defences that do work, in order of importance:
 *   1. The handoff page starts the clock from an explicit POST (see the
 *      `start` flag on /api/course/unlock), not from rendering /course. A
 *      prefetch cannot issue that POST, and neither can a link scanner.
 *   2. prefetch={false} on every <Link> to /course. There is one today, in
 *      LeadGenPage; any new one must set it too.
 * The render-time stamp below remains only as a fallback for someone who
 * types their code straight into the gate on /course.
 */

/**
 * The per-request gate check for /course pages. Reads the access cookie and
 * resolves it against Supabase; callers render the gate in place of content
 * unless state is "valid". Fail-closed: a Supabase error locks the gate.
 *
 * This is also where a dormant grant's clock starts — the first time a real
 * person renders the course. Because the stamp lives inside the try, a
 * Supabase failure mid-stamp returns "locked" and leaves the grant dormant:
 * the failure mode is a retryable lock-out, never untimed access.
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

    if (status.state === "pending") {
      const started = await startCourseAccessClock(status.access);
      if (started) return { state: "valid", expiresAt: started.expiresAt };
      // Lost the stamp race; the winner's row is the truth.
      const settled = await resolveCourseAccess(status.access.accessCode);
      return settled.state === "valid"
        ? { state: "valid", expiresAt: settled.access.expiresAt }
        : { state: "locked", expiresAt: null };
    }

    if (status.state === "valid") {
      return { state: "valid", expiresAt: status.access.expiresAt };
    }
    if (status.state === "expired") {
      return { state: "expired", expiresAt: status.access.expiresAt };
    }
    if (status.state === "revoked") {
      return { state: "revoked", expiresAt: status.access.expiresAt };
    }
    return { state: "locked", expiresAt: null };
  } catch (error) {
    console.error("course access check failed", error);
    return { state: "locked", expiresAt: null };
  }
}
