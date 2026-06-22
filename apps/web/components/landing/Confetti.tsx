// Confete sutil e contínuo (determinístico — mesmo no servidor e no cliente).
const COLORS = ["#E8C26B", "#7C3AED", "#EC4899", "#06B6D4", "#16A34A"];

const PIECES = Array.from({ length: 34 }, (_, i) => ({
  left: (i * 2.917) % 100,
  delay: (i * 0.41) % 7,
  dur: 6 + (i % 6),
  color: COLORS[i % COLORS.length],
  rot: (i * 47) % 360,
  size: 6 + (i % 4) * 2,
}));

export function Confetti({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.6,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            transform: `rotate(${p.rot}deg)`,
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  );
}
