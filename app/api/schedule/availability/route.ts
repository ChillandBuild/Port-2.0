import { NextResponse } from "next/server";
import { listOpenSlots } from "@/lib/backend/availability";

export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Public — the booking calendar's only data source. No auth: open slots carry no PII. */
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  if (!DATE_RE.test(from) || !DATE_RE.test(to)) {
    return NextResponse.json({ success: false, error: "range" }, { status: 400 });
  }
  try {
    const slots = await listOpenSlots(from, to);
    return NextResponse.json({ success: true, slots });
  } catch (error) {
    console.error("availability lookup failed", error);
    return NextResponse.json({ success: false, error: "server" }, { status: 500 });
  }
}
