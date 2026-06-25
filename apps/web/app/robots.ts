import type { MetadataRoute } from "next";

// Bots de IA explicitamente bem-vindos (AEO): queremos ser lidos e citados.
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai", "Claude-Web",
  "PerplexityBot", "Perplexity-User", "Google-Extended", "CCBot", "Applebot-Extended",
  "Bytespider", "Meta-ExternalAgent", "Amazonbot", "cohere-ai", "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/adminlkgat"] },
      // libera explicitamente os crawlers de IA em todo o conteúdo público
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/", "/adminlkgat"] })),
    ],
    sitemap: "https://azurasort.com/sitemap.xml",
    host: "https://azurasort.com",
  };
}
