"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { StripeCard } from "./StripeCard";
import { WooviPix } from "./WooviPix";
import { track } from "@/lib/track";
import { priceLabels, formatPrice, cardPriceForCount, priceForCount, type Currency, type PlanId } from "@/lib/payments/pricing";

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
  // sem live, QUALQUER plano pode pagar (Padrão sempre disponível → usa a animação
  // Contagem). Só a live força VIP. sceneTier fica pra decidir a nota abaixo.
  const RANK: Record<PlanId, number> = { padrao: 0, premium: 1, vip: 2 };
  const minTier: PlanId = live ? "vip" : "padrao";
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
  // Padrão só inclui a Contagem: se a pessoa escolheu uma cena premium mas seleciona
  // Padrão, o PREVIEW troca pra Contagem — assim ela VÊ o que vai receber (sem surpresa).
  const showingPadraoScene = plan === "padrao" && sceneTier !== "padrao";
  const previewSrc = showingPadraoScene ? "/contagem.mp4" : sceneSrc;
  const previewName = showingPadraoScene ? t("scenes.countdownName") : sceneName;

  // 📱 BARRA FIXA NO CELULAR. Os 3 planos so viram colunas em 768px (md), entao no
  // celular eles EMPILHAM e o primeiro botao de pagar fica a ~1.600px do topo:
  // 2,5 telas de rolagem so pra descobrir que existe um botao. A maior parte do
  // trafego e anuncio no celular. A barra some quando os botoes reais aparecem,
  // pra nao duplicar CTA na mesma tela.
  const blocoPagarRef = useRef<HTMLDivElement>(null);
  const [pagarNaTela, setPagarNaTela] = useState(true);
  useEffect(() => {
    const el = blocoPagarRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver((es) => es.forEach((e) => setPagarNaTela(e.isIntersecting)), {
      rootMargin: "-80px 0px 0px 0px",
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    // pb extra no celular enquanto a barra fixa esta visivel, senao ela tampa o
    // ultimo bloco (a saida do /gratis).
    <div className={`space-y-6 ${!pagarNaTela ? "pb-24 sm:pb-0" : ""}`}>
      {allowTest && (
        <div className="rounded-2xl border border-dashed border-emerald/40 bg-emerald/5 px-4 py-2.5 text-center text-sm font-medium text-emerald">
          🧪 MODO TESTE ativo — o pagamento com <strong>cartão</strong> cobra só <strong>{formatPrice(100, currency)}</strong>
        </div>
      )}
      {/* amostra de participantes.
          ⚠️ So renderiza se TIVER amostra. Quando a coleta do Instagram estoura o
          tempo, o `sample` vem vazio e isso desenhava a moldura com o titulo
          "Amostra de quem participou" e NADA embaixo — uma caixa branca no topo
          do paywall, bem antes de pedir dinheiro. Justamente a unica prova de que
          a ferramenta leu o post da pessoa aparecendo em branco. Melhor sumir. */}
      {sample.length > 0 && (
      <div className="rounded-3xl border border-ink/5 bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium uppercase tracking-widest text-gold-deep">{t("paywall.sampleTitle")}</p>
          <span className="text-xs text-inkSoft">5 / {count > 0 ? count.toLocaleString() : t("s3.all")}</span>
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
        {count > 5 && (
          <p className="mt-3 text-center text-xs text-inkSoft">
            {t("paywall.unlockMore", { n: (count - 5).toLocaleString() })}
          </p>
        )}
      </div>
      )}

      {/* desbloqueie + preview da cena escolhida */}
      <div className="text-center">
        <h3 className="font-display text-3xl font-semibold text-ink">{t("paywall.unlockTitle")}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm font-medium text-ink/80">🎬 {t("paywall.videoHeroSub")}</p>
        <p className="mt-1 text-xs text-inkSoft">{t("paywall.postWith", { count: count > 0 ? count.toLocaleString() : t("s3.all") })}</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-void shadow-gold">
        <span className="absolute left-4 top-4 z-10 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-void">
          {t("paywall.yourScene", { scene: previewName })}
        </span>
        {/* ⚠️ NAO reintroduzir key={previewSrc}: isso REMONTAVA o elemento a cada
            troca de plano (Padrao <-> Premium muda a cena), refazendo o download
            do zero — e a cena do Padrao e contagem.mp4, o maior arquivo (5,66 MB).
            Trocando so o src, o browser reaproveita o que ja tem em cache. */}
        <video
          src={previewSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
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

      {/* 🎬 UPSELL POR DELTA — so aparece pra quem escolheu o Padrao.
          Enquadra a diferenca ("+R$15 e vira video"), nao o total ("R$34,90 vs
          R$19,90"): o cliente compara R$15 contra um video, e nao um preco contra
          outro. ~74% das vendas sao Padrao, entao essa e a alavanca de ticket que
          nao exige uma visita a mais. Nada e tirado do Padrao — e so um atalho. */}
      {plan === "padrao" && planAllowed("premium") && !live && (
        <button
          onClick={() => { track("upsell_click", { from: "padrao", to: "premium" }); setPlan("premium"); }}
          className="-mt-2 w-full rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/10 to-surface px-4 py-3 text-center text-sm font-semibold text-ink transition hover:border-gold"
        >
          {t("paywall.upsellPadrao", {
            delta: formatPrice(
              priceForCount(currency, "premium", count) - priceForCount(currency, "padrao", count),
              currency,
            ),
          })}
        </button>
      )}

      {live ? (
        <p className="-mt-2 text-center text-xs text-inkSoft">{t("paywall.liveNeedsVip")}</p>
      ) : showingPadraoScene ? (
        <p className="-mt-2 rounded-xl border border-gold/40 bg-gold/10 px-3 py-2 text-center text-xs font-semibold text-gold-deep">
          ⚠️ {t("paywall.padraoScene")}
        </p>
      ) : null}

      {/* faixa de confiança — reduz o atrito na hora de pagar */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 rounded-2xl border border-emerald/20 bg-emerald/5 px-4 py-3 text-xs font-medium text-ink/80">
        <span className="inline-flex items-center gap-1.5">🔒 {t("paywall.trust1")}</span>
        <span className="inline-flex items-center gap-1.5">📜 {t("paywall.trust2")}</span>
        <span className="inline-flex items-center gap-1.5">⚡ {t("paywall.trust3")}</span>
        <span className="inline-flex items-center gap-1.5">💳 {t("paywall.trust4")}</span>
      </div>

      {/* pagamento */}
      <div ref={blocoPagarRef}>
        <div className={`grid gap-3 ${isBrazil ? "sm:grid-cols-2" : "mx-auto max-w-xs"}`}>
          {isBrazil && (
            <PayCard icon="⚡" title="PIX" sub={t("paywall.pixSub")} price={priceLabel} cta={t("paywall.pixCta")} accent onClick={() => { track("pay_started", { method: "pix", plan }); setShowPix(true); }} />
          )}
          <PayCard icon="💳" title={t("paywall.cardCta")} sub={t("paywall.cardSub")} price={allowTest ? `${formatPrice(100, currency)} (teste)` : cardLabel} cta={t("paywall.cardCta")} onClick={() => { track("pay_started", { method: "card", plan }); setShowCard(true); }} />
        </div>
        {/* 💚 Reversao de risco ANTES do clique, nao depois. Era um texto cinza pequeno
            embaixo dos cartoes — ou seja, so era lido por quem JA tinha decidido pagar.
            No funil, o vazamento esta entre ver o preco e iniciar o pagamento (~21%
            seguem), entao a promessa de reembolso precisa estar no ponto da decisao. */}
        <p className="mt-3 text-center text-xs font-semibold text-emerald">
          {t("paywall.guarantee")}
        </p>

        {/* 🆓 SAIDA, nao concorrente. Discreto e por ultimo, DEPOIS dos botoes de
            pagar: quem ia pagar ja pagou antes de chegar aqui. Quem nao ia,
            antes simplesmente sumia do site — agora desce um degrau e vira
            usuario conhecido, que pode voltar. O /gratis nao coleta comentario
            nem gera video, entao nao canibaliza o produto pago. */}
        <p className="mt-4 text-center text-xs text-inkSoft">
          <Link href="/gratis" className="underline underline-offset-2 hover:text-ink">
            {t("paywall.freeExit")}
          </Link>
        </p>
      </div>

      {/* 📱 barra fixa (só celular) — leva pros botões sem exigir 2,5 telas de rolagem */}
      {!pagarNaTela && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-surface/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur sm:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] uppercase tracking-wider text-inkSoft">{t(`plans.${PLAN_META.find((p) => p.id === plan)!.nameKey}`)}</p>
              <p className="font-display text-lg font-bold leading-tight text-ink">{priceLabel}</p>
            </div>
            <button
              onClick={() => blocoPagarRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
              className="shrink-0 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-void shadow-gold"
            >
              {t("paywall.stickyCta")}
            </button>
          </div>
        </div>
      )}

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
