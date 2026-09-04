/**
 * Price for the paid second call (infrastructure setup, tool estimation,
 * methodology, process flow) booked from /schedule. Mirrors
 * lib/content/course.ts's COURSE_PRICE_USD — same shape, same reason: one
 * server-side constant the order route trusts, never a client-supplied amount.
 */
export const SCHEDULE_SECOND_CALL_PRICE_USD = 350;
export const SCHEDULE_CURRENCY = "USD";
/** INR alternative for buyers paying from India — a round price point, not a live conversion. */
export const SCHEDULE_SECOND_CALL_PRICE_INR = 29999;
