"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type LiveMessage = { type: string; [k: string]: unknown };

/**
 * Sala de transmissão em tempo real (Ably) para a LIVE do sorteio.
 * - host: cria a sala, publica o início do sorteio (spec) e bate presença.
 * - viewer: entra pelo link /live/<id>, recebe o spec e renderiza a mesma
 *   revelação sincronizada. A contagem de espectadores é REAL (presence).
 *
 * `configured` = false quando ABLY_API_KEY não está setado (a live cai no modo
 * local, sem espectadores reais).
 */
export function useLiveRoom(
  roomId: string | null,
  role: "host" | "viewer",
  onMessage?: (m: LiveMessage) => void,
) {
  const [count, setCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const channelRef = useRef<unknown>(null);
  const clientRef = useRef<unknown>(null);
  const onMsgRef = useRef(onMessage);
  onMsgRef.current = onMessage;

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let client: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let channel: any;

    (async () => {
      try {
        const Ably = await import("ably");
        client = new Ably.Realtime({
          authUrl: "/api/ably-token",
          clientId: `${role}-${Math.random().toString(36).slice(2, 8)}`,
        });
        clientRef.current = client;
        client.connection.on("connected", () => {
          if (!cancelled) {
            setConnected(true);
            setConfigured(true);
          }
        });
        client.connection.on("failed", () => {
          if (!cancelled) setConfigured(false);
        });

        channel = client.channels.get(`live:${roomId}`);
        channelRef.current = channel;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await channel.subscribe("msg", (m: any) => {
          onMsgRef.current?.(m.data as LiveMessage);
        });

        const refreshCount = async () => {
          try {
            const members = await channel.presence.get();
            if (!cancelled) setCount(members.length);
          } catch {
            /* ignore */
          }
        };
        channel.presence.subscribe(["enter", "leave", "present", "update"], refreshCount);
        await channel.presence.enter({ role });
        refreshCount();
      } catch {
        if (!cancelled) setConfigured(false);
      }
    })();

    return () => {
      cancelled = true;
      try {
        channel?.presence?.leave();
      } catch {
        /* ignore */
      }
      try {
        client?.close();
      } catch {
        /* ignore */
      }
    };
  }, [roomId, role]);

  const publish = useCallback((data: LiveMessage) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (channelRef.current as any)?.publish("msg", data);
    } catch {
      /* ignore */
    }
  }, []);

  return { count, connected, configured, publish };
}
