/**
 * Design tokens do AzuraSort.
 *
 * Tema do SITE: "Light Luxury" — claro, premium, sofisticado (AAAAA).
 * Tema das CENAS de revelacao: permanece escuro (cinema), ver `reveal`.
 */

/* ----------------------------- SITE (light) ----------------------------- */
export const light = {
  canvas: "#FBFAF7", // ivory quente (fundo da pagina)
  canvasAlt: "#F4F1EA", // secao alternada
  surface: "#FFFFFF", // cards
  ink: "#16141D", // texto principal (quase preto quente)
  inkSoft: "#6B6873", // texto secundario
  line: "#1614210F", // bordas (preto 6%)
  gold: "#C2922E", // ouro legivel em fundo claro
  goldHi: "#E8C26B", // ouro claro (gradiente)
  goldDeep: "#8A6314", // ouro escuro (texto forte)
  violet: "#6D54F7", // acento premium
  rose: "#F26B8A", // acento quente
  emerald: "#16A34A",
} as const;

/* --------------------- CENAS de revelacao (dark) ------------------------ */
export const reveal = {
  bgVoid: "#05060A",
  bgElevated: "#0D0F17",
  goldHi: "#E8C26B",
  goldLo: "#B8862F",
  neonCyan: "#3DF5FF",
  neonMagenta: "#FF2DAA",
  neonViolet: "#8A5BFF",
  textHi: "#F5F7FF",
  textLo: "#8A90A6",
} as const;

/** alias retrocompat: cenas e codigo antigo continuam usando `colors.*` */
export const colors = reveal;

/** Curvas de easing — a alma do produto. */
export const easing = {
  cinematic: [0.16, 1, 0.3, 1] as const,
  snap: [0.7, 0, 0.2, 1] as const,
};

export const easingCss = {
  cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
  snap: "cubic-bezier(0.7, 0, 0.2, 1)",
};

export const duration = {
  micro: 120,
  ui: 320,
  revealBeatMin: 600,
  revealBeatMax: 1400,
} as const;

export type ColorToken = keyof typeof reveal;
