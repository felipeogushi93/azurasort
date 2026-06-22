"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { RevealModule, RevealSpec } from "@prizegram/reveal-spec";
import { RevealClient } from "@/components/reveal/RevealClient";
import { VideoReveal } from "@/components/reveal/VideoReveal";
import { normalizeComments, applyFilters, runDraw } from "@/lib/draw/engine";
import { generateMockComments } from "@/lib/draw/mock";
import { parsePastedComments } from "@/lib/draw/parse";
import { buildRevealSpecFromDraw } from "@/lib/draw/toRevealSpec";
import { DEFAULT_FILTERS, type Comment, type DrawFilters, type DrawResult } from "@/lib/draw/types";

type Step = "link" | "base" | "scene" | "result";
type Base = "comments" | "likes";

export function GiveawaySimulator() {
  const [step, setStep] = useState<Step>("link");

  // passo 1 — publicacao
  const [campaign, setCampaign] = useState("Sorteio iPhone 16 Pro");
  const [link, setLink] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [raw, setRaw] = useState("");

  // passo 2 — base
  const [base, setBase] = useState<Base>("comments");

  // passo 3 — animacao
  const [module, setModule] = useState<RevealModule>("oscar_envelope");
  const [live, setLive] = useState(false);
  const [filters, setFilters] = useState<DrawFilters>(DEFAULT_FILTERS);
  const [hashtagInput, setHashtagInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");

  // resultado
  const [result, setResult] = useState<DrawResult | null>(null);
  const [spec, setSpec] = useState<RevealSpec | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [busy, setBusy] = useState(false);

  /* ----- passo 1: conectar publicacao (demo: gera participantes de exemplo) ----- */
  function connectFromLink() {
    setComments(normalizeComments(generateMockComments(800, link.length + 7)));
    setStep("base");
  }
  function loadPasted() {
    const c = normalizeComments(parsePastedComments(raw));
    if (c.length) setComments(c);
  }
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      setRaw(text);
      setComments(normalizeComments(parsePastedComments(text)));
    };
    reader.readAsText(f);
  }

  const liveFilters: DrawFilters = useMemo(
    () => ({
      ...filters,
      mustHaveHashtags: hashtagInput.split(/[\s,]+/).filter(Boolean),
      excludeHandles: excludeInput.split(/[\s,]+/).filter(Boolean),
    }),
    [filters, hashtagInput, excludeInput]
  );
  const eligibleCount = useMemo(
    () => (comments.length ? applyFilters(comments, liveFilters).filter((c) => c.eligible).length : 0),
    [comments, liveFilters]
  );

  /* ----- sorteio ----- */
  async function doDraw() {
    setBusy(true);
    const { result: r } = await runDraw(comments, liveFilters, new Date().toISOString());
    const s = buildRevealSpecFromDraw(r, { module, campaignName: campaign, locale: "pt-BR" });
    setResult(r);
    setSpec(s);
    setStep("result");
    setBusy(false);
  }
  async function redraw() {
    setShowReveal(false);
    await doDraw();
  }

  function newGiveaway() {
    setStep("link");
    setResult(null);
    setSpec(null);
    setComments([]);
    setLink("");
    setRaw("");
  }

  /* ============================ RENDER ============================ */
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <Stepper step={step} />

      {/* ---------- 1 · PUBLICAÇÃO ---------- */}
      {step === "link" && (
        <Card title="1 · Conecte sua publicação" subtitle="Cole o link do post ou Reels do seu sorteio.">
          <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">Nome do sorteio</label>
          <input value={campaign} onChange={(e) => setCampaign(e.target.value)} className="inp mb-5" />

          <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">Link da publicação</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://instagram.com/p/..."
            className="inp"
          />

          {/* exemplo de como copiar o link */}
          <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-deep">Como copiar o link</p>
            <ol className="space-y-1.5 text-sm text-ink/80">
              <li className="flex gap-2"><span className="text-gold-deep">1.</span> Abra o menu <span className="rounded bg-ink/5 px-1.5 font-semibold">•••</span> no topo da publicação.</li>
              <li className="flex gap-2"><span className="text-gold-deep">2.</span> Toque em <span className="font-semibold">“Copiar link”</span>.</li>
              <li className="flex gap-2"><span className="text-gold-deep">3.</span> Cole aqui em cima.</li>
            </ol>
          </div>

          {/* opcao de teste / dados */}
          <button
            onClick={() => setAdvancedOpen((v) => !v)}
            className="mt-4 text-xs text-inkSoft underline-offset-2 hover:text-ink hover:underline"
          >
            {advancedOpen ? "− ocultar" : "+ usar lista de teste ou CSV (modo avançado)"}
          </button>
          {advancedOpen && (
            <div className="mt-3 space-y-3 rounded-xl border border-ink/5 bg-canvasAlt p-4">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setComments(normalizeComments(generateMockComments(200, 13)))} className="btn-ghost py-2">⚡ 200 de teste</button>
                <button onClick={() => setComments(normalizeComments(generateMockComments(1000, 29)))} className="btn-ghost py-2">⚡ 1.000</button>
                <label className="btn-ghost cursor-pointer py-2">📄 CSV<input type="file" accept=".csv,.txt" onChange={onFile} className="hidden" /></label>
              </div>
              <textarea value={raw} onChange={(e) => setRaw(e.target.value)} onBlur={loadPasted} rows={4} placeholder="@ana.silva: eu quero! #sorteio" className="inp font-mono text-xs" />
              {comments.length > 0 && <p className="text-xs text-emerald">✓ {comments.length} participantes carregados</p>}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-inkSoft">
              {comments.length ? `${comments.length} participantes prontos` : "modo demonstração: geramos participantes de exemplo"}
            </span>
            <button
              disabled={!link && comments.length === 0}
              onClick={() => (comments.length ? setStep("base") : connectFromLink())}
              className="btn-gold py-2.5 disabled:opacity-40"
            >
              Continuar →
            </button>
          </div>
          <p className="mt-2 text-[11px] text-inkSoft/70">A coleta real do Instagram entra com o backend — por enquanto usamos participantes de exemplo.</p>
        </Card>
      )}

      {/* ---------- 2 · BASE ---------- */}
      {step === "base" && (
        <Card title="2 · Comentários ou curtidas" subtitle="Escolha entre quem concorre.">
          <div className="grid gap-3 sm:grid-cols-2">
            <BaseCard active={base === "comments"} onClick={() => setBase("comments")} icon="💬" title="Comentários" desc="Sorteia entre quem comentou na publicação." />
            <BaseCard active={base === "likes"} onClick={() => setBase("likes")} icon="❤️" title="Curtidas" desc="Sorteia entre quem curtiu a publicação." />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setStep("link")} className="text-sm text-inkSoft hover:text-ink">← voltar</button>
            <button onClick={() => setStep("scene")} className="btn-gold py-2.5">Continuar →</button>
          </div>
        </Card>
      )}

      {/* ---------- 3 · ANIMAÇÃO ---------- */}
      {step === "scene" && (
        <Card title="3 · Escolha a animação" subtitle="Como o vencedor será revelado — e os extras do sorteio.">
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-inkSoft">Animação da revelação</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <SceneCard active={module === "oscar_envelope"} onClick={() => setModule("oscar_envelope")} emoji="✉️" name="Envelope Dourado" />
            <SceneCard active={module === "stage_host"} onClick={() => setModule("stage_host")} emoji="🎤" name="Palco (vídeo)" />
            <SceneCard active={false} onClick={() => {}} emoji="🔐" name="Cofre" soon />
          </div>

          {/* ao vivo */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-ink/5 bg-canvasAlt px-4 py-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-ink">🔴 Transmitir ao vivo</p>
              <p className="text-xs text-inkSoft">Mostre o sorteio em tempo real para a sua audiência.</p>
            </div>
            <button onClick={() => setLive((v) => !v)} className={`toggle ${live ? "toggle-on" : ""}`}><span className="dot" /></button>
          </div>

          {/* cortes de video */}
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-ink/80">
            🎬 Ao final você recebe <span className="font-semibold text-gold-deep">cortes de vídeo prontos</span> (9:16 · 16:9 · 1:1) para postar.
          </div>

          {/* nº vencedores */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <Field label="Vencedores">
              <input type="number" min={1} value={filters.winnersCount} onChange={(e) => setFilters({ ...filters, winnersCount: Math.max(1, +e.target.value) })} className="inp" />
            </Field>
            <Field label="Suplentes">
              <input type="number" min={0} value={filters.backupsCount} onChange={(e) => setFilters({ ...filters, backupsCount: Math.max(0, +e.target.value) })} className="inp" />
            </Field>
          </div>

          {/* opcoes avancadas (filtros) */}
          <button onClick={() => setAdvancedOpen((v) => !v)} className="mt-4 text-xs text-inkSoft underline-offset-2 hover:text-ink hover:underline">
            {advancedOpen ? "− ocultar filtros" : "+ filtros avançados (hashtag, menções, excluir)"}
          </button>
          {advancedOpen && (
            <div className="mt-3 grid gap-3 rounded-xl border border-ink/5 bg-canvasAlt p-4 sm:grid-cols-2">
              <Field label="Hashtags obrigatórias"><input value={hashtagInput} onChange={(e) => setHashtagInput(e.target.value)} placeholder="#sorteio" className="inp" /></Field>
              <Field label="Excluir handles"><input value={excludeInput} onChange={(e) => setExcludeInput(e.target.value)} placeholder="@minhamarca" className="inp" /></Field>
              <Field label="Mín. de menções"><input type="number" min={0} value={filters.minMentions} onChange={(e) => setFilters({ ...filters, minMentions: Math.max(0, +e.target.value) })} className="inp" /></Field>
              <Field label="Sem duplicados">
                <button onClick={() => setFilters({ ...filters, blockDuplicateUsers: !filters.blockDuplicateUsers })} className={`toggle ${filters.blockDuplicateUsers ? "toggle-on" : ""}`}><span className="dot" /></button>
              </Field>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between rounded-xl border border-ink/5 bg-canvasAlt px-4 py-3">
            <span className="text-sm text-inkSoft">Participantes elegíveis</span>
            <span className="font-display text-2xl font-semibold text-gold-deep">{eligibleCount.toLocaleString("pt-BR")}</span>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button onClick={() => setStep("base")} className="text-sm text-inkSoft hover:text-ink">← voltar</button>
            <button disabled={!eligibleCount || busy} onClick={doDraw} className="btn-gold py-2.5 disabled:opacity-40">
              {busy ? "sorteando…" : "🎲 Sortear"}
            </button>
          </div>
        </Card>
      )}

      {/* ---------- 4 · RESULTADO ---------- */}
      {step === "result" && result && spec && (
        <Card title="4 · Resultado" subtitle="Sorteio auditável concluído. Veja a revelação e baixe os cortes.">
          <div className="space-y-2">
            {result.winners.map((w) => (
              <div key={w.position} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${w.isBackup ? "border-ink/5 bg-canvasAlt" : "border-gold/40 bg-gold/5"}`}>
                <span className={`font-display text-lg font-semibold ${w.isBackup ? "text-inkSoft" : "text-gold-deep"}`}>
                  {w.isBackup ? `S${w.position - filters.winnersCount}` : `#${w.position}`}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-ink">@{w.handle}</p>
                  <p className="truncate text-xs text-inkSoft">{w.text || "—"}</p>
                </div>
                <span className="ml-auto text-[10px] uppercase tracking-widest text-inkSoft">{w.isBackup ? "suplente" : "vencedor"}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Stat label="Elegíveis" value={result.eligibleCount.toLocaleString("pt-BR")} />
            <Stat label="Base" value={base === "comments" ? "comentários" : "curtidas"} />
            <Stat label="Ao vivo" value={live ? "sim" : "não"} />
            <Stat label="Certificado" value={result.certificateHash.slice(0, 8) + "…"} mono />
          </div>

          <div className="mt-4 rounded-lg border border-ink/5 bg-canvasAlt px-3 py-2">
            <p className="text-[10px] uppercase tracking-widest text-inkSoft">Seed (reproduz o mesmo resultado)</p>
            <p className="break-all font-mono text-xs text-violet">{result.seed}</p>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-inkSoft">Cortes de vídeo prontos</p>
            <div className="flex gap-2">
              {["9:16", "16:9", "1:1"].map((f) => (
                <button key={f} className="flex-1 rounded-xl border border-ink/10 bg-surface py-2.5 text-sm text-ink shadow-soft transition hover:border-gold/50">⬇ {f}</button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setShowReveal(true)} className="btn-gold py-2.5">▶ Ver revelação</button>
            <button onClick={redraw} className="btn-ghost py-2.5">↻ Refazer</button>
            <button onClick={newGiveaway} className="btn-ghost py-2.5">+ Novo sorteio</button>
          </div>
        </Card>
      )}

      {/* ---------- REVEAL OVERLAY ---------- */}
      {showReveal && spec && (
        <div className="fixed inset-0 z-[100] bg-void">
          <button onClick={() => setShowReveal(false)} className="absolute right-5 top-5 z-[110] rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur hover:border-gold">✕ fechar</button>
          {module === "stage_host" ? <div className="h-full w-full"><VideoReveal spec={spec} /></div> : <RevealClient spec={spec} />}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-inkSoft">
        Simulação local · <Link href="/" className="text-gold-deep hover:underline">voltar ao site</Link>
      </p>
    </div>
  );
}

/* ----------------------------- subcomponentes ----------------------------- */

function Stepper({ step }: { step: Step }) {
  const steps: { k: Step; label: string }[] = [
    { k: "link", label: "Publicação" },
    { k: "base", label: "Base" },
    { k: "scene", label: "Animação" },
    { k: "result", label: "Resultado" },
  ];
  const idx = steps.findIndex((s) => s.k === step);
  return (
    <div className="mb-8 flex items-center justify-center gap-2 sm:gap-3">
      {steps.map((s, i) => (
        <div key={s.k} className="flex items-center gap-2 sm:gap-3">
          <div className={`flex items-center gap-2 ${i <= idx ? "text-gold-deep" : "text-inkSoft"}`}>
            <span className={`grid h-7 w-7 place-items-center rounded-full border text-xs ${i <= idx ? "border-gold bg-gold/10" : "border-ink/15"}`}>{i + 1}</span>
            <span className="hidden text-sm sm:inline">{s.label}</span>
          </div>
          {i < steps.length - 1 && <span className={`h-px w-6 sm:w-8 ${i < idx ? "bg-gold" : "bg-ink/15"}`} />}
        </div>
      ))}
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-ink/5 bg-surface p-6 shadow-card sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-inkSoft">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">{label}</label>
      {children}
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-ink/5 bg-canvasAlt px-3 py-2">
      <p className="text-[10px] uppercase tracking-widest text-inkSoft">{label}</p>
      <p className={`text-ink ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}

function BaseCard({ active, onClick, icon, title, desc }: { active: boolean; onClick: () => void; icon: string; title: string; desc: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-2xl border p-5 text-left transition ${
        active ? "border-gold bg-gold/10 shadow-gold" : "border-ink/10 bg-surface hover:border-gold/40"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-display text-lg font-semibold text-ink">{title}</span>
      <span className="text-xs text-inkSoft">{desc}</span>
    </button>
  );
}

function SceneCard({ active, onClick, emoji, name, soon }: { active: boolean; onClick: () => void; emoji: string; name: string; soon?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={soon}
      className={`relative flex h-24 flex-col items-center justify-center gap-1 rounded-2xl border transition ${
        active ? "border-gold bg-gold/10 shadow-gold" : "border-ink/10 bg-surface hover:border-gold/40"
      } ${soon ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-xs font-medium text-ink">{name}</span>
      {soon && <span className="absolute right-2 top-2 rounded-full bg-ink/5 px-1.5 text-[8px] uppercase text-inkSoft">em breve</span>}
    </button>
  );
}
