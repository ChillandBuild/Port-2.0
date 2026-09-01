import { extractPayment, verifyRazorpaySignature } from "@/lib/backend/razorpay";
import { grantCourseAccess } from "@/lib/backend/course-access";
import { sendCourseAccessEmail } from "@/lib/backend/email";

export const runtime = "nodejs";

/**
 * Receives Razorpay webhooks for the lead-generation course. On a captured
 * payment the buyer is granted 30 days of access and emailed their code.
 * The signature is verified against the raw body before anything else —
 * the body is read as text, not JSON, so the HMAC matches what Razorpay
 * signed. Always answers 200 once authenticated (even for unhandled events)
 * so Razorpay stops retrying; only verification or database failures get
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
    // loudly so the code can be sent manually from Supabase.
    console.error(`razorpay payment ${payment.id} captured without an email — grant manually`);
    return Response.json({ success: true, handled: false });
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
