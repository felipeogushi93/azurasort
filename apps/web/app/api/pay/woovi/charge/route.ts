import { NextResponse } from "next/server";
import { createWooviCharge } from "@/lib/payments/woovi";
import { PRICES, type PlanId } from "@/lib/payments/pricing";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`pay-woovi:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde." }, { status: 429 });
  }
  try {
    const body = (await req.json().catch(() => ({}))) as { plan?: PlanId };
    const plan: PlanId = body.plan === "padrao" || body.plan === "vip" ? body.plan : "premium";
    // PIX é exclusivo do Brasil → sempre em BRL
    const charge = await createWooviCharge(PRICES.BRL[plan], `AzuraSort sorteio ${plan}`);
    return NextResponse.json(charge);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Falha ao gerar PIX" }, { status: 502 });
  }
}
