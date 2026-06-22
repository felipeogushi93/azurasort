"use client";

import { useMemo } from "react";
import { Text, Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";
import type { RevealSpec } from "@prizegram/reveal-spec";
import {
  ramp,
  easeCinematic,
  type RevealClock,
} from "../engine/useRevealClock";

/**
 * Cena de revelacao "Envelope Dourado" (estilo Oscar).
 *
 * Beats (timeline padrao):
 *   intro   0-1s   envelope flutua e entra
 *   buildup 1-4.9s dolly-in lento, lacre brilha
 *   hush    4.9-5.5s quase-silencio, leve tremor de tensao
 *   reveal  5.5s   aba abre, carta desliza, nome em foil dourado, burst
 *   celebrate >5.9s sparkles, nome pulsa
 *
 * Tudo derivado de `clock.timeMs` => mesma funcao roda no browser e no Remotion.
 */
export function OscarEnvelope({
  spec,
  clock,
}: {
  spec: RevealSpec;
  clock: RevealClock;
}) {
  const t = clock.timeMs;
  const tl = spec.timeline;
  const winner = spec.winners.find((w) => w.position === 1) ?? spec.winners[0];

  const gold = useMemo(() => new THREE.Color(spec.branding.primaryColor), [
    spec.branding.primaryColor,
  ]);

  // --- camera dolly-in (z: 6 -> 3.4) durante o build-up ---
  const dolly = easeCinematic(ramp(t, 0, tl.revealAtMs));
  const camZ = 6 - dolly * 2.6;

  // --- tremor de tensao no "hush" ---
  const hush = ramp(t, tl.revealAtMs - tl.preRevealHushMs, tl.revealAtMs);
  const shake = clock.phase === "hush" ? Math.sin(t * 0.06) * 0.015 * hush : 0;

  // --- abertura da aba do envelope (0 fechado -> -PI*0.9 aberto) ---
  const openT = easeCinematic(ramp(t, tl.revealAtMs, tl.revealAtMs + 700));
  const flapAngle = -openT * Math.PI * 0.9;

  // --- carta desliza para cima ao revelar ---
  const cardRise = easeCinematic(ramp(t, tl.revealAtMs + 150, tl.revealAtMs + 900));
  const cardY = -0.2 + cardRise * 1.0;
  const cardOpacity = ramp(t, tl.revealAtMs + 150, tl.revealAtMs + 600);

  // --- intensidade do brilho do lacre cresce no build-up, estoura no reveal ---
  const sealGlow = 0.4 + ramp(t, tl.buildUpAtMs, tl.revealAtMs) * 1.6;
  const burst = ramp(t, tl.revealAtMs, tl.revealAtMs + 250) * (1 - ramp(t, tl.revealAtMs + 250, tl.revealAtMs + 800));

  // pulso do nome na celebracao
  const namePulse = clock.phase === "celebrate" ? 1 + Math.sin(t * 0.008) * 0.03 : 1;

  return (
    <group>
      {/* camera controlada pela timeline */}
      <PerspectiveRig z={camZ} shakeX={shake} />

      {/* iluminacao: key dourada quente cenital + rim + ambiente baixo */}
      <ambientLight intensity={0.15} />
      <spotLight
        position={[0, 6, 4]}
        angle={0.5}
        penumbra={0.8}
        intensity={2.2 + burst * 6}
        color={gold}
        castShadow
      />
      <pointLight position={[-4, 1, 3]} intensity={0.6} color={"#3DF5FF"} />
      <pointLight position={[4, -2, 2]} intensity={0.5} color={spec.branding.accentColor} />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <group position={[0, 0, 0]}>
          {/* corpo do envelope */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3, 2, 0.08]} />
            <meshStandardMaterial
              color={gold}
              metalness={0.9}
              roughness={0.25}
              emissive={gold}
              emissiveIntensity={0.05}
            />
          </mesh>

          {/* aba do envelope (gira ao abrir) */}
          <group position={[0, 1, 0.05]} rotation={[flapAngle, 0, 0]}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[3, 1, 0.06]} />
              <meshStandardMaterial
                color={gold}
                metalness={0.95}
                roughness={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>

          {/* lacre de cera vermelho com brilho crescente */}
          {openT < 0.05 && (
            <mesh position={[0, 0.55, 0.12]}>
              <cylinderGeometry args={[0.28, 0.28, 0.06, 32]} />
              <meshStandardMaterial
                color={"#8E1B2E"}
                metalness={0.3}
                roughness={0.5}
                emissive={"#FF2D55"}
                emissiveIntensity={sealGlow}
              />
            </mesh>
          )}

          {/* carta que sobe com o nome do vencedor */}
          <group position={[0, cardY, -0.2]}>
            <mesh>
              <planeGeometry args={[2.6, 1.4]} />
              <meshStandardMaterial
                color={"#0D0F17"}
                transparent
                opacity={cardOpacity}
                metalness={0.1}
                roughness={0.6}
              />
            </mesh>
            {cardOpacity > 0.1 && (
              <group position={[0, 0, 0.02]} scale={namePulse}>
                <Text
                  position={[0, 0.32, 0]}
                  fontSize={0.16}
                  color={spec.branding.accentColor}
                  anchorX="center"
                  anchorY="middle"
                  fillOpacity={cardOpacity}
                  letterSpacing={0.18}
                >
                  E O VENCEDOR E
                </Text>
                <Text
                  position={[0, -0.02, 0]}
                  fontSize={0.34}
                  color={gold}
                  anchorX="center"
                  anchorY="middle"
                  fillOpacity={cardOpacity}
                  maxWidth={2.4}
                  textAlign="center"
                >
                  {winner.displayName}
                </Text>
                <Text
                  position={[0, -0.42, 0]}
                  fontSize={0.13}
                  color={"#F5F7FF"}
                  anchorX="center"
                  anchorY="middle"
                  fillOpacity={cardOpacity * 0.8}
                >
                  {"@" + winner.handle}
                </Text>
              </group>
            )}
          </group>
        </group>
      </Float>

      {/* particulas douradas explodem no reveal e ficam na celebracao */}
      {clock.revealed && (
        <Sparkles
          count={120}
          scale={[7, 5, 3]}
          size={4 + burst * 10}
          speed={0.4}
          color={gold}
          opacity={0.9}
        />
      )}

      {/* selo de prova de escala */}
      {spec.participantCount > 0 && clock.phase !== "celebrate" && (
        <Text
          position={[0, -1.7, 0.5]}
          fontSize={0.11}
          color={"#8A90A6"}
          anchorX="center"
          anchorY="middle"
        >
          {spec.participantCount.toLocaleString("pt-BR") + " participantes"}
        </Text>
      )}
    </group>
  );
}

/** Ajusta a camera a partir da timeline (sem OrbitControls — cinema, nao ferramenta). */
import { useThree, useFrame } from "@react-three/fiber";

function PerspectiveRig({ z, shakeX }: { z: number; shakeX: number }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.set(shakeX, 0, z);
    camera.lookAt(0, 0, 0);
  });
  return null;
}
