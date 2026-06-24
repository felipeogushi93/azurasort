/**
 * 🚨 RESGATE MANUAL — parser do texto colado do Instagram.
 *
 * Recebe o texto cru (Ctrl+A → Ctrl+C de uma página de comentários do IG) e
 * extrai { handle, text }. Limpa ruído de UI, deduplica @handles e ignora linhas
 * que claramente não são usuário. Tolerante: se não casar o formato "rico",
 * cai para um modo simples (qualquer @handle ou linha de username).
 *
 * Feature isolada — pode apagar este arquivo para remover o resgate manual.
 */

export type ParsedComment = { handle: string; text: string };

// linhas de interface do IG que devem ser ignoradas
const UI_NOISE = new Set([
  "curtir", "responder", "responder.", "editado", "ver tradução", "ver traducao",
  "like", "reply", "edited", "see translation", "verified", "seguir", "follow",
  "ver respostas", "ocultar respostas", "view replies", "hide replies",
  "foto do perfil de", "profile picture of",
]);

const HANDLE_RE = /^[a-z0-9._]{1,30}$/;

function looksLikeHandle(line: string): boolean {
  const l = line.trim().toLowerCase();
  if (!HANDLE_RE.test(l)) return false;
  if (UI_NOISE.has(l)) return false;
  // descarta coisas tipo "1.234" (curtidas) ou só números/pontos
  if (/^[\d.]+$/.test(l)) return false;
  return true;
}

function clean(line: string): string {
  return line.replace(/​|‎|‏/g, "").trim();
}

/**
 * Parser principal. Estratégia:
 * 1) Se o texto tem marcadores "Foto do perfil de X" (PT) / "Profile picture of X"
 *    (EN), usa-os como âncora de cada bloco de comentário.
 * 2) Caso contrário, varre linha a linha: uma linha que parece @handle inicia um
 *    comentário; as linhas seguintes (até o próximo handle/ruído) são o texto.
 */
export function parseIgPaste(raw: string): ParsedComment[] {
  if (!raw || !raw.trim()) return [];
  const lines = raw.split(/\r?\n/).map(clean).filter(Boolean);

  const out: ParsedComment[] = [];
  const seen = new Set<string>();

  const push = (handle: string, text: string) => {
    const h = handle.replace(/^@/, "").trim().toLowerCase();
    if (!HANDLE_RE.test(h) || UI_NOISE.has(h)) return;
    if (seen.has(h)) return; // 1 entrada por usuário (no painel)
    seen.add(h);
    out.push({ handle: h, text: text.trim().slice(0, 300) });
  };

  // âncora "Foto do perfil de <user>"
  const anchorRe = /(?:foto do perfil de|profile picture of)\s+([a-z0-9._]{1,30})/i;
  const hasAnchors = lines.some((l) => anchorRe.test(l));

  if (hasAnchors) {
    let cur: { handle: string; parts: string[] } | null = null;
    for (const line of lines) {
      const m = line.match(anchorRe);
      if (m) {
        if (cur) push(cur.handle, cur.parts.join(" "));
        cur = { handle: m[1], parts: [] };
        continue;
      }
      if (cur) {
        const low = line.toLowerCase();
        if (UI_NOISE.has(low) || /^[\d.]+ ?(curtida|like)/i.test(low)) continue;
        if (low === cur.handle.toLowerCase()) continue; // IG repete o handle como 1ª linha
        cur.parts.push(line);
      }
    }
    if (cur) push(cur.handle, cur.parts.join(" "));
    return out;
  }

  // modo simples: handle inicia comentário; linhas seguintes = texto
  let curHandle: string | null = null;
  let curText: string[] = [];
  for (const line of lines) {
    if (looksLikeHandle(line)) {
      if (curHandle) push(curHandle, curText.join(" "));
      curHandle = line;
      curText = [];
    } else if (curHandle) {
      const low = line.toLowerCase();
      if (UI_NOISE.has(low)) continue;
      curText.push(line);
    }
  }
  if (curHandle) push(curHandle, curText.join(" "));

  // fallback final: se quase nada saiu, pega todo @mencionado do texto
  if (out.length < 3) {
    for (const m of raw.matchAll(/@([a-z0-9._]{2,30})/gi)) push(m[1], "");
  }
  return out;
}
