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
  playbackRate = 0.85,
  gain = 1.25,
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
  gain?: number;
  silent?: boolean;
  openingLabel?: string;
  soundLabel?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const compressorRef = useRef<DynamicsCompressorNode | null>(null);
  const clankedRef = useRef(false);
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

  // amplifica o áudio do vídeo via Web Audio, com LIMITER (compressor) p/ não clipar/chiar
  function ensureAudioBoost() {
    const v = videoRef.current;
    if (!v || silent || audioCtxRef.current) return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const sourceNode = ctx.createMediaElementSource(v);
      const g = ctx.createGain();
      g.gain.value = gain;
      // limiter: evita o estouro/ruído quando o áudio é amplificado
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -3;
      comp.knee.value = 6;
      comp.ratio.value = 12;
      comp.attack.value = 0.003;
      comp.release.value = 0.25;
      sourceNode.connect(g).connect(comp).connect(ctx.destination);
      audioCtxRef.current = ctx;
      compressorRef.current = comp;
    } catch {
      /* sem boost (navegador antigo) — segue no volume nativo */
    }
  }

  // "clank" de cofre abrindo (sintetizado, limpo) — thud grave + 2 parciais metálicos
  function playVaultClank() {
    const ctx = audioCtxRef.current;
    if (!ctx || silent) return;
    const dest = compressorRef.current ?? ctx.destination;
    const now = ctx.currentTime;
    // thud grave
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = "sine";
    thud.frequency.setValueAtTime(110, now);
    thud.frequency.exponentialRampToValueAtTime(42, now + 0.3);
    thudGain.gain.setValueAtTime(0.0001, now);
    thudGain.gain.exponentialRampToValueAtTime(0.6, now + 0.02);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    thud.connect(thudGain).connect(dest);
    thud.start(now);
    thud.stop(now + 0.45);
    // "clink" metálico limpo (dois parciais, sem ruído branco)
    [1850, 2750].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      const t0 = now + 0.04 + idx * 0.015;
      og.gain.setValueAtTime(0.0001, t0);
      og.gain.exponentialRampToValueAtTime(0.22, t0 + 0.008);
      og.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28);
      osc.connect(og).connect(dest);
      osc.start(t0);
      osc.stop(t0 + 0.3);
    });
  }

  // SUSPENSE: segura o vídeo, depois toca (devagar + com som)
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
      ensureAudioBoost();
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

  // toca o clank quando o nome aparece
  useEffect(() => {
    if (show && !clankedRef.current) {
      clankedRef.current = true;
      playVaultClank();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  function enableSound() {
    const v = videoRef.current;
    if (!v) return;
    ensureAudioBoost();
    void audioCtxRef.current?.resume();
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
