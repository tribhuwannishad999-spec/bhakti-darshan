"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Header() {
  const { lang, setLang, t } = useLang();
  const links = [["/", "home"], ["/panchang", "panchang"], ["/rashifal", "rashifal"], ["/katha", "katha"], ["/temples", "temples"], ["/bhajan", "bhajan"]] as const;
  return (
    <header className="sticky top-0 z-30 border-b border-gold/40 bg-maroon text-cream">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-4 py-2 text-sm" aria-label="Main">
        <Link href="/" className="font-display text-lg text-gold whitespace-nowrap">Bhakti Darshan</Link>
        {links.map(([href, k]) => <Link key={href} href={href} className="whitespace-nowrap hover:text-gold">{t(k)}</Link>)}
        <button onClick={() => setLang(lang === "hi" ? "en" : "hi")} className="ml-auto whitespace-nowrap rounded-full border border-gold px-3 py-1" aria-label="Switch language">
          {lang === "hi" ? "English" : "हिन्दी"}
        </button>
      </nav>
    </header>
  );
}
