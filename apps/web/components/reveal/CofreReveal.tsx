"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Revelação por VÍDEO + nome do vencedor.
 *
 * Toca um vídeo (com som) e, no momento em que o vídeo mostra o lugar do nome,
 * sobrepõe o @ do vencedor em DOURADO — e o mantém fixo até o fim.
 *
 * - `showBand`: desenha uma faixa preta para cobrir um nome já gravado (ex: cofre
 *   tem "WINNER_USERNAME" gravado). Quando o vídeo já tem um cartão preto (ex:
 *   contagem regressiva), use showBand=false e só o @ aparece sobre o cartão.
 *
 * Posições em % do VÍDEO (não da tela) — alinhamento mantém em qualquer tamanho.
 */
export function CofreReveal({
  handle,
  src = "/cofre.mp4",
  revealAtSec = 3.9,
  loop = false,
  showBand = true,
  band = { left: 12, top: 42, width: 80, height: 24 },
  textLeft = 52,
  textTop = 54,
  rotation = 0,
  fontScale = 0.045,
}: {
  handle: string;
  src?: string;
  revealAtSec?: number;
  loop?: boolean;
  showBand?: boolean;
  band?: { left: number; top: number; width: number; height: number };
  textLeft?: number;
  textTop?: number;
  rotation?: number;
  fontScale?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [t, setT] = useState(0);
  const [w, setW] = useState(0);
  const [muted, setMuted] = useState(false);
  const show = t >= revealAtSec;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // tenta tocar COM SOM; se o navegador bloquear, cai pra mudo + botao de ativar
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
  }, []);

  function enableSound() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    void v.play();
  }

  const fontPx = Math.max(14, w * fontScale);

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-void">
      <div ref={wrapRef} className="relative inline-block">
        <video
          ref={videoRef}
          src={src}
          muted={muted}
          playsInline
          loop={loop}
          onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
          className="block max-h-screen max-w-full"
        />

        {/* fallback: navegador bloqueou autoplay com som */}
        {muted && (
          <button
            onClick={enableSound}
            className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-black/80"
          >
            🔊 Ativar som
          </button>
        )}

        {show && (
          <>
            {showBand && (
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
            )}
            <span
              className="absolute whitespace-nowrap font-display font-bold tracking-wide"
              style={{
                top: `${textTop}%`,
                left: `${textLeft}%`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
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
