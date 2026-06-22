import type { Config } from "tailwindcss";
import { light, reveal, easingCss } from "@prizegram/ui-tokens";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ----- SITE (light premium) -----
        canvas: light.canvas,
        canvasAlt: light.canvasAlt,
        surface: light.surface,
        ink: light.ink,
        inkSoft: light.inkSoft,
        line: light.line,
        gold: { DEFAULT: light.gold, hi: light.goldHi, deep: light.goldDeep },
        violet: light.violet,
        rose: light.rose,
        emerald: light.emerald,

        // ----- CENAS de revelacao (dark) — mantido p/ R3F/VideoReveal -----
        void: reveal.bgVoid,
        elevated: reveal.bgElevated,
        neon: {
          cyan: reveal.neonCyan,
          magenta: reveal.neonMagenta,
          violet: reveal.neonViolet,
        },
        hi: reveal.textHi,
        lo: reveal.textLo,
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        cinematic: easingCss.cinematic,
        snap: easingCss.snap,
      },
      boxShadow: {
        soft: "0 2px 12px -4px rgba(22,20,33,0.08), 0 8px 30px -12px rgba(22,20,33,0.10)",
        card: "0 10px 40px -16px rgba(22,20,33,0.18)",
        lift: "0 20px 60px -20px rgba(22,20,33,0.25)",
        gold: "0 18px 50px -18px rgba(194,146,46,0.45)",
        glow: "0 0 0 1px rgba(255,255,255,0.6) inset, 0 10px 40px -12px rgba(22,20,33,0.15)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
