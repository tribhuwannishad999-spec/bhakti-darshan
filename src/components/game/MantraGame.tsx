"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MANTRAS, Mantra } from "@/lib/mantras";
import { useLang } from "@/lib/i18n";

type B = { uid: number; m: Mantra; x: number; size: number; dur: number; popped: boolean; fx: { dx: number; dy: number }[] };
const MAX_BUBBLES = 9;
const LEVEL_STEP = 10;
const TARGET_STEP = 108; // कुल मंत्र स्मरण का लक्ष्य

export default function MantraGame() {
  const { t } = useLang();
  const [bubbles, setBubbles] = useState<B[]>([]);
  const [score, setScore] = useState(0);
  const [pops, setPops] = useState(0);
  const [soundOn, setSoundOn] = useState(false); // उपयोगकर्ता के क्लिक से पहले कोई ऑडियो नहीं
  const [slow, setSlow] = useState(false);
  const [charge, setCharge] = useState(0);
  const [note, setNote] = useState("");
  const [height, setHeight] = useState(700);
  const uid = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const slowRef = useRef(false);
  const lastMantra = useRef("");
  const wrapRef = useRef<HTMLDivElement>(null);
  slowRef.current = slow;

  const level = Math.floor(pops / LEVEL_STEP) + 1;

  useEffect(() => {
    const measure = () => setHeight(wrapRef.current?.clientHeight ?? window.innerHeight);
    measure(); window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const spawn = useCallback(() => {
    setBubbles((prev) => {
      if (prev.filter((b) => !b.popped).length >= MAX_BUBBLES) return prev;
      const pool = MANTRAS.filter((m) => m.id !== lastMantra.current);
      const m = pool[Math.floor(Math.random() * pool.length)];
      lastMantra.current = m.id;
      const size = 92 + Math.round(Math.random() * 34);
      const fast = Math.random() < 0.25;
      const base = fast ? 8 : 12 + Math.random() * 4; // सेकंड में; पढ़ने का समय रहे
      const dur = base * (slowRef.current ? 1.8 : 1);
      return [...prev, { uid: ++uid.current, m, x: Math.random() * 78 + 2, size, dur, popped: false, fx: [] }];
    });
  }, []);

  useEffect(() => {
    spawn();
    const id = setInterval(spawn, 1300);
    return () => clearInterval(id);
  }, [spawn]);

  const remove = (u: number) => setBubbles((p) => p.filter((b) => b.uid !== u));

  const play = (m: Mantra) => {
    if (!soundOn) return;
    audioRef.current?.pause(); // ऑडियो ओवरलैप नहीं होगा
    const a = new Audio(`/audio/${m.id}.mp3`);
    audioRef.current = a;
    a.play().catch(() => setNote("इस मंत्र की ऑडियो फ़ाइल अभी उपलब्ध नहीं है।"));
    a.onerror = () => setNote("इस मंत्र की ऑडियो फ़ाइल अभी उपलब्ध नहीं है।");
  };

  const pop = (b: B) => {
    if (b.popped) return;
    const fx = Array.from({ length: 8 }, (_, i) => {
      const ang = (i / 8) * Math.PI * 2;
      return { dx: Math.cos(ang) * 70, dy: Math.sin(ang) * 70 };
    });
    setBubbles((p) => p.map((x) => (x.uid === b.uid ? { ...x, popped: true, fx } : x)));
    setTimeout(() => remove(b.uid), 700);
    setScore((s) => s + 11); setPops((p) => p + 1); setCharge((c) => Math.min(c + 1, 15));
    setNote(""); play(b.m);
  };

  const divine = () => {
    if (charge < 15) return;
    setCharge(0);
    const ids = bubbles.filter((b) => !b.popped).map((b) => b.uid);
    const fx = [{ dx: 40, dy: -40 }, { dx: -40, dy: -40 }, { dx: 0, dy: 60 }];
    setBubbles((p) => p.map((b) => (ids.includes(b.uid) ? { ...b, popped: true, fx } : b)));
    setTimeout(() => setBubbles((p) => p.filter((b) => !ids.includes(b.uid))), 700);
    setScore((s) => s + 51);
  };

  const btn = "rounded-full px-3 py-1.5 text-sm font-semibold border border-gold/70 bg-black/30 text-cream backdrop-blur disabled:opacity-40";

  return (
    <section aria-label="Mantra Bubble Game" className="game-sky relative w-full overflow-hidden" style={{ height: "100svh" }}>
      <div className="absolute inset-x-0 top-0 z-20 px-3 pt-3 text-cream" style={{ paddingTop: "max(env(safe-area-inset-top), 12px)" }}>
        <div className="flex items-center justify-between gap-2 text-center">
          <div><div className="text-[11px] opacity-80">पुण्य अंक</div><div className="text-xl font-bold text-gold">{score}</div></div>
          <div><div className="text-[11px] opacity-80">साधना स्तर</div><div className="text-xl font-bold text-gold">{level}</div></div>
          <div><div className="text-[11px] opacity-80">कुल मंत्र स्मरण</div><div className="text-xl font-bold text-gold">{pops}/{TARGET_STEP}</div></div>
        </div>
        <h1 className="mt-1 text-center font-display text-lg text-gold">Bhakti Darshan</h1>
      </div>

      <div ref={wrapRef} className="absolute inset-0">
        {bubbles.map((b) => (
          <div key={b.uid} className="bubble-wrap" style={{ left: `${b.x}%`, animationDuration: `${b.dur}s`, ["--travel" as string]: `${height}px` }} onAnimationEnd={() => !b.popped && remove(b.uid)}>
            {b.popped ? (
              <div style={{ width: b.size, height: b.size, position: "relative" }}>
                <div className="glow" />
                {b.fx.map((f, i) => <span key={i} className="petal" style={{ ["--dx" as string]: `${f.dx}px`, ["--dy" as string]: `${f.dy}px` }} />)}
              </div>
            ) : (
              <button type="button" className="bubble" aria-label={b.m.text} onPointerDown={() => pop(b)}
                style={{ width: b.size, height: b.size, fontSize: b.size > 110 ? 16 : 14, background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,.75), ${b.m.color} 55%)` }}>
                {b.m.text}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 px-3 text-cream" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 10px)" }}>
        {note && <p role="status" className="mb-2 rounded-lg bg-black/50 px-3 py-1 text-center text-sm">{note}</p>}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button className={btn} onClick={() => { setSoundOn((s) => !s); audioRef.current?.pause(); }} aria-pressed={soundOn}>{soundOn ? "🔊 ध्वनि चालू" : "🔇 ध्वनि बंद"}</button>
          <button className={btn} onClick={() => setSlow((s) => !s)} aria-pressed={slow}>🌊 धीमा प्रवाह {slow ? "✓" : ""}</button>
          <button className={btn} onClick={divine} disabled={charge < 15}>✨ दिव्य शक्ति {charge}/15</button>
        </div>
        <a href="#dhanpatra" className="mt-2 block text-center text-xs opacity-80">{t("scroll")} ↓</a>
      </div>
    </section>
  );
}
