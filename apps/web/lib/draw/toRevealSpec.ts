import { parseRevealSpec, type RevealModule, type RevealSpec, type Locale } from "@prizegram/reveal-spec";
import type { DrawResult } from "./types";

/** Transforma "@joao.silva" em "Joao Silva" (nome de exibicao amigavel). */
function prettyName(handle: string): string {
  return handle
    .replace(/[._]+/g, " ")
    .replace(/\d+/g, "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || handle;
}

const TIMELINES: Record<string, RevealSpec["timeline"]> = {
  oscar_envelope: { durationMs: 8000, buildUpAtMs: 1000, preRevealHushMs: 600, revealAtMs: 5500 },
  stage_host: { durationMs: 9000, buildUpAtMs: 1200, preRevealHushMs: 800, revealAtMs: 6000 },
};

/** Constroi a RevealSpec a partir de um resultado de sorteio real. */
export function buildRevealSpecFromDraw(
  result: DrawResult,
  opts: {
    module: RevealModule;
    locale?: Locale;
    campaignName: string;
    drawId?: string;
  }
): RevealSpec {
  const module = opts.module;
  const winners = result.winners
    .filter((w) => !w.isBackup)
    .map((w) => ({
      position: w.position,
      isBackup: false,
      displayName: prettyName(w.handle),
      handle: w.handle,
    }));

  return parseRevealSpec({
    specVersion: 1,
    drawId: opts.drawId ?? "sim",
    module,
    locale: opts.locale ?? "pt-BR",
    participantCount: result.eligibleCount,
    winners: winners.length ? winners : [{ position: 1, displayName: "—", handle: "—" }],
    branding: {
      campaignName: opts.campaignName || "Sorteio",
      primaryColor: "#E8C26B",
      accentColor: "#3DF5FF",
      watermark: true,
    },
    audio: { muted: true },
    timeline: TIMELINES[module] ?? TIMELINES.oscar_envelope,
    certificateHash: result.certificateHash.slice(0, 16),
  });
}
