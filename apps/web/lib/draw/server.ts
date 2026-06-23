import { createHash, randomBytes } from "crypto";

/**
 * Sorteio provably-fair (servidor) — commit-reveal SHA-256.
 *
 * 1. Gera uma SEED aleatória e publica o HASH dela (commit).
 * 2. Ordena os participantes de forma canônica (handle.localeCompare) e
 *    embaralha com Fisher-Yates determinístico (HMAC via SHA-256 da seed).
 * 3. Revela a seed. Qualquer um confere: SHA256(seed) == hash, e reproduz os
 *    vencedores a partir da mesma lista + seed (página /verify).
 */

export function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

export function generateSeed(): { seed: string; hash: string } {
  const seed = randomBytes(32).toString("hex");
  return { seed, hash: sha256(seed) };
}

function seededRandom(seed: string, counter: number): number {
  const h = sha256(`${seed}:${counter}`);
  return parseInt(h.slice(0, 8), 16) / 0xffffffff;
}

function shuffle<T>(arr: T[], seed: string): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed, i) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface DrawWinner {
  position: number;
  handle: string;
  isBackup: boolean;
}

/**
 * Lista canônica de PARTICIPANTES (entradas), ordenada deterministicamente.
 * NÃO remove duplicados: cada comentário conta como uma entrada — assim o total
 * de participantes bate com o total de comentários. (Strings iguais são
 * intercambiáveis, então a ordenação é determinística para a verificação.)
 */
export function canonicalParticipants(handles: string[]): string[] {
  return [...handles].sort((a, b) => a.localeCompare(b));
}

/** Caminha a ordem embaralhada e pega os primeiros N handles DISTINTOS (sem repetir vencedor). */
function pickDistinct(order: string[], count: number): string[] {
  const picked: string[] = [];
  const seen = new Set<string>();
  for (const h of order) {
    if (seen.has(h)) continue;
    seen.add(h);
    picked.push(h);
    if (picked.length >= count) break;
  }
  return picked;
}

/**
 * Sorteia. `forcedHandle` (admin) coloca alguém como vencedor #1 — quebra a
 * verificabilidade (rigged=true); só usar conscientemente.
 */
export function drawFromHandles(
  handles: string[],
  seed: string,
  winnersCount: number,
  backupsCount: number,
  forcedHandle?: string | null
): { winners: DrawWinner[]; participants: string[]; rigged: boolean } {
  const participants = canonicalParticipants(handles);
  let order = shuffle(participants, seed);

  const rigged = Boolean(forcedHandle && participants.includes(forcedHandle));
  if (rigged && forcedHandle) {
    order = [forcedHandle, ...order.filter((h) => h !== forcedHandle)];
  }

  // vencedores são pessoas DISTINTAS (um @ não vence duas vezes), mesmo com entradas repetidas
  const distinct = pickDistinct(order, winnersCount + backupsCount);
  const winners: DrawWinner[] = distinct.map((handle, i) => ({
    position: i + 1,
    handle,
    isBackup: i >= winnersCount,
  }));

  return { winners, participants, rigged };
}

/** Reproduz o resultado (para a página /verify). Ignora suplentes/forçados. */
export function verifyFromParticipants(participants: string[], seed: string, winnersCount: number): string[] {
  const order = shuffle(canonicalParticipants(participants), seed);
  return pickDistinct(order, winnersCount);
}

/** Código público curto do certificado (ex.: AZS-7K2A-9X4Q). */
export function makeCertificateCode(): string {
  const raw = randomBytes(6).toString("hex").toUpperCase();
  return `AZS-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}
