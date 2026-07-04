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
    const body = (await req.json().catch(() => ({}))) as { plan?: PlanId; currency?: Currency; count?: number; test?: boolean; adminKey?: string };
    const plan: PlanId = body.plan === "padrao" || body.plan === "vip" ? body.plan : "premium";

    // moeda da localização escolhida (validada); fallback pelo país do visitante
    const currency: Currency =
      body.currency === "BRL" || body.currency === "EUR" || body.currency === "USD"
        ? body.currency
        : currencyForCountry(countryFromRequest(req));
    // preço do CARTÃO = base + taxa do Stripe embutida (PIX fica no base).
    // 🔒 TESTE R$1: só vale com a chave admin (AZURA_ADMIN_BYPASS_KEY). Antes o
    // ?teste=1 sozinho dava R$1 pra QUALQUER cliente → agora sem a chave cobra o
    // valor real. O PI de teste é marcado (metadata.test="1") p/ o /api/draw liberar.
    const secret = process.env.AZURA_ADMIN_BYPASS_KEY?.trim();
    const testOk = body.test === true && !!secret && body.adminKey === secret;
    const amount = testOk ? 100 : cardPriceForCount(currency, plan, Number(body.count) || 0);

    const intent = await getStripe().paymentIntents.create({
      amount,
      currency: stripeCurrency(currency),
      automatic_payment_methods: { enabled: true },
      metadata: { product: "azurasort-sorteio", plan, currency, test: testOk ? "1" : "0" },
    });

    return NextResponse.json({ clientSecret: intent.client_secret, amount, plan, currency });
  } catch (e) {
    console.error("[/api/pay/stripe/intent] erro:", e);
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, { status: 502 });
  }
}
