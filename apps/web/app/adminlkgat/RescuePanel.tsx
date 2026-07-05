"use client";

import { useMemo, useState } from "react";
import { parseIgPaste } from "@/lib/draw/parseIg";

/**
 * 🚨 RESGATE MANUAL (painel). Admin cola os comentários do IG, o sistema parseia
 * e injeta como pool do sorteio daquele post. Feature isolada — remover este
 * componente (e o bloco no /api/draw) desliga tudo sem afetar o resto.
 */
export function RescuePanel() {
  const [postUrl, setPostUrl] = useState("");
  const [raw, setRaw] = useState("");
  const [owner, setOwner] = useState("");
  const [totalReal, setTotalReal] = useState("");
  const [plan, setPlan] = useState("premium"); // tipo de sorteio: padrao | premium | vip
  const [link, setLink] = useState<string | null>(null); // link pronto pro cliente
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const parsed = useMemo(() => parseIgPaste(raw), [raw]);
  const ownerClean = owner.replace(/^@/, "").trim().toLowerCase();
  const finalList = parsed.filter((p) => p.handle !== ownerClean);

  async function inject() {
    setBusy(true);
    setMsg(null);
    try {
      const r = await fetch("/api/admin/rescue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postUrl,
          handles: finalList,
          owner: ownerClean || undefined,
          totalReal: totalReal ? Number(totalReal) : undefined,
          plan,
        }),
      });
      const d = await r.json();
      if (r.ok) {
        setLink(d.link ?? null);
        setMsg({ ok: true, text: `✓ Injetado: ${d.injected} participantes (total exibido: ${d.totalReal}). Copie o link abaixo e mande pro cliente.` });
      } else {
        setMsg({ ok: false, text: d.error || "Falha ao injetar." });
      }
    } catch {
      setMsg({ ok: false, text: "Erro de conexão." });
    } finally {
      setBusy(false);
    }
  }

  async function clearPool() {
    if (!postUrl) return;
    setBusy(true);
    await fetch(`/api/admin/rescue?postUrl=${encodeURIComponent(postUrl)}`, { method: "DELETE" });
    setBusy(false);
    setMsg({ ok: true, text: "Pool removido — o sorteio volta a usar a coleta automática." });
  }

  return (
    <div className="rounded-2xl border border-rose/30 bg-rose/5 p-5 shadow-soft">
      <p className="font-display text-lg font-bold text-ink">🚨 Resgate manual</p>
      <p className="mb-4 text-xs text-inkSoft">
        Quando o Instagram libera poucos comentários, cole-os aqui. Abra o post, dê Ctrl+A na área de
        comentários, copie e cole abaixo. Owner é removido do sorteio.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-inkSoft">Link do post</label>
          <input value={postUrl} onChange={(e) => setPostUrl(e.target.value)} placeholder="https://instagram.com/p/..." className="w-full rounded-lg border border-ink/10 bg-surface px-3 py-2 text-sm outline-none focus:border-gold" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-inkSoft">Owner (excluir)</label>
            <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="@dono" className="w-full rounded-lg border border-ink/10 bg-surface px-3 py-2 text-sm outline-none focus:border-gold" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-inkSoft">Total real (opcional)</label>
            <input value={totalReal} onChange={(e) => setTotalReal(e.target.value.replace(/\D/g, ""))} placeholder="ex: 631" className="w-full rounded-lg border border-ink/10 bg-surface px-3 py-2 text-sm outline-none focus:border-gold" />
          </div>
        </div>
      </div>

      <div className="mt-3">
        <label className="mb-1 block text-xs font-medium text-inkSoft">Tipo de sorteio (vai no link do cliente)</label>
        <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full rounded-lg border border-ink/10 bg-surface px-3 py-2 text-sm outline-none focus:border-gold">
          <option value="padrao">Padrão — animação Contagem</option>
          <option value="premium">Cinematográfico (Premium) — cofre, cassino, etc.</option>
          <option value="vip">VIP — com transmissão ao vivo</option>
        </select>
      </div>

      <label className="mb-1 mt-3 block text-xs font-medium text-inkSoft">Comentários colados do Instagram</label>
      <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={6} placeholder="Cole aqui (Ctrl+V)…" className="w-full rounded-lg border border-ink/10 bg-surface px-3 py-2 font-mono text-xs outline-none focus:border-gold" />

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink">
          {finalList.length} participantes detectados{ownerClean && parsed.length !== finalList.length ? ` (owner removido)` : ""}
        </span>
        {finalList.length > 0 && (
          <span className="text-[11px] text-inkSoft">ex: {finalList.slice(0, 4).map((p) => "@" + p.handle).join(", ")}…</span>
        )}
      </div>

      {msg && (
        <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${msg.ok ? "bg-emerald/10 text-emerald" : "bg-rose/10 text-rose"}`}>{msg.text}</p>
      )}

      {link && (
        <div className="mt-3 rounded-lg border border-gold/30 bg-gold/5 p-3">
          <p className="mb-1.5 text-xs font-medium text-inkSoft">🔗 Link pronto pro cliente — copie e mande:</p>
          <div className="flex items-center gap-2">
            <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} className="flex-1 rounded border border-ink/10 bg-surface px-2 py-1.5 font-mono text-[11px] outline-none" />
            <button
              onClick={() => { navigator.clipboard?.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {}); }}
              className="shrink-0 rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-white hover:bg-ink/90"
            >
              {copied ? "✓ Copiado" : "Copiar"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button onClick={inject} disabled={busy || !postUrl || finalList.length < 3} className="btn-gold py-2.5 disabled:opacity-40">
          {busy ? "…" : `✓ Injetar ${finalList.length} no sorteio`}
        </button>
        <button onClick={clearPool} disabled={busy || !postUrl} className="rounded-full border border-ink/15 px-4 py-2.5 text-sm text-inkSoft hover:border-rose hover:text-rose disabled:opacity-40">
          Remover pool
        </button>
      </div>
    </div>
  );
}
