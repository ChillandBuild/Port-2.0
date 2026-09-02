import { getSupabaseAdmin } from "@/lib/backend/supabase/admin";
import { generateAccessCode } from "@/lib/backend/razorpay";
import { clampAccessSeconds } from "@/lib/course-duration";

/**
 * Admin-side reads and writes over course_access. Service-role throughout —
 * see the note at the top of course-access.ts for why the admin's own Supabase
 * Auth client must never be used to touch this table.
 */

const GRANT_COLUMNS =
  "id, access_code, email, label, source, access_seconds, paid_at, started_at, expires_at, redeem_by, revoked_at, granted_by, sections_seen, last_seen_at, created_at";

export interface GrantRow {
  id: string;
  accessCode: string;
  email: string | null;
  label: string | null;
  source: "payment" | "demo";
  accessSeconds: number;
  createdAt: string;
  startedAt: string | null;
  expiresAt: string | null;
  redeemBy: string | null;
  revokedAt: string | null;
  grantedBy: string | null;
  sectionsSeen: Record<string, { first?: string; seconds?: number }>;
  lastSeenAt: string | null;
}

interface RawGrant {
  id: string;
  access_code: string;
  email: string | null;
  label: string | null;
  source: string;
  access_seconds: number;
  paid_at: string;
  started_at: string | null;
  expires_at: string | null;
  redeem_by: string | null;
  revoked_at: string | null;
  granted_by: string | null;
  sections_seen: unknown;
  last_seen_at: string | null;
  created_at: string;
}

function toGrant(row: RawGrant): GrantRow {
  return {
    id: row.id,
    accessCode: row.access_code,
    email: row.email,
    label: row.label,
    source: row.source === "demo" ? "demo" : "payment",
    accessSeconds: row.access_seconds,
    createdAt: row.created_at,
    startedAt: row.started_at,
    expiresAt: row.expires_at,
    redeemBy: row.redeem_by,
    revokedAt: row.revoked_at,
    grantedBy: row.granted_by,
    sectionsSeen:
      typeof row.sections_seen === "object" && row.sections_seen !== null
        ? (row.sections_seen as GrantRow["sectionsSeen"])
        : {},
    lastSeenAt: row.last_seen_at,
  };
}

export async function listGrants(limit = 200): Promise<GrantRow[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("course_access")
    .select(GRANT_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as RawGrant[]).map(toGrant);
}

export interface CreateGrantInput {
  label: string;
  email: string | null;
  accessSeconds: number;
  redeemByDays: number | null;
  grantedBy: string;
}

/**
 * Creates a dormant demo grant. started_at and expires_at stay null until the
 * recipient actually opens the course.
 *
 * grantCourseAccess's idempotency trick does not help here: it recovers from a
 * duplicate by re-reading the row with the same payment_id, and a demo grant
 * has none. A code collision is astronomically unlikely but cheap to survive,
 * so retry with a fresh code on the unique-violation code instead.
 */
export async function createDemoGrant(input: CreateGrantInput): Promise<GrantRow> {
  const supabase = getSupabaseAdmin();
  const accessSeconds = clampAccessSeconds(input.accessSeconds);
  const redeemBy =
    input.redeemByDays === null
      ? null
      : new Date(Date.now() + input.redeemByDays * 24 * 60 * 60 * 1000).toISOString();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data, error } = await supabase
      .from("course_access")
      .insert({
        access_code: generateAccessCode(),
        email: input.email,
        label: input.label,
        source: "demo",
        access_seconds: accessSeconds,
        redeem_by: redeemBy,
        granted_by: input.grantedBy,
      })
      .select(GRANT_COLUMNS)
      .single();
    if (!error) return toGrant(data as RawGrant);
    // 23505 = unique_violation, i.e. the generated code already existed.
    if ((error as { code?: string }).code !== "23505") throw error;
  }
  throw new Error("Could not generate a unique access code after 3 attempts.");
}

/**
 * Adds time to a grant.
 *
 * Two different writes behind one button, because the two states mean
 * different things:
 *   dormant → grow access_seconds; there is no deadline yet to push.
 *   started → push expires_at out from whichever is later, now or the current
 *             deadline. Adding to an expiry three days in the past would leave
 *             the grant expired and look like the console had done nothing.
 */
export async function extendGrant(id: string, addSeconds: number): Promise<GrantRow> {
  const supabase = getSupabaseAdmin();
  const { data: current, error: readError } = await supabase
    .from("course_access")
    .select(GRANT_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (readError) throw readError;
  if (!current) throw new Error("not-found");

  const grant = toGrant(current as RawGrant);
  if (grant.revokedAt !== null) throw new Error("revoked");

  const patch =
    grant.startedAt === null
      ? { access_seconds: clampAccessSeconds(grant.accessSeconds + addSeconds) }
      : {
          expires_at: new Date(
            Math.max(Date.now(), new Date(grant.expiresAt ?? 0).getTime()) + addSeconds * 1000,
          ).toISOString(),
        };

  const { data, error } = await supabase
    .from("course_access")
    .update(patch)
    .eq("id", id)
    .select(GRANT_COLUMNS)
    .single();
  if (error) throw error;
  return toGrant(data as RawGrant);
}

/**
 * Soft revoke. Rows are never deleted: the payment_id unique index is what
 * makes grantCourseAccess idempotent, so deleting a paid row would let the
 * next Razorpay webhook retry silently re-grant a fresh 30-day window. It
 * would also throw away the reading history, which is the point of the list.
 *
 * There is no need to reach into the recipient's browser — the cookie is the
 * access code, and it is re-validated against this table on every request.
 */
export async function setGrantRevoked(id: string, revoked: boolean): Promise<GrantRow> {
  const { data, error } = await getSupabaseAdmin()
    .from("course_access")
    .update({ revoked_at: revoked ? new Date().toISOString() : null })
    .eq("id", id)
    .select(GRANT_COLUMNS)
    .single();
  if (error) throw error;
  return toGrant(data as RawGrant);
}
