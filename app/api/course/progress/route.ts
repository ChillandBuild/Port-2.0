import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COURSE_ACCESS_COOKIE, resolveCourseAccess } from "@/lib/backend/course-access";
import { getSupabaseAdmin } from "@/lib/backend/supabase/admin";
import { getGuideSectionIdSet } from "@/lib/guide/sections";

export const runtime = "nodejs";

/** Nobody reads one section for four hours; anything past this is a stuck tab. */
const MAX_SECONDS_PER_SECTION = 60 * 60;
/** One beacon should never claim more time than the interval that produced it. */
const MAX_SECONDS_PER_REPORT = 10 * 60;

interface StoredSection {
  first?: string;
  seconds?: number;
}

/**
 * Records which sections a recipient has actually read, so Sampath can see
 * whether a company engaged before he follows up.
 *
 * Authorisation is the access cookie and nothing else — whoever holds a live
 * code can write here. That makes input validation the real control:
 *
 *  - Section ids are checked against the document's own set. Without that this
 *    is an arbitrary write into a jsonb column keyed by a bearer token.
 *  - Durations are clamped per report and per section, so a looping or
 *    malicious client cannot inflate the engagement number into fiction.
 *
 * Silent success on an invalid or expired cookie is deliberate: the reply goes
 * to a fire-and-forget beacon that cannot act on an error, and telling an
 * anonymous caller which codes are live would be a probing oracle.
 */
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: true });
  }

  const raw = (body as { sections?: unknown })?.sections;
  if (typeof raw !== "object" || raw === null) return NextResponse.json({ success: true });

  const knownSectionIds = await getGuideSectionIdSet();
  const reported = new Map<string, number>();
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!knownSectionIds.has(id)) continue;
    const seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds <= 0) continue;
    reported.set(id, Math.min(MAX_SECONDS_PER_REPORT, Math.round(seconds)));
  }
  if (reported.size === 0) return NextResponse.json({ success: true });

  try {
    const store = await cookies();
    const status = await resolveCourseAccess(store.get(COURSE_ACCESS_COOKIE)?.value);
    if (status.state !== "valid") return NextResponse.json({ success: true });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("course_access")
      .select("sections_seen")
      .eq("access_code", status.access.accessCode)
      .maybeSingle();
    if (error) throw error;

    const current: Record<string, StoredSection> =
      typeof data?.sections_seen === "object" && data.sections_seen !== null
        ? (data.sections_seen as Record<string, StoredSection>)
        : {};

    const now = new Date().toISOString();
    const merged: Record<string, StoredSection> = { ...current };
    for (const [id, seconds] of reported) {
      const existing = merged[id];
      merged[id] = {
        first: existing?.first ?? now,
        seconds: Math.min(MAX_SECONDS_PER_SECTION, (existing?.seconds ?? 0) + seconds),
      };
    }

    // Last write wins. Two tabs reading at once can lose a few seconds of one
    // another's time; that is well inside the noise of what this measures.
    const { error: writeError } = await supabase
      .from("course_access")
      .update({ sections_seen: merged, last_seen_at: now })
      .eq("access_code", status.access.accessCode);
    if (writeError) throw writeError;
  } catch (error) {
    console.error("course progress write failed", error);
    // Still 200: reading must never break because analytics did.
  }

  return NextResponse.json({ success: true });
}
