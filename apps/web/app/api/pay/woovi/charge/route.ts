import { NextResponse } from "next/server";
import { createWooviCharge } from "@/lib/payments/woovi";
import { priceForCount, type PlanId } from "@/lib/payments/pricing";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`pay-woovi:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde." }, { status: 429 });
  }
  try {
    const body = (await req.json().catch(() => ({}))) as { plan?: PlanId; count?: number };
    const plan: PlanId = body.plan === "padrao" || body.plan === "vip" ? body.plan : "premium";
    // PIX é exclusivo do Brasil → sempre em BRL; preço pela faixa de participantes
    const charge = await createWooviCharge(priceForCount("BRL", plan, Number(body.count) || 0), `AzuraSort sorteio ${plan}`);
    return NextResponse.json(charge);
  } catch (e) {
    console.error("[/api/pay/woovi/charge] erro:", e);
    return NextResponse.json({ error: "Não foi possível gerar o PIX. Tente novamente." }, { status: 502 });
  }
}
