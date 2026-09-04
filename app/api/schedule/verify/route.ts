import { NextResponse } from "next/server";
import { verifyCheckoutSignature } from "@/lib/backend/razorpay";
import { grantSchedulePayment } from "@/lib/backend/schedule-payment";
import { sendSchedulePaymentNotification, sendSchedulePaymentReceiptEmail } from "@/lib/backend/email";
import { bookSlot } from "@/lib/backend/availability";
import { SCHEDULE_CURRENCY } from "@/lib/content/schedule-payment";
import { getSchedulePricing } from "@/lib/backend/site-content-loaders";

export const runtime = "nodejs";

interface VerifyBody {
  razorpay_order_id?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_signature?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  companyName?: unknown;
  purpose?: unknown;
  slot?: unknown;
  slotDate?: unknown;
  slotTime?: unknown;
  /** Echoed back from the order response — records what was actually charged, not what the client claims it wants now. */
  currency?: unknown;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Verifies a Checkout.js success callback for the paid second call and
 * records the payment — mirrors app/api/course/verify/route.ts. This is the
 * primary path (full form details); the webhook (app/api/webhooks/razorpay)
 * stays wired as a backup for the rare case a browser closes before this
 * call completes, converging safely through grantSchedulePayment's existing
 * idempotency (unique index on payment_id).
 */
export async function POST(request: Request): Promise<Response> {
  let body: VerifyBody;
  try {
    body = (await request.json()) as VerifyBody;
  } catch {
    return NextResponse.json({ success: false, error: "invalid" }, { status: 400 });
  }

  const orderId = str(body.razorpay_order_id);
  const paymentId = str(body.razorpay_payment_id);
  const signature = str(body.razorpay_signature);
  const name = str(body.name);
  const email = str(body.email).toLowerCase();
  const phone = str(body.phone);
  const companyName = str(body.companyName);
  const purpose = str(body.purpose);
  const slot = str(body.slot);
  const currency = body.currency === "INR" ? "INR" : SCHEDULE_CURRENCY;
  const pricing = await getSchedulePricing();
  const amount = currency === "INR" ? pricing.secondCallPriceInr : pricing.secondCallPriceUsd;

  if (!orderId || !paymentId || !signature || !email || !name || !phone) {
    return NextResponse.json({ success: false, error: "invalid" }, { status: 400 });
  }

  if (!verifyCheckoutSignature(orderId, paymentId, signature)) {
    console.error(`razorpay checkout signature mismatch — order ${orderId} payment ${paymentId}`);
    return NextResponse.json({ success: false, error: "unverified" }, { status: 401 });
  }

  // Money already moved by this point — a lost slot race must never turn
  // into a failed response. If the claim fails, the payment is still
  // recorded and Sampath's notification flags it for manual follow-up.
  const slotDate = str(body.slotDate);
  const slotTime = str(body.slotTime);
  let slotConflict = false;
  if (DATE_RE.test(slotDate) && TIME_RE.test(slotTime)) {
    try {
      const claimed = await bookSlot(slotDate, slotTime, paymentId);
      slotConflict = !claimed;
    } catch (error) {
      console.error("slot claim failed for paid booking", error);
      slotConflict = true;
    }
  }

  let payment;
  try {
    payment = await grantSchedulePayment({
      name,
      email,
      phone,
      companyName: companyName || null,
      purpose: purpose || null,
      slot: slot || null,
      paymentId,
      amount,
      currency,
    });
  } catch (error) {
    console.error("schedule payment record failed after verified payment", error);
    return NextResponse.json({ success: false, error: "grant-pending" });
  }

  void sendSchedulePaymentReceiptEmail(payment);
  void sendSchedulePaymentNotification(payment, slotConflict);

  return NextResponse.json({ success: true });
}
