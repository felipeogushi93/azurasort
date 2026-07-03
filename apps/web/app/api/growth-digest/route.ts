import { NextResponse } from "next/server";
import { notifyTelegram } from "@/lib/notify/telegram";

export const runtime = "nodejs";

/**
 * Relé do "dever de casa" semanal de crescimento (backlinks/AEO): o agente
 * agendado faz a pesquisa + rascunhos e manda o texto pra cá; o site posta no
 * Telegram usando o token do servidor (o agente nunca vê o token). Protegido por
 * GROWTH_DIGEST_SECRET. Vai pro GROWTH_CHAT_ID (fallback: grupo de atividade).
 */
export async function POST(req: Request) {
  const secret = process.env.GROWTH_DIGEST_SECRET?.trim();
  if (!secret || req.headers.get("x-growth-secret") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ ok: false, error: "text ausente" }, { status: 400 });
  }
  const chat = process.env.GROWTH_CHAT_ID?.trim() || process.env.TELEGRAM_FUNNEL_CHAT_ID?.trim();
  await notifyTelegram(text.slice(0, 4000), chat);
  return NextResponse.json({ ok: true });
}
