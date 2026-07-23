import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 📇 CAPTURA DE CONTATO (foundation de LTV/remarketing).
 *
 * Hoje temos 0 emails de 134 clientes pagos — ou seja, nao conseguimos chamar
 * NINGUEM de volta. E o publico e lojinha que REPETE sorteio (mensal/sazonal).
 * Este endpoint guarda o email na tela de resultado, em troca do certificado +
 * video (troca natural — a pessoa ja quer isso). O email vai pro Payment da
 * venda: serve pra (1) remarketing/trazer de volta, (2) alimentar o match de
 * Enhanced Conversions do Google Ads.
 *
 * Nao muda o fluxo de pagamento nem o paywall — roda so DEPOIS da venda.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { certCode?: string; email?: string; consent?: boolean };
  const email = body.email?.trim().toLowerCase();
  const certCode = body.certCode?.trim().toUpperCase();

  // validacao simples de email — sem lib, so o basico
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 160) {
    return NextResponse.json({ ok: false, error: "email invalido" }, { status: 400 });
  }
  if (!certCode) return NextResponse.json({ ok: false, error: "sem certificado" }, { status: 400 });

  try {
    // certCode → Draw → giveawayId → Payment(s) da venda
    const draw = await db.draw.findUnique({ where: { certificateCode: certCode }, select: { giveawayId: true } });
    if (draw?.giveawayId) {
      // grava o email na(s) venda(s) daquele giveaway que ainda nao tem email
      await db.payment.updateMany({
        where: { giveawayId: draw.giveawayId, email: null },
        data: { email },
      });
    }
    // mesmo sem giveaway ligado, nao falha pro cliente — a captura e best-effort
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // nunca quebra a tela de resultado
  }
}
