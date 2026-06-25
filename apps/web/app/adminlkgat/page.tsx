import { getAdminUser } from "@/lib/admin/auth";
import { getKpis, getGiveaways, getRecentDraws, getSourceBreakdown, sourceLabel, resolveRange } from "@/lib/admin/stats";
import { LoginForm } from "./LoginForm";
import { ForcedWinnerManager, LogoutButton, DateFilter } from "./AdminClient";
import { RescuePanel } from "./RescuePanel";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function brl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(d: Date) {
  return new Date(d).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const user = await getAdminUser();
  if (!user) return <LoginForm />;

  const sp = await searchParams;
  const range = sp.range || "all";
  const r = resolveRange(range, sp.from, sp.to);
  const [kpis, giveaways, draws, sources] = await Promise.all([getKpis(r), getGiveaways(r), getRecentDraws(r), getSourceBreakdown(r)]);
  const funnelMax = Math.max(1, ...kpis.funnel.map((f) => f.count));
  const sourcesMax = Math.max(1, ...sources.map((s) => s.visits));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Painel AzuraSort</h1>
          <p className="text-sm text-inkSoft">Olá, {user}</p>
        </div>
        <LogoutButton />
      </header>

      {/* filtro de datas */}
      <DateFilter range={range} from={sp.from} to={sp.to} />

      {/* KPIs */}
      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Receita (pagos)" value={brl(kpis.revenueCents)} accent />
        <Kpi label="Pagamentos" value={String(kpis.paidCount)} />
        <Kpi label="Sorteios" value={String(kpis.draws)} />
        <Kpi label="Conversão" value={`${kpis.conversion}%`} />
      </section>

      {/* funil */}
      <section className="mb-8 rounded-3xl border border-ink/5 bg-surface p-6 shadow-card">
        <h2 className="mb-4 font-display text-lg font-bold text-ink">Funil</h2>
        <div className="space-y-2.5">
          {kpis.funnel.map((f) => (
            <div key={f.type} className="flex items-center gap-3">
              <span className="w-40 shrink-0 text-sm text-inkSoft">{f.label}</span>
              <div className="h-7 flex-1 overflow-hidden rounded-lg bg-canvasAlt">
                <div
                  className="flex h-full items-center justify-end rounded-lg bg-gradient-to-r from-violet to-gold px-2 text-xs font-semibold text-white"
                  style={{ width: `${Math.max(6, (f.count / funnelMax) * 100)}%` }}
                >
                  {f.count}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-inkSoft">
          Visitas/etapas dependem do tracking de eventos. Sorteios e pagamentos vêm do banco.
        </p>
      </section>

      {/* origem dos visitantes/leads (de onde vieram) */}
      <section className="mb-8 rounded-3xl border border-ink/5 bg-surface p-6 shadow-card">
        <h2 className="mb-1 font-display text-lg font-bold text-ink">Origem dos leads</h2>
        <p className="mb-4 text-[11px] text-inkSoft">
          De onde cada visitante veio (ChatGPT, Google, anúncio, etc.) e quantos pagaram. Detectado por referrer/UTM no 1º acesso.
        </p>
        {sources.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 p-6 text-center text-sm text-inkSoft">
            Sem dados de origem ainda no período.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-ink/5">
            <table className="w-full text-sm">
              <thead className="bg-canvasAlt text-left text-xs uppercase tracking-wider text-inkSoft">
                <tr>
                  <th className="px-4 py-2.5">Origem</th>
                  <th className="px-4 py-2.5">Visitas</th>
                  <th className="px-4 py-2.5">Pagaram</th>
                  <th className="px-4 py-2.5">Conversão</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((s) => (
                  <tr key={s.source} className="border-t border-ink/5">
                    <td className="px-4 py-2.5">
                      <span className={`font-medium ${s.source.startsWith("ai-") ? "text-violet" : "text-ink"}`}>
                        {sourceLabel(s.source)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded bg-canvasAlt">
                          <div className="h-full rounded bg-gradient-to-r from-violet to-gold" style={{ width: `${Math.max(4, (s.visits / sourcesMax) * 100)}%` }} />
                        </div>
                        <span className="tabular-nums text-inkSoft">{s.visits}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 tabular-nums text-inkSoft">{s.paid}</td>
                    <td className="px-4 py-2.5 tabular-nums font-semibold text-ink">{s.conversion}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 🚨 resgate manual (feature isolada) */}
      <section className="mb-8">
        <RescuePanel />
      </section>

      {/* gestão de campanhas + ganhadores pré-selecionados */}
      <section className="mb-8">
        <h2 className="mb-1 font-display text-lg font-bold text-ink">Sorteios & ganhadores pré-selecionados</h2>
        <p className="mb-4 text-xs text-inkSoft">
          Ferramenta interna. Define o @ que vence em cada rodada (1ª/2ª/3ª). Só é aplicado se o @ estiver entre os
          participantes elegíveis. Da 4ª rodada em diante é sempre aleatório.
        </p>
        <div className="space-y-3">
          {giveaways.length === 0 && (
            <p className="rounded-2xl border border-dashed border-ink/15 bg-surface p-6 text-center text-sm text-inkSoft">
              Nenhum sorteio ainda.
            </p>
          )}
          {giveaways.map((g) => (
            <div key={g.id} className="rounded-2xl border border-ink/5 bg-surface p-5 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{g.campaign || "Sem nome"}</p>
                  <a href={g.postUrl} target="_blank" rel="noreferrer" className="block truncate text-xs text-violet hover:underline">
                    {g.postUrl}
                  </a>
                </div>
                <div className="flex gap-3 text-right text-xs text-inkSoft">
                  <span>{g._count.draws} sorteios</span>
                  <span>{g._count.payments} pagtos</span>
                  <span>{g.totalComments.toLocaleString("pt-BR")} coment.</span>
                </div>
              </div>
              <ForcedWinnerManager
                giveawayId={g.id}
                initial={g.forced.map((f) => ({ id: f.id, runIndex: f.runIndex, handle: f.handle, usedAt: f.usedAt }))}
              />
            </div>
          ))}
        </div>
      </section>

      {/* sorteios recentes */}
      <section>
        <h2 className="mb-4 font-display text-lg font-bold text-ink">Sorteios recentes</h2>
        <div className="overflow-hidden rounded-2xl border border-ink/5 bg-surface shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-canvasAlt text-left text-xs uppercase tracking-wider text-inkSoft">
              <tr>
                <th className="px-4 py-3">Quando</th>
                <th className="px-4 py-3">Campanha</th>
                <th className="px-4 py-3">Ganhador(es)</th>
                <th className="px-4 py-3">Elegíveis</th>
                <th className="px-4 py-3">Certificado</th>
                <th className="px-4 py-3">Rig</th>
              </tr>
            </thead>
            <tbody>
              {draws.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-inkSoft">Nenhum sorteio ainda.</td>
                </tr>
              )}
              {draws.map((d) => (
                <tr key={d.id} className="border-t border-ink/5">
                  <td className="whitespace-nowrap px-4 py-3 text-inkSoft">{fmtDate(d.createdAt)}</td>
                  <td className="max-w-[160px] truncate px-4 py-3">{d.giveaway.campaign || "—"}</td>
                  <td className="px-4 py-3">
                    {d.winners.filter((w) => !w.isBackup).map((w) => `@${w.handle}`).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-inkSoft">{d.eligibleCount.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-3">
                    <a href={`/pt-br/verify/${d.certificateCode}`} target="_blank" rel="noreferrer" className="text-violet hover:underline">
                      {d.certificateCode}
                    </a>
                  </td>
                  <td className="px-4 py-3">{d.rigged ? <span className="text-rose">●</span> : <span className="text-emerald">●</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 shadow-soft ${accent ? "border-gold/30 bg-gradient-to-br from-gold/10 to-surface" : "border-ink/5 bg-surface"}`}>
      <p className="text-xs text-inkSoft">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}
