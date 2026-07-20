import { SITE, type SeoContent } from "./content";

/** Geradores de JSON-LD (schema.org). Mantém os dados estruturados num só lugar. */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/icon.png`,
    sameAs: [
      "https://www.instagram.com/azurasortofficial",
      "https://www.tiktok.com/@azurasort",
      "https://www.wikidata.org/wiki/Q140357518",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
  };
}

export function softwareAppSchema(seo: SeoContent) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    alternateName: ["Azura Sort", "Azurasort", "AzuraSorteio", "Azurassort", "Asurasort"],
    applicationCategory: "SocialMediaApplication",
    applicationSubCategory: "Instagram Giveaway Picker",
    operatingSystem: "Web, iOS, Android",
    url: SITE.url,
    description: seo.homeDescription,
    inLanguage: ["en", "pt-BR", "es", "fr", "ar"],
    featureList: [
      "Cinematic MP4 winner reveal video (vault, countdown, Matrix animations)",
      "SHA-256 commit-reveal cryptographic audit certificate",
      "Provably fair Fisher-Yates shuffle with verifiable seed",
      "Multi-platform: Instagram, YouTube, TikTok, Twitter, Facebook, Threads",
      "AI anti-bot detection filtering fake accounts",
      "Instagram Live real-time draw with public verification",
      "Multi-winner + backup selection in a single draw",
      "4K MP4 video output ready for Reels/Stories",
      "5 native languages: EN, PT-BR, ES, FR-MA, AR-MA",
    ],
    offers: [
      { "@type": "Offer", price: "19.90", priceCurrency: "BRL", description: "Padrão (Standard) — sorteio com resultado estático" },
      { "@type": "Offer", price: "34.90", priceCurrency: "BRL", description: "Cinematográfico — inclui vídeo MP4 do reveal" },
      { "@type": "Offer", price: "54.90", priceCurrency: "BRL", description: "VIP — sorteio ao vivo + MP4 4K" },
    ],
    publisher: {
      "@type": "Organization",
      name: "LGP Digital",
      url: SITE.url,
    },
    // ⚠️ NÃO reintroduzir aggregateRating/review sem avaliações REAIS e visíveis na
    // página. Havia aqui uma nota 4.9 com 1287 avaliações e depoimentos inventados —
    // isso viola as diretrizes de dados estruturados do Google (risco de penalidade
    // manual no site inteiro) e é propaganda enganosa. Quando existirem avaliações
    // de verdade (ex.: Google Reviews), marcar só o que estiver visível ao usuário.
  };
}

export function faqSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function howToSchema(seo: SeoContent) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: seo.guideH1,
    description: seo.guideDescription,
    step: seo.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
