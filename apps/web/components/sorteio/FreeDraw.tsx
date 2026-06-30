"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { parsePastedComments } from "@/lib/draw/parse";
import { track } from "@/lib/track";

type Winner = { position: number; handle: string; isBackup: boolean };

/**
 * Sorteio GRÁTIS — 100% manual (cola os @/comentários), sem coleta (Apify) e sem
 * pagamento. Resultado simples + certificado verificável. Upsell pro sorteio
 * completo (vídeo cinematográfico + ao vivo). Isolado: não toca no fluxo pago.
 */
export function FreeDraw() {
  const t = useTranslations("free");
  const [raw, setRaw] = useState("");
  const [winnersCount, setWinnersCount] = useState(1);
  const [campaign, setCampaign] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState<{ winners: Winner[]; certificateCode: string; eligibleCount: number } | null>(null);

  useEffect(() => {
    track("visit");
  }, []);

  async function run() {
    const comments = parsePastedComments(raw);
    if (comments.length < 1) {
      setErr(t("empty"));
      return;
    }
    setBusy(true);
    setErr("");
    setResult(null);
    try {
      const res = await fetch("/api/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comments,
          free: true,
          campaign: campaign.trim() || "Sorteio grátis",
          totalComments: comments.length,
          filters: { winnersCount: Math.max(1, winnersCount) },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || "Erro");
        return;
      }
      setResult({ winners: data.winners ?? [], certificateCode: data.certificateCode, eligibleCount: data.eligibleCount });
    } catch {
      setErr("Erro de rede. Tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  const mainWinners = result?.winners.filter((w) => !w.isBackup) ?? [];
  const backups = result?.winners.filter((w) => w.isBackup) ?? [];

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{t("title")}</h1>
      <p className="mt-2 text-base text-inkSoft">{t("subtitle")}</p>

      {!result && (
        <div className="mt-8 rounded-3xl border border-ink/5 bg-surface p-6 shadow-card">
          <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">{t("pasteLabel")}</label>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={8}
            placeholder={"@maria\n@joao\n@ana"}
            className="inp w-full resize-y font-mono text-sm"
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">{t("winners")}</label>
              <input type="number" min={1} value={winnersCount} onChange={(e) => setWinnersCount(Math.max(1, +e.target.value))} className="inp w-full" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-widest text-inkSoft">{t("campaign")}</label>
              <input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder={t("campaignPh")} className="inp w-full" />
            </div>
          </div>
          {err && <p className="mt-3 rounded-lg bg-rose/10 px-3 py-2 text-sm text-rose">{err}</p>}
          <button onClick={run} disabled={busy} className="btn-gold mt-5 w-full py-3.5 text-base disabled:opacity-50">
            {busy ? t("running") : t("run")}
          </button>
          <p className="mt-3 text-center text-[11px] text-inkSoft">{t("manualNote")}</p>
        </div>
      )}

      {result && (
        <div className="mt-8">
          <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 to-surface p-8 text-center shadow-gold">
            <p className="text-sm font-medium uppercase tracking-widest text-gold-deep">🎉 {t("resultTitle")}</p>
            <div className="mt-3 space-y-1">
              {mainWinners.map((w) => (
                <p key={w.position} className="font-display text-3xl font-black text-ink">@{w.handle}</p>
              ))}
            </div>
            {backups.length > 0 && (
              <p className="mt-3 text-sm text-inkSoft">{t("backups")}: {backups.map((w) => `@${w.handle}`).join(", ")}</p>
            )}
            <p className="mt-2 text-xs text-inkSoft">{t("amongN", { n: result.eligibleCount.toLocaleString() })}</p>
            {result.certificateCode && (
              <Link href={`/verify/${result.certificateCode}`} className="mt-3 inline-block text-sm text-violet hover:underline">
                🔒 {t("cert")}
              </Link>
            )}
          </div>

          <button onClick={() => { setResult(null); setRaw(""); }} className="btn-ghost mt-4 w-full">
            {t("again")}
          </button>

          {/* UPSELL pro sorteio completo */}
          <div className="mt-6 rounded-3xl border border-violet/20 bg-violet/5 p-6 text-center">
            <p className="font-display text-xl font-semibold text-ink">{t("upsellTitle")}</p>
            <p className="mt-2 text-sm text-inkSoft">{t("upsellText")}</p>
            <Link href="/sorteio" className="btn-gold mt-4 inline-block px-8 py-3 text-base">
              {t("upsellCta")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
