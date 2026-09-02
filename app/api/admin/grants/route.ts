import { NextResponse } from "next/server";
import { isSameOrigin, requireAdmin } from "@/lib/backend/admin-auth";
import { createDemoGrant } from "@/lib/backend/course-grants";
import { sendCourseGrantEmail } from "@/lib/backend/email";
import {
  clampAccessSeconds,
  durationToSeconds,
  presetById,
  type DurationUnit,
} from "@/lib/course-duration";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Resolves the requested window to seconds, server-side.
 *
 * The request never carries a second count. It names a preset, or an
 * amount plus a unit — both of which are re-derived from the same table the
 * form rendered. A hand-crafted request cannot mint a ten-year window.
 */
function resolveSeconds(body: Record<string, unknown>): number | null {
  if (typeof body.preset === "string") {
    const preset = presetById(body.preset);
    return preset ? preset.seconds : null;
  }
  const amount = Number(body.amount);
  const unit = body.unit === "days" ? "days" : "hours";
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return clampAccessSeconds(durationToSeconds(amount, unit as DurationUnit));
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false, error: "origin" }, { status: 403 });
  }
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, error: "invalid" }, { status: 400 });
  }

  const label = typeof body.label === "string" ? body.label.trim() : "";
  if (!label) {
    return NextResponse.json({ success: false, error: "label" }, { status: 400 });
  }

  const seconds = resolveSeconds(body);
  if (seconds === null) {
    return NextResponse.json({ success: false, error: "duration" }, { status: 400 });
  }

  const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (rawEmail && !EMAIL_RE.test(rawEmail)) {
    return NextResponse.json({ success: false, error: "email" }, { status: 400 });
  }

  const redeemByDays = Number(body.redeemByDays);
  const redeemBy =
    Number.isFinite(redeemByDays) && redeemByDays > 0 ? Math.min(365, Math.round(redeemByDays)) : null;

  try {
    const grant = await createDemoGrant({
      label,
      email: rawEmail || null,
      accessSeconds: seconds,
      redeemByDays: redeemBy,
      grantedBy: admin.email,
    });

    const url = new URL(`/c/${grant.accessCode}`, request.url).toString();

    // Awaited, not fire-and-forget: the console reports whether it actually
    // sent, because Sampath may be about to tell someone "check your inbox".
    let emailed = false;
    if (grant.email) {
      emailed = await sendCourseGrantEmail({
        to: grant.email,
        label: grant.label ?? "",
        url,
        accessSeconds: grant.accessSeconds,
        redeemBy: grant.redeemBy,
      });
    }

    return NextResponse.json({ success: true, grant: { ...grant, url }, emailed });
  } catch (error) {
    console.error("create demo grant failed", error);
    return NextResponse.json({ success: false, error: "server" }, { status: 500 });
  }
}
