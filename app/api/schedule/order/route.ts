import { createOrder } from "@/lib/backend/razorpay";
import {
  SCHEDULE_CURRENCY,
  SCHEDULE_SECOND_CALL_PRICE_USD,
  SCHEDULE_SECOND_CALL_PRICE_INR,
} from "@/lib/content/schedule-payment";

export const runtime = "nodejs";

/**
 * Creates a Razorpay Order for the paid second call. Mirrors
 * app/api/course/order/route.ts: the only client input accepted is which of
 * two fixed prices to charge, never a client-supplied amount.
 */
export async function POST(request: Request): Promise<Response> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) {
    console.error("schedule order requested but RAZORPAY_KEY_ID is not configured");
    return Response.json({ success: false, error: "server" }, { status: 500 });
  }

  let currency = SCHEDULE_CURRENCY;
  try {
    const body = (await request.json()) as { currency?: unknown };
    if (body.currency === "INR") currency = "INR";
  } catch {
    // No body, or not JSON — default to the USD price.
  }

  const amountMajorUnits = currency === "INR" ? SCHEDULE_SECOND_CALL_PRICE_INR : SCHEDULE_SECOND_CALL_PRICE_USD;

  try {
    const order = await createOrder(amountMajorUnits * 100, currency, "schedule-second-call");
    return Response.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error) {
    console.error("schedule order creation failed", error);
    return Response.json({ success: false, error: "server" }, { status: 500 });
  }
}
