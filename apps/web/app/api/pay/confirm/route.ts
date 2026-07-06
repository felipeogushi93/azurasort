import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyStripePayment } from "@/lib/payments/stripe";
import { getWooviStatus } from "@/lib/payments/woovi";
import { priceForCount, type Currency, type PlanId } from "@/lib/payments/pricing";
import { notifyTelegram, paymentMessage } from "@/lib/notify/telegram";
import { shortcodeFromUrl } from "@/lib/providers/apify";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Confirma o pagamento no MOMENTO do pagamento (chamado pelo cliente em handlePaid).
 * Verifica no servidor, registra o Payment (importante p/ PIX, que não tem webhook)
 * e notifica o grupo de VENDAS — assim toda venda aparece mesmo se o cliente não
 * sortear na hora (F5). Idempotente: só notifica na primeira vez.
 */
export async function POST(req: Request) {
  if (!rateLimit(`pay-confirm:${clientIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  try {
    const body = (await req.json().catch(() => ({}))) as {
      provider?: string;
      externalId?: string;
      plan?: string;
      currency?: string;
      count?: number;
      campaign?: string;
      postUrl?: string;
    };
    const provider = body.provider;
    const externalId = body.externalId;
    if (!provider || !externalId) return NextResponse.json({ ok: false }, { status: 400 });

    // verifica de verdade no gateway
    let paid = false;
    let amount = 0;
    let currency = (body.currency || "BRL").toUpperCase();
    if (provider === "stripe") {
      const v = await verifyStripePayment(externalId);
      paid = v.paid;
      amount = v.amount;
      currency = v.currency;
    } else if (provider === "woovi") {
      const v = await getWooviStatus(externalId);
      paid = v.paid;
      amount = v.amount;
      currency = "BRL";
    } else {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    if (!paid) return NextResponse.json({ ok: true, paid: false });

    const planId: PlanId = (["padrao", "premium", "vip"].includes(body.plan ?? "") ? body.plan : "premium") as PlanId;
    const cur: Currency = currency === "EUR" || currency === "USD" ? currency : "BRL";
    // Woovi (PIX) às vezes não devolve o valor → calcula pela faixa (mesmo cálculo da cobrança)
    if (!amount) amount = priceForCount(cur, planId, Number(body.count) || 0);

    // já registrado como pago? (evita notificar 2x em re-chamadas / re-roll)
    const existing = await db.payment.findUnique({ where: { externalId }, select: { status: true } });
    const alreadyPaid = existing?.status === "paid";

    // Link do post → cria/acha o Giveaway JÁ no pagamento. Assim a venda E o link
    // aparecem no painel na hora, sem depender de a pessoa rodar o sorteio.
    // (mesmo padrão do /api/draw; se ela sortear depois, reusa este giveaway)
    let giveawayId: string | undefined;
    const shortcode = body.postUrl ? shortcodeFromUrl(body.postUrl) : null;
    if (shortcode && body.postUrl) {
      let gv = await db.giveaway.findFirst({ where: { shortcode } });
      if (!gv) {
        gv = await db.giveaway
          .create({ data: { postUrl: body.postUrl, shortcode, campaign: body.campaign?.trim() || "Sorteio", totalComments: Number(body.count) || 0 } })
          .catch(() => null);
      }
      giveawayId = gv?.id;
    }

    await db.payment
      .upsert({
        where: { externalId },
        create: { provider, externalId, amount, currency: cur, plan: planId, status: "paid", paidAt: new Date(), ...(giveawayId ? { giveawayId } : {}) },
        update: { status: "paid", ...(giveawayId ? { giveawayId } : {}) },
      })
      .catch(() => {});

    if (!alreadyPaid) {
      await notifyTelegram(paymentMessage({ provider, plan: planId, amountCents: amount, currency: cur, campaign: body.campaign })).catch(() => {});
    }

    return NextResponse.json({ ok: true, paid: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
