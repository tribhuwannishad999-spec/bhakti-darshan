import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-maroon px-4 py-8 text-center text-sm text-cream">
      <p className="font-display text-lg text-gold">Bhakti Darshan</p>
      <p className="mt-1 opacity-80">ज्योतिष और हस्तरेखा परंपरागत मान्यताओं पर आधारित हैं; ये भविष्य की निश्चितता का दावा नहीं करते।</p>
      <div className="mt-3 flex flex-wrap justify-center gap-4">
        <Link href="/privacy">गोपनीयता नीति</Link><Link href="/terms">नियम और शर्तें</Link>
        <Link href="/donation-policy">दान नीति</Link><Link href="/contact">संपर्क</Link>
      </div>
    </footer>
  );
}
