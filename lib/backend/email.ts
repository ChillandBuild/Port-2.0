import { Resend } from "resend";
import type { SubmissionPayload } from "@/lib/submissions";
import type { CourseAccess } from "@/lib/backend/course-access";
import type { SchedulePayment } from "@/lib/backend/schedule-payment";
import { DISPLAY_TIME_ZONE, formatDuration } from "@/lib/course-duration";
import {
  getIdentity,
  getScheduleConfirmationTemplate,
  getCourseAccessEmailTemplate,
  getSchedulePaymentReceiptTemplate,
  getCourseGrantEmailTemplate,
} from "@/lib/backend/site-content-loaders";
import { interpolate } from "@/lib/backend/template";

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
    const [identity, template] = await Promise.all([getIdentity(), getScheduleConfirmationTemplate()]);
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: payload.email,
      subject: template.subject,
      text: [
        payload.name ? `Thanks, ${payload.name}.` : "Thanks.",
        "",
        template.receivedLine,
        "",
        payload.slot ? `Requested slot: ${payload.slot}` : "",
        payload.purpose ? `Purpose you shared: ${payload.purpose}` : "",
        payload.companyName ? `Company: ${payload.companyName}` : "",
        "",
        template.nextStepsLine,
        "",
        template.prepLine,
        "",
        template.reachOutLine,
        `Phone: ${identity.phone}`,
        `Telegram: ${identity.telegram}`,
        `LinkedIn: ${identity.linkedin}`,
        "",
        template.signoff,
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
    const template = await getCourseAccessEmailTemplate();
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: recipient,
      subject: template.subject,
      text: [
        template.introLine,
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
        template.keepSafeLine,
        "",
        template.signoff,
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
    const template = await getSchedulePaymentReceiptTemplate();
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: payment.email,
      subject: template.subject,
      text: [
        payment.name ? `Thank you, ${payment.name}.` : "Thank you.",
        "",
        interpolate(template.paidLine, { amount: `${payment.currency} ${payment.amount}` }),
        payment.slot ? `Requested slot: ${payment.slot}` : "",
        payment.purpose ? `Purpose: ${payment.purpose}` : "",
        "",
        template.confirmLine,
        "",
        `Payment reference: ${payment.paymentId}`,
        "",
        template.signoff,
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
export async function sendSchedulePaymentNotification(
  payment: SchedulePayment,
  slotConflict = false,
): Promise<void> {
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
    slotConflict
      ? "SLOT CONFLICT — that time was taken between selection and payment. Confirm a new time with them directly."
      : null,
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
    const template = await getCourseGrantEmailTemplate();
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: grant.to,
      subject: template.subject,
      text: [
        grant.label ? `For ${grant.label}.` : "",
        "",
        template.introLine,
        "",
        grant.url,
        "",
        interpolate(template.windowLine, { window }),
        claimBy ? `The link itself stays available until ${claimBy}.` : "",
        "",
        template.signoff,
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
