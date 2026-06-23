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

/** Verifica no Stripe se um PaymentIntent foi realmente pago. */
export async function verifyStripePayment(
  paymentIntentId: string
): Promise<{ paid: boolean; amount: number; currency: string }> {
  const pi = await getStripe().paymentIntents.retrieve(paymentIntentId);
  return { paid: pi.status === "succeeded", amount: pi.amount ?? 0, currency: (pi.currency ?? "brl").toUpperCase() };
}
