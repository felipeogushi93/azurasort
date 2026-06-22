"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Revelação "Cofre" — toca o vídeo do cofre e, no momento em que o vídeo mostra
 * "WINNER_USERNAME" ao lado do logo do Instagram, cobre esse texto com uma
 * FAIXA PRETA e escreve o @ do vencedor em DOURADO no lugar.
 *
 * O overlay fica ancorado ao VÍDEO (não ao container), então o alinhamento se
 * mantém em qualquer tela. Posição/tempo são props — fáceis de calibrar.
 */
export function CofreReveal({
  handle,
  revealAtSec = 3.9, // segundo em que o nome surge no vídeo
  loop = false,
  // região (% do vídeo) da faixa que cobre o logo do Insta + "WINNER_USERNAME"
  band = { left: 12, top: 42, width: 80, height: 24 },
  // centro do @ (% do vídeo)
  textLeft = 52,
  textTop = 54,
}: {
  handle: string;
  revealAtSec?: number;
  loop?: boolean;
  band?: { left: number; top: number; width: number; height: number };
  textLeft?: number;
  textTop?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [w, setW] = useState(0);
  const show = t >= revealAtSec;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const fontPx = Math.max(14, w * 0.045);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-void">
      <div ref={wrapRef} className="relative inline-block">
        <video
          src="/cofre.mp4"
          autoPlay
          muted
          playsInline
          loop={loop}
          onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
          className="block max-h-screen max-w-full"
        />

        {show && (
          <>
            {/* faixa preta cobrindo o "WINNER_USERNAME" gravado no vídeo */}
            <div
              className="absolute"
              style={{
                left: `${band.left}%`,
                top: `${band.top}%`,
                width: `${band.width}%`,
                height: `${band.height}%`,
                background: "#000",
                borderRadius: fontPx * 0.18,
                boxShadow: "0 0 0 1px rgba(232,194,107,0.25), 0 0 24px rgba(0,0,0,0.6)",
              }}
            />
            {/* @ do vencedor em dourado, no lugar do nome */}
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display font-bold tracking-wide"
              style={{
                top: `${textTop}%`,
                left: `${textLeft}%`,
                fontSize: fontPx,
                background: "linear-gradient(180deg, #F6DFA0, #E8C26B 45%, #B8862F)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "0 0 24px rgba(232,194,107,0.4)",
              }}
            >
              @{handle}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
