/**
 * Rate limit simples (em memória, por instância).
 * Stopgap contra abuso — protege rotas caras (Apify) e de pagamento.
 *
 * ⚠️ Em serverless é POR INSTÂNCIA (não global). Para produção robusta,
 * trocar por Upstash Redis (rate limit distribuído). Ver SECURITY-ANALISE.md.
 */
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const e = hits.get(key);
  if (!e || now > e.reset) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (e.count >= limit) return false;
  e.count++;
  return true;
}

export function clientIp(req: Request): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
