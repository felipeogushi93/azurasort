import Stripe from "stripe";

let _stripe: Stripe | null = null;

/** Cliente Stripe (servidor). Lê a chave secreta do ambiente. */
export function getStripe(): Stripe {
  if (!_stripe) {
    // .trim() blinda contra espaço/quebra de linha colado no valor da env (Vercel)
    const key = process.env.STRIPE_SECRET_KEY?.trim();
    if (!key) throw new Error("STRIPE_SECRET_KEY ausente (configure em .env.local / Vercel)");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

/** Verifica no Stripe se um PaymentIntent foi realmente pago.
 *  Retorna product/test do metadata pra amarrar o pagamento AO nosso produto
 *  (não aceitar um PI de outro fluxo) e reconhecer o modo teste autorizado. */
export async function verifyStripePayment(
  paymentIntentId: string
): Promise<{ paid: boolean; amount: number; currency: string; product?: string; test: boolean }> {
  const pi = await getStripe().paymentIntents.retrieve(paymentIntentId);
  return {
    paid: pi.status === "succeeded",
    amount: pi.amount ?? 0,
    currency: (pi.currency ?? "brl").toUpperCase(),
    product: (pi.metadata?.product as string) ?? undefined,
    test: pi.metadata?.test === "1",
  };
}
