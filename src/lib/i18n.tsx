"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "hi" | "en";
const dict = {
  donation: { hi: "Bhakti Darshan धनपात्र", en: "Bhakti Darshan Donation Box" },
  rashifal: { hi: "आज का राशिफल", en: "Today's Horoscope" },
  hastrekha: { hi: "हस्तरेखा", en: "Palmistry" },
  katha: { hi: "भक्ति कहानियाँ", en: "Devotional Stories" },
  panchang: { hi: "आज का पंचांग", en: "Today's Panchang" },
  vrat: { hi: "व्रत और उपवास", en: "Vrat & Fasting" },
  festivals: { hi: "त्योहार और पर्व", en: "Festivals" },
  temples: { hi: "मंदिर दर्शन", en: "Temple Darshan" },
  bhajan: { hi: "भजन और भक्ति संगीत", en: "Bhajan & Devotional Music" },
  home: { hi: "मुख्य पृष्ठ", en: "Home" },
  contact: { hi: "संपर्क", en: "Contact" },
  scroll: { hi: "नीचे स्क्रॉल करें", en: "Scroll down" },
} as const;
export type Key = keyof typeof dict;

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "hi", setLang: () => {}, t: (k) => dict[k].hi,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("hi");
  useEffect(() => {
    try { const s = localStorage.getItem("lang"); if (s === "en" || s === "hi") setLangState(s); } catch {}
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("lang", l); } catch {}
    document.documentElement.lang = l;
  };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[k][lang] }}>{children}</Ctx.Provider>;
}
export const useLang = () => useContext(Ctx);
