import { NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe";
import { PRICES, currencyForCountry, countryFromRequest, stripeCurrency, type PlanId } from "@/lib/payments/pricing";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`pay-stripe:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde." }, { status: 429 });
  }
  try {
    const body = (await req.json().catch(() => ({}))) as { plan?: PlanId };
    const plan: PlanId = body.plan === "padrao" || body.plan === "vip" ? body.plan : "premium";

    // moeda decidida no SERVIDOR pelo país do visitante (não confia no cliente)
    const currency = currencyForCountry(countryFromRequest(req));
    const amount = PRICES[currency][plan];

    const intent = await getStripe().paymentIntents.create({
      amount,
      currency: stripeCurrency(currency),
      automatic_payment_methods: { enabled: true },
      metadata: { product: "azurasort-sorteio", plan, currency },
    });

    return NextResponse.json({ clientSecret: intent.client_secret, amount, plan, currency });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Falha no pagamento" }, { status: 502 });
  }
}
