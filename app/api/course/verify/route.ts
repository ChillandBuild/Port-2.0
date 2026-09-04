import { NextResponse } from "next/server";
import { verifyCheckoutSignature } from "@/lib/backend/razorpay";
import {
  COURSE_ACCESS_COOKIE,
  COURSE_ACCESS_COOKIE_MAX_AGE,
  grantCourseAccess,
} from "@/lib/backend/course-access";
import { sendCourseAccessEmail, sendCourseAccessNotification } from "@/lib/backend/email";
import { COURSE_CURRENCY } from "@/lib/content/course";
import { getCoursePricing } from "@/lib/backend/site-content-loaders";

export const runtime = "nodejs";

interface VerifyBody {
  razorpay_order_id?: unknown;
  razorpay_payment_id?: unknown;
  razorpay_signature?: unknown;
  email?: unknown;
  name?: unknown;
  phone?: unknown;
  /** Echoed back from the order response — records what was actually charged, not what the client claims it wants now. */
  currency?: unknown;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Verifies a Checkout.js success callback and grants access immediately —
 * this is the primary grant path now; the webhook (app/api/webhooks/razorpay)
 * stays wired unchanged as a backup for the rare case a browser closes
 * before this call completes. Both converge safely through
 * grantCourseAccess's existing idempotency (unique index on payment_id).
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
  const email = str(body.email).toLowerCase();
  const name = str(body.name);
  const phone = str(body.phone);
  const currency = body.currency === "INR" ? "INR" : COURSE_CURRENCY;
  const pricing = await getCoursePricing();
  const amount = currency === "INR" ? pricing.priceInr : pricing.priceUsd;

  if (!orderId || !paymentId || !signature || !email) {
    return NextResponse.json({ success: false, error: "invalid" }, { status: 400 });
  }

  if (!verifyCheckoutSignature(orderId, paymentId, signature)) {
    console.error(`razorpay checkout signature mismatch — order ${orderId} payment ${paymentId}`);
    return NextResponse.json({ success: false, error: "unverified" }, { status: 401 });
  }

  // Payment is verified from here on — a grant failure below must never be
  // reported to the buyer as "payment failed." Logged for manual follow-up;
  // name/phone were collected for the Checkout.js prefill, not persisted.
  if (name || phone) {
    console.log(`course checkout verified for ${email} — name: ${name || "—"}, phone: ${phone || "—"}`);
  }

  let access;
  try {
    access = await grantCourseAccess(paymentId, email);
  } catch (error) {
    console.error("course access grant failed after verified payment", error);
    return NextResponse.json({ success: false, error: "grant-pending" });
  }

  void sendCourseAccessEmail(access);
  void sendCourseAccessNotification({
    access,
    paymentId,
    amount,
    currency,
    name: name || undefined,
    phone: phone || undefined,
  });

  const response = NextResponse.json({
    success: true,
    accessCode: access.accessCode,
    expiresAt: access.expiresAt,
  });
  response.cookies.set({
    name: COURSE_ACCESS_COOKIE,
    value: access.accessCode,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COURSE_ACCESS_COOKIE_MAX_AGE,
  });
  return response;
}
