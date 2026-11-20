"use client";
import { useState } from "react";
import PageShell from "@/components/PageShell";

export default function Contact() {
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(f)) });
    const j = await r.json(); setMsg(j.message);
    if (r.ok) e.currentTarget.reset();
  }
  return (
    <PageShell title="संपर्क और सुझाव">
      <form onSubmit={submit} className="max-w-lg space-y-3">
        <input name="name" required maxLength={80} placeholder="नाम" className="w-full rounded border p-2" />
        <input name="email" type="email" maxLength={120} placeholder="ईमेल (वैकल्पिक)" className="w-full rounded border p-2" />
        <textarea name="message" required minLength={5} maxLength={2000} rows={5} placeholder="आपका संदेश" className="w-full rounded border p-2" />
        <button className="rounded-full bg-maroon px-6 py-2 text-cream">भेजें</button>
        {msg && <p role="status">{msg}</p>}
      </form>
    </PageShell>
  );
}
