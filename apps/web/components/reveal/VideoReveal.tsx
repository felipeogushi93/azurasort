"use client";

import { getHostLine, type RevealSpec } from "@prizegram/reveal-spec";
import { useRevealClock, ramp, easeCinematic } from "./engine/useRevealClock";
import { StagePlaceholder } from "./StagePlaceholder";

/**
 * VideoReveal — cena baseada em VIDEO REAL + overlays dinamicos.
 *
 * Fundo: um <video> (filmagem, stock ou gerado por IA) quando spec.backgroundVideoUrl
 * existe; senao, um placeholder de palco em CSS. Por cima, sincronizado pela
 * mesma timeline da engine:
 *   - a frase localizada que a apresentadora "fala" (BR: "E o premio vai para...")
 *   - o cartao que se abre revelando o @ do vencedor
 *
 * Esta e a arquitetura de producao: o mesmo overlay roda no browser e no
 * render de video (Remotion) sobre o mesmo clipe -> paridade total.
 */
export function VideoReveal({
  spec,
  loop = false,
}: {
  spec: RevealSpec;
  loop?: boolean;
}) {
  const clock = useRevealClock(spec.timeline, { loop });
  const t = clock.timeMs;
  const tl = spec.timeline;
  const winner = spec.winners.find((w) => w.position === 1) ?? spec.winners[0];
  const line = getHostLine(spec.locale);

  // frase falada: entra no build-up, some ao revelar
  const captionIn = ramp(t, tl.buildUpAtMs, tl.buildUpAtMs + 600);
  const captionOut = ramp(t, tl.revealAtMs, tl.revealAtMs + 300);
  const caption = captionIn * (1 - captionOut);

  // cartao abrindo + @ surgindo
  const cardIn = easeCinematic(ramp(t, tl.revealAtMs - 400, tl.revealAtMs));
  const flap = easeCinematic(ramp(t, tl.revealAtMs, tl.revealAtMs + 650)); // 0 fechado -> 1 aberto
  const handleIn = ramp(t, tl.revealAtMs + 200, tl.revealAtMs + 700);
  const burst = ramp(t, tl.revealAtMs, tl.revealAtMs + 200) * (1 - ramp(t, tl.revealAtMs + 200, tl.revealAtMs + 700));

  const gold = spec.branding.primaryColor;
  const accent = spec.branding.accentColor;

  return (
    <div className="relative h-full w-full overflow-hidden bg-void">
      {/* FUNDO: video real ou placeholder de palco */}
      {spec.backgroundVideoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={spec.backgroundVideoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <StagePlaceholder gold={gold} phase={clock.phase} />
      )}

      {/* vinheta para legibilidade dos overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      {/* burst de luz no momento do reveal */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 55%, ${gold}, transparent 60%)`,
          opacity: burst * 0.5,
          mixBlendMode: "screen",
        }}
      />

      {/* FRASE FALADA (localizada) — legenda da apresentadora */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[26%] flex justify-center px-6 text-center"
        style={{ opacity: caption, transform: `translateY(${(1 - caption) * 8}px)` }}
      >
        <p
          className="font-display text-xl leading-snug text-white sm:text-2xl"
          style={{ textShadow: "0 2px 18px rgba(0,0,0,0.9)" }}
        >
          {line}
        </p>
      </div>

      {/* CARTAO que abre no @ do vencedor */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-[16%] flex justify-center"
        style={{ opacity: cardIn, transform: `scale(${0.85 + cardIn * 0.15})` }}
      >
        <div
          className="relative"
          style={{ perspective: "800px" }}
        >
          {/* corpo do cartao (revela o @) */}
          <div
            className="relative flex w-56 flex-col items-center justify-center gap-1 rounded-xl border px-5 py-6"
            style={{
              borderColor: gold,
              background: "rgba(13,15,23,0.92)",
              boxShadow: `0 0 ${20 + burst * 60}px -8px ${gold}`,
            }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: accent, opacity: handleIn }}
            >
              Vencedor
            </span>
            <span
              className="font-display text-3xl"
              style={{
                color: gold,
                opacity: handleIn,
                transform: `scale(${0.9 + handleIn * 0.1})`,
                textShadow: `0 0 24px ${gold}80`,
              }}
            >
              @{winner.handle}
            </span>
            <span className="text-xs text-lo" style={{ opacity: handleIn * 0.85 }}>
              {winner.displayName}
            </span>

            {/* FLAP — tampa do cartao que levanta ao abrir */}
            <div
              className="absolute inset-x-0 top-0 origin-top rounded-t-xl border-x border-t"
              style={{
                height: "50%",
                borderColor: gold,
                background: `linear-gradient(160deg, ${gold}, ${spec.branding.primaryColor}cc)`,
                transform: `rotateX(${-flap * 175}deg)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                opacity: 1 - ramp(t, tl.revealAtMs + 400, tl.revealAtMs + 700),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="font-display text-2xl text-void">✦</span>
            </div>
          </div>
        </div>
      </div>

      {/* barra de suspense */}
      {!clock.revealed && (
        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2">
          <div className="h-1 w-32 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full"
              style={{ width: `${Math.round(clock.progress * 100)}%`, background: accent }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
