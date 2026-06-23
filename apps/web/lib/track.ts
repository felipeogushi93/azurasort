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

export function track(type: "visit" | "link_loaded" | "unlock_view" | "pay_started" | "pay_done", meta?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({ type, sessionId: sessionId(), path: window.location.pathname, meta });
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
