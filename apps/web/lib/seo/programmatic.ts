/**
 * SEO programático: páginas de cauda longa por idioma e caso de uso.
 * Cada (locale, slug) vira uma landing page indexável em /[locale]/[slug].
 *
 * Estratégia: todos os idiomas incluídos (pt-br + ES, FR-MA, AR-MA, EN).
 * AzuraSort cresce no seu próprio ângulo premium: prova/certificado/vídeo/ao vivo.
 *
 * Os textos ficam em ./programmaticContent (gerado). Aqui ficam os tipos e helpers.
 */
import { PROGRAMMATIC } from "./programmaticContent";

export type ProgrammaticTopic = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { h2: string; body: string }[];
  faq: { q: string; a: string }[];
  cta: string;
  keywords: string[];
};

/** Locales que possuem páginas programáticas (inclui pt-br). */
export const PROGRAMMATIC_LOCALES = Object.keys(PROGRAMMATIC);

/** Todos os pares { locale, slug } para generateStaticParams. */
export function allProgrammaticParams(): { locale: string; slug: string }[] {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of PROGRAMMATIC_LOCALES) {
    for (const topic of Object.values(PROGRAMMATIC[locale])) {
      params.push({ locale, slug: topic.slug });
    }
  }
  return params;
}

/** Busca um tópico por locale + slug (ou null se não existir). */
export function getTopic(locale: string, slug: string): ProgrammaticTopic | null {
  const byLocale = PROGRAMMATIC[locale];
  if (!byLocale) return null;
  return Object.values(byLocale).find((t) => t.slug === slug) ?? null;
}

/** A chave interna (tópico) a partir do slug — usada para achar a versão em outro idioma (hreflang). */
function topicKeyFromSlug(locale: string, slug: string): string | null {
  const byLocale = PROGRAMMATIC[locale];
  if (!byLocale) return null;
  const entry = Object.entries(byLocale).find(([, t]) => t.slug === slug);
  return entry ? entry[0] : null;
}

/** Mapa hreflang { locale: "/locale/slug" } para um tópico (mesmo conteúdo em cada idioma). */
export function alternatesForSlug(locale: string, slug: string): Record<string, string> {
  const key = topicKeyFromSlug(locale, slug);
  const out: Record<string, string> = {};
  if (!key) return out;
  for (const l of PROGRAMMATIC_LOCALES) {
    const t = PROGRAMMATIC[l]?.[key];
    if (t) out[l] = `/${l}/${t.slug}`;
  }
  return out;
}

/** Lista de tópicos de um locale (para a página índice/hub e links internos). */
export function topicsForLocale(locale: string): ProgrammaticTopic[] {
  const byLocale = PROGRAMMATIC[locale];
  return byLocale ? Object.values(byLocale) : [];
}

/**
 * Alguns "irmãos" para links internos (exclui o próprio slug).
 * Janela ROTATIVA a partir da posição do próprio tópico: o `.slice(0, n)` fixo que
 * havia aqui fazia TODAS as páginas linkarem só os 4 primeiros tópicos — o resto
 * ficava órfão (zero links internos) e o Google praticamente não os alcançava.
 */
export function siblingTopics(locale: string, slug: string, n = 4): ProgrammaticTopic[] {
  const all = topicsForLocale(locale);
  const others = all.filter((t) => t.slug !== slug);
  if (!others.length) return [];
  const i = all.findIndex((t) => t.slug === slug);
  const start = i < 0 ? 0 : i % others.length;
  return Array.from({ length: Math.min(n, others.length) }, (_, k) => others[(start + k) % others.length]);
}

/** Todas as URLs absolutas das páginas programáticas (para sitemap / IndexNow). */
export function allProgrammaticUrls(base = "https://azurasort.com"): string[] {
  return allProgrammaticParams().map(({ locale, slug }) => `${base}/${locale}/${slug}`);
}
