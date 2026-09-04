import { getSupabaseAdmin } from "@/lib/backend/supabase/admin";

/**
 * IMPORTANT: reads/writes go through getSupabaseAdmin() — the service-role
 * client. schedule_payments has RLS enabled with zero policies, same posture
 * as course_access (see the warning in lib/backend/course-access.ts) — a
 * publishable-key client would silently read back zero rows here.
 */

export interface SchedulePaymentDetails {
  /** Null only on the webhook backup path, which knows just the email — the primary verify path always has the full form details. */
  name: string | null;
  email: string;
  phone: string | null;
  companyName: string | null;
  purpose: string | null;
  slot: string | null;
  paymentId: string;
  /** Major units, in whatever currency was actually charged — e.g. 350 (USD) or 29999 (INR). */
  amount: number;
  currency: string;
}

export interface SchedulePayment extends SchedulePaymentDetails {
  paidAt: string;
}

const COLUMNS = "name, email, phone, company_name, purpose, slot, payment_id, amount, currency, paid_at";

interface SchedulePaymentRow {
  name: string | null;
  email: string;
  phone: string | null;
  company_name: string | null;
  purpose: string | null;
  slot: string | null;
  payment_id: string;
  amount: number;
  currency: string;
  paid_at: string;
}

function rowToPayment(row: SchedulePaymentRow): SchedulePayment {
  return {
    name: row.name,
    email: row.email,
    phone: row.phone,
    companyName: row.company_name,
    purpose: row.purpose,
    slot: row.slot,
    paymentId: row.payment_id,
    amount: row.amount,
    currency: row.currency,
    paidAt: row.paid_at,
  };
}

/**
 * Records a captured payment for the paid second call. Idempotent on the
 * unique index on payment_id, same insert-then-recover-on-race shape as
 * grantCourseAccess in course-access.ts — a Razorpay webhook retry either
 * finds the existing row or loses a genuine insert race to it cleanly.
 */
export async function grantSchedulePayment(details: SchedulePaymentDetails): Promise<SchedulePayment> {
  const supabase = getSupabaseAdmin();
  const existing = await supabase
    .from("schedule_payments")
    .select(COLUMNS)
    .eq("payment_id", details.paymentId)
    .maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) return rowToPayment(existing.data as SchedulePaymentRow);

  const { data, error } = await supabase
    .from("schedule_payments")
    .insert({
      name: details.name,
      email: details.email,
      phone: details.phone,
      company_name: details.companyName,
      purpose: details.purpose,
      slot: details.slot,
      payment_id: details.paymentId,
      amount: details.amount,
      currency: details.currency,
    })
    .select(COLUMNS)
    .single();
  if (error) {
    const race = await supabase
      .from("schedule_payments")
      .select(COLUMNS)
      .eq("payment_id", details.paymentId)
      .maybeSingle();
    if (race.error) throw error;
    if (race.data) return rowToPayment(race.data as SchedulePaymentRow);
    throw error;
  }
  return rowToPayment(data as SchedulePaymentRow);
}
