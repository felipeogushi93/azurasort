"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCameraLink } from "@/lib/live/useCameraLink";

type ChatMsg = { handle: string; text: string };

/**
 * Tela de transmissão AO VIVO (antes da revelação).
 *
 * Mostra a câmera do organizador (getUserMedia), selo "AO VIVO", contador de
 * espectadores, um CHAT com os comentários rolando (reaproveita os comentários já
 * carregados — sem custo extra) e um botão START. Só quando ele clica em START é
 * que a revelação (vídeo do vencedor) começa — via onStart().
 */
type LiveLabels = { badge: string; camera: string; exit: string; ready: string; start: string; noCam: string; goLive: string; goLiveHint: string; finish: string; thank: string };

export function LiveStage({
  campaign,
  comments = [],
  labels = { badge: "Ao vivo", camera: "câmera", exit: "✕ sair", ready: "Quando estiver com a audiência pronta, inicie o sorteio.", start: "▶ Iniciar sorteio", noCam: "Câmera não disponível — você pode iniciar mesmo assim.", goLive: "🔴 Iniciar transmissão", goLiveHint: "Comece a live e fale com a sua audiência. Quando quiser, inicie o sorteio.", finish: "Encerrar live", thank: "Sorteio concluído! Agradeça à sua audiência e encerre quando quiser." },
  onStart,
  onClose,
  onGoLive,
  shareUrl,
  realViewers,
  rtcChannel,
  rtcClientId,
  winner,
}: {
  campaign?: string;
  comments?: ChatMsg[];
  labels?: LiveLabels;
  onStart: () => void;
  onClose: () => void;
  onGoLive?: () => void;
  shareUrl?: string; // link público /live/<id> — quando setado, mostra caixa de compartilhar (live REAL)
  realViewers?: number; // contagem REAL de espectadores (presence). Sem ela, usa simulação.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rtcChannel?: any; // canal Ably p/ transmitir a câmera (WebRTC). Sem ele = sem broadcast.
  rtcClientId?: string;
  winner?: string; // setado = modo PÓS-SORTEIO: volta pra câmera p/ agradecer, sem re-sortear
}) {
  const postDraw = !!winner;
  const broadcasting = !!rtcChannel;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camOk, setCamOk] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [viewers, setViewers] = useState(0);
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(3);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [liveOn, setLiveOn] = useState<boolean>(() => postDraw); // pós-sorteio já entra "ao vivo"
  const [copied, setCopied] = useState(false);
  const [camStream, setCamStream] = useState<MediaStream | null>(null);

  // transmite a câmera/voz do host pros espectadores (WebRTC) quando estiver ao vivo
  useCameraLink({
    channel: rtcChannel ?? null,
    clientId: rtcClientId ?? "",
    role: "host",
    localStream: camStream,
    enabled: broadcasting && liveOn,
  });

  // (re)liga a câmera no facingMode atual (com microfone quando vai transmitir)
  const startCamera = useCallback(
    async (mode: "user" | "environment") => {
      try {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: broadcasting, // mic ligado só quando transmite (pros espectadores ouvirem)
        });
        streamRef.current = stream;
        setCamStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCamOk(true);
      } catch {
        setCamOk(false);
      }
    },
    [broadcasting],
  );

  useEffect(() => {
    startCamera(facing);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facing, startCamera]);

  // contador de espectadores — usa o REAL (presence) quando disponível; senão, simula.
  useEffect(() => {
    if (realViewers !== undefined) return; // live real: contagem vem por props
    setViewers(Math.floor(Math.random() * 40) + 18);
    const id = setInterval(() => {
      setViewers((v) => Math.max(0, v + Math.floor(Math.random() * 7) - 2));
    }, 2200);
    return () => clearInterval(id);
  }, [realViewers]);
  const shownViewers = realViewers !== undefined ? realViewers : viewers;

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
          {liveOn && (
            <>
              <span className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> {labels.badge}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                👁 {shownViewers.toLocaleString("pt-BR")}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {camOk && (
            <button
              onClick={() => setFacing((f) => (f === "user" ? "environment" : "user"))}
              title={labels.camera}
              className="rounded-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white backdrop-blur hover:border-gold"
            >
              🔄 {labels.camera}
            </button>
          )}
          <button
            onClick={() => {
              streamRef.current?.getTracks().forEach((t) => t.stop());
              onClose();
            }}
            className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur hover:border-gold"
          >
            {labels.exit}
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
      {liveOn && chat.length > 0 && !counting && (
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

      {/* PÓS-SORTEIO: banner do vencedor (continua na live pra agradecer) */}
      {postDraw && !counting && (
        <div className="pointer-events-none absolute left-1/2 top-24 z-10 -translate-x-1/2 rounded-2xl border border-gold/40 bg-black/55 px-5 py-3 text-center backdrop-blur">
          <p className="text-2xl">🏆</p>
          <p className="mt-0.5 font-display text-2xl font-black text-white drop-shadow">@{winner}</p>
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

      {/* rodapé: 1º "Start live"; depois "Iniciar sorteio" */}
      {!counting && (
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-8">
          {camOk === false && (
            <p className="rounded-lg bg-black/50 px-3 py-1.5 text-center text-xs text-white/80 backdrop-blur">
              {labels.noCam}
            </p>
          )}
          {postDraw ? (
            <>
              <p className="text-center text-sm text-white/80 drop-shadow">{labels.thank}</p>
              <button
                onClick={() => {
                  streamRef.current?.getTracks().forEach((t) => t.stop());
                  onClose();
                }}
                className="rounded-full bg-gradient-to-r from-rose to-gold px-10 py-4 font-display text-lg font-bold text-white shadow-gold transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                {labels.finish}
              </button>
            </>
          ) : !liveOn ? (
            <>
              <p className="text-center text-sm text-white/80 drop-shadow">{labels.goLiveHint}</p>
              <button
                onClick={() => {
                  setLiveOn(true);
                  onGoLive?.();
                }}
                className="rounded-full bg-red-600 px-10 py-4 font-display text-lg font-bold text-white shadow-lift transition hover:-translate-y-0.5"
              >
                {labels.goLive}
              </button>
            </>
          ) : (
            <>
              {shareUrl && (
                <div className="flex w-full max-w-md items-center gap-2 rounded-xl border border-white/15 bg-black/50 px-3 py-2 backdrop-blur">
                  <span className="flex-1 truncate text-xs text-white/80">{shareUrl}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(shareUrl).then(
                        () => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1800);
                        },
                        () => {},
                      );
                    }}
                    className="shrink-0 rounded-lg bg-gold px-3 py-1.5 text-xs font-bold text-void transition hover:bg-gold-hi"
                  >
                    {copied ? "✓ copiado" : "📋 copiar link"}
                  </button>
                </div>
              )}
              {shareUrl && (
                <p className="text-center text-xs text-white/70 drop-shadow">
                  Mande esse link pra sua audiência entrar e acompanhar o sorteio ao vivo.
                </p>
              )}
              <p className="text-center text-sm text-white/80 drop-shadow">{labels.ready}</p>
              <button
                onClick={start}
                className="rounded-full bg-gradient-to-r from-rose to-gold px-10 py-4 font-display text-lg font-bold text-white shadow-gold transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                {labels.start}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
