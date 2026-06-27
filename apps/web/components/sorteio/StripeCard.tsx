"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { formatPrice, type Currency } from "@/lib/payments/pricing";

const stripePromise = loadStripe((process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "").trim());

/** Modal de pagamento por cartão (Stripe Payment Element — sem sair da página). */
export function StripeCard({
  onSuccess,
  onClose,
  plan = "premium",
  priceLabel = "R$ 34,90",
  currency = "BRL",
  count = 0,
  test = false,
}: {
  onSuccess: (externalId: string) => void;
  onClose: () => void;
  plan?: string;
  priceLabel?: string;
  currency?: string;
  count?: number;
  test?: boolean;
}) {
  const t = useTranslations("sim.card");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  // no modo teste (?teste=1) cobra só 1,00 na moeda local — ver /api/pay/stripe/intent
  const label = test ? `${formatPrice(100, (currency as Currency) || "BRL")} (teste)` : priceLabel;

  useEffect(() => {
    fetch("/api/pay/stripe/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, currency, count, test }),
    })
      .then((r) => r.json())
      .then((d) => (d.clientSecret ? setClientSecret(d.clientSecret) : setErr(d.error || t("failStart"))))
      .catch((e) => setErr(String(e)));
  }, [plan, currency, count, test, t]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-ink/5 bg-surface p-6 shadow-lift">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">{t("title")}</h3>
          <button onClick={onClose} className="text-inkSoft hover:text-ink">✕</button>
        </div>

        {err && <p className="rounded-lg bg-rose/10 px-3 py-2 text-sm text-rose">{err}</p>}

        {!clientSecret && !err && (
          <div className="flex items-center justify-center py-10">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/15 border-t-gold" />
          </div>
        )}

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe", variables: { colorPrimary: "#C2922E" } } }}>
            <CardForm onSuccess={onSuccess} priceLabel={label} />
          </Elements>
        )}

        <p className="mt-4 text-center text-[11px] text-inkSoft">
          {t("secure")}
        </p>
      </div>
    </div>
  );
}

function CardForm({ onSuccess, priceLabel }: { onSuccess: (externalId: string) => void; priceLabel: string }) {
  const t = useTranslations("sim.card");
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function pay() {
    if (!stripe || !elements) return;
    setBusy(true);
    setMsg("");
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: "if_required",
    });
    if (error) {
      setMsg(error.message ?? t("failProcess"));
      setBusy(false);
      return;
    }
    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
      return;
    }
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <PaymentElement />
      {msg && <p className="text-sm text-rose">{msg}</p>}
      <button onClick={pay} disabled={busy || !stripe} className="btn-gold w-full py-3 disabled:opacity-50">
        {busy ? t("processing") : t("pay", { price: priceLabel })}
      </button>
    </div>
  );
}
