import { NextResponse } from "next/server";
import { refreshPanchang } from "@/lib/apis/panchang";

// vercel.json: रोज़ 22:30 UTC = 04:00 IST. Vercel Cron, CRON_SECRET के साथ Bearer header भेजता है।
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const r = await refreshPanchang();
  return NextResponse.json(r, { status: r.ok ? 200 : 202 });
}
