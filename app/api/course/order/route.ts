import { createOrder } from "@/lib/backend/razorpay";
import { COURSE_CURRENCY } from "@/lib/content/course";
import { getCoursePricing } from "@/lib/backend/site-content-loaders";

export const runtime = "nodejs";

/**
 * Creates a Razorpay Order for the on-site checkout. The only client input
 * accepted is which of two fixed prices to charge — "INR" picks the rupee
 * price, anything else falls back to the USD price. The amount itself is
 * always looked up here, server-side, from that choice — a buyer can never
 * negotiate it by editing a request body.
 */
export async function POST(request: Request): Promise<Response> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) {
    console.error("course order requested but RAZORPAY_KEY_ID is not configured");
    return Response.json({ success: false, error: "server" }, { status: 500 });
  }

  let currency = COURSE_CURRENCY;
  try {
    const body = (await request.json()) as { currency?: unknown };
    if (body.currency === "INR") currency = "INR";
  } catch {
    // No body, or not JSON — default to the USD price.
  }

  const pricing = await getCoursePricing();
  const amountMajorUnits = currency === "INR" ? pricing.priceInr : pricing.priceUsd;

  try {
    const order = await createOrder(amountMajorUnits * 100, currency, "lead-gen-course");
    return Response.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    console.error("course order creation failed", error);
    return Response.json({ success: false, error: "server" }, { status: 500 });
  }
}
