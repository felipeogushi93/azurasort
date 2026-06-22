import { z } from "zod";

/**
 * reveal-spec — o contrato unico que descreve uma revelacao.
 *
 * A MESMA spec e consumida por:
 *   1. a cena 3D no browser (apps/web, React Three Fiber)
 *   2. a composicao de video no worker (Remotion)
 *
 * Isso garante PARIDADE: o MP4 baixado e identico ao que o usuario viu na tela.
 * Qualquer mudanca visual deve ser expressa aqui, nunca hardcoded numa cena.
 */

/** Identificadores das 24 cenas de revelacao do blueprint. */
export const REVEAL_MODULES = [
  "oscar_envelope",
  "stage_host",
  "bank_vault",
  "countdown",
  "hologram",
  "comment_matrix",
  "casino_roulette",
  "loot_box",
  "red_carpet",
  "concert_stage",
  "ai_oracle",
  "stadium_jumbotron",
  "dimensional_portal",
  "galaxy_cosmos",
  "lightning_storm",
  "fireworks",
  "lottery_machine",
  "slot_machine",
  "glass_shatter",
  "gift_box",
  "neon_cyberpunk",
  "treasure_cave",
  "names_speedrun",
  "origami",
  "message_in_bottle",
  "rocket_launch",
] as const;

export const RevealModuleSchema = z.enum(REVEAL_MODULES);
export type RevealModule = z.infer<typeof RevealModuleSchema>;

/** Formatos de saida de video. */
export const VideoFormatSchema = z.enum(["VERTICAL", "HORIZONTAL", "SQUARE"]);
export type VideoFormat = z.infer<typeof VideoFormatSchema>;

export const LocaleSchema = z.enum(["pt-BR", "es-ES", "ar-MA", "fr-MA", "en"]);
export type Locale = z.infer<typeof LocaleSchema>;

/** Um vencedor (ou suplente) ja resolvido pelo sorteio. */
export const WinnerSchema = z.object({
  /** posicao: 1 = principal, 2..n = multiplos vencedores ou suplentes */
  position: z.number().int().positive(),
  isBackup: z.boolean().default(false),
  /** nome de exibicao (ex: "Joao Silva") */
  displayName: z.string().min(1),
  /** @handle do Instagram, sem o @ */
  handle: z.string().min(1),
  /** URL do avatar (opcional) */
  avatarUrl: z.string().url().optional(),
});
export type Winner = z.infer<typeof WinnerSchema>;

/** Branding do cliente, sobreposto na cena e no video. */
export const BrandingSchema = z.object({
  campaignName: z.string().min(1),
  clientLogoUrl: z.string().url().optional(),
  /** cores em hex; a cena adapta seus emissivos/gradientes a partir daqui */
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#E8C26B"),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{6})$/).default("#3DF5FF"),
  /** se a marca dagua "Made with AzuraSort" aparece (planos pagos = false) */
  watermark: z.boolean().default(true),
});
export type Branding = z.infer<typeof BrandingSchema>;

/** Configuracao de audio da cena. */
export const AudioSpecSchema = z.object({
  /** trilha ambiente/musica */
  trackUrl: z.string().url().optional(),
  /** stinger do momento do reveal */
  revealSfxUrl: z.string().url().optional(),
  muted: z.boolean().default(false),
  volume: z.number().min(0).max(1).default(0.8),
});
export type AudioSpec = z.infer<typeof AudioSpecSchema>;

/**
 * Timeline em milissegundos. Cada cena respeita estes "beats" para que
 * a animacao no browser e o render de video fiquem perfeitamente sincronizados.
 */
export const TimelineSchema = z.object({
  /** duracao total da cena */
  durationMs: z.number().int().positive().default(8000),
  /** quando comeca o build-up de suspense */
  buildUpAtMs: z.number().int().nonnegative().default(1000),
  /** silencio/pausa imediatamente antes do cl, a arma de retencao */
  preRevealHushMs: z.number().int().nonnegative().default(600),
  /** momento exato do reveal (impacto audiovisual) */
  revealAtMs: z.number().int().positive().default(5500),
});
export type Timeline = z.infer<typeof TimelineSchema>;

/** A spec completa de uma revelacao. */
export const RevealSpecSchema = z.object({
  specVersion: z.literal(1).default(1),
  drawId: z.string().min(1),
  module: RevealModuleSchema,
  locale: LocaleSchema.default("pt-BR"),
  winners: z.array(WinnerSchema).min(1),
  branding: BrandingSchema,
  audio: AudioSpecSchema.default({}),
  timeline: TimelineSchema.default({}),
  /** numero total de participantes elegiveis — exibido como prova de escala */
  participantCount: z.number().int().nonnegative().default(0),
  /** hash do certificado de transparencia, para overlay/QR */
  certificateHash: z.string().optional(),
  /**
   * URL de um video de fundo (cena real: filmagem, stock ou gerado por IA).
   * Quando presente, a cena renderiza esse video e sobrepoe os elementos
   * dinamicos (frase localizada, cartao, @). Quando ausente, mostra um
   * placeholder de palco em CSS.
   * Aceita URL completa (https://...) ou caminho relativo a /public (/stage.mp4).
   */
  backgroundVideoUrl: z.string().min(1).optional(),
});
export type RevealSpec = z.infer<typeof RevealSpecSchema>;

/** Valida e normaliza um payload bruto numa RevealSpec confiavel. */
export function parseRevealSpec(input: unknown): RevealSpec {
  return RevealSpecSchema.parse(input);
}

/**
 * Frase do anuncio da apresentadora, localizada por pais/idioma.
 * Usada pela cena "stage_host" — fala antes de abrir o cartao.
 */
export const HOST_ANNOUNCEMENT: Record<Locale, string> = {
  "pt-BR": "E o premio vai para...",
  "es-ES": "Y el premio es para...",
  "ar-MA": "والجائزة من نصيب...",
  "fr-MA": "Et le prix revient a...",
  en: "And the winner is...",
};

export function getHostLine(locale: Locale): string {
  return HOST_ANNOUNCEMENT[locale] ?? HOST_ANNOUNCEMENT.en;
}

/** Dimensoes de pixel por formato de video. */
export const VIDEO_DIMENSIONS: Record<VideoFormat, { width: number; height: number; fps: number }> = {
  VERTICAL: { width: 1080, height: 1920, fps: 30 },
  HORIZONTAL: { width: 1920, height: 1080, fps: 30 },
  SQUARE: { width: 1080, height: 1080, fps: 30 },
};

/** Metadados de cada cena para a galeria (titulo, tier, descricao). */
export interface RevealModuleMeta {
  id: RevealModule;
  title: Record<"pt-BR" | "es-ES" | "en", string>;
  tier: 1 | 2 | 3;
  /** plano minimo necessario */
  minPlan: "FREE" | "PRO" | "BUSINESS";
}

export const REVEAL_MODULE_META: Partial<Record<RevealModule, RevealModuleMeta>> = {
  oscar_envelope: {
    id: "oscar_envelope",
    title: { "pt-BR": "Envelope Dourado", "es-ES": "Sobre Dorado", en: "Golden Envelope" },
    tier: 1,
    minPlan: "FREE",
  },
  comment_matrix: {
    id: "comment_matrix",
    title: { "pt-BR": "Matrix de Comentarios", "es-ES": "Matrix de Comentarios", en: "Comment Matrix" },
    tier: 1,
    minPlan: "FREE",
  },
  hologram: {
    id: "hologram",
    title: { "pt-BR": "Holograma Futurista", "es-ES": "Holograma Futurista", en: "Futuristic Hologram" },
    tier: 1,
    minPlan: "FREE",
  },
};
