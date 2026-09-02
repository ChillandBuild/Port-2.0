import { createOrder } from "@/lib/backend/razorpay";
import { COURSE_PRICE_USD, COURSE_CURRENCY } from "@/lib/content/course";

export const runtime = "nodejs";

/**
 * Creates a Razorpay Order for the on-site checkout. No client input is
 * accepted — the amount is always the server-fixed course price, so a buyer
 * can never negotiate it by editing a request body.
 */
export async function POST(): Promise<Response> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) {
    console.error("course order requested but RAZORPAY_KEY_ID is not configured");
    return Response.json({ success: false, error: "server" }, { status: 500 });
  }

  try {
    const order = await createOrder(COURSE_PRICE_USD * 100, COURSE_CURRENCY);
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
