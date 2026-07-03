"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/**
 * 🚀 Alavancagem — mapa de crescimento (backlinks/AEO). Estado no navegador
 * (localStorage): checklist marcado, alvos customizados e o registro de presença
 * (IA/Google). Dá pra migrar pro banco depois pra compartilhar com o Lucas.
 *
 * Exporta: GrowthLeverage (tela cheia, /adminlkgat/alavancagem) e
 * GrowthSummaryCard (cartão compacto no painel principal, com link).
 */

type Item = { key: string; label: string; link?: string; note?: string; seed?: boolean };
type Group = { title: string; help: string; items: Item[] };

const GROUPS: Group[] = [
  {
    title: "⚙️ Configuração",
    help: "Ajustes únicos que ligam a máquina. Feito uma vez, não repete.",
    items: [
      { key: "cfg-agent", label: "Agente semanal ligado (Vercel)", seed: true },
      { key: "cfg-ig", label: "Perfil Instagram @azurasortofficial", seed: true },
      { key: "cfg-tt", label: "Perfil TikTok @azurasort", seed: true },
      { key: "cfg-mails", label: "Confirmar emails de cadastro (gmail)" },
    ],
  },
  {
    title: "📁 Diretórios",
    help: "Sites que listam ferramentas. Cada cadastro = um link pro seu site (autoridade no Google) e um lugar a mais onde a IA te encontra. Submete 1x, fica pra sempre.",
    items: [
      { key: "dir-launchingnext", label: "Launching Next", link: "https://launchingnext.com/submit", seed: true },
      { key: "dir-saashub", label: "SaaSHub", link: "https://www.saashub.com/submit", seed: true },
      { key: "dir-alternativeto", label: "AlternativeTo", link: "https://alternativeto.net/manage-item", note: "submeter a partir de 10/jul" },
      { key: "dir-uneed", label: "Uneed", link: "https://www.uneed.best" },
      { key: "dir-dangai", label: "Dang.ai", link: "https://dang.ai/submit" },
      { key: "dir-toolify", label: "Toolify", link: "https://www.toolify.ai" },
      { key: "dir-startupstash", label: "Startup Stash", link: "https://startupstash.com" },
      { key: "dir-indiehackers", label: "Indie Hackers (Products)", link: "https://www.indiehackers.com/products" },
    ],
  },
  {
    title: "📝 Listicles (outreach)",
    help: "Artigos 'melhores sorteadores'. Você manda email pedindo pra te incluírem. É o que a IA MAIS lê pra recomendar — a alavanca nº 1 de AEO.",
    items: [
      { key: "lst-reviewraffles", label: "reviewraffles.com", link: "https://reviewraffles.com/instagram-giveaway-tool", seed: true },
      { key: "lst-beyondcomments", label: "beyondcomments.io", link: "https://beyondcomments.io/blog/free-instagram-giveaway-picker" },
      { key: "lst-creatorflow", label: "creatorflow.so", link: "https://creatorflow.so/blog/best-instagram-giveaway-tools-comparison" },
      { key: "lst-copywritersnow", label: "copywritersnow.com", link: "https://copywritersnow.com/instagram-giveaway-tools" },
      { key: "lst-kickofflabs", label: "kickofflabs.com", link: "https://kickofflabs.com/blog/best-free-paid-tools-pick-giveaway-winners" },
    ],
  },
  {
    title: "💬 Comunidades",
    help: "Reddit/Quora. Você ajuda de verdade e menciona de leve no fim. A IA cita muito essas respostas. Conta nova: aquece antes (comenta/upvota) pra não tomar spam.",
    items: [
      { key: "com-reddit", label: "1ª resposta no Reddit (r/Instagram, r/socialmedia)" },
      { key: "com-quora", label: "1ª resposta no Quora" },
    ],
  },
  {
    title: "🏆 Marcos",
    help: "Ações maiores que dão saltos de autoridade — feitas com preparo, não toda semana.",
    items: [
      { key: "mrk-wikidata", label: "Wikidata (Q140357518)", link: "https://www.wikidata.org/wiki/Q140357518", seed: true },
      { key: "mrk-producthunt", label: "Lançamento no Product Hunt", link: "https://www.producthunt.com", note: "kit pronto — escolher um dia" },
      { key: "mrk-g2", label: "G2 / Capterra", note: "quando tiver 1-2 clientes felizes" },
    ],
  },
];

const STAGES = [
  { label: "Produto", status: "ok" },
  { label: "Rastreamento", status: "ok" },
  { label: "SEO base (Google)", status: "ok" },
  { label: "AEO + comparações", status: "wip" },
  { label: "Backlinks (grind)", status: "wip" },
  { label: "Instagram", status: "wip" },
  { label: "Ads pagos", status: "wait" },
] as const;

const KEY_DONE = "azs_growth_v1";
const KEY_CUSTOM = "azs_growth_custom_v1";
const KEY_PRESENCE = "azs_growth_presence_v1";
const BACKLINK_GOAL = 50;

type Custom = { key: string; label: string; link?: string };
type Presence = { google?: string; ai?: string };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignora */
  }
}

/** Cartão compacto pro painel principal — % + link pra tela cheia. */
export function GrowthSummaryCard() {
  const [pct, setPct] = useState<number | null>(null);
  useEffect(() => {
    const done = load<Record<string, boolean>>(KEY_DONE, {});
    const custom = load<Custom[]>(KEY_CUSTOM, []);
    const base = GROUPS.flatMap((g) => g.items);
    // se nunca marcou nada, considera os seeds
    const hasState = Object.keys(done).length > 0;
    const total = base.length + custom.length;
    const completed = hasState
      ? [...base, ...custom].filter((it) => done[it.key]).length
      : base.filter((it) => it.seed).length;
    setPct(total ? Math.round((completed / total) * 100) : 0);
  }, []);
  return (
    <section className="mb-8 rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/5 to-surface p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">🚀 Alavancagem</h2>
          <p className="text-sm text-inkSoft">Mapa de crescimento · backlinks & AEO</p>
        </div>
        <Link href="/adminlkgat/alavancagem" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">
          Abrir mapa completo →
        </Link>
      </div>
      {pct !== null && (
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-ink">Progresso</span>
            <span className="text-inkSoft">{pct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </section>
  );
}

/** Tela cheia da Alavancagem. */
export function GrowthLeverage({ visits7d, sales7d }: { visits7d: number; sales7d: number }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [custom, setCustom] = useState<Custom[]>([]);
  const [presence, setPresence] = useState<Presence>({});
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [openHelp, setOpenHelp] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newLink, setNewLink] = useState("");

  useEffect(() => {
    const saved = load<Record<string, boolean> | null>(KEY_DONE, null);
    if (saved && Object.keys(saved).length) {
      setDone(saved);
    } else {
      const seed: Record<string, boolean> = {};
      for (const it of GROUPS.flatMap((g) => g.items)) if (it.seed) seed[it.key] = true;
      setDone(seed);
      save(KEY_DONE, seed);
    }
    setCustom(load<Custom[]>(KEY_CUSTOM, []));
    setPresence(load<Presence>(KEY_PRESENCE, {}));
    setReady(true);
  }, []);

  function toggle(key: string) {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      save(KEY_DONE, next);
      return next;
    });
  }
  function addCustom() {
    const label = newLabel.trim();
    if (!label) return;
    const item: Custom = { key: `custom-${Date.now()}`, label, link: newLink.trim() || undefined };
    setCustom((prev) => {
      const next = [...prev, item];
      save(KEY_CUSTOM, next);
      return next;
    });
    setNewLabel("");
    setNewLink("");
  }
  function removeCustom(key: string) {
    setCustom((prev) => {
      const next = prev.filter((c) => c.key !== key);
      save(KEY_CUSTOM, next);
      return next;
    });
  }
  function stamp(which: "google" | "ai") {
    setPresence((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      const next = { ...prev, [which]: prev[which] ? undefined : today };
      save(KEY_PRESENCE, next);
      return next;
    });
  }

  const allItems = useMemo(() => [...GROUPS.flatMap((g) => g.items), ...custom], [custom]);
  const total = allItems.length;
  const completed = allItems.filter((it) => done[it.key]).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  // "backlinks/menções" = diretórios + listicles + customizados feitos
  const backlinkItems = [...GROUPS.filter((g) => g.title.includes("Diretórios") || g.title.includes("Listicles")).flatMap((g) => g.items), ...custom];
  const backlinksDone = backlinkItems.filter((it) => done[it.key]).length;

  const showItem = (key: string) => (filter === "all" ? true : filter === "done" ? !!done[key] : !done[key]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">🚀 Alavancagem</h1>
          <p className="text-sm text-inkSoft">Mapa de crescimento · o baú do tesouro 🗺️</p>
        </div>
        <Link href="/adminlkgat" className="rounded-full border border-ink/10 px-4 py-2 text-sm text-inkSoft hover:text-ink">← Voltar ao painel</Link>
      </header>

      {/* METAS / números */}
      <section className="mb-6 grid gap-3 sm:grid-cols-4">
        <Metric label="Progresso" value={`${pct}%`} sub={`${completed}/${total} tarefas`} accent />
        <Metric label="Backlinks/menções" value={`${backlinksDone}/${BACKLINK_GOAL}`} sub="meta 3 meses" />
        <Metric label="Visitas (7d)" value={String(visits7d)} sub="do sistema" />
        <Metric label="Vendas (7d)" value={String(sales7d)} sub="do sistema" />
      </section>

      {/* PRESENÇA (manual, mensal) */}
      <section className="mb-6 rounded-3xl border border-ink/5 bg-surface p-5 shadow-card">
        <p className="mb-1 text-sm font-semibold text-ink">📡 Estamos aparecendo? <span className="font-normal text-inkSoft">(teste mensal, manual)</span></p>
        <p className="mb-3 text-xs text-inkSoft">Detectar isso automático não é confiável — então você testa e marca aqui uma vez por mês.</p>
        <div className="flex flex-wrap gap-3">
          <PresenceToggle
            label="Citados por uma IA"
            hint="Pergunte no ChatGPT/Claude: 'melhor site pra sorteio no Instagram' e veja se aparece."
            on={!!presence.ai}
            date={presence.ai}
            onClick={() => stamp("ai")}
          />
          <PresenceToggle
            label="Aparecendo no Google"
            hint="Veja no Google Search Console (Desempenho) se há cliques/impressões."
            on={!!presence.google}
            date={presence.google}
            onClick={() => stamp("google")}
          />
        </div>
      </section>

      {/* estágios */}
      <section className="mb-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-inkSoft">Onde estamos</p>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <span key={s.label} className={`rounded-full px-3 py-1 text-xs font-medium ${s.status === "ok" ? "bg-emerald/10 text-emerald" : s.status === "wip" ? "bg-gold/15 text-gold-deep" : "bg-ink/5 text-inkSoft"}`}>
              {s.status === "ok" ? "✅" : s.status === "wip" ? "🏗️" : "⏳"} {s.label}
            </span>
          ))}
        </div>
      </section>

      {/* filtros */}
      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-inkSoft">Mostrar:</span>
        {(["all", "pending", "done"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3 py-1 ${filter === f ? "bg-gold text-void" : "bg-ink/5 text-inkSoft hover:text-ink"}`}>
            {f === "all" ? "Todos" : f === "pending" ? "Pendentes" : "Feitos"}
          </button>
        ))}
      </div>

      {/* checklist */}
      <div className="grid gap-5 md:grid-cols-2">
        {GROUPS.map((g) => {
          const visible = g.items.filter((it) => showItem(it.key));
          if (!visible.length) return null;
          return (
            <div key={g.title} className="rounded-2xl border border-ink/5 bg-surface p-4 shadow-soft">
              <div className="mb-2 flex items-center gap-2">
                <p className="text-sm font-semibold text-ink">{g.title}</p>
                <button onClick={() => setOpenHelp(openHelp === g.title ? null : g.title)} className="grid h-5 w-5 place-items-center rounded-full bg-ink/5 text-xs text-inkSoft hover:bg-gold/20 hover:text-gold-deep" title="O que é / pra quê?">?</button>
              </div>
              {openHelp === g.title && <p className="mb-3 rounded-lg bg-gold/5 px-3 py-2 text-xs text-inkSoft">{g.help}</p>}
              <ul className="space-y-1.5">
                {visible.map((it) => {
                  const checked = ready && !!done[it.key];
                  return (
                    <li key={it.key} className="flex items-start gap-2">
                      <input type="checkbox" checked={checked} onChange={() => toggle(it.key)} className="mt-0.5 h-4 w-4 shrink-0 accent-gold" />
                      <span className={`text-sm ${checked ? "text-inkSoft line-through" : "text-ink"}`}>
                        {it.link ? <a href={it.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{it.label}</a> : it.label}
                        {it.note && <span className="ml-1 text-xs text-gold-deep">· {it.note}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        {/* meus alvos (customizados) */}
        <div className="rounded-2xl border border-dashed border-gold/30 bg-surface p-4 shadow-soft">
          <p className="mb-2 text-sm font-semibold text-ink">➕ Meus alvos <span className="font-normal text-inkSoft">(adicione os que o agente mandar)</span></p>
          <ul className="mb-3 space-y-1.5">
            {custom.filter((c) => showItem(c.key)).map((c) => {
              const checked = ready && !!done[c.key];
              return (
                <li key={c.key} className="flex items-start gap-2">
                  <input type="checkbox" checked={checked} onChange={() => toggle(c.key)} className="mt-0.5 h-4 w-4 shrink-0 accent-gold" />
                  <span className={`flex-1 text-sm ${checked ? "text-inkSoft line-through" : "text-ink"}`}>
                    {c.link ? <a href={c.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{c.label}</a> : c.label}
                  </span>
                  <button onClick={() => removeCustom(c.key)} className="text-xs text-inkSoft hover:text-rose">✕</button>
                </li>
              );
            })}
            {!custom.length && <li className="text-xs text-inkSoft">Nenhum ainda. Cola aqui os alvos novos que chegarem no Telegram.</li>}
          </ul>
          <div className="space-y-2">
            <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Nome do site/tarefa" className="w-full rounded-lg border border-ink/10 bg-canvasAlt px-3 py-2 text-sm" />
            <input value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder="Link (opcional)" className="w-full rounded-lg border border-ink/10 bg-canvasAlt px-3 py-2 text-sm" />
            <button onClick={addCustom} className="w-full rounded-full bg-ink/90 py-2 text-sm font-semibold text-white hover:bg-ink">Adicionar</button>
          </div>
        </div>
      </div>

      <p className="mt-6 rounded-xl bg-ink/5 px-4 py-3 text-xs text-inkSoft">
        🎯 <b>Onde queremos chegar:</b> que quando alguém pesquisar no Google OU perguntar pra uma IA
        &quot;melhor site pra sorteio no Instagram&quot;, o AzuraSort apareça. Isso vem do grind semanal
        (o agente manda os alvos toda segunda no Telegram → você faz → marca aqui). A bola de neve cresce. ⛄
      </p>
    </div>
  );
}

function Metric({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-gold/30 bg-gold/5" : "border-ink/5 bg-surface"} shadow-soft`}>
      <p className="text-xs text-inkSoft">{label}</p>
      <p className="font-display text-2xl font-bold text-ink">{value}</p>
      {sub && <p className="text-[11px] text-inkSoft">{sub}</p>}
    </div>
  );
}

function PresenceToggle({ label, hint, on, date, onClick }: { label: string; hint: string; on: boolean; date?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} title={hint} className={`rounded-xl border px-4 py-3 text-left transition ${on ? "border-emerald/40 bg-emerald/5" : "border-ink/10 bg-surface hover:border-gold/40"}`}>
      <p className="text-sm font-semibold text-ink">{on ? "✅" : "⬜"} {label}</p>
      <p className="text-[11px] text-inkSoft">{on && date ? `confirmado em ${date}` : "ainda não / clique ao confirmar"}</p>
    </button>
  );
}
