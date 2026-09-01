import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** How long a paid enrollment stays valid, in days. */
export const COURSE_ACCESS_DAYS = 30;

/**
 * Razorpay signs every webhook with the webhook secret configured in the
 * dashboard (HMAC SHA256 over the raw request body). The signature header
 * must be checked before the payload is trusted — a forged webhook would
 * otherwise hand out course access for free.
 */
export function verifyRazorpaySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Human-readable access code, e.g. LG-7K2M-9QX4. The alphabet drops
 * 0/O/1/I/L so the code survives being read out over the phone or retyped
 * from an email.
 */
export function generateAccessCode(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const pick = () =>
    Array.from(randomBytes(4), (byte) => alphabet[byte % alphabet.length]).join("");
  return `LG-${pick()}-${pick()}`;
}

export interface RazorpayPayment {
  id: string;
  email: string | null;
}

/**
 * Pulls the paying customer out of a `payment.captured` payload. Razorpay's
 * Payment Pages collect the buyer's email on the hosted form, and it can also
 * arrive via `notes` if the payment link was configured with a prefill —
 * both are accepted so neither integration path breaks the grant.
 */
export function extractPayment(payload: unknown): RazorpayPayment | null {
  if (typeof payload !== "object" || payload === null) return null;
  const { event, payload: inner } = payload as Record<string, unknown>;
  if (event !== "payment.captured") return null;
  if (typeof inner !== "object" || inner === null) return null;
  const payment = (inner as Record<string, unknown>).payment;
  if (typeof payment !== "object" || payment === null) return null;
  const entity = (payment as Record<string, unknown>).entity;
  if (typeof entity !== "object" || entity === null) return null;
  const e = entity as Record<string, unknown>;
  if (typeof e.id !== "string" || !e.id) return null;
  const notes = typeof e.notes === "object" && e.notes !== null ? (e.notes as Record<string, unknown>) : {};
  const email = [e.email, notes.email].find(
    (value): value is string => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  );
  return { id: e.id, email: email ? email.trim().toLowerCase() : null };
}
