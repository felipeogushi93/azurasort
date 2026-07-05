"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/**
 * 🚀 Alavancagem — mapa de crescimento (backlinks/AEO). Estado no navegador
 * (localStorage): checklist marcado, alvos adicionados por grupo, e o registro
 * de citações (IAs/Google). Dá pra migrar pro banco depois (compartilhar c/ Lucas).
 *
 * Exporta: GrowthLeverage (tela cheia) e GrowthSummaryCard (cartão no painel).
 */

type Item = { key: string; label: string; link?: string; note?: string; seed?: boolean };
type Group = { title: string; help: string; items: Item[]; addable?: boolean };

const GROUPS: Group[] = [
  {
    title: "⚙️ Configuração",
    help: "Ajustes únicos que ligam a máquina. Feito uma vez, não repete.",
    addable: true,
    items: [
      { key: "cfg-agent", label: "Agente semanal ligado (Vercel)", seed: true },
      { key: "cfg-ig", label: "Perfil Instagram @azurasortofficial", seed: true },
      { key: "cfg-tt", label: "Perfil TikTok @azurasort", seed: true },
      { key: "cfg-mails", label: "Confirmar emails de cadastro (gmail)" },
    ],
  },
  {
    title: "📁 Diretórios",
    help: "Sites que listam ferramentas. Cada cadastro = um link pro seu site (autoridade no Google) e um lugar a mais onde a IA te encontra. Submete 1x, fica pra sempre. Cola aqui os que o agente mandar.",
    addable: true,
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
    addable: true,
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
    addable: true,
    items: [
      { key: "com-reddit", label: "1ª resposta no Reddit (r/Instagram, r/socialmedia)" },
      { key: "com-quora", label: "1ª resposta no Quora" },
    ],
  },
  {
    title: "🏆 Marcos",
    help: "Ações maiores que dão saltos de autoridade — feitas com preparo, não toda semana.",
    addable: true,
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

const AIS = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "claude", label: "Claude" },
  { id: "perplexity", label: "Perplexity" },
  { id: "gemini", label: "Gemini" },
] as const;

const GOOGLE_LEVELS = ["Não aparece", "Além da 2ª página", "2ª página", "1ª página", "Top 3 🎉"];

/** 📡 Cockpit — os instrumentos que a gente olha toda semana (dica do Lucas). */
const MONITOR = [
  { id: "gsc", label: "Google Search Console", link: "https://search.google.com/search-console", what: "Aba Desempenho: cliques, quais buscas te trazem e sua posição média no Google. É o painel-mãe do SEO." },
  { id: "backlinks", label: "Backlinks (Links no Search Console)", link: "https://search.google.com/search-console/links", what: "Quem está linkando pra você. Tem que crescer conforme cadastramos diretórios (Indie Hackers, Uneed…)." },
  { id: "bing", label: "Bing Webmaster Tools", link: "https://www.bing.com/webmasters", what: "SEO no Bing — que é a base das buscas do ChatGPT. Submeta o sitemap (azurasort.com/sitemap.xml)." },
  { id: "quora", label: "Quora — perguntas do nicho", link: "https://www.quora.com/search?q=instagram+giveaway+picker&type=question", what: "Perguntas tipo 'como sortear no Instagram' pra responder e mencionar o AzuraSort de leve." },
  { id: "reviews", label: "Google Reviews (avaliações ⭐)", link: "https://business.google.com/reviews", what: "As avaliações da marca (página que o Lucas criou). Meta: 5+ estrelas. Peça pros clientes felizes deixarem." },
  { id: "alerts", label: "Google Alerts — menções da marca", link: "https://www.google.com/alerts", what: "Setup 1x: criar alerta pra \"AzuraSort\". Depois te avisa por email quando alguém cita a marca (= backlink/menção nova pra aproveitar)." },
  { id: "ahrefs", label: "Ahrefs Webmaster Tools (grátis)", link: "https://ahrefs.com/webmaster-tools", what: "Setup 1x: verificar o site. Mostra o Domain Rating (autoridade 0-100) e a lista de backlinks, melhor que o Google." },
  { id: "uptime", label: "UptimeRobot — site no ar?", link: "https://uptimerobot.com", what: "Setup 1x: monitorar azurasort.com. Te avisa na hora se o site cair (site fora = venda perdida em silêncio)." },
] as const;

const KEY_DONE = "azs_growth_v1";
const KEY_CUSTOM = "azs_growth_custom_v1";
const KEY_CITE = "azs_growth_citations_v1";
const KEY_MONITOR = "azs_growth_monitor_v1";
const BACKLINK_GOAL = 50;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

type Custom = { key: string; group: string; label: string; link?: string };
type Citations = { ai: Record<string, string | undefined>; googleLevel?: number; googleDate?: string };

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
    const hasState = Object.keys(done).length > 0;
    const total = base.length + custom.length;
    const completed = hasState ? [...base, ...custom].filter((it) => done[it.key]).length : base.filter((it) => it.seed).length;
    setPct(total ? Math.round((completed / total) * 100) : 0);
  }, []);
  return (
    <section className="mb-8 rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/5 to-surface p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">🚀 Alavancagem</h2>
          <p className="text-sm text-inkSoft">Mapa de crescimento · backlinks & AEO</p>
        </div>
        <Link href="/adminlkgat/alavancagem" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5">Abrir mapa completo →</Link>
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
  const [cite, setCite] = useState<Citations>({ ai: {} });
  const [monitor, setMonitor] = useState<Record<string, string>>({}); // id -> última conferida (YYYY-MM-DD)
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [openHelp, setOpenHelp] = useState<string | null>(null);
  const [addingGroup, setAddingGroup] = useState<string | null>(null);
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
    // migra custom antigos (sem group) pra Diretórios
    const rawCustom = load<Custom[]>(KEY_CUSTOM, []).map((c) => ({ ...c, group: c.group ?? "📁 Diretórios" }));
    setCustom(rawCustom);
    setCite(load<Citations>(KEY_CITE, { ai: {} }));
    setMonitor(load<Record<string, string>>(KEY_MONITOR, {}));
    setReady(true);
  }, []);

  function toggle(key: string) {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      save(KEY_DONE, next);
      return next;
    });
  }
  function addTo(group: string) {
    const label = newLabel.trim();
    if (!label) return;
    const item: Custom = { key: `custom-${Date.now()}`, group, label, link: newLink.trim() || undefined };
    setCustom((prev) => {
      const next = [...prev, item];
      save(KEY_CUSTOM, next);
      return next;
    });
    setNewLabel("");
    setNewLink("");
    setAddingGroup(null);
  }
  function removeCustom(key: string) {
    setCustom((prev) => {
      const next = prev.filter((c) => c.key !== key);
      save(KEY_CUSTOM, next);
      return next;
    });
  }
  function toggleAi(id: string) {
    setCite((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      const ai = { ...prev.ai, [id]: prev.ai[id] ? undefined : today };
      const next = { ...prev, ai };
      save(KEY_CITE, next);
      return next;
    });
  }
  function setGoogle(level: number) {
    setCite((prev) => {
      const next = { ...prev, googleLevel: level, googleDate: new Date().toISOString().slice(0, 10) };
      save(KEY_CITE, next);
      return next;
    });
  }
  function markChecked(id: string) {
    setMonitor((prev) => {
      const next = { ...prev, [id]: new Date().toISOString().slice(0, 10) };
      save(KEY_MONITOR, next);
      return next;
    });
  }
  // "vencido" = nunca conferido ou passou +7 dias
  function isStale(id: string): boolean {
    const d = monitor[id];
    if (!d) return true;
    return Date.now() - new Date(d + "T12:00:00").getTime() > WEEK_MS;
  }

  const allItems = useMemo(() => [...GROUPS.flatMap((g) => g.items), ...custom], [custom]);
  const total = allItems.length;
  const completed = allItems.filter((it) => done[it.key]).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const backlinkGroups = ["📁 Diretórios", "📝 Listicles (outreach)"];
  const backlinkItems = [...GROUPS.filter((g) => backlinkGroups.includes(g.title)).flatMap((g) => g.items), ...custom.filter((c) => backlinkGroups.includes(c.group))];
  const backlinksDone = backlinkItems.filter((it) => done[it.key]).length;

  const showItem = (key: string) => (filter === "all" ? true : filter === "done" ? !!done[key] : !done[key]);

  function renderItem(it: { key: string; label: string; link?: string; note?: string }, removable = false) {
    const checked = ready && !!done[it.key];
    return (
      <li key={it.key} className="flex items-start gap-2">
        <input type="checkbox" checked={checked} onChange={() => toggle(it.key)} className="mt-0.5 h-4 w-4 shrink-0 accent-gold" />
        <span className={`flex-1 text-sm ${checked ? "text-inkSoft line-through" : "text-ink"}`}>
          {it.link ? <a href={it.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{it.label}</a> : it.label}
          {it.note && <span className="ml-1 text-xs text-gold-deep">· {it.note}</span>}
        </span>
        {removable && <button onClick={() => removeCustom(it.key)} className="text-xs text-inkSoft hover:text-rose" title="Remover">✕</button>}
      </li>
    );
  }

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

      {/* CITAÇÕES — estamos aparecendo? */}
      <section className="mb-6 rounded-3xl border border-ink/5 bg-surface p-5 shadow-card">
        <p className="mb-1 text-sm font-semibold text-ink">📡 Citações — Estamos aparecendo? <span className="font-normal text-inkSoft">(teste manual, ~1x/mês)</span></p>
        <p className="mb-3 text-xs text-inkSoft">Pergunte em cada IA &quot;melhor site pra sorteio no Instagram&quot; e marque se o AzuraSort aparece. No Google, veja em que ponto estamos.</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {AIS.map((a) => {
            const on = !!cite.ai[a.id];
            return (
              <button key={a.id} onClick={() => toggleAi(a.id)} className={`rounded-xl border px-4 py-2.5 text-left transition ${on ? "border-emerald/40 bg-emerald/5" : "border-ink/10 bg-surface hover:border-gold/40"}`}>
                <p className="text-sm font-semibold text-ink">{on ? "✅" : "⬜"} {a.label}</p>
                <p className="text-[11px] text-inkSoft">{on ? `desde ${cite.ai[a.id]}` : "ainda não"}</p>
              </button>
            );
          })}
        </div>
        <div className="rounded-xl border border-ink/10 bg-canvasAlt p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-ink">🔎 Google — em que ponto estamos?</p>
              <p className="text-[11px] text-inkSoft">Veja no Search Console (Desempenho) a posição média. Atualize aqui pra ver a evolução.</p>
            </div>
            <select
              value={cite.googleLevel ?? 0}
              onChange={(e) => setGoogle(Number(e.target.value))}
              className="rounded-lg border border-ink/10 bg-surface px-3 py-2 text-sm text-ink"
            >
              {GOOGLE_LEVELS.map((lvl, i) => (
                <option key={i} value={i}>{lvl}</option>
              ))}
            </select>
          </div>
          {/* barra de evolução do Google */}
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className={`h-full rounded-full transition-all ${(cite.googleLevel ?? 0) >= 4 ? "bg-emerald" : (cite.googleLevel ?? 0) >= 3 ? "bg-gold" : "bg-gold/50"}`}
              style={{ width: `${((cite.googleLevel ?? 0) / (GOOGLE_LEVELS.length - 1)) * 100}%` }}
            />
          </div>
          {cite.googleDate && <p className="mt-1 text-[11px] text-inkSoft">atualizado em {cite.googleDate}</p>}
        </div>
      </section>

      {/* 📡 COCKPIT — instrumentos que a gente olha toda semana (dica do Lucas) */}
      <section className="mb-6 rounded-3xl border border-ink/5 bg-surface p-5 shadow-card">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink">🛩️ Cockpit — olhar 1x por semana</p>
          {ready && (
            <span className="text-xs text-inkSoft">
              {MONITOR.filter((m) => isStale(m.id)).length === 0
                ? "✅ tudo em dia"
                : `⚠️ ${MONITOR.filter((m) => isStale(m.id)).length} pra conferir`}
            </span>
          )}
        </div>
        <p className="mb-3 text-xs text-inkSoft">Os instrumentos do avião. Abra cada um, veja como está, e marque &quot;conferi&quot;. Fica laranja quando passa 7 dias.</p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {MONITOR.map((m) => {
            const stale = ready && isStale(m.id);
            const last = monitor[m.id];
            return (
              <div key={m.id} className={`rounded-xl border p-3 transition ${stale ? "border-gold/40 bg-gold/5" : "border-emerald/30 bg-emerald/5"}`}>
                <div className="flex items-start justify-between gap-2">
                  <a href={m.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-ink hover:underline">
                    {stale ? "⚠️" : "✅"} {m.label} <span className="text-inkSoft">↗</span>
                  </a>
                  <button onClick={() => markChecked(m.id)} className="shrink-0 rounded-full bg-ink px-3 py-1 text-[11px] font-semibold text-white hover:bg-ink/90">
                    conferi
                  </button>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-inkSoft">{m.what}</p>
                <p className="mt-1 text-[11px] text-inkSoft">{last ? `conferido em ${last}` : "nunca conferido"}</p>
              </div>
            );
          })}
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

      {/* checklist por grupo (cada um com adicionar) */}
      <div className="grid gap-5 md:grid-cols-2">
        {GROUPS.map((g) => {
          const baseVisible = g.items.filter((it) => showItem(it.key));
          const customVisible = custom.filter((c) => c.group === g.title && showItem(c.key));
          const isAdding = addingGroup === g.title;
          return (
            <div key={g.title} className="rounded-2xl border border-ink/5 bg-surface p-4 shadow-soft">
              <div className="mb-2 flex items-center gap-2">
                <p className="text-sm font-semibold text-ink">{g.title}</p>
                <button onClick={() => setOpenHelp(openHelp === g.title ? null : g.title)} className="grid h-5 w-5 place-items-center rounded-full bg-ink/5 text-xs text-inkSoft hover:bg-gold/20 hover:text-gold-deep" title="O que é / pra quê?">?</button>
              </div>
              {openHelp === g.title && <p className="mb-3 rounded-lg bg-gold/5 px-3 py-2 text-xs text-inkSoft">{g.help}</p>}
              <ul className="space-y-1.5">
                {baseVisible.map((it) => renderItem(it))}
                {customVisible.map((c) => renderItem(c, true))}
              </ul>
              {/* adicionar neste grupo */}
              {isAdding ? (
                <div className="mt-3 space-y-2 rounded-lg bg-canvasAlt p-2">
                  <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Nome do site/tarefa" className="w-full rounded-lg border border-ink/10 bg-surface px-3 py-1.5 text-sm" autoFocus />
                  <input value={newLink} onChange={(e) => setNewLink(e.target.value)} placeholder="Link (opcional)" className="w-full rounded-lg border border-ink/10 bg-surface px-3 py-1.5 text-sm" />
                  <div className="flex gap-2">
                    <button onClick={() => addTo(g.title)} className="flex-1 rounded-full bg-ink/90 py-1.5 text-sm font-semibold text-white hover:bg-ink">Adicionar</button>
                    <button onClick={() => { setAddingGroup(null); setNewLabel(""); setNewLink(""); }} className="rounded-full border border-ink/10 px-3 py-1.5 text-sm text-inkSoft">Cancelar</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => { setAddingGroup(g.title); setNewLabel(""); setNewLink(""); }} className="mt-3 text-xs font-medium text-gold-deep hover:underline">+ adicionar aqui</button>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-6 rounded-xl bg-ink/5 px-4 py-3 text-xs text-inkSoft">
        🎯 <b>Onde queremos chegar:</b> que quando alguém pesquisar no Google OU perguntar pra uma IA
        &quot;melhor site pra sorteio no Instagram&quot;, o AzuraSort apareça. Isso vem do grind semanal
        (o agente manda os alvos toda segunda no Telegram → você adiciona no grupo certo → faz → marca). A bola de neve cresce. ⛄
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
