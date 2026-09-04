import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isSameOrigin, requireAdmin } from "@/lib/backend/admin-auth";
import { setSiteContent } from "@/lib/backend/site-content";

/**
 * Every admin-editable content key, whitelisted here so a request can never
 * write to an arbitrary site_content row — only the keys this console
 * actually exposes an editor for.
 */
const ALLOWED_KEYS = new Set([
  "identity",
  "course_pricing",
  "schedule_pricing",
  "course_faq",
  "footer",
  "legal_terms",
  "legal_privacy",
  "legal_refunds",
  "hero",
  "pipeline",
  "sectors",
  "ledger",
  "about",
  "roles",
  "tool_groups",
  "posts",
  "case_studies",
]);

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false, error: "origin" }, { status: 403 });
  }
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { key?: unknown; value?: unknown };
  try {
    body = (await request.json()) as { key?: unknown; value?: unknown };
  } catch {
    return NextResponse.json({ success: false, error: "invalid" }, { status: 400 });
  }

  const key = typeof body.key === "string" ? body.key : "";
  if (!ALLOWED_KEYS.has(key) || body.value === undefined) {
    return NextResponse.json({ success: false, error: "key" }, { status: 400 });
  }

  try {
    await setSiteContent(key, body.value);
  } catch (error) {
    console.error(`admin settings save failed for ${key}`, error);
    return NextResponse.json({ success: false, error: "server" }, { status: 500 });
  }

  // Instant publish: every statically generated page reading this key must
  // pick up the change on its next request. The root layout covers every
  // route on the site, so one call is simpler and safer than a per-key path
  // map that would silently miss a consumer added later.
  revalidatePath("/", "layout");

  return NextResponse.json({ success: true });
}
