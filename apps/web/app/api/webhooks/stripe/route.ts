import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook do Stripe — rede de segurança da receita.
 *
 * Mesmo que o cliente pague e feche o navegador antes de sortear, o pagamento
 * fica REGISTRADO (status paid). Quando ele voltar e sortear, o /api/draw faz
 * upsert pelo mesmo externalId (idempotente) e vincula ao sorteio.
 *
 * Configurar no Stripe: Developers → Webhooks → Add endpoint
 *   URL: https://azurasort.com/api/webhooks/stripe
 *   Eventos: payment_intent.succeeded
 *   Copiar o "Signing secret" → env STRIPE_WEBHOOK_SECRET no Vercel.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) {
    return NextResponse.json({ error: "webhook não configurado" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const raw = await req.text(); // corpo CRU é obrigatório p/ validar a assinatura
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("[webhook/stripe] assinatura inválida:", e);
    return NextResponse.json({ error: "assinatura inválida" }, { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      await db.payment.upsert({
        where: { externalId: pi.id },
        create: {
          provider: "stripe",
          externalId: pi.id,
          amount: pi.amount ?? 0,
          currency: (pi.currency ?? "brl").toUpperCase(),
          plan: (pi.metadata?.plan as string) ?? "premium",
          status: "paid",
          paidAt: new Date(),
        },
        update: { status: "paid", paidAt: new Date() },
      });
    }
  } catch (e) {
    console.error("[webhook/stripe] erro ao processar:", e);
    // 200 mesmo assim evita o Stripe ficar reenviando indefinidamente por erro nosso de DB
  }

  return NextResponse.json({ received: true });
}
