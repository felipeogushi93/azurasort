"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ChatMsg = { handle: string; text: string };

/**
 * Tela de transmissão AO VIVO (antes da revelação).
 *
 * Mostra a câmera do organizador (getUserMedia), selo "AO VIVO", contador de
 * espectadores, um CHAT com os comentários rolando (reaproveita os comentários já
 * carregados — sem custo extra) e um botão START. Só quando ele clica em START é
 * que a revelação (vídeo do vencedor) começa — via onStart().
 */
export function LiveStage({
  campaign,
  comments = [],
  onStart,
  onClose,
}: {
  campaign?: string;
  comments?: ChatMsg[];
  onStart: () => void;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camOk, setCamOk] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [viewers, setViewers] = useState(0);
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(3);
  const [chat, setChat] = useState<ChatMsg[]>([]);

  // (re)liga a câmera no facingMode atual
  const startCamera = useCallback(async (mode: "user" | "environment") => {
    try {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setCamOk(true);
    } catch {
      setCamOk(false);
    }
  }, []);

  useEffect(() => {
    startCamera(facing);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facing, startCamera]);

  // contador de espectadores "subindo" (efeito de live)
  useEffect(() => {
    setViewers(Math.floor(Math.random() * 40) + 18);
    const id = setInterval(() => {
      setViewers((v) => Math.max(0, v + Math.floor(Math.random() * 7) - 2));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  // chat: empurra um comentário a cada ~1.6s, mantém os últimos 6 visíveis
  useEffect(() => {
    const pool = comments.filter((c) => c.handle);
    if (!pool.length) return;
    let i = 0;
    const id = setInterval(() => {
      const c = pool[i % pool.length];
      i += 1;
      setChat((prev) => [...prev.slice(-5), c]);
    }, 1600);
    return () => clearInterval(id);
  }, [comments]);

  // START → contagem 3,2,1 → revela
  function start() {
    if (counting) return;
    setCounting(true);
    setCount(3);
    let n = 3;
    const id = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(id);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        onStart();
      } else {
        setCount(n);
      }
    }, 1000);
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-void">
      {/* câmera (espelhada só na frontal) ou fundo */}
      {camOk !== false ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: facing === "user" ? "scaleX(-1)" : "none" }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1430] via-void to-[#0c0a1a]" />
      )}

      {/* leve escurecida para legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/50" />

      {/* topo: AO VIVO + espectadores + (trocar câmera) + fechar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> Ao vivo
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            👁 {viewers.toLocaleString("pt-BR")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {camOk && (
            <button
              onClick={() => setFacing((f) => (f === "user" ? "environment" : "user"))}
              title="Trocar câmera"
              className="rounded-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white backdrop-blur hover:border-gold"
            >
              🔄 câmera
            </button>
          )}
          <button
            onClick={() => {
              streamRef.current?.getTracks().forEach((t) => t.stop());
              onClose();
            }}
            className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur hover:border-gold"
          >
            ✕ sair
          </button>
        </div>
      </div>

      {/* campanha */}
      {campaign && (
        <div className="absolute left-5 top-20">
          <p className="max-w-xs text-sm font-medium text-white/90 drop-shadow">{campaign}</p>
        </div>
      )}

      {/* CHAT ao vivo (comentários rolando) */}
      {chat.length > 0 && !counting && (
        <div className="pointer-events-none absolute bottom-32 left-5 z-10 flex max-w-[78%] flex-col gap-1.5 sm:max-w-sm">
          {chat.map((c, i) => (
            <div
              key={`${c.handle}-${i}`}
              className="w-fit max-w-full animate-[fadeInUp_0.4s_ease-out] rounded-2xl bg-black/45 px-3 py-1.5 text-sm text-white backdrop-blur"
              style={{ opacity: 0.55 + (i / chat.length) * 0.45 }}
            >
              <span className="font-semibold text-gold-hi">@{c.handle}</span>{" "}
              <span className="text-white/90">{c.text || "🎉"}</span>
            </div>
          ))}
        </div>
      )}

      {/* contagem regressiva sobreposta */}
      {counting && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/40 backdrop-blur-sm">
          <span key={count} className="animate-[ping_1s_ease-out] font-display text-[28vw] font-black text-white drop-shadow-2xl sm:text-[16vw]">
            {count}
          </span>
        </div>
      )}

      {/* rodapé: instrução + START */}
      {!counting && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-8">
          {camOk === false && (
            <p className="rounded-lg bg-black/50 px-3 py-1.5 text-center text-xs text-white/80 backdrop-blur">
              Câmera não disponível — você pode iniciar mesmo assim.
            </p>
          )}
          <p className="text-center text-sm text-white/80 drop-shadow">
            Quando estiver com a audiência pronta, inicie o sorteio.
          </p>
          <button
            onClick={start}
            className="rounded-full bg-gradient-to-r from-rose to-gold px-10 py-4 font-display text-lg font-bold text-white shadow-gold transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            ▶ INICIAR SORTEIO AO VIVO
          </button>
        </div>
      )}
    </div>
  );
}
