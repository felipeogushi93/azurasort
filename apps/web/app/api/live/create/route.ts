import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { roomHostToken } from "@/lib/live/sign";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cria uma sala de LIVE: o servidor gera o roomId e o hostToken (HMAC).
 * Só o host recebe o hostToken — é ele que dá direito de PUBLISH no /api/ably-token.
 */
export async function POST() {
  const key = process.env.ABLY_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "realtime_not_configured" }, { status: 503 });
  }
  const roomId = "az-" + crypto.randomBytes(6).toString("hex");
  const hostToken = roomHostToken(roomId, key);
  return NextResponse.json({ roomId, hostToken });
}
