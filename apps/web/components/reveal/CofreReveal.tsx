"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Revelação por VÍDEO + nome do vencedor, com SUSPENSE.
 *
 * 1. Mostra uma tela de suspense ("Abrindo o cofre…") por `suspenseMs`.
 * 2. Toca o vídeo mais devagar (`playbackRate`) e com som AMPLIFICADO (Web Audio).
 * 3. No momento do nome, sobrepõe o @ do vencedor em DOURADO + toca um "clank" de cofre.
 *
 * `showBand`: faixa preta para cobrir um nome já gravado no vídeo (ex.: cofre).
 * Posições em % do VÍDEO (não da tela).
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
  suspenseMs = 2600,
  playbackRate = 1,
  silent = false,
  openingLabel = "Abrindo o cofre…",
  soundLabel = "🔊 Ativar som",
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
  suspenseMs?: number;
  playbackRate?: number;
  silent?: boolean;
  openingLabel?: string;
  soundLabel?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [t, setT] = useState(0);
  const [w, setW] = useState(0);
  const [muted, setMuted] = useState(false);
  const [suspense, setSuspense] = useState(true);
  const show = t >= revealAtSec;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // SUSPENSE: segura o vídeo, depois toca com SOM NATIVO do vídeo (sem efeitos)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = playbackRate;
    v.pause();
    const id = setTimeout(() => {
      setSuspense(false);
      if (silent) {
        v.muted = true;
        v.play().catch(() => {});
        return;
      }
      v.muted = false;
      v.play().catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      });
    }, suspenseMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          muted={muted || silent}
          playsInline
          loop={loop}
          onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
          className="block max-h-full max-w-full"
        />

        {/* SUSPENSE: tela de tensão antes de abrir */}
        {suspense && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-void/90 backdrop-blur-sm">
            <span className="animate-[pulse-slow_1.4s_ease-in-out_infinite] text-6xl">🔒</span>
            <p className="font-display text-xl font-bold tracking-wide text-white sm:text-2xl">{openingLabel}</p>
            <div className="h-1.5 w-44 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-gradient-to-r from-rose to-gold" style={{ animation: `loadbar ${suspenseMs}ms linear forwards` }} />
            </div>
          </div>
        )}

        {/* fallback: navegador bloqueou autoplay com som */}
        {muted && !suspense && (
          <button
            onClick={enableSound}
            className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-black/80"
          >
            {soundLabel}
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
