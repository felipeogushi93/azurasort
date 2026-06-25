import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE = "https://azurasort.com";

// páginas públicas (indexáveis): landing · ferramenta · guia (cauda longa SEO) · legais
const PATHS = ["", "/sorteio", "/guia", "/termos", "/privacidade"];

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
        priority: path === "" ? 1 : path === "/guia" ? 0.9 : 0.7,
        alternates: { languages },
      });
    }
  }

  return entries;
}
