import Link from "next/link";
import PageShell from "@/components/PageShell";
import { publicClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "भक्ति कथाएँ" };
const CATS = ["शिव कथा", "श्रीराम कथा", "श्रीकृष्ण कथा", "हनुमान कथा", "माता रानी कथा", "विष्णु कथा", "धार्मिक और पौराणिक कथाएँ"];

export default async function Katha({ searchParams }: { searchParams: { q?: string; cat?: string } }) {
  const db = publicClient();
  let rows: any[] = []; let err = "";
  if (!db) err = "डेटाबेस अभी जुड़ा नहीं है (README देखें)।";
  else {
    let q = db.from("katha_videos").select("slug,title,description,category,duration,thumbnail_url,published_at").eq("published", true).order("published_at", { ascending: false });
    if (searchParams.cat) q = q.eq("category", searchParams.cat);
    if (searchParams.q) q = q.ilike("title", `%${searchParams.q.replace(/[%,]/g, "")}%`);
    const { data, error } = await q;
    if (error) err = "कथाएँ लोड नहीं हो सकीं।"; else rows = data ?? [];
  }
  return (
    <PageShell title="भक्ति कथाएँ">
      <form className="mb-4 flex gap-2"><input name="q" defaultValue={searchParams.q} placeholder="कथा खोजें" className="flex-1 rounded border p-2" /><button className="rounded bg-saffron px-4 text-white">खोजें</button></form>
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <Link href="/katha" className="rounded-full border border-gold px-3 py-1">सभी</Link>
        {CATS.map((c) => <Link key={c} href={`/katha?cat=${encodeURIComponent(c)}`} className="rounded-full border border-gold px-3 py-1">{c}</Link>)}
      </div>
      {err && <p className="rounded border border-gold bg-white p-3">{err}</p>}
      {!err && rows.length === 0 && <p className="rounded border border-gold bg-white p-3">अभी कोई कथा प्रकाशित नहीं हुई। मालिक पैनल (/owner) से वीडियो जोड़ें।</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((v) => (
          <Link key={v.slug} href={`/katha/${v.slug}`} className="overflow-hidden rounded-xl border border-gold bg-white">
            {v.thumbnail_url && <img src={v.thumbnail_url} alt="" loading="lazy" className="aspect-video w-full object-cover" />}
            <div className="p-3"><h2 className="text-lg">{v.title}</h2><p className="text-sm text-gray-600">{v.category}{v.duration ? ` · ${v.duration}` : ""}</p></div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
