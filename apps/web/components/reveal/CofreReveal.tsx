"use client";

import { useRef, useState } from "react";

/**
 * Revelação "Cofre" — toca o vídeo do cofre (AI) e sobrepõe o @ do vencedor
 * em dourado no momento em que o nome aparece ao lado do símbolo do Instagram.
 *
 * O overlay é sincronizado pelo TEMPO REAL do vídeo (currentTime), então o @
 * aparece exatamente no ponto certo mesmo se o vídeo travar/bufferizar.
 *
 * Ajustes finos (posição/tempo) ficam nas props — fáceis de calibrar.
 */
export function CofreReveal({
  handle,
  revealAtSec = 4.3, // segundo em que o nome surge no vídeo
  top = "50%", // posição vertical do @ (ajustável)
  left = "50%", // posição horizontal do @
  fontSize = "clamp(1.5rem, 6vw, 3rem)",
  loop = false,
}: {
  handle: string;
  revealAtSec?: number;
  top?: string;
  left?: string;
  fontSize?: string;
  loop?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [t, setT] = useState(0);
  const show = t >= revealAtSec;

  return (
    <div className="relative h-full w-full overflow-hidden bg-void">
      <video
        ref={videoRef}
        src="/cofre.mp4"
        autoPlay
        muted
        playsInline
        loop={loop}
        onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
        className="h-full w-full object-contain"
      />

      {/* @ do vencedor em dourado, sincronizado com o vídeo */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500"
        style={{
          top,
          left,
          opacity: show ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${show ? 1 : 0.9})`,
        }}
      >
        <span
          className="font-display font-semibold"
          style={{
            fontSize,
            background: "linear-gradient(180deg, #F6DFA0, #E8C26B 45%, #B8862F)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 0 30px rgba(232,194,107,0.45)",
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.6))",
          }}
        >
          @{handle}
        </span>
      </div>
    </div>
  );
}
