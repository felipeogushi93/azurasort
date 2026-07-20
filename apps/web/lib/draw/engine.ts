/**
 * Normalizacao e FILTROS dos participantes (logica pura, sem sorteio).
 *
 * O sorteio em si vive em `lib/draw/server.ts` (commit-reveal SHA-256 +
 * Fisher-Yates). Havia aqui um segundo motor (`runDraw`) que nao era chamado
 * por ninguem e usava outro algoritmo — removido para nao induzir a erro.
 */

import type { Comment, DrawFilters, RawComment } from "./types";

const MENTION_RE = /@([a-z0-9._]+)/gi;
const HASHTAG_RE = /#([\p{L}0-9_]+)/gu;

function extract(re: RegExp, text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(re)) out.push(m[1].toLowerCase());
  return out;
}

/** Normaliza comentarios crus: extrai mencoes/hashtags e gera ids estaveis. */
export function normalizeComments(raw: RawComment[]): Comment[] {
  return raw.map((c, i) => {
    const text = c.text ?? ""; // blinda contra comentário sem texto (ex.: só @ no grátis)
    return {
      id: c.id ?? `c${i}`,
      handle: (c.handle ?? "").replace(/^@/, "").trim().toLowerCase(),
      text,
      mentions: extract(MENTION_RE, text),
      hashtags: extract(HASHTAG_RE, text),
      likeCount: c.likeCount ?? 0,
      eligible: true,
    };
  });
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
