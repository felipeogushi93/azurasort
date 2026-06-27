import { db } from "@/lib/db";

/**
 * Saúde do AzuraSort: checagens automáticas a partir dos NOSSOS dados (visitas,
 * vendas). Acende alertas no painel pro Felipe ver de bater o olho. Isolado —
 * não depende de stats.ts. Dados de campanha (CPA etc.) ficam no Google Ads.
 */
export type HealthAlert = { level: "warn" | "alert"; msg: string };
export type HealthResult = {
  status: "ok" | "warn" | "alert";
  waiting: boolean; // true = ainda sem tráfego (campanhas recém-publicadas)
  alerts: HealthAlert[];
  stats: { visits24h: number; visits7d: number; visitsPrev7d: number; sales7d: number };
};

export async function getHealth(): Promise<HealthResult> {
  const now = new Date();
  const d24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const d14 = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [visits24h, visits7d, visitsPrev7d, sales7d] = await Promise.all([
    db.event.count({ where: { type: "visit", createdAt: { gte: d24 } } }),
    db.event.count({ where: { type: "visit", createdAt: { gte: d7 } } }),
    db.event.count({ where: { type: "visit", createdAt: { gte: d14, lt: d7 } } }),
    db.payment.count({ where: { status: "paid", paidAt: { gte: d7 } } }),
  ]).catch(() => [0, 0, 0, 0]);

  const alerts: HealthAlert[] = [];
  const hadTraffic = visits7d > 0 || visitsPrev7d > 0;
  const waiting = !hadTraffic;

  // 🔴 site teve tráfego antes e parou — algo quebrou (site/rastreamento) ou anúncios pausados/reprovados
  if (hadTraffic && visits24h === 0) {
    alerts.push({
      level: "alert",
      msg: "Nenhuma visita nas últimas 24h, mesmo tendo tráfego antes. Confira se o site abre e se os anúncios não foram pausados/reprovados no Google Ads.",
    });
  }
  // 🟡 queda forte de visitas
  if (visitsPrev7d >= 10 && visits7d < visitsPrev7d * 0.5) {
    alerts.push({
      level: "warn",
      msg: `Queda nas visitas: ${visits7d} nos últimos 7 dias vs ${visitsPrev7d} na semana anterior.`,
    });
  }
  // 🟡 tráfego mas zero venda
  if (visits7d >= 30 && sales7d === 0) {
    alerts.push({
      level: "warn",
      msg: `${visits7d} visitas em 7 dias e nenhuma venda. Vale revisar a oferta/preço ou a página de sorteio.`,
    });
  }

  const status = alerts.some((a) => a.level === "alert") ? "alert" : alerts.length ? "warn" : "ok";
  return { status, waiting, alerts, stats: { visits24h, visits7d, visitsPrev7d, sales7d } };
}
