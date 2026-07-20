/** Tracking de funil no cliente (fire-and-forget, não bloqueia a UI). */

function sessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem("azs_sid");
    if (!id) {
      id = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("azs_sid", id);
    }
    return id;
  } catch {
    return "";
  }
}

/** Mesmo sessionId do funil — pra amarrar o draw (server-side) à sessão do visitante. */
export function getSessionId(): string {
  return sessionId();
}

// ===== Detecção de origem do lead (de onde a pessoa veio) =====
// Normaliza ?utm_source/?ref e o referrer em uma fonte canônica.
function normalizeSource(v: string | null): string | null {
  if (!v) return null;
  const s = v.toLowerCase().trim();
  if (/chatgpt|openai|^gpt$|^ai-chatgpt$/.test(s)) return "ai-chatgpt";
  if (/claude|anthropic/.test(s)) return "ai-claude";
  if (/perplexity|^pplx$/.test(s)) return "ai-perplexity";
  if (/gemini|bard/.test(s)) return "ai-gemini";
  if (/copilot/.test(s)) return "ai-copilot";
  if (/^google|organic-google/.test(s)) return "organic-google";
  if (/^bing/.test(s)) return "organic-bing";
  if (/duckduckgo/.test(s)) return "organic-duckduckgo";
  if (/insta/.test(s)) return "social-instagram";
  if (/face|^fb$/.test(s)) return "social-facebook";
  if (/tiktok/.test(s)) return "social-tiktok";
  if (/youtube/.test(s)) return "social-youtube";
  if (/whatsapp|wa\.me/.test(s)) return "whatsapp";
  return s;
}

function detectFresh(): string {
  try {
    const qs = new URLSearchParams(window.location.search);
    // 💰 PAGO vem ANTES de tudo: clique de anúncio chega com referrer google.com e
    // era contado como "organic-google" — o painel mostrava tráfego pago como
    // orgânico (90% do que parecia SEO era Ads). O gclid é a marca definitiva.
    if (qs.get("gclid") || qs.get("gbraid") || qs.get("wbraid") || qs.get("gad_source")) return "paid-google";
    if ((qs.get("utm_medium") || "").toLowerCase() === "cpc") {
      const s = (qs.get("utm_source") || "").toLowerCase();
      return /google/.test(s) ? "paid-google" : /face|meta|insta/.test(s) ? "paid-meta" : "paid-other";
    }
    if (qs.get("fbclid")) return "paid-meta";
    const explicit = qs.get("utm_source") || qs.get("ref") || qs.get("source") || qs.get("via");
    if (explicit) return normalizeSource(explicit) ?? "direct";
    const ref = document.referrer || "";
    if (/chatgpt\.com|chat\.openai\.com|openai\.com/.test(ref)) return "ai-chatgpt";
    if (/claude\.ai|anthropic/.test(ref)) return "ai-claude";
    if (/perplexity\.ai/.test(ref)) return "ai-perplexity";
    if (/gemini\.google\.com|bard\.google/.test(ref)) return "ai-gemini";
    if (/copilot\.microsoft\.com|bing\.com\/chat/.test(ref)) return "ai-copilot";
    if (/google\./.test(ref)) return "organic-google";
    if (/bing\./.test(ref)) return "organic-bing";
    if (/duckduckgo\./.test(ref)) return "organic-duckduckgo";
    if (/instagram\.com/.test(ref)) return "social-instagram";
    if (/facebook\.com|fb\.com/.test(ref)) return "social-facebook";
    if (/tiktok\.com/.test(ref)) return "social-tiktok";
    if (/youtube\.com/.test(ref)) return "social-youtube";
    if (/whatsapp|wa\.me/.test(ref)) return "whatsapp";
    if (/t\.co|twitter\.com|x\.com/.test(ref)) return "social-x";
    return ref ? "referral" : "direct";
  } catch {
    return "direct";
  }
}

// First-touch sticky 90d: se a 1ª visita foi de IA, mantém o crédito da IA mesmo
// que o ChatGPT zere o referrer nas navegações seguintes (rel="noreferrer").
function stickySource(): string {
  try {
    const fresh = detectFresh();
    const raw = localStorage.getItem("azs_src");
    const prev = raw ? (JSON.parse(raw) as { s: string; t: number }) : null;
    const fresh90d = prev && Date.now() - prev.t < 90 * 864e5 ? prev.s : null;

    // IA fresca sempre registra e usa.
    if (/^ai-/.test(fresh)) {
      localStorage.setItem("azs_src", JSON.stringify({ s: fresh, t: Date.now() }));
      return fresh;
    }
    // Sessão prévia de IA tem prioridade (first-touch IA).
    if (fresh90d && /^ai-/.test(fresh90d)) return fresh90d;
    // Fonte fresca não-direct registra.
    if (fresh !== "direct" && fresh !== "referral") {
      localStorage.setItem("azs_src", JSON.stringify({ s: fresh, t: Date.now() }));
      return fresh;
    }
    // Mantém qualquer fonte prévia não-direct.
    if (fresh90d && fresh90d !== "direct") return fresh90d;
    if (!prev) localStorage.setItem("azs_src", JSON.stringify({ s: fresh, t: Date.now() }));
    return fresh;
  } catch {
    return "direct";
  }
}

/** Origem do lead anexada a cada evento (de onde veio + UTM + click IDs de ads). */
function origin(): Record<string, unknown> {
  try {
    const qs = new URLSearchParams(window.location.search);
    return {
      src: stickySource(),
      ref: document.referrer || null,
      utm_source: qs.get("utm_source") || null,
      utm_medium: qs.get("utm_medium") || null,
      utm_campaign: qs.get("utm_campaign") || null,
      gclid: qs.get("gclid") || qs.get("gbraid") || qs.get("wbraid") || null,
      fbclid: qs.get("fbclid") || null,
    };
  } catch {
    return { src: "direct" };
  }
}

export function track(type: "visit" | "link_loaded" | "unlock_view" | "pay_started" | "pay_done", meta?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({ type, sessionId: sessionId(), path: window.location.pathname, meta: { ...(meta ?? {}), ...origin() } });
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
    }
  } catch {
    /* tracking nunca quebra a UX */
  }
}
