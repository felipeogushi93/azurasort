import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminUser } from "@/lib/admin/auth";
import { shortcodeFromUrl } from "@/lib/providers/apify";

export const runtime = "nodejs";

/**
 * 🚨 RESGATE MANUAL — injeta/atualiza o pool de comentários colados pelo admin.
 * Usado pelo /api/draw quando existe (antes de tentar o Apify).
 * Protegido pelo cookie de admin (mesma auth do painel).
 */

type Incoming = { handle: string; text?: string };

export async function POST(req: Request) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { postUrl, handles, owner, totalReal, plan } = await req.json().catch(() => ({}));
  if (typeof postUrl !== "string" || !shortcodeFromUrl(postUrl)) {
    return NextResponse.json({ error: "Link do Instagram inválido." }, { status: 400 });
  }
  const shortcode = shortcodeFromUrl(postUrl)!;
  // tipo de sorteio escolhido (padrão/cinematográfico=premium/vip) → vai no link
  const planId = ["padrao", "premium", "vip"].includes(plan) ? plan : "premium";

  const ownerClean = typeof owner === "string" ? owner.replace(/^@/, "").trim().toLowerCase() : null;

  // normaliza, remove owner, deduplica
  const seen = new Set<string>();
  const clean: Incoming[] = [];
  for (const h of Array.isArray(handles) ? handles : []) {
    const handle = String(h?.handle ?? "").replace(/^@/, "").trim().toLowerCase();
    if (!handle || handle === ownerClean || seen.has(handle)) continue;
    seen.add(handle);
    clean.push({ handle, text: typeof h?.text === "string" ? h.text.slice(0, 300) : "" });
  }

  if (clean.length < 3) {
    return NextResponse.json({ error: "São necessários ao menos 3 participantes válidos." }, { status: 422 });
  }

  const total = typeof totalReal === "number" && totalReal > 0 ? Math.floor(totalReal) : clean.length;

  await db.manualPool.upsert({
    where: { shortcode },
    create: { shortcode, postUrl, handles: clean, owner: ownerClean, totalReal: total },
    update: { postUrl, handles: clean, owner: ownerClean, totalReal: total },
  });

  // link pronto pro cliente sortear (bypass admin) com o tipo de sorteio escolhido
  const key = process.env.AZURA_ADMIN_BYPASS_KEY?.trim();
  const link = key
    ? `https://azurasort.com/pt-br/sorteio?paid=1&url=${encodeURIComponent(postUrl)}&plan=${planId}&count=${total}&key=${key}`
    : null;

  return NextResponse.json({ ok: true, shortcode, injected: clean.length, totalReal: total, plan: planId, link });
}

export async function DELETE(req: Request) {
  if (!(await getAdminUser())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("postUrl") || "";
  const code = shortcodeFromUrl(url) || searchParams.get("shortcode");
  if (!code) return NextResponse.json({ error: "shortcode ausente" }, { status: 400 });
  await db.manualPool.delete({ where: { shortcode: code } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
