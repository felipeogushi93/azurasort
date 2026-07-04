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
 * Mapa da jornada do visitante pro Telegram — estilo "site respirando". Cada
 * mensagem leva uma etiqueta curta da sessão (#xxxxx) pra dar pra SEGUIR a mesma
 * pessoa: entrou → carregou post → paywall → iniciou pagamento → pagou.
 * "visit" só na 1ª página da sessão (o filtro é no /api/track). Retorna null
 * pros tipos sem alerta.
 */
export function funnelMessage(opts: {
  type: string;
  meta?: Record<string, unknown>;
  ip?: string | null;
  country?: string | null;
  sessionId?: string | null;
  path?: string | null;
}): string | null {
  const m = opts.meta ?? {};
  const tag = opts.sessionId ? escapeHtml(opts.sessionId.slice(-5)) : "?????";
  const who = `👤 <code>#${tag}</code>`;
  const srcRaw = typeof m.src === "string" ? m.src : undefined;
  const src = escapeHtml(srcRaw ? SRC_LABEL[srcRaw] ?? srcRaw : "—");
  const fromAds = m.gclid || m.fbclid ? " (Ads)" : "";
  const loc = [opts.country ? escapeHtml(opts.country) : null, opts.ip ? escapeHtml(opts.ip) : null].filter(Boolean).join(" · ");

  switch (opts.type) {
    case "visit": {
      const page = opts.path ? escapeHtml(opts.path) : "—";
      return [`${who} 🟢 <b>entrou no site</b>`, `Página: ${page}`, `Origem: ${src}${fromAds}`, loc || null].filter(Boolean).join("\n");
    }
    case "link_loaded": {
      const n = typeof m.total === "number" ? m.total : null;
      const total = n !== null ? n.toLocaleString("pt-BR") : "?";
      const warn = n === 0 ? " ⚠️" : "";
      const url = typeof m.postUrl === "string" && m.postUrl ? `\n${escapeHtml(m.postUrl)}` : "";
      return `${who} 🔗 <b>carregou um post</b> — ${total} comentários${warn}${url}`;
    }
    case "unlock_view": {
      const url = typeof m.postUrl === "string" && m.postUrl ? `\n${escapeHtml(m.postUrl)}` : "";
      return `${who} 🧊 <b>chegou no paywall</b>${url}`;
    }
    case "pay_started": {
      const method = m.method === "pix" ? "PIX" : m.method === "card" ? "Cartão" : escapeHtml(String(m.method ?? "—"));
      const plan = PLAN_LABEL[String(m.plan)] ?? escapeHtml(String(m.plan ?? "—"));
      return `${who} 💳 <b>iniciou pagamento</b> — ${method} · ${plan}`;
    }
    case "pay_done":
      return `${who} ✅ <b>PAGOU!</b> 🎉`;
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

/** Mensagem de PAGAMENTO confirmado (no momento do pagamento, antes do sorteio).
 *  Garante que TODA venda apareça no grupo de vendas — mesmo se o cliente não
 *  sortear na hora (F5). O sorteio depois manda a saleMessage com o ganhador. */
export function paymentMessage(opts: { provider: string; plan: string; amountCents: number; currency?: string; campaign?: string }): string {
  const plan = PLAN_LABEL[opts.plan] ?? opts.plan;
  const cur = (opts.currency || "BRL").toUpperCase();
  const valor = (opts.amountCents / 100).toLocaleString(INTL_LOCALE[cur] ?? "en-US", { style: "currency", currency: cur });
  const metodo = opts.provider === "woovi" ? "PIX" : opts.provider === "stripe" ? "Cartão" : opts.provider;
  return [
    "💵 <b>Pagamento confirmado — AzuraSort</b>",
    "",
    `Plano: <b>${escapeHtml(plan)}</b> (${valor})`,
    `Pagamento: ${metodo}`,
    opts.campaign ? `Campanha: ${escapeHtml(opts.campaign)}` : null,
    "<i>Aguardando o sorteio…</i>",
  ]
    .filter(Boolean)
    .join("\n");
}
