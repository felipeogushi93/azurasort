import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizeComments, applyFilters } from "@/lib/draw/engine";
import { fetchComments, shortcodeFromUrl } from "@/lib/providers/apify";
import { drawFromHandles, generateSeed, makeCertificateCode } from "@/lib/draw/server";
import { verifyStripePayment } from "@/lib/payments/stripe";
import { getWooviStatus } from "@/lib/payments/woovi";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { notifyTelegram, saleMessage } from "@/lib/notify/telegram";
import type { DrawFilters, RawComment } from "@/lib/draw/types";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!rateLimit(`draw:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ error: "Muitas requisições. Aguarde." }, { status: 429 });
  }
  try {
    const body = (await req.json()) as {
      postUrl?: string;
      comments?: RawComment[];
      campaign?: string;
      module?: string;
      filters?: Partial<DrawFilters>;
      totalComments?: number;
      plan?: string;
      payment?: { provider: string; externalId: string };
      sessionId?: string;
    };

    // GATE: pagamento confirmado no SERVIDOR (antes de coletar — economia)
    let paid = false;
    let paidAmount = 0;
    let paidCurrency = "BRL";
    if (body.payment?.externalId) {
      if (body.payment.provider === "stripe") {
        const v = await verifyStripePayment(body.payment.externalId);
        paid = v.paid;
        paidAmount = v.amount;
        paidCurrency = v.currency;
      } else if (body.payment.provider === "woovi") {
        const v = await getWooviStatus(body.payment.externalId);
        paid = v.paid;
        paidCurrency = "BRL"; // PIX é sempre BRL
      }
    }
    if (!paid && process.env.ALLOW_FREE_DRAWS !== "1") {
      return NextResponse.json({ error: "Pagamento necessário para sortear." }, { status: 402 });
    }

    const f: DrawFilters = {
      mustHaveHashtags: [],
      minMentions: 0,
      blockDuplicateUsers: false, // cada comentário conta como uma entrada (participantes = comentários)
      excludeHandles: [],
      winnersCount: 1,
      backupsCount: 0,
      ...(body.filters ?? {}),
    };

    // 1. giveaway + anti-abuso + runIndex (antes de coletar, p/ permitir re-roll sem custo)
    const shortcode = body.postUrl ? shortcodeFromUrl(body.postUrl) : null;
    let giveaway = shortcode ? await db.giveaway.findFirst({ where: { shortcode } }) : null;

    // ANTI-ABUSO: um pagamento vale para UM sorteio. Re-rolls do MESMO post são permitidos;
    // reutilizar o mesmo pagamento em OUTRO post é bloqueado.
    if (paid && body.payment) {
      const prevPay = await db.payment.findUnique({ where: { externalId: body.payment.externalId } });
      if (prevPay?.giveawayId && prevPay.giveawayId !== giveaway?.id) {
        return NextResponse.json({ error: "Este pagamento já foi usado em outro sorteio." }, { status: 409 });
      }
    }

    if (!giveaway) {
      giveaway = await db.giveaway.create({
        data: { postUrl: body.postUrl ?? "manual", shortcode, campaign: body.campaign ?? "Sorteio", totalComments: body.totalComments ?? 0 },
      });
    }
    const runIndex = await db.draw.count({ where: { giveawayId: giveaway.id } });

    // 2. obter participantes — ECONOMIA: re-roll (mesmo post) reusa a base do sorteio
    //    anterior, SEM nova coleta no Apify. Primeiro sorteio coleta de verdade.
    let eligibleHandles: string[];
    let totalForCert: number;
    const prevDraw =
      shortcode && runIndex > 0
        ? await db.draw.findFirst({ where: { giveawayId: giveaway.id }, orderBy: { createdAt: "desc" } })
        : null;
    // ⬇️ RESCUE manual (feature isolada): se o admin colou comentários para este post,
    // usa esse pool no lugar do Apify. Remover este bloco desliga o resgate sem afetar o resto.
    const manualPool =
      shortcode && !prevDraw ? await db.manualPool.findUnique({ where: { shortcode } }) : null;
    // ⬆️ RESCUE manual

    if (prevDraw && Array.isArray(prevDraw.participants) && (prevDraw.participants as string[]).length) {
      eligibleHandles = prevDraw.participants as string[]; // re-roll: mesma base
      totalForCert = prevDraw.totalCount;
    } else if (manualPool && Array.isArray(manualPool.handles) && (manualPool.handles as unknown[]).length) {
      // RESCUE manual: pool colado pelo admin (owner já removido na injeção)
      const raw = manualPool.handles as unknown as RawComment[];
      const processed = applyFilters(normalizeComments(raw), f);
      eligibleHandles = processed.filter((c) => c.eligible).map((c) => c.handle);
      totalForCert = manualPool.totalReal > 0 ? manualPool.totalReal : raw.length;
    } else {
      let raw: RawComment[];
      if (Array.isArray(body.comments) && body.comments.length) {
        raw = body.comments; // caminho de teste/CSV (lista do cliente)
      } else if (body.postUrl) {
        raw = await fetchComments(body.postUrl); // coleta real (1ª vez)
      } else {
        return NextResponse.json({ error: "Informe um link ou uma lista de comentários." }, { status: 400 });
      }
      const processed = applyFilters(normalizeComments(raw), f);
      eligibleHandles = processed.filter((c) => c.eligible).map((c) => c.handle);
      totalForCert = body.totalComments && body.totalComments > 0 ? body.totalComments : raw.length;
    }
    if (!eligibleHandles.length) {
      return NextResponse.json({ error: "Nenhum participante elegível." }, { status: 400 });
    }

    // 3. ganhador forçado (admin)
    let forcedHandle: string | null = null;
    if (runIndex < 3) {
      const forced = await db.forcedWinner.findUnique({
        where: { giveawayId_runIndex: { giveawayId: giveaway.id, runIndex } },
      });
      if (forced && !forced.usedAt && eligibleHandles.includes(forced.handle)) forcedHandle = forced.handle;
    }

    // 3. sorteio commit-reveal
    const { seed, hash } = generateSeed();
    const { winners, participants, rigged } = drawFromHandles(eligibleHandles, seed, f.winnersCount, f.backupsCount, forcedHandle);

    // 4. persistir
    const certificateCode = makeCertificateCode();
    await db.draw.create({
      data: {
        giveawayId: giveaway.id,
        module: body.module ?? "bank_vault",
        seedHash: hash,
        seed,
        // total de comentários = número da prévia (1º sorteio) ou o mesmo do re-roll
        totalCount: totalForCert,
        eligibleCount: eligibleHandles.length,
        certificateCode,
        rigged,
        participants,
        winners: { create: winners.map((w) => ({ position: w.position, handle: w.handle, isBackup: w.isBackup })) },
      },
    });
    if (forcedHandle) {
      await db.forcedWinner.update({
        where: { giveawayId_runIndex: { giveawayId: giveaway.id, runIndex } },
        data: { usedAt: new Date() },
      });
    }
    // IMPORTANTE: AGUARDAR estes (registro de venda + Telegram + evento) antes de responder.
    // Em serverless, sem await a função encerra e mata os envios (Telegram não chegava).
    const tasks: Promise<unknown>[] = [];
    if (paid && body.payment) {
      tasks.push(
        db.payment
          .upsert({
            where: { externalId: body.payment.externalId },
            create: {
              provider: body.payment.provider,
              externalId: body.payment.externalId,
              amount: paidAmount,
              currency: paidCurrency,
              plan: body.plan ?? "premium",
              status: "paid",
              giveawayId: giveaway.id,
              paidAt: new Date(),
            },
            update: { status: "paid", currency: paidCurrency, giveawayId: giveaway.id, paidAt: new Date() },
          })
          .catch(() => {})
      );

      // notificação de venda no Telegram (AGUARDADA — garante entrega)
      tasks.push(
        notifyTelegram(
          saleMessage({
            provider: body.payment.provider,
            plan: body.plan ?? "premium",
            amountCents: paidAmount,
            currency: paidCurrency,
            campaign: giveaway.campaign,
            winners: winners.filter((w) => !w.isBackup).map((w) => w.handle),
            eligibleCount: eligibleHandles.length,
            certificateCode,
          })
        )
      );
    }
    tasks.push(db.event.create({ data: { type: "draw_done", sessionId: typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : null, meta: { giveawayId: giveaway.id, eligible: eligibleHandles.length } } }).catch(() => {}));
    await Promise.allSettled(tasks);

    return NextResponse.json({
      winners,
      certificateCode,
      seedHash: hash,
      eligibleCount: eligibleHandles.length,
      totalCount: totalForCert,
    });
  } catch (e) {
    // loga o erro real no servidor; devolve mensagem amigável (sem vazar interno) que tranquiliza
    console.error("[/api/draw] erro:", e);
    return NextResponse.json(
      { error: "Não foi possível concluir o sorteio agora. Seu pagamento está salvo — toque em “Sortear agora” para tentar de novo." },
      { status: 502 }
    );
  }
}
