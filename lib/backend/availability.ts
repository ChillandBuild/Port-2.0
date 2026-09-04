import { getSupabaseAdmin } from "@/lib/backend/supabase/admin";

export interface OpenSlot {
  date: string;
  time: string;
}

export interface AdminSlot {
  id: string;
  date: string;
  time: string;
  status: "open" | "booked";
  bookedReference: string | null;
}

/** Public read — only what a booking calendar needs, no reference/PII. */
export async function listOpenSlots(from: string, to: string): Promise<OpenSlot[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("availability_slots")
    .select("date, time")
    .eq("status", "open")
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: true })
    .order("time", { ascending: true });
  if (error) throw error;
  return data as OpenSlot[];
}

export async function listSlotsForAdmin(from: string, to: string): Promise<AdminSlot[]> {
  const { data, error } = await getSupabaseAdmin()
    .from("availability_slots")
    .select("id, date, time, status, booked_reference")
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: true })
    .order("time", { ascending: true });
  if (error) throw error;
  return (data as { id: string; date: string; time: string; status: string; booked_reference: string | null }[]).map(
    (row) => ({
      id: row.id,
      date: row.date,
      time: row.time,
      status: row.status === "booked" ? "booked" : "open",
      bookedReference: row.booked_reference,
    }),
  );
}

/**
 * Adds one or more open slots. Duplicate (date, time) pairs are silently
 * skipped rather than erroring — re-adding a slot Sampath already opened is
 * a no-op, not a mistake worth surfacing.
 */
export async function addSlots(entries: { date: string; time: string }[]): Promise<void> {
  if (entries.length === 0) return;
  const { error } = await getSupabaseAdmin()
    .from("availability_slots")
    .upsert(
      entries.map((e) => ({ date: e.date, time: e.time, status: "open" })),
      { onConflict: "date,time", ignoreDuplicates: true },
    );
  if (error) throw error;
}

export async function deleteSlot(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin().from("availability_slots").delete().eq("id", id);
  if (error) throw error;
}

/**
 * The atomic claim. A plain UPDATE ... WHERE status = 'open' — either this
 * request is the one that flips the row, or it sees zero rows affected and
 * knows someone else got there first. Mirrors startCourseAccessClock's
 * conditional-update pattern; no separate SELECT-then-UPDATE race window.
 */
export async function bookSlot(date: string, time: string, reference: string): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin()
    .from("availability_slots")
    .update({ status: "booked", booked_reference: reference })
    .eq("date", date)
    .eq("time", time)
    .eq("status", "open")
    .select("id")
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

/**
 * Compensating action for a claim whose caller failed after booking it —
 * e.g. the submission insert that follows a successful claim. Scoped to the
 * exact reference that claimed it, so a slow release can never undo a
 * different, newer booking of the same slot.
 */
export async function releaseSlot(date: string, time: string, reference: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("availability_slots")
    .update({ status: "open", booked_reference: null })
    .eq("date", date)
    .eq("time", time)
    .eq("booked_reference", reference);
  if (error) console.error("slot release failed", error);
}
