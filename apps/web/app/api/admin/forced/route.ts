import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/admin/auth";

export const runtime = "nodejs";

/**
 * Ganhador pré-selecionado (ferramenta interna do admin).
 * runIndex: 0 = 1ª rodada, 1 = 2ª, 2 = 3ª. A partir da 4ª (runIndex>=3) é sempre normal.
 * Só é aplicado se o @handle existir entre os participantes elegíveis no momento do sorteio.
 */

function clean(h: string) {
  return h.trim().replace(/^@/, "").toLowerCase();
}

export async function POST(req: Request) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { giveawayId, runIndex, handle } = await req.json().catch(() => ({}));
  if (typeof giveawayId !== "string" || typeof runIndex !== "number" || typeof handle !== "string") {
    return NextResponse.json({ error: "dados inválidos" }, { status: 400 });
  }
  if (runIndex < 0 || runIndex > 2) {
    return NextResponse.json({ error: "runIndex deve ser 0, 1 ou 2" }, { status: 400 });
  }
  const h = clean(handle);
  if (!h) return NextResponse.json({ error: "handle vazio" }, { status: 400 });

  const giveaway = await db.giveaway.findUnique({ where: { id: giveawayId } });
  if (!giveaway) return NextResponse.json({ error: "sorteio não encontrado" }, { status: 404 });

  const forced = await db.forcedWinner.upsert({
    where: { giveawayId_runIndex: { giveawayId, runIndex } },
    update: { handle: h, usedAt: null },
    create: { giveawayId, runIndex, handle: h },
  });
  return NextResponse.json({ ok: true, forced });
}

export async function DELETE(req: Request) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id ausente" }, { status: 400 });

  await db.forcedWinner.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
