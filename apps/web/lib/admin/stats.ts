import { db } from "@/lib/db";

/** Camada de leitura do painel: KPIs, funil e listagens. */

export type DateRange = { from?: Date; to?: Date };

/** Converte um preset/datas em {from,to}. Presets: today, yesterday, 7d, 30d, all, custom. */
export function resolveRange(range?: string, from?: string, to?: string): DateRange {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = 24 * 60 * 60 * 1000;
  switch (range) {
    case "today":
      return { from: startOfToday };
    case "yesterday":
      return { from: new Date(startOfToday.getTime() - day), to: startOfToday };
    case "7d":
      return { from: new Date(startOfToday.getTime() - 6 * day) };
    case "30d":
      return { from: new Date(startOfToday.getTime() - 29 * day) };
    case "custom": {
      const f = from ? new Date(from + "T00:00:00") : undefined;
      const t = to ? new Date(to + "T23:59:59") : undefined;
      return { from: f, to: t };
    }
    default:
      return {}; // all
  }
}

function whereCreated(r: DateRange) {
  if (!r.from && !r.to) return {};
  return { createdAt: { ...(r.from ? { gte: r.from } : {}), ...(r.to ? { lte: r.to } : {}) } };
}

export type Kpis = {
  giveaways: number;
  draws: number;
  paidCount: number;
  revenueCents: number;
  revenueByPlan: { plan: string; count: number; cents: number }[];
  funnel: { type: string; label: string; count: number }[];
  conversion: number; // % draws / visits
};

const FUNNEL_STEPS: { type: string; label: string }[] = [
  { type: "visit", label: "Visitas" },
  { type: "link_loaded", label: "Colaram o link" },
  { type: "unlock_view", label: "Viram o paywall" },
  { type: "pay_started", label: "Iniciaram pagamento" },
  { type: "pay_done", label: "Pagaram" },
  { type: "draw_done", label: "Sortearam" },
];

export async function getKpis(r: DateRange = {}): Promise<Kpis> {
  const dateWhere = whereCreated(r);
  const [giveaways, draws, payments, events] = await Promise.all([
    db.giveaway.count({ where: dateWhere }),
    db.draw.count({ where: dateWhere }),
    db.payment.findMany({ where: { status: "paid", ...dateWhere }, select: { amount: true, plan: true } }),
    db.event.groupBy({ by: ["type"], _count: { _all: true }, where: { ...dateWhere, bot: false } }),
  ]);

  const counts = new Map(events.map((e) => [e.type, e._count._all]));
  const funnel = FUNNEL_STEPS.map((s) => ({ ...s, count: counts.get(s.type) ?? 0 }));
  const visits = counts.get("visit") ?? 0;
  const drawsDone = counts.get("draw_done") ?? draws;

  // receita por plano (padrão/premium/vip) — quantos e quanto cada um rendeu
  const planMap = new Map<string, { count: number; cents: number }>();
  for (const p of payments) {
    const k = p.plan || "premium";
    const cur = planMap.get(k) ?? { count: 0, cents: 0 };
    cur.count++;
    cur.cents += p.amount;
    planMap.set(k, cur);
  }
  const revenueByPlan = [...planMap.entries()].map(([plan, v]) => ({ plan, ...v })).sort((a, b) => b.cents - a.cents);

  return {
    giveaways,
    draws,
    paidCount: payments.length,
    revenueCents: payments.reduce((a, p) => a + p.amount, 0),
    revenueByPlan,
    funnel,
    conversion: visits > 0 ? Math.round((drawsDone / visits) * 1000) / 10 : 0,
  };
}

/** Pagamentos recentes (pagos) com detalhe: plano, valor, moeda, método, data. */
export async function getRecentPayments(r: DateRange = {}, limit = 25) {
  return db.payment.findMany({
    where: { status: "paid", ...whereCreated(r) },
    orderBy: { paidAt: "desc" },
    take: limit,
    select: { plan: true, amount: true, currency: true, provider: true, paidAt: true, createdAt: true, giveaway: { select: { campaign: true } } },
  });
}

export type DrawRow = Awaited<ReturnType<typeof getRecentDraws>>[number];

export async function getRecentDraws(r: DateRange = {}, limit = 50) {
  return db.draw.findMany({
    where: whereCreated(r),
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      giveaway: { include: { forced: { orderBy: { runIndex: "asc" } } } },
      winners: { orderBy: { position: "asc" } },
    },
  });
}

/** Origem dos visitantes/leads (de onde vieram) — agrega o campo meta.src dos eventos.
 * Mostra visitas e pagamentos por fonte (ChatGPT/Google/ads/etc) + conversão. */
export type SourceRow = { source: string; visits: number; paid: number; conversion: number };

const SOURCE_LABELS: Record<string, string> = {
  "ai-chatgpt": "ChatGPT", "ai-claude": "Claude", "ai-perplexity": "Perplexity",
  "ai-gemini": "Gemini", "ai-copilot": "Copilot",
  "organic-google": "Google (orgânico)", "organic-bing": "Bing", "organic-duckduckgo": "DuckDuckGo",
  "social-instagram": "Instagram", "social-facebook": "Facebook", "social-tiktok": "TikTok",
  "social-youtube": "YouTube", "social-x": "X/Twitter", "whatsapp": "WhatsApp",
  referral: "Outros sites", direct: "Direto/desconhecido",
};

export function sourceLabel(src: string): string {
  return SOURCE_LABELS[src] ?? src;
}

export async function getSourceBreakdown(r: DateRange = {}): Promise<SourceRow[]> {
  const rows = await db.event.findMany({
    where: { type: { in: ["visit", "pay_done"] }, bot: false, ...whereCreated(r) },
    select: { type: true, meta: true },
  });
  const map = new Map<string, { visits: number; paid: number }>();
  for (const e of rows) {
    const meta = (e.meta ?? {}) as { src?: string };
    const src = typeof meta.src === "string" && meta.src ? meta.src : "direct";
    const row = map.get(src) ?? { visits: 0, paid: 0 };
    if (e.type === "visit") row.visits++;
    else if (e.type === "pay_done") row.paid++;
    map.set(src, row);
  }
  return [...map.entries()]
    .map(([source, v]) => ({
      source,
      visits: v.visits,
      paid: v.paid,
      conversion: v.visits > 0 ? Math.round((v.paid / v.visits) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.visits - a.visits || b.paid - a.paid);
}

/** Sorteios (campanhas) com contagem de rodadas e forced atuais — base da gestão. */
export async function getGiveaways(r: DateRange = {}, limit = 40) {
  return db.giveaway.findMany({
    where: whereCreated(r),
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      forced: { orderBy: { runIndex: "asc" } },
      _count: { select: { draws: true, payments: true } },
    },
  });
}
