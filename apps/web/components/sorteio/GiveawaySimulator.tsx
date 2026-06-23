"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { RevealModule, RevealSpec } from "@prizegram/reveal-spec";
import { RevealClient } from "@/components/reveal/RevealClient";
import { VideoReveal } from "@/components/reveal/VideoReveal";
import { CofreReveal } from "@/components/reveal/CofreReveal";
import { LiveStage } from "./LiveStage";
import { Paywall } from "./Paywall";
import { normalizeComments, applyFilters } from "@/lib/draw/engine";
import { generateMockComments } from "@/lib/draw/mock";
import { parsePastedComments } from "@/lib/draw/parse";
import { buildRevealSpecFromDraw } from "@/lib/draw/toRevealSpec";
import { track } from "@/lib/track";
import type { Currency } from "@/lib/payments/pricing";
import { DEFAULT_FILTERS, type Comment, type DrawFilters, type DrawResult } from "@/lib/draw/types";

type Step = "link" | "base" | "scene" | "unlock" | "result";
type Base = "comments" | "likes";
type PreviewState = {
  status: "loading" | "loadingComments" | "loaded" | "error";
  imageUrl?: string;
  username?: string;
  isReel: boolean;
  isVideo?: boolean;
  total: number;
  loaded: number;
  likesCount?: number;
  caption?: string;
  error?: string;
};

const IG_URL_RE = /instagram\.com\/(p|reel|reels|tv)\//i;

// Cenas disponíveis (com vídeo de exemplo). Para adicionar uma nova no futuro,
// basta colocar o vídeo em /public e acrescentar um item aqui.
type SceneOption = { module: RevealModule; key: "cofre" | "countdown"; src: string };
const SCENE_OPTIONS: SceneOption[] = [
  { module: "bank_vault", key: "cofre", src: "/cofre.mp4" },
  { module: "countdown", key: "countdown", src: "/contagem.mp4" },
];

export function GiveawaySimulator({ currency = "BRL" }: { currency?: Currency }) {
  const t = useTranslations("sim");
  const [step, setStep] = useState<Step>("link");

  // passo 1 — publicacao
  const [campaign, setCampaign] = useState("");
  const [link, setLink] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [raw, setRaw] = useState("");
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [sample, setSample] = useState<{ handle: string; text: string }[]>([]);
  const [certCode, setCertCode] = useState<string | null>(null);
  const [lastPayment, setLastPayment] = useState<{ provider: string; externalId: string; plan?: string } | undefined>(undefined);

  // passo 2 — base
  const [base, setBase] = useState<Base>("comments");

  // passo 3 — animacao
  const [module, setModule] = useState<RevealModule>("bank_vault");
  const [live, setLive] = useState(false);
  const [filters, setFilters] = useState<DrawFilters>(DEFAULT_FILTERS);
  const [hashtagInput, setHashtagInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");

  // resultado
  const [result, setResult] = useState<DrawResult | null>(null);
  const [spec, setSpec] = useState<RevealSpec | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [liveStarted, setLiveStarted] = useState(false); // na live: vira true quando dá START
  const [liveActive, setLiveActive] = useState(false); // live só vale no VIP (ou modo teste)
  const [busy, setBusy] = useState(false);
  // modo teste só aparece com ?teste=1 na URL (não fica aberto ao público)
  const [allowTest, setAllowTest] = useState(false);
  useEffect(() => {
    setAllowTest(new URLSearchParams(window.location.search).get("teste") === "1");
    track("visit");
  }, []);

  // funil: registra quando o cliente chega no paywall (uma vez por entrada no passo)
  useEffect(() => {
    if (step === "unlock") track("unlock_view");
  }, [step]);

  /* ----- passo 1: ao colar o link, busca a publicacao e carrega os comentarios
     (modo demonstracao — quando o backend existir, troca por coleta real) ----- */
  useEffect(() => {
    if (!IG_URL_RE.test(link)) {
      setPreview(null);
      return;
    }
    let cancelled = false;
    let progress: ReturnType<typeof setInterval> | undefined;

    const debounce = setTimeout(async () => {
      setPreview({ status: "loading", total: 0, loaded: 0, isReel: /\/reels?\//i.test(link) });
      try {
        // prévia barata: imagem + contagem + amostra (a coleta completa só roda no sorteio pago)
        const pr = await fetch(`/api/instagram/preview?url=${encodeURIComponent(link)}`);
        const p = await pr.json();
        if (cancelled) return;
        if (!pr.ok || p.error) {
          setPreview({ status: "error", total: 0, loaded: 0, isReel: false, error: p.error || "Falha ao buscar a publicação" });
          return;
        }
        setSample((p.sampleComments ?? []).map((c: { handle: string; text: string }) => ({ handle: c.handle, text: c.text })));
        const total: number = p.commentsCount ?? 0;
        setPreview({
          status: "loadingComments",
          imageUrl: p.imageUrl,
          username: p.username,
          isReel: p.isReel,
          isVideo: p.isVideo,
          total,
          loaded: 0,
          likesCount: p.likesCount,
          caption: p.caption,
        });

        // barra de "preparando" (cosmética — não gasta Apify; a coleta real é no sorteio)
        let cur = 0;
        progress = setInterval(() => {
          cur += Math.max(1, Math.ceil((total || 100) / 30));
          if (cur >= total) {
            cur = total;
            if (progress) clearInterval(progress);
            if (!cancelled) {
              setPreview((s) => (s ? { ...s, status: "loaded", loaded: total } : s));
              track("link_loaded", { total });
            }
          } else if (!cancelled) {
            setPreview((s) => (s ? { ...s, loaded: cur } : s));
          }
        }, 60);
      } catch (e) {
        if (!cancelled) setPreview({ status: "error", total: 0, loaded: 0, isReel: false, error: e instanceof Error ? e.message : "Erro de rede" });
      }
    }, 700);

    return () => {
      cancelled = true;
      clearTimeout(debounce);
      if (progress) clearInterval(progress);
    };
  }, [link]);

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
  // exibido ao cliente = total de comentários do post (esconde a filtragem interna)
  const displayCount = preview?.total ?? comments.length;

  /* ----- sorteio ----- */
  async function doDraw(payment?: { provider: string; externalId: string; plan?: string }) {
    const pay = payment ?? lastPayment;
    if (payment) {
      setLastPayment(payment);
      track("pay_done", { provider: payment.provider, plan: payment.plan });
    }
    // live só ativa no plano VIP (ou em modo teste, quando não há pagamento)
    setLiveActive(live && (!pay || pay.plan === "vip"));
    setBusy(true);
    try {
      const res = await fetch("/api/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postUrl: link || undefined,
          comments: comments.length ? comments.map((c) => ({ handle: c.handle, text: c.text })) : undefined,
          campaign: campaign.trim() || undefined,
          module,
          filters: liveFilters,
          totalComments: displayCount,
          plan: pay?.plan ?? "premium",
          payment: pay ? { provider: pay.provider, externalId: pay.externalId } : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        alert(data.error || "Falha no sorteio. Tente novamente.");
        setBusy(false);
        return;
      }
      const r: DrawResult = {
        seed: "",
        algorithm: "sha256-commit-reveal-fisher-yates",
        totalCount: data.totalCount ?? 0,
        eligibleCount: data.eligibleCount ?? 0,
        winners: (data.winners ?? []).map((w: { position: number; handle: string; isBackup: boolean }) => ({
          position: w.position,
          isBackup: w.isBackup,
          handle: w.handle,
          text: "",
        })),
        certificateHash: data.certificateCode ?? "",
        drawnAtIso: "",
      };
      const s = buildRevealSpecFromDraw(r, { module, campaignName: campaign, locale: "pt-BR" });
      setResult(r);
      setSpec(s);
      setCertCode(data.certificateCode ?? null);
      setStep("result");
      setLiveStarted(false); // na live, primeiro a tela ao vivo; só dá START depois
      setShowReveal(true); // abre a revelacao automaticamente (suspense antes do vencedor)
    } catch (e) {
      alert(e instanceof Error ? e.message : "Falha no sorteio.");
    }
    setBusy(false);
  }
  async function redraw() {
    setShowReveal(false);
    setLiveStarted(false);
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
        <Card title={t("s1.title")} subtitle={t("s1.subtitle")}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* coluna esquerda: formulario */}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">{t("s1.nameLabel")}</label>
              <input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder={t("s1.namePlaceholder")} className="inp mb-5" />

              <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">{t("s1.linkLabel")}</label>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://instagram.com/p/..."
                className="inp"
              />

              <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-deep">{t("s1.howTitle")}</p>
                <ol className="space-y-1.5 text-sm text-ink/80">
                  <li className="flex gap-2"><span className="text-gold-deep">1.</span> {t("s1.how1")}</li>
                  <li className="flex gap-2"><span className="text-gold-deep">2.</span> {t("s1.how2")}</li>
                  <li className="flex gap-2"><span className="text-gold-deep">3.</span> {t("s1.how3")}</li>
                </ol>
              </div>

              <button onClick={() => setAdvancedOpen((v) => !v)} className="mt-4 text-xs text-inkSoft underline-offset-2 hover:text-ink hover:underline">
                {advancedOpen ? t("s1.advHide") : t("s1.advShow")}
              </button>
              {advancedOpen && (
                <div className="mt-3 space-y-3 rounded-xl border border-ink/5 bg-canvasAlt p-4">
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => { setComments(normalizeComments(generateMockComments(200, 13))); setPreview(null); }} className="btn-ghost py-2">{t("s1.test200")}</button>
                    <button onClick={() => { setComments(normalizeComments(generateMockComments(1000, 29))); setPreview(null); }} className="btn-ghost py-2">{t("s1.test1000")}</button>
                    <label className="btn-ghost cursor-pointer py-2">{t("s1.csv")}<input type="file" accept=".csv,.txt" onChange={onFile} className="hidden" /></label>
                  </div>
                  <textarea value={raw} onChange={(e) => setRaw(e.target.value)} onBlur={loadPasted} rows={4} placeholder={t("s1.pastePlaceholder")} className="inp font-mono text-xs" />
                  {comments.length > 0 && !preview && <p className="text-xs text-emerald">{t("s1.loadedManual", { n: comments.length.toLocaleString() })}</p>}
                </div>
              )}
            </div>

            {/* coluna direita: previa da publicacao */}
            <PostPreview preview={preview} hasManual={!preview && comments.length > 0} manualCount={comments.length} />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-ink/5 pt-5">
            <span className="text-[11px] text-inkSoft/70">{t("s1.footnote")}</span>
            <button
              disabled={!(preview?.status === "loaded" || comments.length > 0)}
              onClick={() => setStep("base")}
              className="btn-gold py-2.5 disabled:opacity-40"
            >
              {t("common.continue")}
            </button>
          </div>
        </Card>
      )}

      {/* ---------- 2 · BASE ---------- */}
      {step === "base" && (
        <Card title={t("s2.title")} subtitle={t("s2.subtitle")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <BaseCard active={base === "comments"} onClick={() => setBase("comments")} icon="💬" title={t("s2.commentsTitle")} desc={t("s2.commentsDesc")} />
            <BaseCard active={base === "likes"} onClick={() => setBase("likes")} icon="❤️" title={t("s2.likesTitle")} desc={t("s2.likesDesc")} />
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setStep("link")} className="text-sm text-inkSoft hover:text-ink">{t("common.back")}</button>
            <button onClick={() => setStep("scene")} className="btn-gold py-2.5">{t("common.continue")}</button>
          </div>
        </Card>
      )}

      {/* ---------- 3 · ANIMAÇÃO ---------- */}
      {step === "scene" && (
        <Card title={t("s3.title")} subtitle={t("s3.subtitle")}>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-inkSoft">
            {t("s3.chooseHint")}
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {SCENE_OPTIONS.map((s) => (
              <ScenePreviewCard
                key={s.module}
                scene={s}
                name={t(`scenes.${s.key}Name`)}
                desc={t(`scenes.${s.key}Desc`)}
                exampleLabel={t("s3.example")}
                active={module === s.module}
                onClick={() => setModule(s.module)}
              />
            ))}
          </div>

          {/* ao vivo */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-ink/5 bg-canvasAlt px-4 py-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-ink">
                🔴 {t("s3.liveTitle")}
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-deep">VIP</span>
              </p>
              <p className="text-xs text-inkSoft">{t("s3.liveDesc")} {t("s3.liveVip")}</p>
            </div>
            <button onClick={() => setLive((v) => !v)} className={`toggle ${live ? "toggle-on" : ""}`}><span className="dot" /></button>
          </div>

          {/* cortes de video */}
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-sm text-ink/80">
            🎬 {t("s3.cuts")}
          </div>

          {/* nº vencedores */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <Field label={t("s3.winners")}>
              <input type="number" min={1} value={filters.winnersCount} onChange={(e) => setFilters({ ...filters, winnersCount: Math.max(1, +e.target.value) })} className="inp" />
            </Field>
            <Field label={t("s3.backups")}>
              <input type="number" min={0} value={filters.backupsCount} onChange={(e) => setFilters({ ...filters, backupsCount: Math.max(0, +e.target.value) })} className="inp" />
            </Field>
          </div>

          {/* opcoes avancadas (filtros) */}
          <button onClick={() => setAdvancedOpen((v) => !v)} className="mt-4 text-xs text-inkSoft underline-offset-2 hover:text-ink hover:underline">
            {advancedOpen ? t("s3.advHide") : t("s3.advShow")}
          </button>
          {advancedOpen && (
            <div className="mt-3 grid gap-3 rounded-xl border border-ink/5 bg-canvasAlt p-4 sm:grid-cols-2">
              <Field label={t("s3.hashtagsLabel")}><input value={hashtagInput} onChange={(e) => setHashtagInput(e.target.value)} placeholder="#sorteio" className="inp" /></Field>
              <Field label={t("s3.excludeLabel")}><input value={excludeInput} onChange={(e) => setExcludeInput(e.target.value)} placeholder="@minhamarca" className="inp" /></Field>
              <Field label={t("s3.minMentions")}><input type="number" min={0} value={filters.minMentions} onChange={(e) => setFilters({ ...filters, minMentions: Math.max(0, +e.target.value) })} className="inp" /></Field>
              <Field label={t("s3.noDup")}>
                <button onClick={() => setFilters({ ...filters, blockDuplicateUsers: !filters.blockDuplicateUsers })} className={`toggle ${filters.blockDuplicateUsers ? "toggle-on" : ""}`}><span className="dot" /></button>
              </Field>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between rounded-xl border border-ink/5 bg-canvasAlt px-4 py-3">
            <span className="text-sm text-inkSoft">{t("s3.participants")}</span>
            <span className="font-display text-2xl font-semibold text-gold-deep">{displayCount.toLocaleString()}</span>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <button onClick={() => setStep("base")} className="text-sm text-inkSoft hover:text-ink">{t("common.back")}</button>
            <button disabled={!displayCount} onClick={() => setStep("unlock")} className="btn-gold py-2.5 disabled:opacity-40">
              {t("common.continue")}
            </button>
          </div>
        </Card>
      )}

      {/* ---------- 4 · DESBLOQUEAR (paywall) ---------- */}
      {step === "unlock" && (
        <div>
          <div className="mb-4">
            <button onClick={() => setStep("scene")} className="text-sm text-inkSoft hover:text-ink">{t("unlock.backToOptions")}</button>
          </div>
          <Paywall
            count={displayCount}
            campaign={campaign}
            allowTest={allowTest}
            sample={
              comments.length
                ? applyFilters(comments, liveFilters)
                    .filter((c) => c.eligible)
                    .slice(0, 5)
                    .map((c) => ({ handle: c.handle, text: c.text }))
                : sample
            }
            onUnlock={doDraw}
            currency={currency}
            sceneName={t(`scenes.${(SCENE_OPTIONS.find((s) => s.module === module) ?? SCENE_OPTIONS[0]).key}Name`)}
            sceneSrc={(SCENE_OPTIONS.find((s) => s.module === module) ?? SCENE_OPTIONS[0]).src}
            live={live}
          />
        </div>
      )}

      {/* ---------- 4 · RESULTADO ---------- */}
      {step === "result" && result && spec && (
        <Card title={t("result.title")} subtitle={t("result.subtitle")}>
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
                <span className="ml-auto text-[10px] uppercase tracking-widest text-inkSoft">{w.isBackup ? t("result.backup") : t("result.winner")}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Stat label={t("result.statParticipants")} value={(result.eligibleCount || displayCount).toLocaleString()} />
            <Stat label={t("result.statBase")} value={base === "comments" ? t("result.baseComments") : t("result.baseLikes")} />
            <Stat label={t("result.statLive")} value={liveActive ? t("result.yes") : t("result.no")} />
            <Stat label={t("result.statCert")} value={result.certificateHash.slice(0, 8) + "…"} mono />
          </div>

          {certCode && (
            <div className="mt-4 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-gold-deep">{t("result.certTitle")}</p>
              <p className="font-mono text-sm text-ink">{certCode}</p>
              <a href={`/verify/${certCode}`} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs font-semibold text-gold-deep underline-offset-2 hover:underline">
                {t("result.verifyPublic")}
              </a>
            </div>
          )}

          <div className="mt-5">
            <p className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-inkSoft">
              {t("result.cutsReady")}
              <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[9px] font-bold normal-case tracking-normal text-inkSoft">{t("result.cutsSoon")}</span>
            </p>
            <div className="flex gap-2">
              {["9:16", "16:9", "1:1"].map((f) => (
                <button key={f} disabled title={t("result.cutsSoon")} className="flex-1 cursor-not-allowed rounded-xl border border-ink/10 bg-surface py-2.5 text-sm text-inkSoft/50 shadow-soft">⬇ {f}</button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setShowReveal(true)} className="btn-gold py-2.5">{t("result.seeReveal")}</button>
            <button onClick={redraw} className="btn-ghost py-2.5">{t("result.redo")}</button>
            <button onClick={newGiveaway} className="btn-ghost py-2.5">{t("result.newDraw")}</button>
          </div>
        </Card>
      )}

      {/* ---------- OVERLAY: sorteando ---------- */}
      {busy && (
        <div className="fixed inset-0 z-[115] grid place-items-center bg-ink/40 backdrop-blur-sm">
          <div className="rounded-2xl bg-surface px-8 py-6 text-center shadow-lift">
            <span className="mx-auto block h-7 w-7 animate-spin rounded-full border-2 border-ink/15 border-t-gold" />
            <p className="mt-3 text-sm text-inkSoft">{t("busy")}</p>
          </div>
        </div>
      )}

      {/* ---------- REVEAL OVERLAY ---------- */}
      {showReveal && spec && liveActive && !liveStarted && (
        <div className="fixed inset-0 z-[100] bg-void">
          <LiveStage
            campaign={campaign}
            comments={comments.length ? comments.map((c) => ({ handle: c.handle, text: c.text })) : sample}
            labels={{ badge: t("live.badge"), camera: t("live.camera"), exit: t("live.exit"), ready: t("live.ready"), start: t("live.start"), noCam: t("live.noCam"), goLive: t("live.goLive"), goLiveHint: t("live.goLiveHint") }}
            onStart={() => setLiveStarted(true)}
            onClose={() => setShowReveal(false)}
          />
        </div>
      )}

      {showReveal && spec && (!liveActive || liveStarted) && (
        <div className="fixed inset-0 z-[100] bg-void">
          <div className="absolute right-5 top-5 z-[110] flex gap-2">
            {liveActive && (
              <button onClick={() => setLiveStarted(false)} className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur hover:border-gold">{t("reveal.backToLive")}</button>
            )}
            <button onClick={() => setShowReveal(false)} className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur hover:border-gold">{liveActive ? t("reveal.results") : t("reveal.seeResult")}</button>
          </div>
          {module === "bank_vault" ? (
            <CofreReveal
              handle={(spec.winners.find((w) => w.position === 1) ?? spec.winners[0]).handle}
              suspenseMs={live ? 900 : 2600}
              openingLabel={t("reveal.opening")}
              soundLabel={t("reveal.enableSound")}
            />
          ) : module === "countdown" ? (
            <CofreReveal
              handle={(spec.winners.find((w) => w.position === 1) ?? spec.winners[0]).handle}
              src="/contagem.mp4"
              revealAtSec={15.9}
              suspenseMs={0}
              playbackRate={1}
              showBand={false}
              textLeft={50}
              textTop={50}
              fontScale={0.04}
              openingLabel={t("reveal.opening")}
              soundLabel={t("reveal.enableSound")}
            />
          ) : module === "stage_host" ? (
            <div className="h-full w-full"><VideoReveal spec={spec} /></div>
          ) : (
            <RevealClient spec={spec} />
          )}
        </div>
      )}

    </div>
  );
}

/* ----------------------------- subcomponentes ----------------------------- */

function Stepper({ step }: { step: Step }) {
  const t = useTranslations("sim.steps");
  const steps: { k: Step; label: string }[] = [
    { k: "link", label: t("link") },
    { k: "base", label: t("base") },
    { k: "scene", label: t("scene") },
    { k: "unlock", label: t("unlock") },
    { k: "result", label: t("result") },
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

function ScenePreviewCard({ scene, name, desc, exampleLabel, active, onClick }: { scene: SceneOption; name: string; desc: string; exampleLabel: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group overflow-hidden rounded-2xl border text-left transition hover:-translate-y-0.5 ${
        active ? "border-gold bg-gold/5 shadow-gold" : "border-ink/10 bg-surface hover:border-gold/40 shadow-soft"
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-void">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video src={scene.src} autoPlay muted loop playsInline className="h-full w-full object-contain" />
        {active && (
          <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-gold text-xs font-bold text-void">✓</span>
        )}
        <span className="absolute bottom-2 left-2 rounded-md bg-black/45 px-2 py-0.5 text-[10px] text-white backdrop-blur">{exampleLabel}</span>
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-ink">{name}</p>
        <p className="text-xs text-inkSoft">{desc}</p>
      </div>
    </button>
  );
}

/** Previa da publicacao + carregamento dos comentarios (lado direito do passo 1). */
function PostPreview({ preview, hasManual, manualCount }: { preview: PreviewState | null; hasManual: boolean; manualCount: number }) {
  const t = useTranslations("sim.preview");
  // estado vazio
  if (!preview && !hasManual) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-canvasAlt/50 p-6 text-center">
        <span className="text-3xl opacity-40">🔗</span>
        <p className="mt-3 text-sm text-inkSoft">{t("empty")}</p>
      </div>
    );
  }

  // lista manual (CSV/teste)
  if (!preview && hasManual) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-emerald/20 bg-emerald/5 p-6 text-center">
        <span className="text-3xl">📄</span>
        <p className="mt-3 font-display text-lg font-semibold text-ink">{t("manualTitle")}</p>
        <p className="text-sm text-inkSoft">{t("manualLoaded", { n: manualCount.toLocaleString() })}</p>
      </div>
    );
  }
  if (!preview) return null;

  // buscando a publicacao
  if (preview.status === "loading") {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-ink/5 bg-surface p-6 text-center shadow-soft">
        <span className="h-7 w-7 animate-spin rounded-full border-2 border-ink/15 border-t-gold" />
        <p className="text-sm text-inkSoft">{t("loading")}</p>
      </div>
    );
  }

  // erro
  if (preview.status === "error") {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-2xl border border-rose/30 bg-rose/5 p-6 text-center">
        <span className="text-3xl">⚠️</span>
        <p className="text-sm font-medium text-ink">{t("errorTitle")}</p>
        <p className="text-xs text-inkSoft">{preview.error}</p>
        <p className="mt-1 text-[11px] text-inkSoft/70">{t("errorHint")}</p>
      </div>
    );
  }

  // carregada (post real)
  const loadingComments = preview.status === "loadingComments";
  const pct = preview.total ? Math.round((preview.loaded / preview.total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-ink/5 bg-surface p-3 shadow-card">
      <div className="overflow-hidden rounded-xl border border-ink/5">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet to-rose" />
          <span className="truncate text-sm font-medium text-ink">@{preview.username}</span>
          <span className="ml-auto rounded-full bg-ink/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-inkSoft">
            {preview.isReel ? t("reels") : t("post")}
          </span>
        </div>
        <div className="relative h-44 bg-gradient-to-br from-[#fce8c9] via-[#f3d7e2] to-[#dfe6ff]">
          {preview.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/api/instagram/image?url=${encodeURIComponent(preview.imageUrl)}`}
              alt="publicação"
              className="h-full w-full object-cover"
            />
          ) : null}
          {preview.isVideo && (
            <span className="absolute inset-0 grid place-items-center text-4xl text-white/90 drop-shadow">▶</span>
          )}
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-xs text-inkSoft">
          <span>❤️ {(preview.likesCount ?? 0).toLocaleString()}</span>
          <span>💬 {preview.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-3 px-1">
        {loadingComments ? (
          <>
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-inkSoft">
                <span className="h-2 w-2 animate-pulse rounded-full bg-gold" /> {t("loadingComments")}
              </span>
              <span className="font-mono text-ink">
                {preview.loaded.toLocaleString()} / {preview.total.toLocaleString()}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full bg-gradient-to-r from-gold to-violet transition-[width] duration-200" style={{ width: `${pct}%` }} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald/10 py-2 text-xs text-emerald">
            <span className="h-2 w-2 rounded-full bg-emerald" /> {t("commentsLoaded", { n: preview.total.toLocaleString() })}
          </div>
        )}
      </div>
    </div>
  );
}
