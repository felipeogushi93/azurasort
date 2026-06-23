import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Cliente Stripe (servidor). Lê a chave secreta do ambiente. */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY ausente (configure em .env.local / Vercel)");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

/** Preços em centavos (BRL). Multi-moeda/geo-pricing entra depois. */
export const PRICES_BRL = {
  padrao: 1990,
  premium: 3490,
  vip: 5990,
} as const;

export const PRICE_LABELS: Record<keyof typeof PRICES_BRL, string> = {
  padrao: "R$ 19,90",
  premium: "R$ 34,90",
  vip: "R$ 59,90",
};

export type PlanId = keyof typeof PRICES_BRL;
