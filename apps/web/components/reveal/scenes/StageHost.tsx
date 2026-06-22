"use client";

import { useMemo } from "react";
import { Text, Sparkles } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getHostLine, type RevealSpec } from "@prizegram/reveal-spec";
import { ramp, easeCinematic, type RevealClock } from "../engine/useRevealClock";

/**
 * Cena "Palco com Apresentadora".
 *
 * Uma apresentadora (silhueta elegante de vestido longo) sob um holofote no
 * palco segura um cartao. Ela "anuncia" — legenda localizada por pais
 * (BR: "E o premio vai para...") — e o cartao se abre revelando o @ do vencedor.
 *
 * Tudo derivado de clock.timeMs => mesma cena no browser e no video (Remotion).
 */
export function StageHost({ spec, clock }: { spec: RevealSpec; clock: RevealClock }) {
  const t = clock.timeMs;
  const tl = spec.timeline;
  const winner = spec.winners.find((w) => w.position === 1) ?? spec.winners[0];
  const gold = useMemo(() => new THREE.Color(spec.branding.primaryColor), [spec.branding.primaryColor]);
  const hostLine = getHostLine(spec.locale);

  // perfil do vestido longo (silhueta feminina estilizada) via LatheGeometry
  const gownPoints = useMemo(
    () =>
      [
        [0.0, 0.0],
        [0.62, 0.02],
        [0.5, 0.45],
        [0.36, 1.0],
        [0.24, 1.45], // cintura
        [0.3, 1.7], // busto
        [0.17, 1.95], // ombros
        [0.0, 2.05],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    []
  );

  // --- entrada: holofote e apresentadora surgem ---
  const enter = easeCinematic(ramp(t, 0, tl.buildUpAtMs + 400));

  // --- legenda falada aparece no build-up ---
  const captionIn = ramp(t, tl.buildUpAtMs, tl.buildUpAtMs + 700);
  const captionOut = ramp(t, tl.revealAtMs, tl.revealAtMs + 300); // some ao revelar
  const captionOpacity = captionIn * (1 - captionOut);

  // --- tensao no hush: leve respiro do holofote ---
  const hush = ramp(t, tl.revealAtMs - tl.preRevealHushMs, tl.revealAtMs);

  // --- reveal: cartao sobe ao centro, cresce e o @ aparece ---
  const cardLift = easeCinematic(ramp(t, tl.revealAtMs, tl.revealAtMs + 800));
  const handleIn = ramp(t, tl.revealAtMs + 250, tl.revealAtMs + 800);
  const burst = ramp(t, tl.revealAtMs, tl.revealAtMs + 220) * (1 - ramp(t, tl.revealAtMs + 220, tl.revealAtMs + 750));

  // cartao: da mao (0.34, 1.15, 0.55) para o centro do palco (0, 0.9, 1.1)
  const cardPos: [number, number, number] = [
    0.34 - cardLift * 0.34,
    1.15 - cardLift * 0.25,
    0.55 + cardLift * 0.55,
  ];
  const cardScale = 0.5 + cardLift * 0.85;

  const spotPulse = 1 + Math.sin(t * 0.01) * 0.04 * (0.4 + hush);
  const namePulse = clock.phase === "celebrate" ? 1 + Math.sin(t * 0.008) * 0.03 : 1;

  return (
    <group position={[0, -1.0, 0]}>
      <StageRig revealed={clock.revealed} />

      {/* luz: holofote quente cenital + rim atras (silhueta) + fill baixo */}
      <ambientLight intensity={0.08} />
      <spotLight
        position={[0, 5, 3.5]}
        angle={0.42}
        penumbra={0.9}
        intensity={(3 + burst * 8) * spotPulse * enter}
        color={gold}
        target-position={[0, 1, 0]}
        castShadow
      />
      <pointLight position={[0, 2.4, -2.5]} intensity={2.2 * enter} color={spec.branding.accentColor} />
      <pointLight position={[2.5, 0.5, 2]} intensity={0.4} color={"#FF2DAA"} />

      {/* feixe de luz volumetrico (cone translucido) */}
      <mesh position={[0, 3.2, 2.4]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.7, 4.5, 32, 1, true]} />
        <meshBasicMaterial
          color={gold}
          transparent
          opacity={0.06 * enter * spotPulse}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* APRESENTADORA — silhueta */}
      <group scale={[enter, enter, enter]} position={[0, 0, 0]}>
        {/* vestido longo */}
        <mesh castShadow>
          <latheGeometry args={[gownPoints, 48]} />
          <meshStandardMaterial color={"#0A0B12"} metalness={0.4} roughness={0.5} emissive={gold} emissiveIntensity={0.06} />
        </mesh>
        {/* cabeca */}
        <mesh position={[0, 2.28, 0]} castShadow>
          <sphereGeometry args={[0.17, 32, 32]} />
          <meshStandardMaterial color={"#0A0B12"} metalness={0.3} roughness={0.6} emissive={gold} emissiveIntensity={0.05} />
        </mesh>
        {/* cabelo (volume atras) */}
        <mesh position={[0, 2.24, -0.06]}>
          <sphereGeometry args={[0.21, 24, 24]} />
          <meshStandardMaterial color={"#07080D"} roughness={0.8} />
        </mesh>
        {/* braco estendido segurando o cartao */}
        <mesh position={[0.22, 1.55, 0.28]} rotation={[0.5, 0, -0.5]}>
          <capsuleGeometry args={[0.05, 0.55, 4, 12]} />
          <meshStandardMaterial color={"#0A0B12"} roughness={0.6} emissive={gold} emissiveIntensity={0.05} />
        </mesh>
      </group>

      {/* LEGENDA FALADA (localizada) */}
      {captionOpacity > 0.01 && (
        <group position={[0, 2.95, 1.5]}>
          <Text
            fontSize={0.2}
            color={"#F5F7FF"}
            anchorX="center"
            anchorY="middle"
            fillOpacity={captionOpacity}
            maxWidth={3.2}
            textAlign="center"
            outlineWidth={0.004}
            outlineColor={"#000000"}
          >
            {hostLine}
          </Text>
        </group>
      )}

      {/* CARTAO + @ DO VENCEDOR */}
      <group position={cardPos} scale={cardScale}>
        <mesh>
          <planeGeometry args={[1.5, 0.95]} />
          <meshStandardMaterial color={"#0D0F17"} metalness={0.2} roughness={0.4} emissive={gold} emissiveIntensity={0.15 + burst} />
        </mesh>
        {/* borda dourada */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.6, 1.05]} />
          <meshBasicMaterial color={gold} />
        </mesh>
        {handleIn > 0.05 && (
          <group position={[0, 0, 0.02]} scale={namePulse}>
            <Text position={[0, 0.22, 0]} fontSize={0.1} color={spec.branding.accentColor} anchorX="center" anchorY="middle" fillOpacity={handleIn} letterSpacing={0.12}>
              VENCEDOR
            </Text>
            <Text position={[0, -0.05, 0]} fontSize={0.26} color={gold} anchorX="center" anchorY="middle" fillOpacity={handleIn} maxWidth={1.4} textAlign="center">
              {"@" + winner.handle}
            </Text>
            <Text position={[0, -0.32, 0]} fontSize={0.085} color={"#F5F7FF"} anchorX="center" anchorY="middle" fillOpacity={handleIn * 0.8}>
              {winner.displayName}
            </Text>
          </group>
        )}
      </group>

      {/* confete dourado na revelacao */}
      {clock.revealed && (
        <Sparkles count={100} scale={[6, 6, 3]} position={[0, 2, 1]} size={3 + burst * 9} speed={0.5} color={gold} opacity={0.9} />
      )}
    </group>
  );
}

/** Piso refletivo do palco + camera controlada pela timeline. */
function StageRig({ revealed }: { revealed: boolean }) {
  const { camera } = useThree();
  useFrame((state) => {
    // leve push-in continuo + drift do reveal
    const z = revealed ? 4.6 : 5.2;
    camera.position.lerp(new THREE.Vector3(0, 1.0, z), 0.04);
    camera.lookAt(0, 1.0, 0);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <circleGeometry args={[6, 64]} />
      <meshStandardMaterial color={"#070810"} metalness={0.8} roughness={0.3} />
    </mesh>
  );
}
