"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Atualiza os dados do painel a cada N segundos (router.refresh re-roda os
 * server components sem recarregar a página / perder scroll). Dá pra pausar.
 */
export function AutoRefresh({ seconds = 30 }: { seconds?: number }) {
  const router = useRouter();
  const [on, setOn] = useState(true);
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => {
      // 💸 não recarrega com a aba em segundo plano: cada refresh roda ~15 queries
      // no banco. Sem isso, uma aba esquecida aberta mantém o Neon acordado o dia
      // inteiro e gera mais chamadas que todo o tráfego real de clientes.
      if (typeof document !== "undefined" && document.hidden) return;
      router.refresh();
      setLast(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "America/Sao_Paulo" }));
    }, Math.max(10, seconds) * 1000);
    return () => clearInterval(id);
  }, [on, seconds, router]);

  return (
    <div className="flex flex-col items-end gap-0.5">
      <button
        onClick={() => setOn((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${on ? "bg-emerald/10 text-emerald hover:bg-emerald/15" : "bg-ink/5 text-inkSoft hover:bg-ink/10"}`}
        title={on ? "Clique para pausar" : "Clique para ativar"}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${on ? "animate-pulse bg-emerald" : "bg-inkSoft"}`} />
        {on ? `Ao vivo · ${seconds}s` : "Pausado"}
      </button>
      {on && last && <span className="text-[10px] text-inkSoft">atualizado {last}</span>}
    </div>
  );
}
