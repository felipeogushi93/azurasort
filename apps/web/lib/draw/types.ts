/**
 * Motor de sorteio — tipos.
 *
 * Pensado para ser PURO e reaproveitavel: hoje roda no browser (simulacao),
 * amanha o mesmo codigo roda no backend (NestJS) com comentarios reais da
 * Instagram Graph API. So muda a FONTE dos comentarios, nao a logica.
 */

/** Comentario cru, como chega da colagem/CSV/mock (ou futuramente da Graph API). */
export interface RawComment {
  id?: string;
  handle: string;
  text: string;
  likeCount?: number;
}

/** Comentario normalizado, com mencoes/hashtags extraidas e status de elegibilidade. */
export interface Comment {
  id: string;
  handle: string;
  text: string;
  mentions: string[];
  hashtags: string[];
  likeCount: number;
  eligible: boolean;
  /** se inelegivel, o motivo (para transparencia) */
  reason?: string;
}

/** Regras/filtros do sorteio. */
export interface DrawFilters {
  /** o comentario precisa conter TODAS estas hashtags */
  mustHaveHashtags: string[];
  /** numero minimo de @mencoes a outras pessoas */
  minMentions: number;
  /** manter so o primeiro comentario de cada usuario */
  blockDuplicateUsers: boolean;
  /** handles a excluir (ex: o organizador) */
  excludeHandles: string[];
  /** quantos vencedores principais */
  winnersCount: number;
  /** quantos suplentes (backups) */
  backupsCount: number;
}

export interface DrawWinner {
  position: number;
  isBackup: boolean;
  handle: string;
  text: string;
}

/** Resultado completo e auditavel de um sorteio. */
export interface DrawResult {
  /** semente determinista (hex) — reproduz o mesmo resultado */
  seed: string;
  algorithm: string;
  totalCount: number;
  eligibleCount: number;
  winners: DrawWinner[];
  /** hash SHA-256 do payload (participantes + seed + vencedores) */
  certificateHash: string;
  drawnAtIso: string;
}

export const DEFAULT_FILTERS: DrawFilters = {
  mustHaveHashtags: [],
  minMentions: 0,
  blockDuplicateUsers: false, // cada comentário conta como uma entrada (participantes = comentários)
  excludeHandles: [],
  winnersCount: 1,
  backupsCount: 0,
};
