/**
 * Amigo secreto — codificação do "link individual" de cada participante.
 *
 * ⚠️ SEM BANCO DE DADOS de propósito. O par sorteado viaja dentro do próprio
 * link, em base64url, para que a brincadeira funcione só com o organizador
 * mandando um link por pessoa. Isso NÃO é segredo criptográfico: quem souber
 * decodificar base64 lê o conteúdo. O objetivo é só evitar o spoiler acidental
 * (print, preview do WhatsApp, alguém olhando por cima do ombro), não proteger
 * contra alguém determinado a trapacear.
 */

export type AmigoPayload = {
  /** quem tira (dono do link) */
  d: string;
  /** quem foi tirado (a resposta) */
  p: string;
  /** nome do grupo (opcional) */
  g: string;
};

const MAX_LEN = 80;

/** base64 padrão → base64url (seguro em URL). */
function toBase64Url(b64: string): string {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** base64url → base64 padrão (com padding de volta). */
function fromBase64Url(token: string): string {
  const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
  return b64 + "=".repeat((4 - (b64.length % 4)) % 4);
}

/** Codifica o par em base64url. Funciona com acentos (UTF-8 → bytes → base64). */
export function encodeAmigoToken(payload: AmigoPayload): string {
  const json = JSON.stringify({
    d: payload.d.slice(0, MAX_LEN),
    p: payload.p.slice(0, MAX_LEN),
    g: payload.g.slice(0, MAX_LEN),
  });
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return toBase64Url(btoa(bin));
}

/**
 * Decodifica com tolerância a lixo: link truncado pelo WhatsApp, colado pela
 * metade ou adulterado retorna `null` — a página mostra um recado amigável em
 * vez de estourar um erro na cara de quem só queria ver o amigo secreto.
 */
export function decodeAmigoToken(token: string): AmigoPayload | null {
  try {
    const bin = atob(fromBase64Url(token));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object") return null;

    const raw = parsed as Record<string, unknown>;
    const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
    const d = str(raw.d);
    const p = str(raw.p);
    const g = str(raw.g);

    if (!d || !p) return null;
    if (d.length > MAX_LEN || p.length > MAX_LEN || g.length > MAX_LEN) return null;

    return { d, p, g };
  } catch {
    return null;
  }
}
