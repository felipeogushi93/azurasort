import { NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";
import { cardPriceForCount, currencyForCountry, countryFromRequest, stripeCurrency, type PlanId, type Currency } from "@/lib/payments/pricing";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`pay-stripe:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde." }, { status: 429 });
  }
  try {
    const body = (await req.json().catch(() => ({}))) as { plan?: PlanId; currency?: Currency; count?: number; test?: boolean };
    const plan: PlanId = body.plan === "padrao" || body.plan === "vip" ? body.plan : "premium";

    // moeda da localização escolhida (validada); fallback pelo país do visitante
    const currency: Currency =
      body.currency === "BRL" || body.currency === "EUR" || body.currency === "USD"
        ? body.currency
        : currencyForCountry(countryFromRequest(req));
    // preço do CARTÃO = base + taxa do Stripe embutida (PIX fica no base).
    // ⚠️ TESTE: com ?teste=1 cobra só 1,00 (100 centavos) — usado p/ validar o fluxo
    // pago em produção sem gastar. Remover quando o teste acabar.
    const amount = body.test === true ? 100 : cardPriceForCount(currency, plan, Number(body.count) || 0);

    const intent = await getStripe().paymentIntents.create({
      amount,
      currency: stripeCurrency(currency),
      automatic_payment_methods: { enabled: true },
      metadata: { product: "azurasort-sorteio", plan, currency },
    });

    return NextResponse.json({ clientSecret: intent.client_secret, amount, plan, currency });
  } catch (e) {
    console.error("[/api/pay/stripe/intent] erro:", e);
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, { status: 502 });
  }
}
