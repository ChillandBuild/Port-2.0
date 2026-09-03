import { createOrder } from "@/lib/backend/razorpay";
import { SCHEDULE_CURRENCY, SCHEDULE_SECOND_CALL_PRICE_USD } from "@/lib/content/schedule-payment";

export const runtime = "nodejs";

/**
 * Creates a Razorpay Order for the paid second call. Mirrors
 * app/api/course/order/route.ts exactly: no client input accepted, the
 * amount is always the server-fixed price.
 */
export async function POST(): Promise<Response> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) {
    console.error("schedule order requested but RAZORPAY_KEY_ID is not configured");
    return Response.json({ success: false, error: "server" }, { status: 500 });
  }

  try {
    const order = await createOrder(
      SCHEDULE_SECOND_CALL_PRICE_USD * 100,
      SCHEDULE_CURRENCY,
      "schedule-second-call",
    );
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
