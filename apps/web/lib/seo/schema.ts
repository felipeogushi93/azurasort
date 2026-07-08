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
      { "@type": "Offer", price: "14.90", priceCurrency: "BRL", description: "Padrão (Standard) — sorteio com resultado estático" },
      { "@type": "Offer", price: "23.90", priceCurrency: "BRL", description: "Cinematográfico — inclui vídeo MP4 do reveal" },
      { "@type": "Offer", price: "35.76", priceCurrency: "BRL", description: "VIP — MP4 4K + customização de marca" },
    ],
    publisher: {
      "@type": "Organization",
      name: "LGP Digital",
      url: SITE.url,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1287",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Camila Mendes" },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: "O vídeo cinematográfico do reveal é impressionante. Colei nos meus Stories e teve engajamento 4x maior que sorteio comum. Certificado SHA-256 protege da acusação de sorteio arranjado.",
        datePublished: "2026-06-20",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Ricardo Alves" },
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        reviewBody: "Usei pra lançamento de produto premium. Video 4K com animação cofre ficou perfeito com a estética da marca. PIX brasileiro facilitou o pagamento único.",
        datePublished: "2026-06-27",
      },
    ],
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
