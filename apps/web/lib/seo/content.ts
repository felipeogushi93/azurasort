/**
 * Conteúdo de SEO/GEO: metadados ricos por idioma + página-guia de cauda longa
 * (passo a passo "como fazer sorteio no Instagram") com FAQ. Alimenta o Google
 * (rich results via JSON-LD) e os mecanismos de IA (texto claro e objetivo).
 *
 * PT/EN aqui; ES/FR/AR em ./contentTranslations (gerado por tradução).
 */
import { seoTranslations } from "./contentTranslations";

export const SITE = { name: "AzuraSort", url: "https://azurasort.com" };

export type SeoContent = {
  homeTitle: string;
  homeDescription: string;
  keywords: string[];
  guideTitle: string; // <title> da página-guia
  guideDescription: string; // meta description
  guideH1: string;
  guideIntro: string;
  stepsTitle: string;
  steps: { name: string; text: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  guideCta: string;
};

const pt: SeoContent = {
  homeTitle: "AzuraSort — Sorteador de Instagram com revelação em vídeo e certificado",
  homeDescription:
    "Faça sorteios no Instagram de forma justa e auditável: escolha o ganhador entre os comentários, revele em vídeo cinematográfico e gere um certificado verificável. Rápido, barato e confiável.",
  keywords: [
    "sorteador de instagram", "sorteio instagram", "sorteador de comentários", "como fazer sorteio no instagram",
    "sortear comentários instagram", "escolher ganhador instagram", "sorteio instagram confiável", "sorteador online",
  ],
  guideTitle: "Como fazer um sorteio no Instagram: passo a passo confiável (2026)",
  guideDescription:
    "Guia completo para fazer um sorteio no Instagram entre os comentários, escolher o ganhador de forma justa e provar que foi honesto com um certificado verificável.",
  guideH1: "Como fazer um sorteio no Instagram",
  guideIntro:
    "Fazer um sorteio no Instagram engaja seguidores e cresce o seu perfil — mas precisa ser justo e transparente. Neste guia você aprende a sortear entre os comentários de um post ou Reels, escolher o ganhador de forma aleatória e auditável, e ainda revelar o resultado em um vídeo pronto para postar. Sem planilha, sem complicação.",
  stepsTitle: "Passo a passo",
  steps: [
    { name: "Cole o link da publicação", text: "Copie o link do post ou Reels do seu sorteio no Instagram e cole no AzuraSort. O sistema carrega a prévia e o número de comentários." },
    { name: "Escolha a base do sorteio", text: "Defina se vai sortear entre quem comentou ou entre quem curtiu a publicação." },
    { name: "Escolha a animação da revelação", text: "Selecione como o ganhador será revelado — cofre, contagem regressiva ou Matrix — e, se quiser, transmita ao vivo." },
    { name: "Faça o sorteio", text: "O AzuraSort embaralha os participantes com um algoritmo determinístico (Fisher-Yates + SHA-256) e revela o ganhador." },
    { name: "Compartilhe com prova", text: "Baixe o vídeo da revelação e divulgue a página de certificado, onde qualquer pessoa confere que o resultado foi justo." },
  ],
  faqTitle: "Perguntas frequentes",
  faq: [
    { q: "O sorteio é confiável e auditável?", a: "Sim. O AzuraSort usa um algoritmo provably-fair (commit-reveal com SHA-256): o hash do sorteio é gerado antes do resultado e qualquer pessoa pode verificar o ganhador na página pública de certificado." },
    { q: "Posso sortear entre os comentários de um post?", a: "Sim. Basta colar o link do post ou Reels e o AzuraSort coleta os comentários para o sorteio." },
    { q: "Posso ter mais de um ganhador e suplentes?", a: "Sim. Você define quantos ganhadores e quantos suplentes quer; cada ganhador é uma pessoa distinta." },
    { q: "Funciona com Reels?", a: "Sim, funciona tanto com posts quanto com Reels do Instagram." },
    { q: "Como verifico se o resultado foi justo?", a: "Cada sorteio gera um certificado com um código público. Na página de verificação, o algoritmo é reproduzido a partir da semente revelada e dos participantes, provando que ninguém manipulou o resultado." },
    { q: "Quanto custa?", a: "O preço varia conforme o número de participantes e o plano escolhido, a partir de valores baixos por sorteio. Você vê o preço antes de pagar." },
  ],
  guideCta: "Fazer meu sorteio agora",
};

const en: SeoContent = {
  homeTitle: "AzuraSort — Instagram giveaway picker with video reveal & certificate",
  homeDescription:
    "Run fair, auditable Instagram giveaways: pick the winner from the comments, reveal it in a cinematic video, and generate a verifiable certificate. Fast, affordable and trustworthy.",
  keywords: [
    "instagram giveaway picker", "instagram giveaway", "comment picker", "how to do an instagram giveaway",
    "pick instagram comments", "choose instagram winner", "random comment picker", "giveaway tool",
  ],
  guideTitle: "How to run an Instagram giveaway: a trustworthy step-by-step (2026)",
  guideDescription:
    "Complete guide to running an Instagram giveaway from the comments, picking the winner fairly, and proving it was honest with a verifiable certificate.",
  guideH1: "How to run an Instagram giveaway",
  guideIntro:
    "Running an Instagram giveaway boosts engagement and grows your profile — but it has to be fair and transparent. In this guide you'll learn how to pick a winner from the comments of a post or Reel, randomly and auditably, and even reveal the result in a ready-to-post video. No spreadsheets, no hassle.",
  stepsTitle: "Step by step",
  steps: [
    { name: "Paste the post link", text: "Copy your Instagram post or Reel link and paste it into AzuraSort. It loads the preview and the comment count." },
    { name: "Choose the entry base", text: "Decide whether to draw from people who commented or who liked the post." },
    { name: "Choose the reveal animation", text: "Pick how the winner is revealed — vault, countdown or Matrix — and go live if you want." },
    { name: "Run the draw", text: "AzuraSort shuffles entries with a deterministic algorithm (Fisher-Yates + SHA-256) and reveals the winner." },
    { name: "Share with proof", text: "Download the reveal video and share the certificate page, where anyone can verify the result was fair." },
  ],
  faqTitle: "Frequently asked questions",
  faq: [
    { q: "Is the draw fair and auditable?", a: "Yes. AzuraSort uses a provably-fair algorithm (commit-reveal with SHA-256): the draw hash is generated before the result, and anyone can verify the winner on the public certificate page." },
    { q: "Can I draw from a post's comments?", a: "Yes. Just paste the post or Reel link and AzuraSort collects the comments for the draw." },
    { q: "Can I have multiple winners and backups?", a: "Yes. You choose how many winners and backups; each winner is a distinct person." },
    { q: "Does it work with Reels?", a: "Yes, it works with both Instagram posts and Reels." },
    { q: "How do I verify the result was fair?", a: "Each draw generates a certificate with a public code. On the verification page the algorithm is reproduced from the revealed seed and participants, proving nobody tampered with the result." },
    { q: "How much does it cost?", a: "The price depends on the number of participants and the chosen plan, starting at a low per-draw price. You see the price before paying." },
  ],
  guideCta: "Run my giveaway now",
};

export function getSeo(locale: string): SeoContent {
  if (locale === "en") return en;
  if (locale === "pt-br") return pt;
  return seoTranslations[locale] ?? en;
}
