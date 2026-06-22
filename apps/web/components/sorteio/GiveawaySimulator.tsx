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

type Step = "import" | "config" | "result";

export function GiveawaySimulator() {
  const [step, setStep] = useState<Step>("import");
  const [campaign, setCampaign] = useState("Sorteio iPhone 16 Pro");
  const [raw, setRaw] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [filters, setFilters] = useState<DrawFilters>(DEFAULT_FILTERS);
  const [excludeInput, setExcludeInput] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [module, setModule] = useState<RevealModule>("oscar_envelope");
  const [result, setResult] = useState<DrawResult | null>(null);
  const [spec, setSpec] = useState<RevealSpec | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [busy, setBusy] = useState(false);

  /* ----- import ----- */
  function loadMock(n: number) {
    const c = normalizeComments(generateMockComments(n, Math.floor(n + raw.length)));
    setComments(c);
    setRaw(`(${c.length} comentarios de teste gerados)`);
  }
  function loadPasted() {
    const c = normalizeComments(parsePastedComments(raw));
    setComments(c);
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

  /* ----- filtros derivados ----- */
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

  function exportCsv() {
    const processed = applyFilters(comments, liveFilters);
    const rows = [["handle", "elegivel", "motivo", "comentario"]];
    processed.forEach((c) =>
      rows.push([c.handle, c.eligible ? "sim" : "nao", c.reason ?? "", `"${c.text.replace(/"/g, '""')}"`])
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "participantes.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ============================ RENDER ============================ */
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <Stepper step={step} />

      {/* ---------- IMPORT ---------- */}
      {step === "import" && (
        <Card title="1 · Importe os participantes" subtitle="Sem domínio e sem Instagram ainda — simule com comentários de teste, cole sua lista ou suba um CSV.">
          <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">Nome do sorteio</label>
          <input value={campaign} onChange={(e) => setCampaign(e.target.value)} className="inp mb-5" />

          <div className="mb-4 flex flex-wrap gap-2">
            <button onClick={() => loadMock(200)} className="btn-ghost py-2">⚡ Gerar 200 de teste</button>
            <button onClick={() => loadMock(1000)} className="btn-ghost py-2">⚡ Gerar 1.000</button>
            <label className="btn-ghost cursor-pointer py-2">
              📄 Subir CSV
              <input type="file" accept=".csv,.txt" onChange={onFile} className="hidden" />
            </label>
          </div>

          <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">Ou cole comentários (um por linha: @handle: texto)</label>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onBlur={loadPasted}
            rows={6}
            placeholder={"@ana.silva: eu quero! @maria @joao #sorteio\n@pedro.costa: participando!!"}
            className="inp font-mono text-sm"
          />

          <div className="mt-5 flex items-center justify-between">
            <span className="text-sm text-inkSoft">
              {comments.length ? `${comments.length} comentários carregados` : "nenhum comentário ainda"}
            </span>
            <button disabled={!comments.length} onClick={() => setStep("config")} className="btn-gold py-2.5 disabled:opacity-40">
              Continuar →
            </button>
          </div>
        </Card>
      )}

      {/* ---------- CONFIG ---------- */}
      {step === "config" && (
        <Card title="2 · Regras e filtros" subtitle="Defina quem concorre e quantos vencedores. O número de elegíveis atualiza em tempo real.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hashtags obrigatórias (separe por espaço)">
              <input value={hashtagInput} onChange={(e) => setHashtagInput(e.target.value)} placeholder="#sorteio" className="inp" />
            </Field>
            <Field label="Excluir handles (ex: organizador)">
              <input value={excludeInput} onChange={(e) => setExcludeInput(e.target.value)} placeholder="@minhamarca" className="inp" />
            </Field>
            <Field label="Mínimo de menções (@)">
              <input type="number" min={0} value={filters.minMentions} onChange={(e) => setFilters({ ...filters, minMentions: Math.max(0, +e.target.value) })} className="inp" />
            </Field>
            <Field label="Sem comentários duplicados">
              <button onClick={() => setFilters({ ...filters, blockDuplicateUsers: !filters.blockDuplicateUsers })} className={`toggle ${filters.blockDuplicateUsers ? "toggle-on" : ""}`}>
                <span className="dot" />
              </button>
            </Field>
            <Field label="Vencedores">
              <input type="number" min={1} value={filters.winnersCount} onChange={(e) => setFilters({ ...filters, winnersCount: Math.max(1, +e.target.value) })} className="inp" />
            </Field>
            <Field label="Suplentes (backups)">
              <input type="number" min={0} value={filters.backupsCount} onChange={(e) => setFilters({ ...filters, backupsCount: Math.max(0, +e.target.value) })} className="inp" />
            </Field>
          </div>

          <div className="mt-5">
            <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">Cena da revelação</label>
            <div className="flex gap-2">
              <SceneBtn active={module === "oscar_envelope"} onClick={() => setModule("oscar_envelope")}>✉️ Envelope Dourado (3D)</SceneBtn>
              <SceneBtn active={module === "stage_host"} onClick={() => setModule("stage_host")}>🎤 Palco (vídeo)</SceneBtn>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-ink/5 bg-canvasAlt px-4 py-3">
            <span className="text-sm text-inkSoft">Participantes elegíveis</span>
            <span className="font-display text-2xl font-semibold text-gold-deep">{eligibleCount.toLocaleString("pt-BR")}</span>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button onClick={() => setStep("import")} className="text-sm text-inkSoft hover:text-ink">← voltar</button>
            <button disabled={!eligibleCount || busy} onClick={doDraw} className="btn-gold py-2.5 disabled:opacity-40">
              {busy ? "sorteando…" : "🎲 Sortear"}
            </button>
          </div>
        </Card>
      )}

      {/* ---------- RESULT ---------- */}
      {step === "result" && result && spec && (
        <Card title="3 · Resultado" subtitle="Sorteio auditável concluído. Veja a revelação, exporte ou refaça.">
          <div className="space-y-2">
            {result.winners.map((w) => (
              <div
                key={w.position}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                  w.isBackup ? "border-ink/5 bg-canvasAlt" : "border-gold/40 bg-gold/5"
                }`}
              >
                <span className={`font-display text-lg font-semibold ${w.isBackup ? "text-inkSoft" : "text-gold-deep"}`}>
                  {w.isBackup ? `S${w.position - filters.winnersCount}` : `#${w.position}`}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-ink">@{w.handle}</p>
                  <p className="truncate text-xs text-inkSoft">{w.text || "—"}</p>
                </div>
                <span className="ml-auto text-[10px] uppercase tracking-widest text-inkSoft">
                  {w.isBackup ? "suplente" : "vencedor"}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Stat label="Total" value={result.totalCount.toLocaleString("pt-BR")} />
            <Stat label="Elegíveis" value={result.eligibleCount.toLocaleString("pt-BR")} />
            <Stat label="Algoritmo" value="auditável" />
            <Stat label="Certificado" value={result.certificateHash.slice(0, 8) + "…"} mono />
          </div>

          <div className="mt-4 rounded-lg border border-ink/5 bg-canvasAlt px-3 py-2">
            <p className="text-[10px] uppercase tracking-widest text-inkSoft">Seed (reproduz o mesmo resultado)</p>
            <p className="break-all font-mono text-xs text-violet">{result.seed}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setShowReveal(true)} className="btn-gold py-2.5">▶ Ver revelação</button>
            <button onClick={redraw} className="btn-ghost py-2.5">↻ Refazer sorteio</button>
            <button onClick={exportCsv} className="btn-ghost py-2.5">📄 Exportar CSV</button>
            <button
              onClick={() => { setStep("import"); setResult(null); setSpec(null); }}
              className="btn-ghost py-2.5"
            >
              + Novo sorteio
            </button>
          </div>
        </Card>
      )}

      {/* ---------- REVEAL OVERLAY (escuro de proposito) ---------- */}
      {showReveal && spec && (
        <div className="fixed inset-0 z-[100] bg-void">
          <button
            onClick={() => setShowReveal(false)}
            className="absolute right-5 top-5 z-[110] rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur hover:border-gold"
          >
            ✕ fechar
          </button>
          {module === "stage_host" ? (
            <div className="h-full w-full">
              <VideoReveal spec={spec} />
            </div>
          ) : (
            <RevealClient spec={spec} />
          )}
        </div>
      )}

      <p className="mt-8 text-center text-xs text-inkSoft">
        Simulação local · sem Instagram conectado.{" "}
        <Link href="/" className="text-gold-deep hover:underline">voltar ao site</Link>
      </p>
    </div>
  );
}

/* ----------------------------- subcomponentes ----------------------------- */

function Stepper({ step }: { step: Step }) {
  const steps: { k: Step; label: string }[] = [
    { k: "import", label: "Importar" },
    { k: "config", label: "Regras" },
    { k: "result", label: "Resultado" },
  ];
  const idx = steps.findIndex((s) => s.k === step);
  return (
    <div className="mb-8 flex items-center justify-center gap-3">
      {steps.map((s, i) => (
        <div key={s.k} className="flex items-center gap-3">
          <div className={`flex items-center gap-2 ${i <= idx ? "text-gold-deep" : "text-inkSoft"}`}>
            <span className={`grid h-7 w-7 place-items-center rounded-full border text-xs ${i <= idx ? "border-gold bg-gold/10" : "border-ink/15"}`}>
              {i + 1}
            </span>
            <span className="hidden text-sm sm:inline">{s.label}</span>
          </div>
          {i < steps.length - 1 && <span className={`h-px w-8 ${i < idx ? "bg-gold" : "bg-ink/15"}`} />}
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

function SceneBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl border px-3 py-2.5 text-sm transition ${
        active ? "border-gold bg-gold/10 text-gold-deep" : "border-ink/10 text-inkSoft hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
