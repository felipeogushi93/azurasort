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

      // Painel-IA central: notificar conversão pra atribuir lead à origem (AI/Google/etc).
      // Fire-and-forget — falha do painel não derruba o webhook do Stripe.
      // URL migrada 2026-07-03: painel-ia rodava em Vercel (painel-ia-ten.vercel.app),
      // agora no VPS (painel-ia.sorteigram.app). Vercel antigo retornava 500.
      void fetch("https://painel-ia.sorteigram.app/api/webhook/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant: "azurasort",
          gateway: "stripe",
          external_id: pi.id,
          order_id: pi.id,
          amount_cents: pi.amount ?? 0,
          currency: (pi.currency ?? "brl").toUpperCase(),
          plan: (pi.metadata?.plan as string) ?? "premium",
          item_slug: (pi.metadata?.plan as string) ?? "premium",
          session_id: (pi.metadata?.session_id as string) ?? null,
          visitor_id: (pi.metadata?.visitor_id as string) ?? null,
          utm_source: (pi.metadata?.utm_source as string) ?? null,
          utm_medium: (pi.metadata?.utm_medium as string) ?? null,
          utm_campaign: (pi.metadata?.utm_campaign as string) ?? null,
          gclid: (pi.metadata?.gclid as string) ?? null,
          fbclid: (pi.metadata?.fbclid as string) ?? null,
          status: "paid",
        }),
        signal: AbortSignal.timeout(3000),
      }).catch(() => { /* swallow */ });
    }
  } catch (e) {
    console.error("[webhook/stripe] erro ao processar:", e);
    // 200 mesmo assim evita o Stripe ficar reenviando indefinidamente por erro nosso de DB
  }

  return NextResponse.json({ received: true });
}
