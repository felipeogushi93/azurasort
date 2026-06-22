/**
 * Motor de sorteio — logica pura e auditavel.
 *
 * Garantias:
 *  - DETERMINISTICO: mesma lista + mesma semente => mesmo resultado (reproduzivel).
 *  - VERIFICAVEL: gera um hash SHA-256 do payload (base do certificado).
 *  - JUSTO: embaralhamento Fisher-Yates com PRNG semeado.
 */

import type {
  Comment,
  DrawFilters,
  DrawResult,
  DrawWinner,
  RawComment,
} from "./types";

const MENTION_RE = /@([a-z0-9._]+)/gi;
const HASHTAG_RE = /#([\p{L}0-9_]+)/gu;

function extract(re: RegExp, text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(re)) out.push(m[1].toLowerCase());
  return out;
}

/** Normaliza comentarios crus: extrai mencoes/hashtags e gera ids estaveis. */
export function normalizeComments(raw: RawComment[]): Comment[] {
  return raw.map((c, i) => ({
    id: c.id ?? `c${i}`,
    handle: c.handle.replace(/^@/, "").trim().toLowerCase(),
    text: c.text,
    mentions: extract(MENTION_RE, c.text),
    hashtags: extract(HASHTAG_RE, c.text),
    likeCount: c.likeCount ?? 0,
    eligible: true,
  }));
}

/** Aplica os filtros, marcando cada comentario como elegivel ou nao (com motivo). */
export function applyFilters(comments: Comment[], filters: DrawFilters): Comment[] {
  const excluded = new Set(filters.excludeHandles.map((h) => h.replace(/^@/, "").toLowerCase()));
  const seenHandles = new Set<string>();
  const wantedTags = filters.mustHaveHashtags.map((t) => t.replace(/^#/, "").toLowerCase());

  return comments.map((c) => {
    let reason: string | undefined;

    if (excluded.has(c.handle)) {
      reason = "handle excluido";
    } else if (filters.minMentions > 0 && c.mentions.length < filters.minMentions) {
      reason = `precisa de ${filters.minMentions} mencao(oes)`;
    } else if (wantedTags.length > 0 && !wantedTags.every((t) => c.hashtags.includes(t))) {
      reason = "faltam hashtags obrigatorias";
    } else if (filters.blockDuplicateUsers && seenHandles.has(c.handle)) {
      reason = "comentario duplicado do mesmo usuario";
    }

    if (!reason && filters.blockDuplicateUsers) seenHandles.add(c.handle);

    return { ...c, eligible: !reason, reason };
  });
}

/* ----------------------------- aleatoriedade ----------------------------- */

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** PRNG determinista (mulberry32) semeado a partir de um inteiro de 32 bits. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Embaralhamento Fisher-Yates usando um PRNG fornecido. */
function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Executa o sorteio.
 *
 * @param comments comentarios ja normalizados (a fonte pode ser manual/CSV/Graph API)
 * @param filters  regras do sorteio
 * @param drawnAtIso timestamp ISO (passe new Date().toISOString() no chamador)
 */
export async function runDraw(
  comments: Comment[],
  filters: DrawFilters,
  drawnAtIso: string
): Promise<{ result: DrawResult; processed: Comment[] }> {
  const processed = applyFilters(comments, filters);
  const eligible = processed.filter((c) => c.eligible);

  // canonicaliza: ordena por id para que a semente independa da ordem de entrada
  const canonical = eligible
    .map((c) => c.id)
    .sort()
    .join("|");

  const seed = await sha256Hex(`${canonical}::${drawnAtIso}`);
  const seedInt = parseInt(seed.slice(0, 8), 16);
  const rnd = mulberry32(seedInt);

  const shuffled = shuffle(eligible, rnd);
  const totalPicks = filters.winnersCount + filters.backupsCount;
  const picks = shuffled.slice(0, Math.min(totalPicks, shuffled.length));

  const winners: DrawWinner[] = picks.map((c, i) => ({
    position: i + 1,
    isBackup: i >= filters.winnersCount,
    handle: c.handle,
    text: c.text,
  }));

  const certificateHash = await sha256Hex(
    JSON.stringify({
      seed,
      drawnAtIso,
      eligibleCount: eligible.length,
      winners: winners.map((w) => ({ p: w.position, h: w.handle })),
    })
  );

  const result: DrawResult = {
    seed,
    algorithm: "sha256-mulberry32-fisher-yates",
    totalCount: comments.length,
    eligibleCount: eligible.length,
    winners,
    certificateHash,
    drawnAtIso,
  };

  return { result, processed };
}
