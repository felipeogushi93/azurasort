import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyStripePayment } from "@/lib/payments/stripe";
import { getWooviStatus } from "@/lib/payments/woovi";
import { priceForCount, type Currency, type PlanId } from "@/lib/payments/pricing";
import { notifyTelegram, paymentMessage } from "@/lib/notify/telegram";
import { shortcodeFromUrl } from "@/lib/providers/apify";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { uploadOfflineConversion } from "@/lib/googleAds/uploadConversion";

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
      gclid?: string;
      email?: string;
      phone?: string;
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

    const gclid = body.gclid?.trim() || null;
    const email = body.email?.trim().toLowerCase() || null;
    const phone = body.phone?.trim() || null;
    const paidAt = new Date();

    // Salvar o pagamento é CRÍTICO (é a venda). NUNCA engolir a falha em silêncio:
    // 1) tenta o registro completo; 2) se falhar, grava só o essencial (a venda não
    // pode se perder por um campo extra); 3) se nem isso, ALERTA no Telegram.
    let saved = false;
    try {
      await db.payment.upsert({
        where: { externalId },
        create: { provider, externalId, amount, currency: cur, plan: planId, status: "paid", paidAt, gclid, email, phone, ...(giveawayId ? { giveawayId } : {}) },
        update: { status: "paid", ...(gclid ? { gclid } : {}), ...(email ? { email } : {}), ...(phone ? { phone } : {}), ...(giveawayId ? { giveawayId } : {}) },
      });
      saved = true;
    } catch {
      try {
        // fallback: só o núcleo da venda (sem gclid/email/phone) — dinheiro não some
        await db.payment.upsert({
          where: { externalId },
          create: { provider, externalId, amount, currency: cur, plan: planId, status: "paid", paidAt, ...(giveawayId ? { giveawayId } : {}) },
          update: { status: "paid", ...(giveawayId ? { giveawayId } : {}) },
        });
        saved = true;
        // await: o alerta é o ÚNICO aviso de que algo deu errado — promessa solta morria
        await notifyTelegram(`⚠️ Pagamento salvo em MODO DE SEGURANÇA (campos extras falharam — confira deploy/schema).\n${externalId} · ${provider} · ${(amount / 100).toFixed(2)} ${cur}`).catch(() => {});
      } catch (e2) {
        await notifyTelegram(`🚨🚨 FALHA AO SALVAR PAGAMENTO — VENDA EM RISCO!\n${externalId} · ${provider} · ${(amount / 100).toFixed(2)} ${cur} · ${planId}\nErro: ${e2 instanceof Error ? e2.message.slice(0, 160) : "?"}`).catch(() => {});
      }
    }
    void saved;

    if (!alreadyPaid) {
      await notifyTelegram(paymentMessage({ provider, plan: planId, amountCents: amount, currency: cur, campaign: body.campaign })).catch(() => {});
    }

    // Google Ads offline conversion — só se ainda não foi enviado (dedup).
    // ⚠️ AWAIT obrigatório: em serverless a promessa solta é MORTA quando a resposta
    // retorna (mesmo bug que matava o tracking). O upload faz 2 chamadas de rede
    // (OAuth + Google Ads), então nunca completava. Confirm é chamado por sendBeacon
    // → o cliente não espera a resposta, logo awaitar aqui não atrasa ninguém.
    if (!alreadyPaid && (gclid || email || phone)) {
      try {
        const ok = await uploadOfflineConversion({
          gclid, email, phone,
          amountBRL: amount / 100,
          externalId,
          paidAt,
        });
        if (ok) {
          await db.payment.update({ where: { externalId }, data: { conversionUploaded: true } }).catch(() => {});
        }
      } catch {
        /* nunca derruba o pagamento */
      }
    }

    return NextResponse.json({ ok: true, paid: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
