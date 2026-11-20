"use client";
import { useEffect, useState } from "react";
import { browserClient } from "@/lib/supabase/browser";

const CATS = ["शिव कथा", "श्रीराम कथा", "श्रीकृष्ण कथा", "हनुमान कथा", "माता रानी कथा", "विष्णु कथा", "धार्मिक और पौराणिक कथाएँ"];
type V = { id: string; title: string; slug: string; published: boolean };

export default function Owner() {
  const db = browserClient();
  const [ready, setReady] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [msg, setMsg] = useState("");
  const [list, setList] = useState<V[]>([]);

  async function refresh() {
    if (!db) return;
    const { data: s } = await db.auth.getSession();
    setSignedIn(!!s.session);
    if (s.session) {
      const { data: o } = await db.from("owners").select("user_id").eq("user_id", s.session.user.id).maybeSingle();
      setIsOwner(!!o);
      if (o) { const { data } = await db.from("katha_videos").select("id,title,slug,published").order("created_at", { ascending: false }); setList((data as V[]) ?? []); }
    }
    setReady(true);
  }
  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, []);

  if (!db) return <main className="p-6">Supabase अभी जुड़ा नहीं है। README में चरण देखें।</main>;

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const { error } = await db!.auth.signInWithPassword({ email: String(f.get("email")), password: String(f.get("password")) });
    setMsg(error ? "लॉगिन विफल।" : ""); refresh();
  }
  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const slug = String(f.get("slug")).toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const { error } = await db!.from("katha_videos").insert({
      title: f.get("title"), slug, category: f.get("category"), description: f.get("description"), duration: f.get("duration") || null,
      youtube_url: f.get("youtube_url") || null, video_url: f.get("video_url") || null, thumbnail_url: f.get("thumbnail_url") || null,
      published: f.get("published") === "on", published_at: new Date().toISOString(),
    });
    setMsg(error ? "सहेजा नहीं जा सका: " + error.message : "सहेज लिया गया।");
    if (!error) { e.currentTarget.reset(); refresh(); }
  }
  async function toggle(v: V) { await db!.from("katha_videos").update({ published: !v.published }).eq("id", v.id); refresh(); }
  async function del(v: V) { if (confirm("यह वीडियो हटाएँ?")) { await db!.from("katha_videos").delete().eq("id", v.id); refresh(); } }

  const inp = "w-full rounded border p-2";
  return (
    <main className="mx-auto max-w-xl p-4">
      <h1 className="text-2xl">मालिक पैनल</h1>
      {!ready ? <p>लोड हो रहा है…</p> : !signedIn ? (
        <form onSubmit={login} className="mt-4 space-y-3">
          <input name="email" type="email" required placeholder="ईमेल" className={inp} />
          <input name="password" type="password" required placeholder="पासवर्ड" className={inp} />
          <button className="rounded-full bg-maroon px-6 py-2 text-cream">लॉगिन</button>
        </form>
      ) : !isOwner ? (
        <p className="mt-4">इस खाते को मालिक की अनुमति नहीं है। README के चरण से अपना user को owners तालिका में जोड़ें।</p>
      ) : (
        <>
          <form onSubmit={add} className="mt-4 space-y-2">
            <h2 className="text-lg">नई कथा जोड़ें</h2>
            <input name="title" required placeholder="शीर्षक" className={inp} />
            <input name="slug" required pattern="[a-z0-9-]+" placeholder="url-नाम (अंग्रेज़ी, जैसे shiv-katha-1)" className={inp} />
            <select name="category" className={inp}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
            <textarea name="description" rows={3} placeholder="विवरण" className={inp} />
            <input name="duration" placeholder="अवधि (जैसे 12:30)" className={inp} />
            <input name="youtube_url" placeholder="YouTube लिंक" className={inp} />
            <input name="video_url" placeholder="या वीडियो फ़ाइल का लिंक" className={inp} />
            <input name="thumbnail_url" placeholder="थंबनेल इमेज लिंक" className={inp} />
            <label className="block"><input type="checkbox" name="published" /> तुरंत प्रकाशित करें</label>
            <button className="rounded-full bg-saffron px-6 py-2 text-white">सहेजें</button>
          </form>
          <ul className="mt-6 space-y-2">
            {list.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-2 rounded border p-2">
                <span>{v.title} {v.published ? "✅" : "(अप्रकाशित)"}</span>
                <span className="flex gap-2"><button onClick={() => toggle(v)} className="underline">{v.published ? "छिपाएँ" : "प्रकाशित करें"}</button><button onClick={() => del(v)} className="underline text-red-700">हटाएँ</button></span>
              </li>
            ))}
          </ul>
          <button onClick={async () => { await db.auth.signOut(); refresh(); }} className="mt-4 underline">लॉग आउट</button>
        </>
      )}
      {msg && <p role="status" className="mt-3">{msg}</p>}
    </main>
  );
}
