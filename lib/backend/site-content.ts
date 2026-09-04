import { getSupabaseAdmin } from "@/lib/backend/supabase/admin";

/**
 * One row per editable content key, JSON value, service-role only (same
 * posture as course_access — RLS on, zero policies). Every caller supplies
 * the current hardcoded value as `fallback`: a missing row, a Supabase
 * outage, or a shape mismatch all degrade to that value instead of a 500,
 * matching the graceful-degradation pattern already used for the grants list.
 */
export async function getSiteContent<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error || !data) return fallback;
    return data.value as T;
  } catch (error) {
    console.error(`getSiteContent(${key}) failed`, error);
    return fallback;
  }
}

/** Instant publish, no draft step — an admin save is live on the next read. */
export async function setSiteContent(key: string, value: unknown): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
}
