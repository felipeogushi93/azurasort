"use client";

import { useEffect, useRef, useState } from "react";
import type { Timeline } from "@prizegram/reveal-spec";

export type RevealPhase = "intro" | "buildup" | "hush" | "reveal" | "celebrate";

export interface RevealClock {
  /** tempo decorrido em ms (clampado a durationMs) */
  timeMs: number;
  /** progresso 0..1 da cena inteira */
  progress: number;
  phase: RevealPhase;
  /** ja passou do momento do reveal? */
  revealed: boolean;
  done: boolean;
}

function phaseFor(timeMs: number, t: Timeline): RevealPhase {
  if (timeMs >= t.revealAtMs) {
    return timeMs >= t.revealAtMs + 400 ? "celebrate" : "reveal";
  }
  if (timeMs >= t.revealAtMs - t.preRevealHushMs) return "hush";
  if (timeMs >= t.buildUpAtMs) return "buildup";
  return "intro";
}

/**
 * Relogio da revelacao.
 *
 * - No browser: avanca em tempo real via requestAnimationFrame.
 * - No render de video (Remotion): passe `overrideMs` com o tempo do frame atual
 *   (frame / fps * 1000) para obter PARIDADE determinismo total com a tela.
 */
export function useRevealClock(
  timeline: Timeline,
  opts: { playing?: boolean; overrideMs?: number; loop?: boolean } = {}
): RevealClock {
  const { playing = true, overrideMs, loop = false } = opts;
  const [timeMs, setTimeMs] = useState(overrideMs ?? 0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // quanto tempo segura na celebracao antes de reiniciar (somente em loop)
  const LOOP_HOLD_MS = 1800;

  useEffect(() => {
    // modo controlado (video): apenas reflete o tempo injetado
    if (overrideMs !== undefined) {
      setTimeMs(Math.min(overrideMs, timeline.durationMs));
      return;
    }
    if (!playing) return;

    const total = timeline.durationMs + (loop ? LOOP_HOLD_MS : 0);

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      let elapsed = now - startRef.current;
      if (loop && elapsed >= total) {
        startRef.current = now;
        elapsed = 0;
      }
      setTimeMs(Math.min(elapsed, timeline.durationMs));
      if (loop || elapsed < timeline.durationMs) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = null;
    };
  }, [playing, overrideMs, loop, timeline.durationMs]);

  const clamped = Math.min(timeMs, timeline.durationMs);
  return {
    timeMs: clamped,
    progress: clamped / timeline.durationMs,
    phase: phaseFor(clamped, timeline),
    revealed: clamped >= timeline.revealAtMs,
    done: clamped >= timeline.durationMs,
  };
}

/** Utilitario: interpola 0..1 entre dois instantes, com clamp. */
export function ramp(timeMs: number, fromMs: number, toMs: number): number {
  if (toMs <= fromMs) return timeMs >= toMs ? 1 : 0;
  return Math.max(0, Math.min(1, (timeMs - fromMs) / (toMs - fromMs)));
}

/** Easing cinematografico (mesma curva dos design tokens). */
export function easeCinematic(t: number): number {
  // aproximacao de cubic-bezier(0.16, 1, 0.3, 1): forte ease-out com overshoot suave
  return 1 - Math.pow(1 - t, 3);
}
