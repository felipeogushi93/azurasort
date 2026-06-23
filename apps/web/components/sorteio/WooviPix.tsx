"use client";

import { useEffect, useRef, useState } from "react";

/** Modal de pagamento PIX (Woovi): QR + copia-e-cola + confirmação automática. */
export function WooviPix({
  onSuccess,
  onClose,
  plan = "premium",
  priceLabel = "R$ 34,90",
}: {
  onSuccess: () => void;
  onClose: () => void;
  plan?: string;
  priceLabel?: string;
}) {
  const [charge, setCharge] = useState<{ correlationID: string; brCode: string; qrCodeImage: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // cria a cobrança ao abrir
  useEffect(() => {
    fetch("/api/pay/woovi/charge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })
      .then((r) => r.json())
      .then((d) => (d.brCode ? setCharge(d) : setErr(d.error || "Falha ao gerar o PIX")))
      .catch((e) => setErr(String(e)));
  }, [plan]);

  // poll de status
  useEffect(() => {
    if (!charge) return;
    pollRef.current = setInterval(async () => {
      try {
        const r = await fetch(`/api/pay/woovi/status?id=${encodeURIComponent(charge.correlationID)}`);
        const d = await r.json();
        if (d.paid) {
          if (pollRef.current) clearInterval(pollRef.current);
          setPaid(true);
          setTimeout(onSuccess, 900);
        }
      } catch {
        /* ignora erro transitório */
      }
    }, 4000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [charge, onSuccess]);

  function copy() {
    if (!charge) return;
    navigator.clipboard.writeText(charge.brCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-ink/5 bg-surface p-6 text-center shadow-lift">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink">Pagar com PIX</h3>
          <button onClick={onClose} className="text-inkSoft hover:text-ink">✕</button>
        </div>

        {err && <p className="rounded-lg bg-rose/10 px-3 py-2 text-sm text-rose">{err}</p>}

        {!charge && !err && (
          <div className="flex items-center justify-center py-12">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/15 border-t-gold" />
          </div>
        )}

        {paid && (
          <div className="py-10">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-emerald/15 text-2xl text-emerald">✓</div>
            <p className="font-display text-lg font-bold text-ink">Pagamento confirmado!</p>
            <p className="text-sm text-inkSoft">Liberando o sorteio…</p>
          </div>
        )}

        {charge && !paid && (
          <>
            <p className="mb-3 text-sm text-inkSoft">Escaneie o QR no app do seu banco · <span className="font-semibold text-ink">{priceLabel}</span></p>
            {charge.qrCodeImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={charge.qrCodeImage} alt="QR Code PIX" className="mx-auto h-52 w-52 rounded-xl border border-ink/5" />
            )}
            <button onClick={copy} className="btn-ghost mt-4 w-full">
              {copied ? "✓ Copiado!" : "📋 Copiar código PIX (copia-e-cola)"}
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-xs text-inkSoft">
              <span className="h-2 w-2 animate-pulse rounded-full bg-gold" /> aguardando pagamento…
            </p>
            <p className="mt-1 text-[11px] text-inkSoft/70">A confirmação é automática assim que o PIX cair.</p>
          </>
        )}
      </div>
    </div>
  );
}
