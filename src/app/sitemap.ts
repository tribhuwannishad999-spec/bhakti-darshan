import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  return ["", "/panchang", "/rashifal", "/katha", "/hastrekha", "/vrat", "/festivals", "/temples", "/bhajan", "/contact", "/privacy", "/terms", "/donation-policy"].map((p) => ({ url: base + p }));
}
