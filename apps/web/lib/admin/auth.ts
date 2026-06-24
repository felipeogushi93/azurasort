import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Auth do painel admin (/adminlkgat).
 *
 * Sessão = cookie assinado por HMAC-SHA256 com ADMIN_SESSION_SECRET.
 * Sem dependência externa: credenciais em env, comparação timing-safe.
 */

export const ADMIN_COOKIE = "azs_admin";
const TTL_MS = 1000 * 60 * 60 * 12; // 12h

function secret() {
  return process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me";
}

function hmac(data: string) {
  return crypto.createHmac("sha256", secret()).update(data).digest("base64url");
}

/** Comparação de strings resistente a timing-attack. */
function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function checkCredentials(user: string, password: string): boolean {
  // .trim() blinda contra espaço/quebra de linha colado na env do Vercel
  const U = (process.env.ADMIN_USER || "").trim();
  const P = (process.env.ADMIN_PASSWORD || "").trim();
  if (!U || !P) return false;
  // avalia ambos para não vazar qual campo falhou
  const okU = safeEqual(user.trim(), U);
  const okP = safeEqual(password.trim(), P);
  return okU && okP;
}

/** Gera o token de sessão: base64url(payload).assinatura */
export function signSession(user: string): string {
  const payload = JSON.stringify({ u: user, exp: Date.now() + TTL_MS });
  const body = Buffer.from(payload).toString("base64url");
  return `${body}.${hmac(body)}`;
}

/** Valida o token; retorna o usuário ou null. */
export function verifySession(token: string | undefined | null): string | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  if (!safeEqual(sig, hmac(body))) return null;
  try {
    const { u, exp } = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof exp !== "number" || Date.now() > exp) return null;
    return typeof u === "string" ? u : null;
  } catch {
    return null;
  }
}

/** Lê a sessão a partir dos cookies (Server Components / route handlers). */
export async function getAdminUser(): Promise<string | null> {
  const jar = await cookies();
  return verifySession(jar.get(ADMIN_COOKIE)?.value);
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: TTL_MS / 1000,
};
