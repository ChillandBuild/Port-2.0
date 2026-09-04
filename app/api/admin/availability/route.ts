import { NextResponse } from "next/server";
import { isSameOrigin, requireAdmin } from "@/lib/backend/admin-auth";
import { addSlots, listSlotsForAdmin } from "@/lib/backend/availability";

export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

export async function GET(request: Request): Promise<Response> {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  if (!DATE_RE.test(from) || !DATE_RE.test(to)) {
    return NextResponse.json({ success: false, error: "range" }, { status: 400 });
  }
  try {
    const slots = await listSlotsForAdmin(from, to);
    return NextResponse.json({ success: true, slots });
  } catch (error) {
    console.error("admin availability list failed", error);
    return NextResponse.json({ success: false, error: "server" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false, error: "origin" }, { status: 403 });
  }
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });

  let body: { date?: unknown; times?: unknown };
  try {
    body = (await request.json()) as { date?: unknown; times?: unknown };
  } catch {
    return NextResponse.json({ success: false, error: "invalid" }, { status: 400 });
  }

  const date = typeof body.date === "string" ? body.date : "";
  const times = Array.isArray(body.times) ? (body.times as unknown[]).filter((t): t is string => typeof t === "string") : [];
  if (!DATE_RE.test(date) || times.length === 0 || !times.every((t) => TIME_RE.test(t))) {
    return NextResponse.json({ success: false, error: "invalid" }, { status: 400 });
  }

  try {
    await addSlots(times.map((time) => ({ date, time })));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin availability add failed", error);
    return NextResponse.json({ success: false, error: "server" }, { status: 500 });
  }
}
