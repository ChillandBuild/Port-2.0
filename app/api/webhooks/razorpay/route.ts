import { extractPayment, verifyRazorpaySignature } from "@/lib/backend/razorpay";
import { grantCourseAccess } from "@/lib/backend/course-access";
import { grantSchedulePayment } from "@/lib/backend/schedule-payment";
import {
  sendCourseAccessEmail,
  sendSchedulePaymentNotification,
  sendSchedulePaymentReceiptEmail,
} from "@/lib/backend/email";
import { SCHEDULE_SECOND_CALL_PRICE_USD } from "@/lib/content/schedule-payment";

export const runtime = "nodejs";

/**
 * Receives Razorpay webhooks for both paid products on this site — the
 * lead-generation course and the schedule page's second-call setup — routed
 * by the `product` tag stamped into the order's notes at createOrder() time.
 * The signature is verified against the raw body before anything else — the
 * body is read as text, not JSON, so the HMAC matches what Razorpay signed.
 * Always answers 200 once authenticated (even for unhandled events) so
 * Razorpay stops retrying; only verification or database failures get
 * non-2xx, which is exactly when a retry is wanted.
 */
export async function POST(request: Request): Promise<Response> {
  const rawBody = await request.text();
  if (!verifyRazorpaySignature(rawBody, request.headers.get("x-razorpay-signature"))) {
    return Response.json({ success: false, error: "Invalid signature." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  const payment = extractPayment(payload);
  if (!payment) return Response.json({ success: true, handled: false });

  if (!payment.email) {
    // Payment Pages normally collect the email, so this should be rare; log
    // loudly so the grant can be issued manually from Supabase.
    console.error(`razorpay payment ${payment.id} captured without an email — grant manually`);
    return Response.json({ success: true, handled: false });
  }

  if (payment.product === "schedule-second-call") {
    // Backup path only — the verify route is primary and has the full form
    // details. This webhook knows just the email, so name/phone land null;
    // grantSchedulePayment never overwrites an existing row, so a verify
    // call that already landed keeps its full details either way.
    try {
      const record = await grantSchedulePayment({
        name: null,
        email: payment.email,
        phone: null,
        companyName: null,
        purpose: null,
        slot: null,
        paymentId: payment.id,
        amountUsd: SCHEDULE_SECOND_CALL_PRICE_USD,
      });
      void sendSchedulePaymentReceiptEmail(record);
      void sendSchedulePaymentNotification(record);
    } catch (error) {
      console.error("schedule payment grant failed", error);
      return Response.json({ success: false, error: "Grant failed." }, { status: 500 });
    }
    return Response.json({ success: true, handled: true });
  }

  let access;
  try {
    access = await grantCourseAccess(payment.id, payment.email);
  } catch (error) {
    console.error("course access grant failed", error);
    return Response.json({ success: false, error: "Grant failed." }, { status: 500 });
  }

  // Best-effort, same policy as submission notifications: the row is the
  // source of truth, a failed email can be resent manually.
  void sendCourseAccessEmail(access);

  return Response.json({ success: true, handled: true });
}
