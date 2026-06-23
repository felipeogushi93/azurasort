"use client";

import { useState } from "react";

export function LoginForm() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });
      const d = await r.json();
      if (r.ok) {
        window.location.reload();
      } else {
        setErr(d.error || "Falha no login");
        setBusy(false);
      }
    } catch {
      setErr("Erro de conexão");
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-ink/5 bg-surface p-8 shadow-lift">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet to-rose text-xl font-bold text-white">A</div>
          <h1 className="font-display text-xl font-bold text-ink">Painel AzuraSort</h1>
          <p className="text-xs text-inkSoft">Acesso restrito</p>
        </div>

        {err && <p className="mb-4 rounded-lg bg-rose/10 px-3 py-2 text-sm text-rose">{err}</p>}

        <label className="mb-1 block text-xs font-medium text-inkSoft">Usuário</label>
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          autoComplete="username"
          className="mb-4 w-full rounded-xl border border-ink/10 bg-canvasAlt px-3 py-2.5 text-sm outline-none focus:border-gold"
        />

        <label className="mb-1 block text-xs font-medium text-inkSoft">Senha</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mb-6 w-full rounded-xl border border-ink/10 bg-canvasAlt px-3 py-2.5 text-sm outline-none focus:border-gold"
        />

        <button disabled={busy} className="btn-gold w-full py-3 disabled:opacity-50">
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
