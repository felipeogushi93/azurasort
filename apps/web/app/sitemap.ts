import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { PROGRAMMATIC_LOCALES, topicsForLocale, alternatesForSlug } from "@/lib/seo/programmatic";

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

  // hub de recursos (só nos idiomas com conteúdo programático)
  const hubLangs: Record<string, string> = {};
  for (const l of PROGRAMMATIC_LOCALES) hubLangs[l] = `${BASE}/${l}/recursos`;
  hubLangs["x-default"] = `${BASE}/en/recursos`;
  for (const locale of PROGRAMMATIC_LOCALES) {
    entries.push({
      url: `${BASE}/${locale}/recursos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: hubLangs },
    });
  }

  // páginas programáticas de cauda longa (ES/FR/AR/EN)
  for (const locale of PROGRAMMATIC_LOCALES) {
    for (const topic of topicsForLocale(locale)) {
      const languages = alternatesForSlug(locale, topic.slug);
      const absLanguages: Record<string, string> = {};
      for (const [l, p] of Object.entries(languages)) absLanguages[l] = `${BASE}${p}`;
      if (languages["en"]) absLanguages["x-default"] = `${BASE}${languages["en"]}`;
      entries.push({
        url: `${BASE}/${locale}/${topic.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: absLanguages },
      });
    }
  }

  return entries;
}
