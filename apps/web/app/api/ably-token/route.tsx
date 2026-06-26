import { NextResponse } from "next/server";
import * as Ably from "ably";
import { roomHostToken } from "@/lib/live/sign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Token-auth do Ably (tempo real da LIVE). A chave secreta (ABLY_API_KEY) fica SÓ no
 * servidor; o navegador recebe um token temporário com permissão LIMITADA:
 *   - host (apresenta hostToken HMAC válido p/ a sala) → publish + subscribe + presence
 *   - espectador (só roomId) → subscribe + presence (NÃO pode publicar)
 * Assim só o organizador injeta o resultado — ninguém forja um vencedor falso.
 */
export async function GET(req: Request) {
  const key = process.env.ABLY_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "realtime_not_configured" }, { status: 503 });
  }
  try {
    const url = new URL(req.url);
    const room = url.searchParams.get("room");
    const h = url.searchParams.get("h");

    let capability: Record<string, string[]>;
    if (room) {
      const isHost = !!h && h === roomHostToken(room, key);
      capability = {
        [`live:${room}`]: isHost
          ? ["publish", "subscribe", "presence"]
          : ["subscribe", "presence"],
      };
    } else {
      // sem sala definida: só leitura geral (não deveria acontecer no fluxo normal)
      capability = { "live:*": ["subscribe", "presence"] };
    }

    const rest = new Ably.Rest(key);
    const tokenRequest = await rest.auth.createTokenRequest({
      capability: JSON.stringify(capability),
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
