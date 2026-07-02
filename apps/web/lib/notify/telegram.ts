/**
 * Notificação de venda via Telegram (bot @AzuraSort_vendas_bot).
 * Fire-and-forget: nunca quebra o sorteio se o Telegram falhar.
 */

const PLAN_LABEL: Record<string, string> = {
  padrao: "Padrão",
  premium: "Premium",
  vip: "VIP",
};

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function notifyTelegram(text: string, chatId?: string): Promise<void> {
  // .trim() blinda contra espaço/quebra de linha colado no valor da env (Vercel)
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chat = chatId || process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chat) return; // não configurado → ignora silenciosamente
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch {
    /* notificação nunca derruba o fluxo */
  }
}

// rótulos amigáveis da origem do lead (mesmos "src" do lib/track.ts)
const SRC_LABEL: Record<string, string> = {
  direct: "Direto",
  referral: "Referência",
  "organic-google": "Google (orgânico)",
  "organic-bing": "Bing",
  "organic-duckduckgo": "DuckDuckGo",
  "ai-chatgpt": "ChatGPT",
  "ai-claude": "Claude",
  "ai-perplexity": "Perplexity",
  "ai-gemini": "Gemini",
  "ai-copilot": "Copilot",
  "social-instagram": "Instagram",
  "social-facebook": "Facebook",
  "social-tiktok": "TikTok",
  "social-youtube": "YouTube",
  "social-x": "X/Twitter",
  whatsapp: "WhatsApp",
};

/**
 * Feed de atividade do site (funil) pro Telegram — estilo "site respirando".
 * Retorna null pros eventos que não geram alerta (visit é barulho; pay_done já
 * vira a mensagem de venda). Só link_loaded, unlock_view e pay_started.
 */
export function funnelMessage(opts: {
  type: string;
  meta?: Record<string, unknown>;
  ip?: string | null;
  country?: string | null;
}): string | null {
  const m = opts.meta ?? {};
  const srcRaw = typeof m.src === "string" ? m.src : undefined;
  const src = escapeHtml(srcRaw ? SRC_LABEL[srcRaw] ?? srcRaw : "—");
  const fromAds = m.gclid || m.fbclid ? " (Ads)" : "";
  const loc = [opts.country ? escapeHtml(opts.country) : null, opts.ip ? escapeHtml(opts.ip) : null].filter(Boolean).join(" · ");
  const foot = [`Origem: ${src}${fromAds}`, loc || null].filter(Boolean).join("\n");

  switch (opts.type) {
    case "link_loaded": {
      const total = typeof m.total === "number" ? m.total.toLocaleString("pt-BR") : "?";
      return `🔗 <b>Cliente carregou um post</b>\nComentários: <b>${total}</b>\n${foot}`;
    }
    case "unlock_view":
      return `🧊 <b>Cliente chegou no paywall</b>\n${foot}`;
    case "pay_started": {
      const method = m.method === "pix" ? "PIX" : m.method === "card" ? "Cartão" : escapeHtml(String(m.method ?? "—"));
      const plan = PLAN_LABEL[String(m.plan)] ?? escapeHtml(String(m.plan ?? "—"));
      return `💳 <b>Cliente iniciou pagamento</b>\nMétodo: ${method} · Plano: ${plan}\n${foot}`;
    }
    default:
      return null;
  }
}

const INTL_LOCALE: Record<string, string> = { BRL: "pt-BR", EUR: "de-DE", USD: "en-US" };

/** Mensagem formatada de uma venda + sorteio concluído. */
export function saleMessage(opts: {
  provider: string;
  plan: string;
  amountCents: number;
  currency?: string;
  campaign?: string;
  winners: string[];
  eligibleCount: number;
  certificateCode: string;
}): string {
  const plan = PLAN_LABEL[opts.plan] ?? opts.plan;
  const cur = (opts.currency || "BRL").toUpperCase();
  const valor = (opts.amountCents / 100).toLocaleString(INTL_LOCALE[cur] ?? "en-US", { style: "currency", currency: cur });
  const metodo = opts.provider === "woovi" ? "PIX" : opts.provider === "stripe" ? "Cartão" : opts.provider;
  const ganhadores = opts.winners.length ? opts.winners.map((w) => `@${escapeHtml(w)}`).join(", ") : "—";
  return [
    "💰 <b>Nova venda — AzuraSort</b>",
    "",
    `Plano: <b>${escapeHtml(plan)}</b> (${valor})`,
    `Pagamento: ${metodo}`,
    opts.campaign ? `Campanha: ${escapeHtml(opts.campaign)}` : null,
    `Participantes elegíveis: ${opts.eligibleCount.toLocaleString("pt-BR")}`,
    `🏆 Ganhador(es): ${ganhadores}`,
    `Certificado: <code>${escapeHtml(opts.certificateCode)}</code>`,
  ]
    .filter(Boolean)
    .join("\n");
}
