import crypto from "node:crypto";

/**
 * Prova de "host" da sala SEM estado no servidor: HMAC(roomId) com a chave secreta.
 * Só o host recebe esse token (via /api/live/create); o link público da live só leva
 * o roomId. Assim, no /api/ably-token, quem apresenta o hostToken válido ganha PUBLISH;
 * os demais (espectadores) ficam só com SUBSCRIBE — ninguém injeta um vencedor falso.
 */
export function roomHostToken(roomId: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(`host:${roomId}`)
    .digest("hex")
    .slice(0, 32);
}
