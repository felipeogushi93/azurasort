"use client";

import { useState } from "react";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }
  return (
    <button onClick={logout} className="rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-inkSoft transition hover:border-rose hover:text-rose">
      Sair
    </button>
  );
}

type Forced = { id: string; runIndex: number; handle: string; usedAt: string | Date | null };

const ROUND_LABEL = ["1ª rodada", "2ª rodada", "3ª rodada"];

/** Gestão de ganhadores pré-selecionados de UMA campanha (ferramenta interna). */
export function ForcedWinnerManager({ giveawayId, initial }: { giveawayId: string; initial: Forced[] }) {
  const [forced, setForced] = useState<Forced[]>(initial);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const byRound = (i: number) => forced.find((f) => f.runIndex === i) || null;

  async function save(runIndex: number) {
    const handle = (drafts[runIndex] || "").trim();
    if (!handle) return;
    setBusy(runIndex);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/forced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giveawayId, runIndex, handle }),
      });
      const d = await r.json();
      if (r.ok) {
        setForced((prev) => [...prev.filter((f) => f.runIndex !== runIndex), d.forced]);
        setDrafts((prev) => ({ ...prev, [runIndex]: "" }));
      } else {
        setMsg(d.error || "Erro ao salvar");
      }
    } finally {
      setBusy(null);
    }
  }

  async function remove(id: string, runIndex: number) {
    setBusy(runIndex);
    await fetch(`/api/admin/forced?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setForced((prev) => prev.filter((f) => f.id !== id));
    setBusy(null);
  }

  return (
    <div className="mt-3 space-y-2">
      {msg && <p className="text-xs text-rose">{msg}</p>}
      {[0, 1, 2].map((i) => {
        const cur = byRound(i);
        return (
          <div key={i} className="flex flex-wrap items-center gap-2 text-sm">
            <span className="w-20 shrink-0 text-xs font-medium text-inkSoft">{ROUND_LABEL[i]}</span>
            {cur ? (
              <>
                <span className="rounded-full bg-gold/15 px-3 py-1 font-medium text-gold-deep">@{cur.handle}</span>
                {cur.usedAt ? (
                  <span className="text-[11px] text-emerald">✓ usado</span>
                ) : (
                  <span className="text-[11px] text-inkSoft">pendente</span>
                )}
                <button
                  onClick={() => remove(cur.id, i)}
                  disabled={busy === i}
                  className="text-[11px] text-rose hover:underline disabled:opacity-40"
                >
                  remover
                </button>
              </>
            ) : (
              <>
                <input
                  value={drafts[i] || ""}
                  onChange={(e) => setDrafts((p) => ({ ...p, [i]: e.target.value }))}
                  placeholder="@usuario"
                  className="w-40 rounded-lg border border-ink/10 bg-canvasAlt px-2.5 py-1.5 text-xs outline-none focus:border-gold"
                />
                <button
                  onClick={() => save(i)}
                  disabled={busy === i || !(drafts[i] || "").trim()}
                  className="rounded-lg bg-ink/90 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                >
                  {busy === i ? "…" : "definir"}
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
