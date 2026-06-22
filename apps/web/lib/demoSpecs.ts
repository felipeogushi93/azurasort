import { parseRevealSpec, type RevealSpec } from "@prizegram/reveal-spec";

/**
 * >>> PARA USAR UM VIDEO REAL NO PALCO <<<
 * 1. Coloque o arquivo em apps/web/public/  (ex: apps/web/public/stage.mp4)
 * 2. Troque o valor abaixo para "/stage.mp4"  (ou uma URL https://... de CDN)
 * Enquanto for undefined, aparece o placeholder de palco em CSS.
 */
const STAGE_VIDEO_URL: string | undefined = undefined;

/** Spec de demonstracao da cena Oscar — em producao vem do banco apos o sorteio. */
export function buildDemoSpec(drawId = "demo"): RevealSpec {
  return parseRevealSpec({
    specVersion: 1,
    drawId,
    module: "oscar_envelope",
    locale: "pt-BR",
    participantCount: 3214,
    winners: [{ position: 1, displayName: "Mariana Costa", handle: "mari.costa" }],
    branding: {
      campaignName: "Sorteio iPhone 16 Pro",
      primaryColor: "#E8C26B",
      accentColor: "#3DF5FF",
      watermark: true,
    },
    audio: { muted: true },
    timeline: {
      durationMs: 8000,
      buildUpAtMs: 1000,
      preRevealHushMs: 600,
      revealAtMs: 5500,
    },
    certificateHash: "demo-0xA1B2C3",
  });
}

/** Spec de demonstracao da cena "Palco com Apresentadora". */
export function buildStageHostSpec(
  drawId = "stage",
  locale: RevealSpec["locale"] = "pt-BR"
): RevealSpec {
  return parseRevealSpec({
    specVersion: 1,
    drawId,
    module: "stage_host",
    locale,
    participantCount: 4820,
    winners: [{ position: 1, displayName: "Mariana Costa", handle: "mari.costa" }],
    branding: {
      campaignName: "Sorteio iPhone 16 Pro",
      primaryColor: "#E8C26B",
      accentColor: "#3DF5FF",
      watermark: true,
    },
    audio: { muted: true },
    timeline: {
      durationMs: 9000,
      buildUpAtMs: 1200,
      preRevealHushMs: 800,
      revealAtMs: 6000,
    },
    certificateHash: "demo-0xST4GE",
    ...(STAGE_VIDEO_URL ? { backgroundVideoUrl: STAGE_VIDEO_URL } : {}),
  });
}
