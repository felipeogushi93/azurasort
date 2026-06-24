import { NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";
import { priceForCount, currencyForCountry, countryFromRequest, stripeCurrency, type PlanId, type Currency } from "@/lib/payments/pricing";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`pay-stripe:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde." }, { status: 429 });
  }
  try {
    const body = (await req.json().catch(() => ({}))) as { plan?: PlanId; currency?: Currency; count?: number };
    const plan: PlanId = body.plan === "padrao" || body.plan === "vip" ? body.plan : "premium";

    // moeda da localização escolhida (validada); fallback pelo país do visitante
    const currency: Currency =
      body.currency === "BRL" || body.currency === "EUR" || body.currency === "USD"
        ? body.currency
        : currencyForCountry(countryFromRequest(req));
    // preço pela FAIXA de participantes (nº vindo da prévia)
    const amount = priceForCount(currency, plan, Number(body.count) || 0);

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
