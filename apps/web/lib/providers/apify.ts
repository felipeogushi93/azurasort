/**
 * Provider de coleta — Apify (instagram-scraper).
 *
 * - fetchPostPreview: chamada barata (resultsType "posts") → imagem, autor, contagem.
 * - fetchComments: chamada pesada (resultsType "comments") → lista de comentários.
 *
 * Cache em memória por shortcode (economia de API — evita repuxar o mesmo post).
 * Em produção real, trocar por Redis/DB para cache persistente entre instâncias.
 */

const APIFY_ACTOR = "apify~instagram-scraper";
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 min
// Teto de comentários coletados por sorteio. Mantido baixo DE PROPÓSITO p/ segurar o
// custo do Apify (pay-per-result). Posts grandes usam o resgate manual + reembolso.
const COMMENT_LIMIT = 15;

type CacheEntry<T> = { data: T; ts: number };
const previewCache = new Map<string, CacheEntry<PostPreview>>();
const commentsCache = new Map<string, CacheEntry<RawCommentDTO[]>>();

export interface PostPreview {
  shortCode: string;
  imageUrl: string;
  username: string;
  fullName: string;
  isReel: boolean;
  isVideo: boolean;
  commentsCount: number;
  likesCount: number;
  caption: string;
  sampleComments: RawCommentDTO[]; // amostra (latestComments) — para o paywall, sem custo extra
}

export interface RawCommentDTO {
  handle: string;
  text: string;
}

export function shortcodeFromUrl(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([^/?#]+)/i);
  return m ? m[1] : null;
}

function token(): string {
  const t = process.env.APIFY_TOKEN;
  if (!t) throw new Error("APIFY_TOKEN ausente (configure em .env.local / Vercel)");
  return t;
}

async function runActor(input: Record<string, unknown>): Promise<any[]> {
  const res = await fetch(
    `https://api.apify.com/v2/acts/${APIFY_ACTOR}/run-sync-get-dataset-items?token=${token()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Apify ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

/** Prévia barata do post (imagem + contagem). */
export async function fetchPostPreview(url: string): Promise<PostPreview> {
  const code = shortcodeFromUrl(url);
  if (!code) throw new Error("Link do Instagram inválido");

  const cached = previewCache.get(code);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;

  const items = await runActor({ directUrls: [url], resultsType: "posts", resultsLimit: 1 });
  const x = items?.[0];
  if (!x) throw new Error("Publicação não encontrada ou privada");

  const sampleComments: RawCommentDTO[] = Array.isArray(x.latestComments)
    ? x.latestComments
        .filter((c: { ownerUsername?: string }) => c?.ownerUsername)
        .slice(0, 5)
        .map((c: { ownerUsername: string; text?: string }) => ({ handle: c.ownerUsername, text: c.text ?? "" }))
    : [];

  const preview: PostPreview = {
    shortCode: x.shortCode ?? code,
    imageUrl: x.displayUrl ?? x.images?.[0] ?? "",
    username: x.ownerUsername ?? "",
    fullName: x.ownerFullName ?? "",
    isReel: /\/reels?\//i.test(url) || x.productType === "clips",
    isVideo: x.type === "Video",
    commentsCount: x.commentsCount ?? 0,
    likesCount: x.likesCount ?? 0,
    caption: x.caption ?? "",
    sampleComments,
  };
  previewCache.set(code, { data: preview, ts: Date.now() });
  return preview;
}

/** Lista de comentários (pesada). Roda só no sorteio PAGO (o pagamento cobre o custo). */
export async function fetchComments(url: string, limit = COMMENT_LIMIT): Promise<RawCommentDTO[]> {
  const code = shortcodeFromUrl(url);
  if (!code) throw new Error("Link do Instagram inválido");

  const cached = commentsCache.get(code);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;

  const items = await runActor({ directUrls: [url], resultsType: "comments", resultsLimit: limit });
  const comments: RawCommentDTO[] = (items ?? [])
    .filter((c) => c?.ownerUsername)
    .map((c) => ({ handle: c.ownerUsername, text: c.text ?? "" }));

  commentsCache.set(code, { data: comments, ts: Date.now() });
  return comments;
}
