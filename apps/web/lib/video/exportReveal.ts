/**
 * Exporta o vídeo do sorteio (pronto pra postar) 100% no navegador:
 * compõe o clipe da cena + overlay do @ vencedor num <canvas>, grava com
 * MediaRecorder (MP4 quando o navegador suporta, senão WebM) e devolve um Blob.
 *
 * Sem servidor/infra. A qualidade é a da tela; o MP4 garantido depende do
 * navegador (Safari iOS / Chrome recentes ✔). Ideal testar no celular.
 */

export type ExportRatio = "9:16" | "16:9" | "1:1";

const DIMS: Record<ExportRatio, [number, number]> = {
  "9:16": [1080, 1920],
  "16:9": [1920, 1080],
  "1:1": [1080, 1080],
};

// clipe + segundo em que o nome aparece, por módulo de cena
export const REVEAL_CLIP: Record<string, { src: string; revealAtSec: number }> = {
  bank_vault: { src: "/cofre.mp4", revealAtSec: 12.5 },
  countdown: { src: "/contagem.mp4", revealAtSec: 15.9 },
  comment_matrix: { src: "/matrix.mp4", revealAtSec: 14.9 },
};

const GOLD = "#E8C26B";
const GOLD_DEEP = "#B8862F";
const CYAN = "#3DF5FF";

// várias formas de pedir MP4/H.264 — navegadores aceitam strings diferentes.
const MP4_TYPES = [
  'video/mp4;codecs="avc1.42E01E"',
  'video/mp4;codecs="avc1.4d002a"',
  "video/mp4;codecs=avc1",
  "video/mp4;codecs=h264",
  "video/mp4",
];

function bestMp4(): string | null {
  if (typeof MediaRecorder === "undefined") return null;
  for (const t of MP4_TYPES) if (MediaRecorder.isTypeSupported(t)) return t;
  return null;
}

function pickMime(): { mime: string; ext: string } {
  const mp4 = bestMp4();
  if (mp4) return { mime: mp4, ext: "mp4" };
  const vp9 = "video/webm;codecs=vp9";
  if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(vp9)) {
    return { mime: vp9, ext: "webm" };
  }
  return { mime: "video/webm", ext: "webm" };
}

/** true se o navegador grava MP4 (Instagram só aceita MP4; WebM não sobe lá). */
export function mp4Supported(): boolean {
  return bestMp4() !== null;
}

export function exportSupported(): boolean {
  return (
    typeof MediaRecorder !== "undefined" &&
    typeof document !== "undefined" &&
    typeof HTMLCanvasElement.prototype.captureStream === "function"
  );
}

export async function exportRevealVideo(opts: {
  module: string;
  handle: string;
  ratio: ExportRatio;
  label?: string; // "VENCEDOR"
  campaign?: string;
  onProgress?: (p: number) => void;
  signal?: AbortSignal;
}): Promise<{ blob: Blob; ext: string }> {
  const clip = REVEAL_CLIP[opts.module] ?? REVEAL_CLIP.bank_vault;
  const [W, H] = DIMS[opts.ratio];
  const label = opts.label ?? "VENCEDOR";

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas 2d indisponível");

  const video = document.createElement("video");
  video.src = clip.src;
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = "anonymous";
  video.preload = "auto";

  await new Promise<void>((res, rej) => {
    video.onloadedmetadata = () => res();
    video.onerror = () => rej(new Error("falha ao carregar o clipe"));
  });

  const duration = Math.min(video.duration || clip.revealAtSec + 5, 25);
  const { mime, ext } = pickMime();
  const stream = canvas.captureStream(30);

  // áudio do clipe — decodificado à parte (independe do <video> mudo). À prova de
  // falha: qualquer erro = vídeo sem som, nunca quebra a exportação.
  let startAudio = () => {};
  let stopAudio = () => {};
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) {
      const ac = new AC();
      await ac.resume().catch(() => {});
      const buf = await fetch(clip.src)
        .then((r) => r.arrayBuffer())
        .then((b) => ac.decodeAudioData(b));
      const dest = ac.createMediaStreamDestination();
      const node = ac.createBufferSource();
      node.buffer = buf;
      node.connect(dest);
      dest.stream.getAudioTracks().forEach((tr) => stream.addTrack(tr));
      startAudio = () => {
        try {
          node.start(0);
        } catch {
          /* ignore */
        }
      };
      stopAudio = () => {
        try {
          node.stop();
        } catch {
          /* ignore */
        }
        try {
          ac.close();
        } catch {
          /* ignore */
        }
      };
    }
  } catch {
    /* sem áudio: vídeo mudo */
  }

  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => {
    if (e.data && e.data.size) chunks.push(e.data);
  };
  const stopped = new Promise<Blob>((res) => {
    rec.onstop = () => res(new Blob(chunks, { type: mime }));
  });

  function drawCover() {
    const vr = (video.videoWidth || 16) / (video.videoHeight || 9);
    const cr = W / H;
    let dw: number, dh: number;
    if (vr > cr) {
      dh = H;
      dw = H * vr;
    } else {
      dw = W;
      dh = W / vr;
    }
    ctx!.drawImage(video, (W - dw) / 2, (H - dh) / 2, dw, dh);
  }

  function drawWinner(alpha: number) {
    const c = ctx!;
    c.save();
    c.globalAlpha = alpha;
    // escurecida pra legibilidade (cobre nome "placeholder" gravado no clipe)
    const grad = c.createLinearGradient(0, H * 0.35, 0, H);
    grad.addColorStop(0, "rgba(5,6,10,0)");
    grad.addColorStop(0.55, "rgba(5,6,10,0.78)");
    grad.addColorStop(1, "rgba(5,6,10,0.94)");
    c.fillStyle = grad;
    c.fillRect(0, H * 0.35, W, H * 0.65);

    const cx = W / 2;
    const baseY = H * 0.72;

    // label
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = CYAN;
    c.font = `700 ${Math.round(W * 0.032)}px sans-serif`;
    const lbl = label.split("").join(" ");
    c.fillText(lbl, cx, baseY - W * 0.11);

    // @handle (encolhe pra caber)
    const handle = "@" + opts.handle;
    let fs = Math.round(W * 0.13);
    c.font = `900 ${fs}px sans-serif`;
    const maxW = W * 0.86;
    while (c.measureText(handle).width > maxW && fs > 20) {
      fs -= 4;
      c.font = `900 ${fs}px sans-serif`;
    }
    c.shadowColor = "rgba(232,194,107,0.55)";
    c.shadowBlur = W * 0.05;
    const g2 = c.createLinearGradient(0, baseY - fs / 2, 0, baseY + fs / 2);
    g2.addColorStop(0, "#F6DFA0");
    g2.addColorStop(0.5, GOLD);
    g2.addColorStop(1, GOLD_DEEP);
    c.fillStyle = g2;
    c.fillText(handle, cx, baseY);
    c.shadowBlur = 0;

    if (opts.campaign) {
      c.fillStyle = "rgba(245,247,255,0.92)";
      c.font = `600 ${Math.round(W * 0.034)}px sans-serif`;
      c.fillText(opts.campaign.slice(0, 40), cx, baseY + W * 0.1);
    }
    c.restore();
  }

  function drawWatermark() {
    const c = ctx!;
    c.save();
    c.globalAlpha = 0.8;
    c.textAlign = "center";
    c.fillStyle = "rgba(255,255,255,0.7)";
    c.font = `700 ${Math.round(W * 0.026)}px sans-serif`;
    c.fillText("azurasort.com", W / 2, H - H * 0.04);
    c.restore();
  }

  await video.play().catch(() => {});
  rec.start();
  startAudio();

  await new Promise<void>((resolve) => {
    function loop() {
      if (opts.signal?.aborted) {
        try { rec.stop(); } catch {}
        resolve();
        return;
      }
      const ct = video.currentTime;
      ctx!.fillStyle = "#05060A";
      ctx!.fillRect(0, 0, W, H);
      if (video.readyState >= 2) drawCover();
      if (ct >= clip.revealAtSec) {
        const a = Math.min(1, (ct - clip.revealAtSec) / 0.6);
        drawWinner(a);
      }
      drawWatermark();
      opts.onProgress?.(Math.min(1, ct / duration));
      if (ct >= duration || video.ended) {
        try { rec.stop(); } catch {}
        resolve();
        return;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  });

  const blob = await stopped;
  stopAudio();
  try {
    video.pause();
    video.removeAttribute("src");
    video.load();
  } catch {}
  return { blob, ext };
}

/** Dispara o download de um Blob no navegador. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
