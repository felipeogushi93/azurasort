/**
 * Server-side Google Ads Offline Conversion Upload.
 *
 * Chama a REST API do Google Ads pra registrar uma venda confirmada
 * mesmo se o cliente fechar a aba antes do pixel client-side disparar.
 *
 * Fallbacks (nessa ordem):
 *   1) gclid → upload via ClickConversion (mais preciso)
 *   2) email/phone → upload via UserIdentifier (Enhanced Conversions)
 *   3) sem nada → não envia (Payment fica com conversionUploaded=false)
 *
 * Todos os erros são silenciados — nunca derrubam o webhook do pagamento.
 * O campo Payment.conversionUploaded vira true SÓ na 1ª tentativa bem-sucedida
 * (evita upload duplicado em retries do webhook).
 */

import crypto from "node:crypto";

// Conversion Action que criamos hoje (08/07/2026) na conta 1569133219
// customers/1569133219/conversionActions/7677276602
const CONVERSION_ACTION_ID = "7677276602";
const CUSTOMER_ID = "1569133219";
const LOGIN_CUSTOMER_ID = "9527888609"; // MCC (mesmo do SG)

interface UploadArgs {
  gclid?: string | null;
  email?: string | null;
  phone?: string | null;
  amountBRL: number;
  externalId: string;
  paidAt: Date;
}

async function getAccessToken(): Promise<string | null> {
  const client_id = process.env.GOOGLE_ADS_CLIENT_ID;
  const client_secret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refresh_token = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  if (!client_id || !client_secret || !refresh_token) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id,
      client_secret,
      refresh_token,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

function sha256Hex(s: string): string {
  return crypto.createHash("sha256").update(s.trim().toLowerCase()).digest("hex");
}

function normalizePhone(p: string): string {
  // E.164 sem espaços/parênteses/hífens. Assume BR se não tem +.
  const digits = p.replace(/\D/g, "");
  if (p.startsWith("+")) return "+" + digits;
  if (digits.length === 11 || digits.length === 10) return "+55" + digits;
  return "+" + digits;
}

/**
 * Envia conversão pro Google Ads. Retorna true se aceito, false se falhou/skiped.
 */
export async function uploadOfflineConversion(args: UploadArgs): Promise<boolean> {
  const dev_token = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  if (!dev_token) return false;

  const token = await getAccessToken();
  if (!token) return false;

  const conversionActionRn = `customers/${CUSTOMER_ID}/conversionActions/${CONVERSION_ACTION_ID}`;
  // ISO com timezone — Google Ads exige formato "yyyy-MM-dd HH:mm:ss+HH:mm"
  const dt = args.paidAt;
  const pad = (n: number) => String(n).padStart(2, "0");
  const conversionDateTime =
    `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())} ` +
    `${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}:${pad(dt.getUTCSeconds())}+00:00`;

  const conversion: Record<string, unknown> = {
    conversionAction: conversionActionRn,
    conversionDateTime,
    conversionValue: args.amountBRL,
    currencyCode: "BRL",
    orderId: args.externalId, // dedupe por order
  };

  if (args.gclid) {
    conversion.gclid = args.gclid;
  } else if (args.email || args.phone) {
    const ids: Array<Record<string, string>> = [];
    if (args.email) ids.push({ hashedEmail: sha256Hex(args.email) });
    if (args.phone) ids.push({ hashedPhoneNumber: sha256Hex(normalizePhone(args.phone)) });
    conversion.userIdentifiers = ids;
  } else {
    return false; // nada pra correlacionar
  }

  const url = `https://googleads.googleapis.com/v22/customers/${CUSTOMER_ID}:uploadClickConversions`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "developer-token": dev_token,
        "login-customer-id": LOGIN_CUSTOMER_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversions: [conversion],
        partialFailure: true,
        validateOnly: false,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("[googleAds/upload] HTTP", res.status, errText.slice(0, 500));
      return false;
    }
    const data = (await res.json()) as { partialFailureError?: unknown; results?: unknown[] };
    if (data.partialFailureError) {
      console.error("[googleAds/upload] partialFailure:", JSON.stringify(data.partialFailureError).slice(0, 500));
      return false;
    }
    console.log("[googleAds/upload] OK order=", args.externalId, "value=R$", args.amountBRL);
    return true;
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[googleAds/upload] fetch error:", msg);
    return false;
  }
}
