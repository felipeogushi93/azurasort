/**
 * Registro central das pillar pages. Uma fonte de verdade para: rotas estáticas,
 * metadados (hreflang/canonical), sitemap/IndexNow e links internos cruzados
 * (silo de conteúdo — cada pillar linka as outras).
 */
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE, type SeoContent } from "../content";
import type { PillarContent } from "./video";
import { getVideoPillar } from "./video";
import { getVsCommentPicker } from "./vs-comment-picker";
import { getVerifiable } from "./verifiable";
import { getBestPicker } from "./best-picker";
import { getVsManualGiveaway } from "./vs-manual-giveaway";
import { getVsFreeGiveawayTools } from "./vs-free-giveaway-tools";
import { getVsWheelOfNames } from "./vs-wheel-of-names";

export type PillarDef = {
  slug: string;
  get: (locale: string) => PillarContent;
};

export const PILLARS: PillarDef[] = [
  { slug: "instagram-giveaway-video", get: getVideoPillar },
  { slug: "vs-comment-picker", get: getVsCommentPicker },
  { slug: "verifiable-instagram-giveaway", get: getVerifiable },
  { slug: "best-instagram-giveaway-picker", get: getBestPicker },
  { slug: "vs-manual-giveaway", get: getVsManualGiveaway },
  { slug: "vs-free-giveaway-tools", get: getVsFreeGiveawayTools },
  { slug: "vs-wheel-of-names", get: getVsWheelOfNames },
];

export const PILLAR_SLUGS = PILLARS.map((p) => p.slug);

export function pillarBySlug(slug: string): PillarDef | undefined {
  return PILLARS.find((p) => p.slug === slug);
}

/** Metadata (title/desc/keywords/hreflang/canonical/OG) de uma pillar. */
export function pillarMetadata(locale: string, slug: string): Metadata {
  const def = pillarBySlug(slug);
  if (!def) return {};
  const p = def.get(locale);
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}/${slug}`;
  languages["x-default"] = `/en/${slug}`;
  return {
    title: p.metaTitle,
    description: p.metaDescription,
    keywords: p.keywords,
    alternates: { canonical: `/${locale}/${slug}`, languages },
    openGraph: {
      title: p.metaTitle,
      description: p.metaDescription,
      url: `${SITE.url}/${locale}/${slug}`,
      type: "article",
    },
  };
}

/** Rótulo localizado do link "guia completo" (varia por idioma). */
export function guiaLabel(locale: string, seo: SeoContent): string {
  return seo.guideH1;
}
