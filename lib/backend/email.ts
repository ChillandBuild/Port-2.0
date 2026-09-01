import { Resend } from "resend";
import type { SubmissionPayload } from "@/lib/submissions";
import type { CourseAccess } from "@/lib/backend/course-access";

// Matches metadataBase in app/layout.tsx; overridable per environment.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sampathkumar.example";

const SOURCE_LABEL: Record<SubmissionPayload["source"], string> = {
  "hire-form": "Hire page — wants a teardown",
  "case-studies-gate": "Case studies — unlocked",
  "schedule-call": "Schedule — wants the free first call",
};

function formatLines(payload: SubmissionPayload): string {
  const lines = [`Source: ${SOURCE_LABEL[payload.source]}`, `Email: ${payload.email}`];
  if (payload.name) lines.push(`Name: ${payload.name}`);
  if (payload.companyDomain) lines.push(`Company domain: ${payload.companyDomain}`);
  if (payload.companyName) lines.push(`Company: ${payload.companyName}`);
  if (payload.lane) lines.push(`Lane: ${payload.lane === "hiring" ? "Hiring for a role" : "Buying outbound"}`);
  if (payload.phone) lines.push(`Phone: ${payload.phone}`);
  if (payload.slot) lines.push(`Requested slot: ${payload.slot}`);
  return lines.join("\n");
}

/**
 * Best-effort notification. Silently no-ops if the env vars aren't
 * configured, and never throws — a failed email must never take down a
 * submission whose Supabase row already landed. Called without awaiting its
 * failure path from the route handler.
 */
export async function sendSubmissionNotification(payload: SubmissionPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.HIRE_NOTIFY_TO;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !to || !from) return;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: `New submission — ${SOURCE_LABEL[payload.source]}`,
      text: formatLines(payload),
    });
  } catch (error) {
    console.error("sendSubmissionNotification failed", error);
  }
}

/**
 * Mails the buyer their course access code after a captured payment. Unlike
 * the notification above this goes to the buyer, so a silent no-op would
 * strand a paying customer — failures are logged loudly and the webhook
 * still answers 200 (the Supabase row is the source of truth and the code
 * can be resent manually).
 */
export async function sendCourseAccessEmail(access: CourseAccess): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    console.error(`course access email skipped for ${access.email} — Resend not configured`);
    return;
  }

  const expiry = new Date(access.expiresAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: access.email,
      subject: "Your Lead Generation course access code",
      text: [
        "Thank you for enrolling in the Lead Generation course.",
        "",
        `Your access code: ${access.accessCode}`,
        "",
        `This code unlocks the full course at ${SITE_URL}/lead-generation and is valid until ${expiry} (30 days from payment).`,
        "",
        "How to start:",
        `1. Open ${SITE_URL}/lead-generation`,
        "2. Enter your access code",
        "3. Work through the lessons at your own pace before your access expires",
        "",
        "Keep this email safe — you will need the code again if you switch devices or clear your browser.",
        "",
        "— Sampath Kumar",
      ].join("\n"),
    });
  } catch (error) {
    console.error(`sendCourseAccessEmail failed for ${access.email}`, error);
  }
}
