import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { PILLAR_SLUGS } from "@/lib/seo/pillars/registry";

const BASE = "https://azurasort.com";

// pillars de cauda longa (cada uma /<slug>) — fonte única no registry
const PILLAR_PATHS = PILLAR_SLUGS.map((s) => `/${s}`);

// páginas públicas (indexáveis): landing · ferramenta · guia · pillars · legais
const PATHS = ["", "/sorteio", "/guia", ...PILLAR_PATHS, "/termos", "/privacidade"];

// guia + pillars ganham prioridade alta (logo abaixo da home)
const HIGH_PRIORITY = new Set(["/guia", ...PILLAR_PATHS]);

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
        priority: path === "" ? 1 : HIGH_PRIORITY.has(path) ? 0.9 : 0.7,
        alternates: { languages },
      });
    }
  }

  return entries;
}
