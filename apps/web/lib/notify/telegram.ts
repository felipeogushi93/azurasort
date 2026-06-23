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

export async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // não configurado → ignora silenciosamente
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
  } catch {
    /* notificação nunca derruba o fluxo */
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
