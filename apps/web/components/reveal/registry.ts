"use client";

import type { ComponentType } from "react";
import type { RevealModule, RevealSpec } from "@prizegram/reveal-spec";
import type { RevealClock } from "./engine/useRevealClock";
import { OscarEnvelope } from "./scenes/OscarEnvelope";
import { StageHost } from "./scenes/StageHost";

export interface SceneProps {
  spec: RevealSpec;
  clock: RevealClock;
}

/**
 * Mapa id da cena -> componente R3F.
 * As 24 cenas do blueprint vivem aqui; implementadas sob demanda.
 * (oscar_envelope e a prova de conceito da Fase 0.)
 */
export const REVEAL_SCENES: Partial<Record<RevealModule, ComponentType<SceneProps>>> = {
  oscar_envelope: OscarEnvelope,
  stage_host: StageHost,
};

export function getScene(module: RevealModule): ComponentType<SceneProps> | null {
  return REVEAL_SCENES[module] ?? null;
}
