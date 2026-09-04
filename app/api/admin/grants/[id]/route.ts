import { NextResponse } from "next/server";
import { isSameOrigin, requireAdmin } from "@/lib/backend/admin-auth";
import { deleteGrant, extendGrant, setGrantRevoked } from "@/lib/backend/course-grants";
import { clampAccessSeconds, durationToSeconds, presetById } from "@/lib/course-duration";

export const runtime = "nodejs";

/**
 * Acts on one grant: extend, revoke, restore, delete.
 *
 * One handler rather than sibling routes — the auth guard, the id lookup and
 * the error mapping are identical, and splitting them would mean more places
 * to forget requireAdmin().
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false, error: "origin" }, { status: 403 });
  }
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, error: "invalid" }, { status: 400 });
  }

  const action = body.action;

  try {
    if (action === "revoke" || action === "restore") {
      const grant = await setGrantRevoked(id, action === "revoke");
      return NextResponse.json({ success: true, grant });
    }

    if (action === "extend") {
      // Same rule as creation: seconds are derived here, never accepted.
      const preset = typeof body.preset === "string" ? presetById(body.preset) : null;
      const amount = Number(body.amount);
      const seconds = preset
        ? preset.seconds
        : Number.isFinite(amount) && amount > 0
          ? clampAccessSeconds(durationToSeconds(amount, body.unit === "days" ? "days" : "hours"))
          : null;
      if (seconds === null) {
        return NextResponse.json({ success: false, error: "duration" }, { status: 400 });
      }
      const grant = await extendGrant(id, seconds);
      return NextResponse.json({ success: true, grant });
    }

    if (action === "delete") {
      await deleteGrant(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "not-found") {
      return NextResponse.json({ success: false, error: "not-found" }, { status: 404 });
    }
    // Extending a revoked grant would look live in the list and be dead in the
    // browser. Make the operator restore it first, deliberately.
    if (message === "revoked") {
      return NextResponse.json({ success: false, error: "revoked" }, { status: 409 });
    }
    // deleteGrant refuses paid rows — see the comment on that function.
    if (message === "not-demo") {
      return NextResponse.json({ success: false, error: "not-demo" }, { status: 409 });
    }
    console.error("grant action failed", error);
    return NextResponse.json({ success: false, error: "server" }, { status: 500 });
  }
}
