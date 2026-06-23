import { NextResponse } from "next/server";
import { getStripe, PRICES_BRL, type PlanId } from "@/lib/payments/stripe";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`pay-stripe:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde." }, { status: 429 });
  }
  try {
    const body = (await req.json().catch(() => ({}))) as { plan?: PlanId };
    const plan: PlanId = body.plan === "padrao" || body.plan === "vip" ? body.plan : "premium";
    const amount = PRICES_BRL[plan];

    const intent = await getStripe().paymentIntents.create({
      amount,
      currency: "brl",
      automatic_payment_methods: { enabled: true },
      metadata: { product: "azurasort-sorteio", plan },
    });

    return NextResponse.json({ clientSecret: intent.client_secret, amount, plan });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Falha no pagamento" }, { status: 502 });
  }
}
