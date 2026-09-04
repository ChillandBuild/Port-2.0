import { Resend } from "resend";
import type { SubmissionPayload } from "@/lib/submissions";
import type { CourseAccess } from "@/lib/backend/course-access";
import type { SchedulePayment } from "@/lib/backend/schedule-payment";
import { DISPLAY_TIME_ZONE, formatDuration } from "@/lib/course-duration";
import { getIdentity } from "@/lib/backend/site-content-loaders";

// Matches metadataBase in app/layout.tsx; overridable per environment. The
// fallback is the real domain, not a placeholder: this builds the links a
// paying buyer receives, and a wrong one strands them with no way back in.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sampathkumar.in";

const SOURCE_LABEL: Record<SubmissionPayload["source"], string> = {
  "case-studies-gate": "Case studies — unlocked",
  "schedule-call": "Schedule — wants the free first call",
};

function formatLines(payload: SubmissionPayload): string {
  const lines = [`Source: ${SOURCE_LABEL[payload.source]}`, `Email: ${payload.email}`];
  if (payload.name) lines.push(`Name: ${payload.name}`);
  if (payload.companyDomain) lines.push(`Company domain: ${payload.companyDomain}`);
  if (payload.companyName) lines.push(`Company: ${payload.companyName}`);
  if (payload.phone) lines.push(`Phone: ${payload.phone}`);
  if (payload.slot) lines.push(`Requested slot: ${payload.slot}`);
  if (payload.purpose) lines.push(`Purpose of call: ${payload.purpose}`);
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
 * Confirms receipt of a free-first-call request to whoever submitted the
 * /schedule form. Buyer-facing, so a failure logs loudly rather than
 * no-ops silently — same policy as sendCourseAccessEmail. The Supabase row
 * (and Sampath's own notification) are unaffected either way.
 */
export async function sendScheduleCallConfirmationEmail(payload: SubmissionPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    console.error(`schedule call confirmation skipped for ${payload.email} — Resend not configured`);
    return;
  }

  try {
    const identity = await getIdentity();
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: payload.email,
      subject: "Your free call request — received",
      text: [
        payload.name ? `Thanks, ${payload.name}.` : "Thanks.",
        "",
        "Your request for the free 30-45 minute discovery call has been received, and it's now in my queue for a personal review — this note confirms it landed, nothing more is needed from you right now.",
        "",
        payload.slot ? `Requested slot: ${payload.slot}` : "",
        payload.purpose ? `Purpose you shared: ${payload.purpose}` : "",
        payload.companyName ? `Company: ${payload.companyName}` : "",
        "",
        "Here's what happens next: I'll go through what you've shared, and reply by email within a day or two to confirm the exact time for your slot (adjusting it if needed to fit both our calendars). The call itself runs 30-45 minutes over video, and by the end of it you'll know whether outbound is the right spend for you right now — including if the honest answer is no.",
        "",
        "A few things worth having ready before we talk, so the 30-45 minutes goes further: a one-line description of what you sell, the regions you're targeting, and a rough picture of where you want your pipeline to be in the next 90 days. No need to prepare slides or a formal brief — a plain-spoken answer to each is plenty.",
        "",
        "If anything changes on your end, or you'd rather sort scheduling directly instead of waiting on email, you can reach me any of these ways:",
        `Phone: ${identity.phone}`,
        `Telegram: ${identity.telegram}`,
        `LinkedIn: ${identity.linkedin}`,
        "",
        "Talk soon,",
        "— Sampath Kumar",
      ]
        .filter((line, index, lines) => !(line === "" && lines[index - 1] === ""))
        .join("\n"),
    });
  } catch (error) {
    console.error(`sendScheduleCallConfirmationEmail failed for ${payload.email}`, error);
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

  // Both are guaranteed on a paid enrollment — grantCourseAccess writes the
  // deadline up front and the buyer's email is required. Demo grants can have
  // neither, and they use their own email; this is the wrong function for them.
  if (!access.email || !access.expiresAt) {
    console.error(`course access email skipped for ${access.accessCode} — no email or deadline`);
    return;
  }
  const recipient = access.email;

  // Vercel runs UTC. Without an explicit zone a 19:00 IST deadline formats as
  // the previous day, so the buyer is told their access ends before it does.
  const expiry = new Date(access.expiresAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: recipient,
      subject: "Your Lead Generation course access code",
      text: [
        "Thank you for enrolling in the Lead Generation course.",
        "",
        `Your access code: ${access.accessCode}`,
        "",
        `This code unlocks the full course at ${SITE_URL}/course and is valid until ${expiry} (30 days from payment).`,
        "",
        "How to start:",
        `1. Open ${SITE_URL}/course`,
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

export interface CourseAccessNotificationDetails {
  access: CourseAccess;
  paymentId: string;
  /** Major units and the currency actually charged — e.g. 59/"USD" or 4999/"INR". */
  amount: number;
  currency: string;
  /** Collected for the Checkout.js prefill, not persisted — only available from the primary verify path, not the webhook backup. */
  name?: string;
  phone?: string;
}

/**
 * Notifies Sampath that the course was paid for — mirrors
 * sendSchedulePaymentNotification's reasoning: a payment is a lead worth
 * knowing about immediately, unlike a plain content-gate unlock. Best-effort,
 * same recipient-resolution as sendSubmissionNotification.
 */
export async function sendCourseAccessNotification(details: CourseAccessNotificationDetails): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.HIRE_NOTIFY_TO;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !to || !from) return;

  const { access, paymentId, amount, currency, name, phone } = details;
  const lines = [
    "Source: Course — paid enrollment",
    name ? `Name: ${name}` : null,
    `Email: ${access.email ?? "unknown"}`,
    phone ? `Phone: ${phone}` : null,
    `Amount paid: ${currency} ${amount}`,
    `Access code: ${access.accessCode}`,
    access.expiresAt ? `Access valid until: ${access.expiresAt}` : null,
    `Payment reference: ${paymentId}`,
  ].filter((line): line is string => Boolean(line));

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: `Course paid — ${currency} ${amount}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("sendCourseAccessNotification failed", error);
  }
}

/**
 * Mails the buyer a receipt for the paid second-call setup. Buyer-facing, so
 * failures log loudly rather than no-op silently — same policy as
 * sendCourseAccessEmail. The Supabase row is still the source of truth.
 */
export async function sendSchedulePaymentReceiptEmail(payment: SchedulePayment): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    console.error(`schedule payment receipt skipped for ${payment.email} — Resend not configured`);
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: payment.email,
      subject: "Receipt — your setup call payment",
      text: [
        payment.name ? `Thank you, ${payment.name}.` : "Thank you.",
        "",
        `We've received your payment of ${payment.currency} ${payment.amount} for the one-time setup call — infrastructure, tool estimation, methodology and process flow.`,
        payment.slot ? `Requested slot: ${payment.slot}` : "",
        payment.purpose ? `Purpose: ${payment.purpose}` : "",
        "",
        "Sampath will confirm the exact time by email shortly.",
        "",
        `Payment reference: ${payment.paymentId}`,
        "",
        "— Sampath Kumar",
      ]
        .filter((line, index, lines) => !(line === "" && lines[index - 1] === ""))
        .join("\n"),
    });
  } catch (error) {
    console.error(`sendSchedulePaymentReceiptEmail failed for ${payment.email}`, error);
  }
}

/**
 * Notifies Sampath that the paid second call was booked and paid — full
 * contact details, purpose and the amount, so no manual follow-up on
 * whether payment happened is needed. Best-effort, same policy as
 * sendSubmissionNotification: the Supabase row already landed either way.
 */
export async function sendSchedulePaymentNotification(payment: SchedulePayment): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.HIRE_NOTIFY_TO;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !to || !from) return;

  const lines = [
    "Source: Schedule — paid second call",
    payment.name ? `Name: ${payment.name}` : null,
    `Email: ${payment.email}`,
    payment.phone ? `Phone: ${payment.phone}` : null,
    payment.companyName ? `Company: ${payment.companyName}` : null,
    payment.purpose ? `Purpose of call: ${payment.purpose}` : null,
    payment.slot ? `Requested slot: ${payment.slot}` : null,
    `Amount paid: ${payment.currency} ${payment.amount}`,
    `Payment reference: ${payment.paymentId}`,
  ].filter((line): line is string => Boolean(line));

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      subject: `Second call paid — ${payment.currency} ${payment.amount}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("sendSchedulePaymentNotification failed", error);
  }
}

export interface CourseGrantEmail {
  to: string;
  label: string;
  url: string;
  accessSeconds: number;
  redeemBy: string | null;
}

/**
 * Sends a time-limited access link to a company representative.
 *
 * Separate from sendCourseAccessEmail because the two say genuinely different
 * things: a buyer has a deadline ("valid until 3 March"), while this recipient
 * has a duration that has not started yet ("4 hours, beginning when you open
 * it"). Reusing the buyer copy here would state a date that does not exist.
 *
 * Returns whether it actually sent, so the console can tell the operator
 * rather than implying an email that never left.
 */
export async function sendCourseGrantEmail(grant: CourseGrantEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    console.error(`course grant email skipped for ${grant.to} — Resend not configured`);
    return false;
  }

  const window = formatDuration(grant.accessSeconds);
  const claimBy = grant.redeemBy
    ? new Date(grant.redeemBy).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: DISPLAY_TIME_ZONE,
      })
    : null;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: grant.to,
      subject: "Your access to the Lead Generation system",
      text: [
        grant.label ? `For ${grant.label}.` : "",
        "",
        "Here is the full lead generation system I run — ICP, research, infrastructure, campaigns, tracking and the numbers, written out in 40 sections.",
        "",
        grant.url,
        "",
        `Your ${window} of access starts when you open it, not now — so there is no rush to click.`,
        claimBy ? `The link itself stays available until ${claimBy}.` : "",
        "",
        "— Sampath Kumar",
      ]
        .filter((line, index, lines) => !(line === "" && lines[index - 1] === ""))
        .join("\n"),
    });
    return true;
  } catch (error) {
    console.error(`sendCourseGrantEmail failed for ${grant.to}`, error);
    return false;
  }
}
