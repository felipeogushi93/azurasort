"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { StripeCard } from "./StripeCard";
import { WooviPix } from "./WooviPix";
import { track } from "@/lib/track";
import { priceLabels, formatPrice, cardPriceForCount, type Currency, type PlanId } from "@/lib/payments/pricing";

// estrutura dos planos; nomes/recursos vêm das traduções (sim.plans.*)
const PLAN_META: { id: PlanId; nameKey: string; badgeKey?: string; featureKeys: string[] }[] = [
  { id: "padrao", nameKey: "padraoName", featureKeys: ["padraoF1", "padraoF2", "padraoF3", "padraoF4"] },
  { id: "premium", nameKey: "premiumName", badgeKey: "badgeMostChosen", featureKeys: ["premiumF1", "premiumF2", "premiumF3", "premiumF4", "premiumF5"] },
  { id: "vip", nameKey: "vipName", badgeKey: "badgeLuxury", featureKeys: ["vipF1", "vipF2", "vipF3", "vipF4", "vipF5"] },
];

/**
 * Paywall / Chooser (modelo SorteiGram) na paleta light premium do AzuraSort.
 *
 * Mostra amostra dos participantes, o preview premium (vídeo da contagem) e os
 * planos. O PAGAMENTO ainda não está integrado — os botões são visuais ("em breve").
 * O botão de MODO TESTE libera o sorteio de graça (para validação pré-lançamento;
 * deve ser fechado/gated antes de divulgar).
 */
export function Paywall({
  count,
  campaign,
  sample,
  onUnlock,
  allowTest = false,
  currency = "BRL",
  sceneName = "Cofre",
  sceneSrc = "/cofre.mp4",
  sceneTier = "premium",
  live = false,
}: {
  count: number;
  campaign: string;
  sample: { handle: string; text: string }[];
  onUnlock: (payment?: { provider: string; externalId: string; plan?: string }) => void;
  allowTest?: boolean;
  currency?: Currency;
  sceneName?: string;
  sceneSrc?: string;
  sceneTier?: PlanId;
  live?: boolean;
}) {
  const t = useTranslations("sim");
  const [showCard, setShowCard] = useState(false);
  const [showPix, setShowPix] = useState(false);
  // plano mínimo exigido: a animação escolhida define o piso; live força VIP.
  const RANK: Record<PlanId, number> = { padrao: 0, premium: 1, vip: 2 };
  const minTier: PlanId = live ? "vip" : sceneTier;
  const planAllowed = (id: PlanId) => RANK[id] >= RANK[minTier];
  const [plan, setPlan] = useState<PlanId>(planAllowed("premium") ? "premium" : minTier);
  // se a cena/live exigem um plano maior que o selecionado, sobe automaticamente.
  useEffect(() => {
    if (RANK[plan] < RANK[minTier]) setPlan(minTier);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minTier]);
  const labels = priceLabels(currency, count); // preço pela FAIXA de participantes
  const priceLabel = labels[plan]; // base (PIX)
  const cardLabel = formatPrice(cardPriceForCount(currency, plan, count), currency); // cartão (com taxa)
  const isBrazil = currency === "BRL"; // PIX só no Brasil

  return (
    <div className="space-y-6">
      {allowTest && (
        <div className="rounded-2xl border border-dashed border-emerald/40 bg-emerald/5 px-4 py-2.5 text-center text-sm font-medium text-emerald">
          🧪 MODO TESTE ativo — o pagamento com <strong>cartão</strong> cobra só <strong>{formatPrice(100, currency)}</strong>
        </div>
      )}
      {/* amostra de participantes */}
      <div className="rounded-3xl border border-ink/5 bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium uppercase tracking-widest text-gold-deep">{t("paywall.sampleTitle")}</p>
          <span className="text-xs text-inkSoft">5 / {count.toLocaleString()}</span>
        </div>
        <div className="space-y-2">
          {sample.slice(0, 5).map((c, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-canvasAlt px-3 py-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet to-rose text-sm font-semibold text-white">
                {c.handle.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">@{c.handle}</p>
                <p className="truncate text-xs text-inkSoft">{c.text || "—"}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-inkSoft">
          {t("paywall.unlockMore", { n: Math.max(0, count - 5).toLocaleString() })}
        </p>
      </div>

      {/* desbloqueie + preview da cena escolhida */}
      <div className="text-center">
        <h3 className="font-display text-3xl font-semibold text-ink">{t("paywall.unlockTitle")}</h3>
        <p className="mt-1 text-sm text-inkSoft">{t("paywall.postWith", { count: count.toLocaleString() })}</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-void shadow-gold">
        <span className="absolute left-4 top-4 z-10 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-void">
          {t("paywall.yourScene", { scene: sceneName })}
        </span>
        <video
          key={sceneSrc}
          src={sceneSrc}
          autoPlay
          muted
          loop
          playsInline
          className="mx-auto block max-h-[340px] w-full object-contain"
        />
        <span className="absolute bottom-4 right-4 z-10 flex gap-1.5">
          {live && <span className="rounded-md bg-red-600 px-2 py-1 text-[11px] font-bold text-white">{t("paywall.live")}</span>}
          <span className="rounded-md bg-black/50 px-2 py-1 text-[11px] text-white backdrop-blur">{t("paywall.cinematic")}</span>
        </span>
      </div>

      {/* planos (selecionáveis) */}
      <div className="grid gap-3 md:grid-cols-3">
        {PLAN_META.map((p) => {
          const sel = plan === p.id;
          const locked = !planAllowed(p.id);
          return (
            <button
              key={p.id}
              onClick={() => !locked && setPlan(p.id)}
              disabled={locked}
              className={`relative rounded-2xl border-2 p-5 text-left transition ${
                locked
                  ? "cursor-not-allowed border-ink/10 bg-surface opacity-50"
                  : sel
                    ? "border-gold bg-gradient-to-br from-gold/10 to-surface shadow-gold"
                    : "border-ink/10 bg-surface hover:border-gold/40"
              }`}
            >
              {p.badgeKey && (
                <span className="absolute right-3 top-3 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold uppercase text-void">
                  {t(`paywall.${p.badgeKey}`)}
                </span>
              )}
              <p className="font-bold text-ink">{t(`plans.${p.nameKey}`)}</p>
              <p className="mt-1">
                <span className="font-display text-2xl font-bold text-ink">{labels[p.id]}</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-inkSoft">
                {p.featureKeys.map((f) => (
                  <li key={f}>✓ {t(`plans.${f}`)}</li>
                ))}
              </ul>
              <span className={`mt-3 block text-xs font-semibold ${locked ? "text-inkSoft" : sel ? "text-gold-deep" : "text-inkSoft/0"}`}>
                {locked ? `🔒 ${t("paywall.planLocked")}` : sel ? t("paywall.selected") : t("paywall.select")}
              </span>
            </button>
          );
        })}
      </div>

      {minTier !== "padrao" && (
        <p className="-mt-2 text-center text-xs text-inkSoft">
          {live
            ? t("paywall.liveNeedsVip")
            : t("paywall.sceneNeedsPlan", { scene: sceneName, plan: t(`plans.${minTier}Name`) })}
        </p>
      )}

      {/* pagamento */}
      <div>
        <div className={`grid gap-3 ${isBrazil ? "sm:grid-cols-2" : "mx-auto max-w-xs"}`}>
          {isBrazil && (
            <PayCard icon="⚡" title="PIX" sub={t("paywall.pixSub")} price={priceLabel} cta={t("paywall.pixCta")} accent onClick={() => { track("pay_started", { method: "pix", plan }); setShowPix(true); }} />
          )}
          <PayCard icon="💳" title={t("paywall.cardCta")} sub={t("paywall.cardSub")} price={allowTest ? `${formatPrice(100, currency)} (teste)` : cardLabel} cta={t("paywall.cardCta")} onClick={() => { track("pay_started", { method: "card", plan }); setShowCard(true); }} />
        </div>
        <p className="mt-3 text-center text-xs text-inkSoft">
          {t("paywall.guarantee")}
        </p>
      </div>

      {/* MODO TESTE — só com ?teste=1 na URL (não aparece pro público) */}
      {allowTest && (
        <div className="rounded-2xl border border-dashed border-ink/20 bg-canvasAlt/60 p-4 text-center">
          <p className="text-xs text-inkSoft">{t("paywall.testMode")}</p>
          <button onClick={() => onUnlock()} className="btn-ghost mt-2">
            {t("paywall.testUnlock")}
          </button>
        </div>
      )}

      {showCard && (
        <StripeCard
          plan={plan}
          priceLabel={cardLabel}
          currency={currency}
          count={count}
          test={allowTest}
          onSuccess={(externalId) => {
            setShowCard(false);
            onUnlock({ provider: "stripe", externalId, plan });
          }}
          onClose={() => setShowCard(false)}
        />
      )}

      {showPix && (
        <WooviPix
          plan={plan}
          priceLabel={priceLabel}
          count={count}
          onSuccess={(externalId) => {
            setShowPix(false);
            onUnlock({ provider: "woovi", externalId, plan });
          }}
          onClose={() => setShowPix(false)}
        />
      )}
    </div>
  );
}

function PayCard({
  icon,
  title,
  sub,
  price,
  cta,
  accent,
  onClick,
}: {
  icon: string;
  title: string;
  sub: string;
  price: string;
  cta: string;
  accent?: boolean;
  onClick: () => void;
}) {
  return (
    <div className={`rounded-2xl border p-4 text-center ${accent ? "border-emerald/40 bg-emerald/5" : "border-ink/10 bg-surface"} shadow-soft`}>
      <div className="text-2xl">{icon}</div>
      <p className="mt-1 font-semibold text-ink">{title}</p>
      <p className="text-[11px] text-inkSoft">{sub}</p>
      <p className="mt-2 font-display text-xl font-bold text-ink">{price}</p>
      <button
        onClick={onClick}
        className={`mt-3 w-full rounded-full py-2.5 text-sm font-semibold transition hover:-translate-y-0.5 ${
          accent ? "bg-emerald text-white" : "bg-ink/90 text-white"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
