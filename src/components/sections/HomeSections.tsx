"use client";
import Link from "next/link";
import DonationBox from "@/components/DonationBox";
import { useLang, Key } from "@/lib/i18n";

const SECTIONS: { id: string; key: Key; href: string; icon: string; desc: string }[] = [
  { id: "rashifal", key: "rashifal", href: "/rashifal", icon: "♈", desc: "बारह राशियों का राशिफल। ज्योतिष API जुड़ने के बाद यहाँ वास्तविक परिणाम दिखेंगे।" },
  { id: "hastrekha", key: "hastrekha", href: "/hastrekha", icon: "🖐", desc: "जीवन, मस्तिष्क, हृदय, भाग्य और सूर्य रेखा की पारंपरिक जानकारी।" },
  { id: "katha", key: "katha", href: "/katha", icon: "📖", desc: "शिव, राम, कृष्ण, हनुमान और माता रानी की कथाएँ वीडियो में।" },
  { id: "panchang", key: "panchang", href: "/panchang", icon: "🗓", desc: "तिथि, नक्षत्र, राहु काल और शुभ मुहूर्त।" },
  { id: "vrat", key: "vrat", href: "/vrat", icon: "🪔", desc: "एकादशी, प्रदोष, पूर्णिमा, अमावस्या आदि व्रत।" },
  { id: "festivals", key: "festivals", href: "/festivals", icon: "🎉", desc: "त्योहारों का महत्व, पूजा विधि, मंत्र और आरती।" },
  { id: "temples", key: "temples", href: "/temples", icon: "🛕", desc: "मंदिरों के चित्र, इतिहास और दर्शन की जानकारी।" },
  { id: "bhajan", key: "bhajan", href: "/bhajan", icon: "🎶", desc: "भजन, आरती और मंत्र का संग्रह।" },
];

export default function HomeSections() {
  const { t } = useLang();
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <section id="dhanpatra" className="scroll-mt-16 pb-12">
        <h2 className="mb-4 text-center text-3xl">{t("donation")} / धनपात्र</h2>
        <DonationBox />
      </section>
      {SECTIONS.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-16 border-t border-gold/40 py-8">
          <h2 className="text-2xl">{s.icon} {t(s.key)}</h2>
          <p className="mt-2 max-w-prose">{s.desc}</p>
          <Link href={s.href} className="mt-4 inline-block rounded-full bg-saffron px-5 py-2 font-semibold text-white">खोलें</Link>
        </section>
      ))}
    </main>
  );
}
