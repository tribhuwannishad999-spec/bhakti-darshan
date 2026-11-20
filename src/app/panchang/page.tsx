import PageShell from "@/components/PageShell";
import { readCachedPanchang } from "@/lib/apis/panchang";

export const dynamic = "force-dynamic";
export const metadata = { title: "आज का पंचांग" };
const DEFAULT_CITY = "New Delhi";

export default async function Panchang() {
  const date = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const row = await readCachedPanchang(DEFAULT_CITY, date);
  const ageH = row ? (Date.now() - new Date(row.fetched_at).getTime()) / 36e5 : 0;
  return (
    <PageShell title="आज का पंचांग">
      <p className="mb-3 text-sm">संदर्भ शहर: {DEFAULT_CITY} · दिनांक: {date} (IST)</p>
      {!row ? (
        <p className="rounded-lg border border-gold bg-white p-4">आज का पंचांग डेटा अभी उपलब्ध नहीं है। पंचांग API जुड़ने और सुबह 4:00 IST के अपडेट के बाद यहाँ वास्तविक डेटा दिखेगा।</p>
      ) : (
        <>
          {ageH > 30 && <p className="mb-2 rounded bg-yellow-100 p-2 text-sm">चेतावनी: यह डेटा पुराना हो सकता है।</p>}
          <pre className="overflow-x-auto rounded bg-white p-4 text-sm">{JSON.stringify(row.data, null, 2)}</pre>
          <p className="mt-2 text-xs">स्रोत: {row.source} · अंतिम अपडेट: {new Date(row.fetched_at).toLocaleString("hi-IN", { timeZone: "Asia/Kolkata" })}</p>
        </>
      )}
    </PageShell>
  );
}
