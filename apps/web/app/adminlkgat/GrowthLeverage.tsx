"use client";

import { useEffect, useState } from "react";

/**
 * 🚀 Alavancagem — mapa de crescimento no painel: estágios (onde estamos),
 * checklist de backlinks/AEO com progresso, e números ao vivo. O estado do
 * checklist salva no navegador (localStorage) — pessoal por dispositivo; dá pra
 * migrar pro banco depois se quiser compartilhar com o Lucas.
 */

type Item = { key: string; label: string; link?: string; note?: string; seed?: boolean };
type Group = { title: string; items: Item[] };

const GROUPS: Group[] = [
  {
    title: "⚙️ Configuração (uma vez)",
    items: [
      { key: "cfg-agent", label: "Agente semanal ligado (GROWTH_DIGEST_SECRET na Vercel)", seed: true },
      { key: "cfg-ig", label: "Perfil Instagram @azurasortofficial", seed: true },
      { key: "cfg-tt", label: "Perfil TikTok @azurasort", seed: true },
      { key: "cfg-mails", label: "Confirmar emails de cadastro (azurasort@gmail.com)" },
    ],
  },
  {
    title: "📁 Diretórios (submeter — 1x cada, permanente)",
    items: [
      { key: "dir-launchingnext", label: "Launching Next", link: "https://launchingnext.com/submit", seed: true },
      { key: "dir-saashub", label: "SaaSHub", link: "https://www.saashub.com/submit", seed: true },
      { key: "dir-alternativeto", label: "AlternativeTo", link: "https://alternativeto.net/manage-item", note: "conta criada — submeter a partir de 10/jul" },
      { key: "dir-uneed", label: "Uneed", link: "https://www.uneed.best" },
      { key: "dir-dangai", label: "Dang.ai", link: "https://dang.ai/submit" },
      { key: "dir-toolify", label: "Toolify", link: "https://www.toolify.ai" },
      { key: "dir-startupstash", label: "Startup Stash", link: "https://startupstash.com" },
      { key: "dir-indiehackers", label: "Indie Hackers (Products)", link: "https://www.indiehackers.com/products" },
    ],
  },
  {
    title: "📝 Listicles (pedir inclusão por email)",
    items: [
      { key: "lst-reviewraffles", label: "reviewraffles.com", link: "https://reviewraffles.com/instagram-giveaway-tool", seed: true },
      { key: "lst-beyondcomments", label: "beyondcomments.io", link: "https://beyondcomments.io/blog/free-instagram-giveaway-picker" },
      { key: "lst-creatorflow", label: "creatorflow.so", link: "https://creatorflow.so/blog/best-instagram-giveaway-tools-comparison" },
      { key: "lst-copywritersnow", label: "copywritersnow.com", link: "https://copywritersnow.com/instagram-giveaway-tools" },
      { key: "lst-kickofflabs", label: "kickofflabs.com", link: "https://kickofflabs.com/blog/best-free-paid-tools-pick-giveaway-winners" },
    ],
  },
  {
    title: "💬 Comunidades (ajudar + menção leve)",
    items: [
      { key: "com-reddit", label: "1ª resposta no Reddit (r/Instagram, r/socialmedia)" },
      { key: "com-quora", label: "1ª resposta no Quora" },
    ],
  },
  {
    title: "🏆 Marcos (com preparo)",
    items: [
      { key: "mrk-wikidata", label: "Wikidata (Q140357518)", link: "https://www.wikidata.org/wiki/Q140357518", seed: true },
      { key: "mrk-producthunt", label: "Lançamento no Product Hunt", link: "https://www.producthunt.com", note: "kit pronto — escolher um dia" },
      { key: "mrk-g2", label: "G2 / Capterra", note: "quando tiver 1-2 clientes felizes" },
      { key: "mrk-ai", label: "1ª citação numa IA (teste mensal: pergunte 'melhor sorteador de Instagram')" },
    ],
  },
];

const STAGES = [
  { label: "Produto (site/sorteio)", status: "ok" },
  { label: "Rastreamento (visitas + jornada)", status: "ok" },
  { label: "SEO base (Google)", status: "ok" },
  { label: "AEO + comparações (ChatGPT/Claude)", status: "wip" },
  { label: "Backlinks (grind semanal)", status: "wip" },
  { label: "Instagram (marca + tráfego)", status: "wip" },
  { label: "Ads pagos (Google/Meta)", status: "wait" },
] as const;

const STORAGE_KEY = "azs_growth_v1";
const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

export function GrowthLeverage({ visits7d, sales7d }: { visits7d: number; sales7d: number }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let saved: Record<string, boolean> | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      /* ignora */
    }
    if (saved) {
      setDone(saved);
    } else {
      // primeira vez: marca o que já sabemos que foi feito (seed)
      const seed: Record<string, boolean> = {};
      for (const it of ALL_ITEMS) if (it.seed) seed[it.key] = true;
      setDone(seed);
    }
    setReady(true);
  }, []);

  function toggle(key: string) {
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignora */
      }
      return next;
    });
  }

  const total = ALL_ITEMS.length;
  const completed = ALL_ITEMS.filter((it) => done[it.key]).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="mb-8 rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/5 to-surface p-6 shadow-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-ink">🚀 Alavancagem — mapa de crescimento</h2>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-ink/5 px-3 py-1 text-inkSoft">Visitas 7d: <b className="text-ink">{visits7d}</b></span>
          <span className="rounded-full bg-ink/5 px-3 py-1 text-inkSoft">Vendas 7d: <b className="text-ink">{sales7d}</b></span>
        </div>
      </div>

      {/* progresso geral */}
      <div className="mb-6">
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-medium text-ink">Progresso do checklist</span>
          <span className="text-inkSoft">{completed}/{total} · {pct}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* estágios */}
      <div className="mb-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-inkSoft">Onde estamos</p>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <span
              key={s.label}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                s.status === "ok"
                  ? "bg-emerald/10 text-emerald"
                  : s.status === "wip"
                    ? "bg-gold/15 text-gold-deep"
                    : "bg-ink/5 text-inkSoft"
              }`}
            >
              {s.status === "ok" ? "✅" : s.status === "wip" ? "🏗️" : "⏳"} {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* checklist */}
      <div className="grid gap-5 md:grid-cols-2">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <p className="mb-2 text-sm font-semibold text-ink">{g.title}</p>
            <ul className="space-y-1.5">
              {g.items.map((it) => {
                const checked = ready && !!done[it.key];
                return (
                  <li key={it.key} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(it.key)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-gold"
                    />
                    <span className={`text-sm ${checked ? "text-inkSoft line-through" : "text-ink"}`}>
                      {it.link ? (
                        <a href={it.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {it.label}
                        </a>
                      ) : (
                        it.label
                      )}
                      {it.note && <span className="ml-1 text-xs text-gold-deep">· {it.note}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-xl bg-ink/5 px-4 py-3 text-xs text-inkSoft">
        🎯 <b>Onde queremos chegar:</b> que quando alguém pesquisar no Google OU perguntar pra uma IA
        &quot;melhor site pra sorteio no Instagram&quot;, o AzuraSort apareça. Isso vem do grind semanal
        (o agente manda os alvos toda segunda no Telegram). Marque aqui conforme faz — a bola de neve cresce. ⛄
      </p>
    </section>
  );
}
