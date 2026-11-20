import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { publicClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function youtubeId(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default async function KathaDetail({ params }: { params: { slug: string } }) {
  const db = publicClient();
  if (!db) notFound();
  const { data: v } = await db.from("katha_videos").select("*").eq("slug", params.slug).eq("published", true).maybeSingle();
  if (!v) notFound();
  const { data: related } = await db.from("katha_videos").select("slug,title").eq("published", true).eq("category", v.category).neq("slug", v.slug).limit(4);
  const yt = youtubeId(v.youtube_url);
  return (
    <PageShell title={v.title}>
      {yt ? (
        <div className="aspect-video w-full overflow-hidden rounded-xl"><iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${yt}`} title={v.title} loading="lazy" allowFullScreen /></div>
      ) : v.video_url ? (
        <video controls preload="metadata" playsInline poster={v.thumbnail_url ?? undefined} className="w-full rounded-xl" src={v.video_url} />
      ) : <p>इस कथा का वीडियो लिंक उपलब्ध नहीं है।</p>}
      <p className="mt-2 text-sm text-gray-600">{v.category}{v.duration ? ` · ${v.duration}` : ""}</p>
      <p className="mt-3 whitespace-pre-line">{v.description}</p>
      {related && related.length > 0 && (<><h2 className="mt-6 text-xl">संबंधित कथाएँ</h2><ul className="list-disc pl-5">{related.map((r) => <li key={r.slug}><Link className="underline" href={`/katha/${r.slug}`}>{r.title}</Link></li>)}</ul></>)}
    </PageShell>
  );
}
