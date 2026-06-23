"use client";

import { useState } from "react";
import { StripeCard } from "./StripeCard";
import { WooviPix } from "./WooviPix";
import { track } from "@/lib/track";

type PlanId = "padrao" | "premium" | "vip";

const PRICE_LABEL: Record<PlanId, string> = {
  padrao: "R$ 19,90",
  premium: "R$ 34,90",
  vip: "R$ 59,90",
};

const PLANS: {
  id: PlanId;
  name: string;
  price: string;
  old?: string;
  badge?: string;
  features: string[];
}[] = [
  {
    id: "padrao",
    name: "Padrão",
    price: "R$ 19,90",
    features: ["Todos os comentários", "Múltiplos ganhadores", "Animação básica", "Certificado verificável"],
  },
  {
    id: "premium",
    name: "Premium Cinematográfico",
    price: "R$ 34,90",
    old: "R$ 44,90",
    badge: "Mais escolhido",
    features: [
      "Tudo do Padrão",
      "Revelações cinematográficas (Cofre, Contagem…)",
      "Contagem + suspense + som",
      "Cortes 9:16 · 16:9 · 1:1",
      "Até 5 cenas",
    ],
  },
  {
    id: "vip",
    name: "Premium VIP",
    price: "R$ 59,90",
    badge: "Luxo",
    features: [
      "Tudo do Premium",
      "Transmissão ao vivo + cortes da live",
      "Vídeo salvo em alta qualidade",
      "10 cenas exclusivas",
      "Suporte prioritário",
    ],
  },
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
}: {
  count: number;
  campaign: string;
  sample: { handle: string; text: string }[];
  onUnlock: (payment?: { provider: string; externalId: string; plan?: string }) => void;
  allowTest?: boolean;
}) {
  const [soon, setSoon] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showPix, setShowPix] = useState(false);
  const [plan, setPlan] = useState<PlanId>("premium");
  const priceLabel = PRICE_LABEL[plan];
  const ping = () => {
    setSoon(true);
    setTimeout(() => setSoon(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* amostra de participantes */}
      <div className="rounded-3xl border border-ink/5 bg-surface p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium uppercase tracking-widest text-gold-deep">Amostra de quem participou</p>
          <span className="text-xs text-inkSoft">5 / {count.toLocaleString("pt-BR")}</span>
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
          🔒 + {Math.max(0, count - 5).toLocaleString("pt-BR")} outros liberados ao desbloquear
        </p>
      </div>

      {/* desbloqueie + preview premium */}
      <div className="text-center">
        <h3 className="font-display text-3xl font-semibold text-ink">Desbloqueie este sorteio</h3>
        <p className="mt-1 text-sm text-inkSoft">Post com {count.toLocaleString("pt-BR")} comentários</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-void shadow-gold">
        <span className="absolute left-4 top-4 z-10 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-void">
          ★ Preview Premium
        </span>
        <video
          src="/contagem.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="mx-auto block max-h-[340px] w-full object-contain"
        />
        <span className="absolute bottom-4 right-4 z-10 rounded-md bg-black/50 px-2 py-1 text-[11px] text-white backdrop-blur">
          Cinematográfico
        </span>
      </div>

      {/* planos (selecionáveis) */}
      <div className="grid gap-3 md:grid-cols-3">
        {PLANS.map((p) => {
          const sel = plan === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPlan(p.id)}
              className={`relative rounded-2xl border-2 p-5 text-left transition ${
                sel ? "border-gold bg-gradient-to-br from-gold/10 to-surface shadow-gold" : "border-ink/10 bg-surface hover:border-gold/40"
              }`}
            >
              {p.badge && (
                <span className="absolute right-3 top-3 rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold uppercase text-void">
                  {p.badge}
                </span>
              )}
              <p className="font-bold text-ink">{p.name}</p>
              <p className="mt-1">
                {p.old && <span className="mr-1 text-xs text-inkSoft line-through">{p.old}</span>}
                <span className="font-display text-2xl font-bold text-ink">{p.price}</span>
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-inkSoft">
                {p.features.map((f) => (
                  <li key={f}>✓ {f}</li>
                ))}
              </ul>
              <span className={`mt-3 block text-xs font-semibold ${sel ? "text-gold-deep" : "text-inkSoft/0"}`}>
                {sel ? "● Selecionado" : "selecionar"}
              </span>
            </button>
          );
        })}
      </div>

      {/* pagamento (visual — em breve) */}
      <div>
        <div className="grid gap-3 sm:grid-cols-3">
          <PayCard icon="⚡" title="PIX" sub="Sem taxas · Instantâneo" price={priceLabel} cta="Gerar PIX" accent onClick={() => { track("pay_started", { method: "pix", plan }); setShowPix(true); }} />
          <PayCard icon="💳" title="Cartão" sub="Crédito · Google/Apple Pay" price={priceLabel} cta="Pagar com Cartão" onClick={() => { track("pay_started", { method: "card", plan }); setShowCard(true); }} />
          <PayCard icon="🅿️" title="PayPal" sub="Conta ou cartão" price={priceLabel} cta="Pagar com PayPal" onClick={ping} />
        </div>
        {soon && (
          <p className="mt-3 text-center text-sm text-gold-deep">
            💳 Pagamento em integração — use o modo teste abaixo por enquanto.
          </p>
        )}
        <p className="mt-3 text-center text-xs text-inkSoft">
          Pagamento único. Liberação instantânea. Garantia de reembolso se falhar.
        </p>
      </div>

      {/* MODO TESTE — só com ?teste=1 na URL (não aparece pro público) */}
      {allowTest && (
        <div className="rounded-2xl border border-dashed border-ink/20 bg-canvasAlt/60 p-4 text-center">
          <p className="text-xs text-inkSoft">Modo de validação (interno)</p>
          <button onClick={() => onUnlock()} className="btn-ghost mt-2">
            🔓 Liberar em modo teste (grátis)
          </button>
        </div>
      )}

      {showCard && (
        <StripeCard
          plan={plan}
          priceLabel={priceLabel}
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
