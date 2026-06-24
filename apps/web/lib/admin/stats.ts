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
    db.payment.findMany({ where: { status: "paid", ...dateWhere }, select: { amount: true } }),
    db.event.groupBy({ by: ["type"], _count: { _all: true }, where: dateWhere }),
  ]);

  const counts = new Map(events.map((e) => [e.type, e._count._all]));
  const funnel = FUNNEL_STEPS.map((s) => ({ ...s, count: counts.get(s.type) ?? 0 }));
  const visits = counts.get("visit") ?? 0;
  const drawsDone = counts.get("draw_done") ?? draws;

  return {
    giveaways,
    draws,
    paidCount: payments.length,
    revenueCents: payments.reduce((a, p) => a + p.amount, 0),
    funnel,
    conversion: visits > 0 ? Math.round((drawsDone / visits) * 1000) / 10 : 0,
  };
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
