import { db } from "@/lib/db";

/** Camada de leitura do painel: KPIs, funil e listagens. */

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

export async function getKpis(): Promise<Kpis> {
  const [giveaways, draws, payments, events] = await Promise.all([
    db.giveaway.count(),
    db.draw.count(),
    db.payment.findMany({ where: { status: "paid" }, select: { amount: true } }),
    db.event.groupBy({ by: ["type"], _count: { _all: true } }),
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

export async function getRecentDraws(limit = 30) {
  return db.draw.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      giveaway: { include: { forced: { orderBy: { runIndex: "asc" } } } },
      winners: { orderBy: { position: "asc" } },
    },
  });
}

/** Sorteios (campanhas) com contagem de rodadas e forced atuais — base da gestão. */
export async function getGiveaways(limit = 40) {
  return db.giveaway.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      forced: { orderBy: { runIndex: "asc" } },
      _count: { select: { draws: true, payments: true } },
    },
  });
}
