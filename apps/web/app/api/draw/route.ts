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

    // 1. obter comentários — ECONOMIA: a coleta completa roda só aqui (pós-pagamento)
    let raw: RawComment[];
    if (Array.isArray(body.comments) && body.comments.length) {
      raw = body.comments; // caminho de teste/CSV (lista do cliente)
    } else if (body.postUrl) {
      raw = await fetchComments(body.postUrl); // coleta real do servidor (sem cap)
    } else {
      return NextResponse.json({ error: "Informe um link ou uma lista de comentários." }, { status: 400 });
    }

    const processed = applyFilters(normalizeComments(raw), f);
    const eligibleHandles = processed.filter((c) => c.eligible).map((c) => c.handle);
    if (!eligibleHandles.length) {
      return NextResponse.json({ error: "Nenhum participante elegível." }, { status: 400 });
    }

    // 2. giveaway + runIndex + ganhador forçado (admin)
    const shortcode = body.postUrl ? shortcodeFromUrl(body.postUrl) : null;
    let giveaway = shortcode ? await db.giveaway.findFirst({ where: { shortcode } }) : null;
    if (!giveaway) {
      giveaway = await db.giveaway.create({
        data: { postUrl: body.postUrl ?? "manual", shortcode, campaign: body.campaign ?? "Sorteio", totalComments: body.totalComments ?? 0 },
      });
    }
    const runIndex = await db.draw.count({ where: { giveawayId: giveaway.id } });
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
        // total de comentários = SEMPRE o número da prévia (etapa anterior) que o cliente viu;
        // só cai pro coletado se não houver prévia (ex.: lista manual/CSV)
        totalCount: body.totalComments && body.totalComments > 0 ? body.totalComments : raw.length,
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
    if (paid && body.payment) {
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
        .catch(() => {});

      // notificação de venda no Telegram (fire-and-forget)
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
      );
    }
    db.event.create({ data: { type: "draw_done", meta: { giveawayId: giveaway.id, eligible: eligibleHandles.length } } }).catch(() => {});

    return NextResponse.json({
      winners,
      certificateCode,
      seedHash: hash,
      eligibleCount: eligibleHandles.length,
      totalCount: body.totalComments && body.totalComments > 0 ? body.totalComments : raw.length,
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Falha no sorteio" }, { status: 502 });
  }
}
