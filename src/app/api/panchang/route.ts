import { NextResponse } from "next/server";
import { readCachedPanchang } from "@/lib/apis/panchang";

export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const city = (new URL(req.url).searchParams.get("city") ?? "New Delhi").slice(0, 60);
  const date = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const row = await readCachedPanchang(city, date);
  if (!row) return NextResponse.json({ status: "unavailable", message: "Panchang data not available yet" }, { status: 404 });
  return NextResponse.json({ status: "ok", ...row });
}
