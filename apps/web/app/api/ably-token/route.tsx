import { NextResponse } from "next/server";
import * as Ably from "ably";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Token-auth do Ably (tempo real da LIVE). A chave secreta (ABLY_API_KEY) fica
 * SÓ no servidor; o navegador recebe um token temporário com permissão limitada
 * aos canais `live:*`. Se a chave não estiver configurada, a live cai no modo
 * local (sem espectadores reais).
 */
export async function GET() {
  const key = process.env.ABLY_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "realtime_not_configured" }, { status: 503 });
  }
  try {
    const rest = new Ably.Rest(key);
    const tokenRequest = await rest.auth.createTokenRequest({
      capability: { "live:*": ["subscribe", "publish", "presence"] },
      ttl: 2 * 60 * 60 * 1000, // 2h
    });
    return NextResponse.json(tokenRequest);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error)?.message || "token_error" },
      { status: 500 },
    );
  }
}
