"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Transmissão da CÂMERA do host pros espectadores via WebRTC (P2P), usando o
 * canal Ably (que já temos) só como SINALIZAÇÃO (offer/answer/ICE). STUN público
 * pra atravessar NAT na maioria dos casos.
 *
 * P2P puro escala pra audiência PEQUENA (~6-10 ao vivo, o caso de quem não tem
 * 1000 seguidores). Pra plateias grandes, o upgrade é um SFU (LiveKit/Cloudflare
 * Calls) — fica documentado, não entra nesta v1.
 */

const ICE: RTCConfiguration = {
  iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }],
};

type Signal = {
  kind: "join" | "offer" | "answer" | "ice" | "leave";
  from: string;
  to?: string;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AblyChannel = any;

export function useCameraLink(opts: {
  channel: AblyChannel | null;
  clientId: string;
  role: "host" | "viewer";
  localStream?: MediaStream | null; // câmera do host
  enabled: boolean;
}) {
  const { channel, clientId, role, localStream, enabled } = opts;
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const joinedRef = useRef(false);

  useEffect(() => {
    if (!channel || !enabled || typeof RTCPeerConnection === "undefined") return;
    let cancelled = false;
    const pcs = pcsRef.current;

    const send = (s: Signal) => {
      try {
        channel.publish("rtc", s);
      } catch {
        /* ignore */
      }
    };

    function makePc(peerId: string): RTCPeerConnection {
      const pc = new RTCPeerConnection(ICE);
      pc.onicecandidate = (e) => {
        if (e.candidate) send({ kind: "ice", from: clientId, to: peerId, candidate: e.candidate.toJSON() });
      };
      if (role === "viewer") {
        pc.ontrack = (e) => {
          if (cancelled) return;
          joinedRef.current = true;
          setRemoteStream(e.streams[0] ?? new MediaStream([e.track]));
        };
      }
      pcs.set(peerId, pc);
      return pc;
    }

    async function onSignal(s: Signal) {
      if (!s || s.from === clientId) return;
      try {
        if (role === "host") {
          if (s.kind === "join") {
            const existing = pcs.get(s.from);
            if (existing && existing.connectionState !== "failed" && existing.connectionState !== "closed") return;
            const pc = makePc(s.from);
            localStream?.getTracks().forEach((t) => pc.addTrack(t, localStream));
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            send({ kind: "offer", from: clientId, to: s.from, sdp: offer });
          } else if (s.kind === "answer" && s.to === clientId) {
            await pcs.get(s.from)?.setRemoteDescription(s.sdp!);
          } else if (s.kind === "ice" && s.to === clientId) {
            await pcs.get(s.from)?.addIceCandidate(s.candidate!).catch(() => {});
          } else if (s.kind === "leave") {
            pcs.get(s.from)?.close();
            pcs.delete(s.from);
          }
        } else {
          // viewer
          if (s.kind === "offer" && s.to === clientId) {
            const pc = makePc(s.from);
            await pc.setRemoteDescription(s.sdp!);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            send({ kind: "answer", from: clientId, to: s.from, sdp: answer });
          } else if (s.kind === "ice" && s.to === clientId) {
            await pcs.get(s.from)?.addIceCandidate(s.candidate!).catch(() => {});
          }
        }
      } catch {
        /* sinal inválido — ignora */
      }
    }

    const handler = (m: { data: Signal }) => onSignal(m.data);
    channel.subscribe("rtc", handler);

    // viewer pede o stream; reanuncia até receber (host pode ter entrado depois)
    let joinTimer: ReturnType<typeof setInterval> | undefined;
    if (role === "viewer") {
      joinedRef.current = false;
      const join = () => {
        if (!joinedRef.current) send({ kind: "join", from: clientId });
      };
      join();
      joinTimer = setInterval(join, 4000);
    }

    return () => {
      cancelled = true;
      if (joinTimer) clearInterval(joinTimer);
      try {
        channel.unsubscribe("rtc", handler);
      } catch {
        /* ignore */
      }
      send({ kind: "leave", from: clientId });
      pcs.forEach((pc) => {
        try {
          pc.close();
        } catch {
          /* ignore */
        }
      });
      pcs.clear();
      setRemoteStream(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, clientId, role, enabled, localStream]);

  return { remoteStream };
}
