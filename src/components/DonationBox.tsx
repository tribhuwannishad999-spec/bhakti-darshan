"use client";
import { useState } from "react";

const AMOUNTS = [11, 21, 51, 101, 501];
const PURPOSES = ["मंदिर सेवा", "कथा और भजन प्रसारण", "वेबसाइट संचालन"];

export default function DonationBox() {
  const [amount, setAmount] = useState<number | "custom">(101);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const value = amount === "custom" ? Number(custom) : amount;
  const valid = Number.isInteger(value) && value >= 1 && value <= 100000;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) { setMsg("कृपया ₹1 से ₹1,00,000 के बीच सही राशि चुनें।"); return; }
    setBusy(true); setMsg("");
    try {
      const r = await fetch("/api/donate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: value, name, purpose }) });
      const j = await r.json();
      setMsg(j.message ?? "भुगतान व्यवस्था जल्द उपलब्ध होगी।");
    } catch { setMsg("नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।"); }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl rounded-2xl border-2 border-gold bg-white p-5 shadow">
      <fieldset>
        <legend className="mb-2 font-semibold text-maroon">राशि चुनें</legend>
        <div className="flex flex-wrap gap-2">
          {AMOUNTS.map((a) => (
            <button type="button" key={a} onClick={() => setAmount(a)} aria-pressed={amount === a}
              className={`rounded-full border px-4 py-2 ${amount === a ? "bg-saffron text-white border-saffron" : "border-gold text-maroon"}`}>₹{a}</button>
          ))}
          <button type="button" onClick={() => setAmount("custom")} aria-pressed={amount === "custom"}
            className={`rounded-full border px-4 py-2 ${amount === "custom" ? "bg-saffron text-white border-saffron" : "border-gold text-maroon"}`}>अन्य राशि</button>
        </div>
        {amount === "custom" && <input inputMode="numeric" value={custom} onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))} placeholder="राशि ₹ में" className="mt-3 w-full rounded border p-2" aria-label="अन्य राशि" />}
      </fieldset>
      <label className="mt-3 block text-sm">उद्देश्य
        <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="mt-1 w-full rounded border p-2">{PURPOSES.map((p) => <option key={p}>{p}</option>)}</select>
      </label>
      <label className="mt-3 block text-sm">नाम (वैकल्पिक)
        <input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border p-2" />
      </label>
      <button disabled={busy} className="mt-4 w-full rounded-full bg-maroon py-3 font-semibold text-cream disabled:opacity-60">{busy ? "कृपया प्रतीक्षा करें…" : "दान करें"}</button>
      {msg && <p role="status" className="mt-3 rounded bg-cream p-3 text-center text-maroon">{msg}</p>}
      <p className="mt-3 text-xs text-gray-600">UPI ID और QR कोड अभी जोड़े नहीं गए हैं। भुगतान की सफलता केवल सर्वर पर सत्यापन के बाद ही दिखाई जाएगी।</p>
    </form>
  );
}
