import { NextResponse } from "next/server";
import { isSameOrigin, requireAdmin } from "@/lib/backend/admin-auth";
import { deleteSlot } from "@/lib/backend/availability";

export const runtime = "nodejs";

export async function DELETE(
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
  try {
    await deleteSlot(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin availability delete failed", error);
    return NextResponse.json({ success: false, error: "server" }, { status: 500 });
  }
}
