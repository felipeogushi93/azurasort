// Cliente Woovi (PIX). Autenticação = App ID no header Authorization.
const BASE = "https://api.woovi.com/api/v1";

function appId(): string {
  const k = process.env.WOOVI_APP_ID?.trim();
  if (!k) throw new Error("WOOVI_APP_ID ausente (configure em .env.local / Vercel)");
  return k;
}

export interface WooviCharge {
  correlationID: string;
  brCode: string; // copia-e-cola
  qrCodeImage: string; // URL da imagem do QR
  status: string;
}

/** Cria uma cobrança PIX. `value` em centavos. */
export async function createWooviCharge(value: number, comment: string): Promise<WooviCharge> {
  const correlationID = `azurasort-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const res = await fetch(`${BASE}/charge?return_existing=true`, {
    method: "POST",
    headers: { Authorization: appId(), "Content-Type": "application/json" },
    body: JSON.stringify({ correlationID, value, comment }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Woovi ${res.status}: ${t.slice(0, 160)}`);
  }
  const data = await res.json();
  const c = data.charge ?? {};
  return {
    correlationID,
    brCode: c.brCode ?? "",
    qrCodeImage: c.qrCodeImage ?? "",
    status: c.status ?? "ACTIVE",
  };
}

/** Consulta o status de uma cobrança pelo correlationID. */
export async function getWooviStatus(correlationID: string): Promise<{ status: string; paid: boolean }> {
  const res = await fetch(`${BASE}/charge/${encodeURIComponent(correlationID)}`, {
    headers: { Authorization: appId() },
  });
  if (!res.ok) throw new Error(`Woovi ${res.status}`);
  const data = await res.json();
  const status = data.charge?.status ?? "ACTIVE";
  return { status, paid: status === "COMPLETED" };
}
