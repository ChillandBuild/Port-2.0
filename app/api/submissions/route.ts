import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendSubmissionNotification } from "@/lib/email";
import type { SubmissionPayload, SubmissionSource, Lane } from "@/lib/submissions";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCES: SubmissionSource[] = ["hire-form", "case-studies-gate", "schedule-call"];
const LANES: Lane[] = ["hiring", "buying"];

function isSubmissionPayload(body: unknown): body is SubmissionPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  if (!SOURCES.includes(b.source as SubmissionSource)) return false;
  if (typeof b.email !== "string" || !EMAIL_RE.test(b.email.trim())) return false;
  if (b.name !== undefined && typeof b.name !== "string") return false;
  if (b.companyDomain !== undefined && typeof b.companyDomain !== "string") return false;
  if (b.lane !== undefined && !LANES.includes(b.lane as Lane)) return false;
  if (b.phone !== undefined && typeof b.phone !== "string") return false;
  return true;
}

/**
 * Single shared endpoint for every form on the site that reaches Sampath
 * directly: the /hire capture form and the case-studies gate both post here.
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

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("submissions").insert({
      source: payload.source,
      email: payload.email.trim(),
      name: payload.name?.trim() || null,
      company_domain: payload.companyDomain?.trim() || null,
      lane: payload.lane ?? null,
      phone: payload.phone?.trim() || null,
    });
    if (error) throw error;
  } catch (error) {
    console.error("submissions insert failed", error);
    return Response.json({ success: false, error: "Could not save submission." }, { status: 500 });
  }

  // Fire-and-forget: an email failure must never turn a saved submission
  // into a client-visible error.
  void sendSubmissionNotification(payload);

  return Response.json({ success: true });
}
