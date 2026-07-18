import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { uploadOfflineConversion } from "@/lib/googleAds/uploadConversion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * 🔁 BACKFILL de conversões offline do Google Ads.
 *
 * Reenvia as vendas PAGAS que têm gclid (ou email/phone) mas nunca subiram
 * (conversionUploaded = false) — o histórico perdido enquanto as env vars
 * estavam faltando.
 *
 * Protegido pela AZURA_ADMIN_BYPASS_KEY. Sempre com LIMITE (padrão 1) pra
 * testar antes de mandar tudo. O Google Ads deduplica por orderId, então
 * reenvio acidental não duplica conversão.
 *
 * Uso:
 *   GET /api/admin/ads-backfill?key=SECRET            → dry-run (só conta)
 *   GET /api/admin/ads-backfill?key=SECRET&run=1&limit=1   → envia 1
 *   GET /api/admin/ads-backfill?key=SECRET&run=1&limit=100 → envia o resto
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = process.env.AZURA_ADMIN_BYPASS_KEY?.trim();
  if (!secret || searchParams.get("key") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 🔎 DIAGNÓSTICO: mostra o que está faltando/quebrando (sem vazar os valores)
  if (searchParams.get("diag") === "1") {
    const has = (k: string) => Boolean(process.env[k]?.trim());
    const envs = {
      GOOGLE_ADS_CLIENT_ID: has("GOOGLE_ADS_CLIENT_ID"),
      GOOGLE_ADS_CLIENT_SECRET: has("GOOGLE_ADS_CLIENT_SECRET"),
      GOOGLE_ADS_DEVELOPER_TOKEN: has("GOOGLE_ADS_DEVELOPER_TOKEN"),
      GOOGLE_ADS_REFRESH_TOKEN: has("GOOGLE_ADS_REFRESH_TOKEN"),
    };
    let oauth: { ok: boolean; status?: number; erro?: string } = { ok: false, erro: "nao testado" };
    if (envs.GOOGLE_ADS_CLIENT_ID && envs.GOOGLE_ADS_CLIENT_SECRET && envs.GOOGLE_ADS_REFRESH_TOKEN) {
      try {
        const r = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_ADS_CLIENT_ID!.trim(),
            client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!.trim(),
            refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!.trim(),
            grant_type: "refresh_token",
          }),
        });
        const txt = await r.text();
        oauth = r.ok ? { ok: true, status: r.status } : { ok: false, status: r.status, erro: txt.slice(0, 300) };
      } catch (e) {
        oauth = { ok: false, erro: e instanceof Error ? e.message : String(e) };
      }
    } else {
      oauth = { ok: false, erro: "faltam env vars pra testar o OAuth" };
    }
    // diag=2: faz um upload em modo VALIDATE (não grava nada) e devolve o erro cru
    if (searchParams.get("deep") === "1" && oauth.ok) {
      const tk = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_ADS_CLIENT_ID!.trim(),
          client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!.trim(),
          refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!.trim(),
          grant_type: "refresh_token",
        }),
      }).then((r) => r.json() as Promise<{ access_token?: string }>);

      const one = await db.payment.findFirst({
        where: { status: "paid", amount: { gt: 100 }, gclid: { not: null } },
        orderBy: { paidAt: "desc" },
        select: { externalId: true, gclid: true, amount: true, paidAt: true },
      });
      if (!one) return NextResponse.json({ envs, oauth, deep: "sem venda com gclid" });

      const dt = one.paidAt ?? new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const when =
        `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())} ` +
        `${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}:${pad(dt.getUTCSeconds())}+00:00`;

      const res = await fetch(
        "https://googleads.googleapis.com/v22/customers/1569133219:uploadClickConversions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tk.access_token}`,
            "developer-token": process.env.GOOGLE_ADS_DEVELOPER_TOKEN!.trim(),
            "login-customer-id": "9527888609",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversions: [
              {
                conversionAction: "customers/1569133219/conversionActions/7677276602",
                conversionDateTime: when,
                conversionValue: one.amount / 100,
                currencyCode: "BRL",
                orderId: one.externalId,
                gclid: one.gclid,
              },
            ],
            partialFailure: true,
            validateOnly: true,
          }),
        },
      );
      const raw = await res.text();
      return NextResponse.json({ envs, oauth, deep: { status: res.status, resposta: raw.slice(0, 1200) } });
    }

    return NextResponse.json({ envs, oauth });
  }

  const run = searchParams.get("run") === "1";
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 1, 1), 200);

  // candidatas: pagas, valor real, com identificador, ainda não enviadas
  const pending = await db.payment.findMany({
    where: {
      status: "paid",
      amount: { gt: 100 },
      conversionUploaded: false,
      OR: [{ gclid: { not: null } }, { email: { not: null } }, { phone: { not: null } }],
    },
    orderBy: { paidAt: "asc" },
    select: { externalId: true, gclid: true, email: true, phone: true, amount: true, currency: true, paidAt: true },
  });

  if (!run) {
    return NextResponse.json({
      dryRun: true,
      pendentes: pending.length,
      amostra: pending.slice(0, 5).map((p) => ({ order: p.externalId, quando: p.paidAt, valor: p.amount / 100 })),
      comoRodar: "adicione &run=1&limit=1 pra enviar a primeira",
    });
  }

  const alvo = pending.slice(0, limit);
  const resultados: { order: string; ok: boolean }[] = [];

  for (const p of alvo) {
    let ok = false;
    try {
      ok = await uploadOfflineConversion({
        gclid: p.gclid,
        email: p.email,
        phone: p.phone,
        amountBRL: p.amount / 100,
        externalId: p.externalId,
        paidAt: p.paidAt ?? new Date(),
      });
      if (ok) {
        await db.payment.update({ where: { externalId: p.externalId }, data: { conversionUploaded: true } }).catch(() => {});
      }
    } catch {
      ok = false;
    }
    resultados.push({ order: p.externalId, ok });
  }

  const enviadas = resultados.filter((r) => r.ok).length;
  return NextResponse.json({
    tentadas: resultados.length,
    enviadas,
    falharam: resultados.length - enviadas,
    restantes: pending.length - enviadas,
    resultados,
  });
}
