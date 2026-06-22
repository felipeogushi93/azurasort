import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE = "https://azurasort.com";

// páginas públicas (indexáveis) — o /sorteio é a ferramenta; landing é a principal
const PATHS = ["", "/sorteio"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PATHS) {
    // mapa de alternates (hreflang) para todos os idiomas
    const languages: Record<string, string> = {};
    for (const l of routing.locales) languages[l] = `${BASE}/${l}${path}`;
    languages["x-default"] = `${BASE}/en${path}`;

    for (const l of routing.locales) {
      entries.push({
        url: `${BASE}/${l}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
        alternates: { languages },
      });
    }
  }

  return entries;
}
