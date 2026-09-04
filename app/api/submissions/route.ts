import { getSupabaseAdmin } from "@/lib/backend/supabase/admin";
import { sendScheduleCallConfirmationEmail, sendSubmissionNotification } from "@/lib/backend/email";
import { bookSlot, releaseSlot } from "@/lib/backend/availability";
import type { SubmissionPayload, SubmissionSource } from "@/lib/submissions";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const SOURCES: SubmissionSource[] = ["case-studies-gate", "schedule-call"];

function isSubmissionPayload(body: unknown): body is SubmissionPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  if (!SOURCES.includes(b.source as SubmissionSource)) return false;
  if (typeof b.email !== "string" || !EMAIL_RE.test(b.email.trim())) return false;
  if (b.name !== undefined && typeof b.name !== "string") return false;
  if (b.companyDomain !== undefined && typeof b.companyDomain !== "string") return false;
  if (b.companyName !== undefined && typeof b.companyName !== "string") return false;
  if (b.phone !== undefined && typeof b.phone !== "string") return false;
  if (b.slot !== undefined && typeof b.slot !== "string") return false;
  if (b.slotDate !== undefined && typeof b.slotDate !== "string") return false;
  if (b.slotTime !== undefined && typeof b.slotTime !== "string") return false;
  if (b.purpose !== undefined && typeof b.purpose !== "string") return false;
  if (b.callType !== undefined && b.callType !== "first" && b.callType !== "second") return false;
  // Phone is the one field the schedule form treats as mandatory, not optional.
  if (b.source === "schedule-call" && !(typeof b.phone === "string" && b.phone.trim())) return false;
  return true;
}

/**
 * Single shared endpoint for every form on the site that reaches Sampath
 * directly: the case-studies gate and the /schedule booking form both post here.
 * The Supabase write is the source of truth and is awaited; the email
 * notification is best-effort and never blocks or fails the response.
 */
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!isSubmissionPayload(body)) {
    return Response.json({ success: false, error: "Missing or invalid fields." }, { status: 400 });
  }

  const payload = body;

  // Opportunistic: most callers never pick a calendar slot at all. Only a
  // well-formed date+time pair is worth an atomic claim; anything partial
  // is treated the same as "no slot" rather than rejected outright.
  const hasStructuredSlot =
    typeof payload.slotDate === "string" &&
    DATE_RE.test(payload.slotDate) &&
    typeof payload.slotTime === "string" &&
    TIME_RE.test(payload.slotTime);

  if (hasStructuredSlot) {
    let claimed = false;
    try {
      claimed = await bookSlot(payload.slotDate!, payload.slotTime!, `submission:${payload.email.trim()}`);
    } catch (error) {
      console.error("slot claim failed", error);
      return Response.json({ success: false, error: "Could not save submission." }, { status: 500 });
    }
    if (!claimed) {
      return Response.json({ success: false, error: "slot-taken" }, { status: 409 });
    }
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("submissions").insert({
      source: payload.source,
      email: payload.email.trim(),
      name: payload.name?.trim() || null,
      company_domain: payload.companyDomain?.trim() || null,
      company_name: payload.companyName?.trim() || null,
      phone: payload.phone?.trim() || null,
    });
    if (error) throw error;
  } catch (error) {
    console.error("submissions insert failed", error);
    if (hasStructuredSlot) {
      void releaseSlot(payload.slotDate!, payload.slotTime!, `submission:${payload.email.trim()}`);
    }
    return Response.json({ success: false, error: "Could not save submission." }, { status: 500 });
  }

  // Fire-and-forget: an email failure must never turn a saved submission
  // into a client-visible error. Case-studies-gate unlocks are just content
  // access, not a lead — no email for those, only schedule-call.
  if (payload.source === "schedule-call") {
    void sendSubmissionNotification(payload);
    void sendScheduleCallConfirmationEmail(payload);
  }

  return Response.json({ success: true });
}
