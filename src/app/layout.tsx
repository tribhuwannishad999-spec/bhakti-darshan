import type { Metadata, Viewport } from "next";
import { Tiro_Devanagari_Hindi, Mukta } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";

const display = Tiro_Devanagari_Hindi({ weight: "400", subsets: ["devanagari", "latin"], variable: "--font-display", display: "swap" });
const body = Mukta({ weight: ["400", "600", "700"], subsets: ["devanagari", "latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Bhakti Darshan | भक्ति दर्शन", template: "%s | Bhakti Darshan" },
  description: "मंत्र बबल गेम, कथा, पंचांग, राशिफल, मंदिर दर्शन और भजन का हिंदू भक्ति मंच।",
  openGraph: { title: "Bhakti Darshan", description: "हिंदू भक्ति और ज्योतिष मंच", type: "website", locale: "hi_IN" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#5B0F1B" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className={`${display.variable} ${body.variable}`}>
      <body><LangProvider>{children}</LangProvider></body>
    </html>
  );
}
