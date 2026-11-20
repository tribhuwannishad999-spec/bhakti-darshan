import { NextResponse } from "next/server";
import { adminClient } from "@/lib/supabase/server";

const hits = new Map<string, number[]>(); // सरल rate limit (प्रति instance)
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "x";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 600000);
  if (recent.length >= 5) return NextResponse.json({ message: "बहुत अधिक अनुरोध। कुछ देर बाद प्रयास करें।" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  let b: any;
  try { b = await req.json(); } catch { return NextResponse.json({ message: "अमान्य अनुरोध।" }, { status: 400 }); }
  const name = String(b?.name ?? "").trim().slice(0, 80);
  const email = String(b?.email ?? "").trim().slice(0, 120);
  const message = String(b?.message ?? "").trim().slice(0, 2000);
  if (!name || message.length < 5) return NextResponse.json({ message: "कृपया नाम और संदेश भरें।" }, { status: 400 });
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ message: "ईमेल सही नहीं है।" }, { status: 400 });

  const db = adminClient();
  if (!db) return NextResponse.json({ message: "संदेश सेवा अभी जुड़ी नहीं है।" }, { status: 503 });
  const { error } = await db.from("contact_messages").insert({ name, email: email || null, message });
  if (error) return NextResponse.json({ message: "संदेश सहेजा नहीं जा सका।" }, { status: 500 });
  return NextResponse.json({ message: "धन्यवाद, आपका संदेश मिल गया।" });
}
