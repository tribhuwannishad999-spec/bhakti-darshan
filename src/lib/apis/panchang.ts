import { adminClient } from "@/lib/supabase/server";

/*
 * पंचांग एकीकरण का ढाँचा। Navamsha / AstroLogics के असली डॉक्स देखे बिना
 * कोई endpoint या request format मान नहीं लिया गया है (चरण 4 में जोड़ा जाएगा)।
 * जब तक provider जुड़ा नहीं, कोई नकली डेटा नहीं बनता।
 */
export type PanchangRow = { city: string; date: string; data: unknown; fetched_at: string; source: string };

export async function readCachedPanchang(city: string, date: string): Promise<PanchangRow | null> {
  const db = adminClient();
  if (!db) return null;
  const { data } = await db.from("panchang_cache").select("city,date,data,fetched_at,source").eq("city", city).eq("date", date).maybeSingle();
  return (data as PanchangRow) ?? null;
}

export async function refreshPanchang(): Promise<{ ok: boolean; message: string }> {
  // TODO (चरण 4): चुने हुए provider का आधिकारिक डॉक्यूमेंट पढ़कर यहाँ fetch + timeout + retry जोड़ें,
  // फिर सफल उत्तर को panchang_cache में upsert करें। विफल होने पर पुराना कैश न मिटाएँ।
  return { ok: false, message: "Panchang provider not configured yet" };
}
