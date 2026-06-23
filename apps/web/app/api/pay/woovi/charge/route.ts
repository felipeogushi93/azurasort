import { NextResponse } from "next/server";
import { createWooviCharge } from "@/lib/payments/woovi";
import { PRICES_BRL, type PlanId } from "@/lib/payments/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { plan?: PlanId };
    const plan: PlanId = body.plan === "padrao" ? "padrao" : "premium";
    const charge = await createWooviCharge(PRICES_BRL[plan], `AzuraSort sorteio ${plan}`);
    return NextResponse.json(charge);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Falha ao gerar PIX" }, { status: 502 });
  }
}
