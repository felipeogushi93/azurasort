import Link from "next/link";
import { Hero } from "@/components/landing/Hero";
import { StepByStep } from "@/components/landing/StepByStep";
import { Features } from "@/components/landing/Features";
import { SceneGallery } from "@/components/landing/SceneGallery";
import { Differentials } from "@/components/landing/Differentials";
import { Faq } from "@/components/landing/Faq";

export default function Home() {
  return (
    <main className="relative bg-canvas">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/5 bg-canvas/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight text-ink">
            Prize<span className="text-gold-deep">gram</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-inkSoft md:flex">
            <a href="#como-funciona" className="transition hover:text-ink">Como funciona</a>
            <a href="#recursos" className="transition hover:text-ink">Recursos</a>
            <a href="#galeria" className="transition hover:text-ink">Galeria</a>
            <a href="#faq" className="transition hover:text-ink">FAQ</a>
          </div>
          <Link href="/sorteio" className="btn-gold py-2 text-sm">
            Criar sorteio
          </Link>
        </nav>
      </header>

      <Hero />

      <div id="como-funciona">
        <StepByStep />
      </div>

      <div id="recursos">
        <Features />
      </div>

      <div id="galeria">
        <SceneGallery />
      </div>

      <div id="diferenciais">
        <Differentials />
      </div>

      <div id="faq">
        <Faq />
      </div>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-canvasAlt">
        <div className="pointer-events-none absolute inset-0 bg-mesh opacity-80" />
        <div className="relative mx-auto max-w-4xl px-6 py-32 text-center">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
            Seu próximo sorteio merece um
            <br />
            <span className="bg-gradient-to-r from-gold-deep to-gold bg-clip-text text-transparent">
              final de cinema.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-inkSoft">
            Comece agora. Crie um sorteio justo, verificável e inesquecível em minutos.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/sorteio" className="btn-gold text-base">
              Criar meu sorteio →
            </Link>
            <Link href="/reveal/stage" className="btn-ghost text-base">
              Ver uma revelação
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ink/5 bg-canvas px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-inkSoft sm:flex-row">
          <span className="font-display text-lg font-semibold text-ink">
            Prize<span className="text-gold-deep">gram</span>
          </span>
          <span>Sorteios de Instagram com final de cinema.</span>
          <span className="text-xs text-inkSoft/70">Prototipo · 2026</span>
        </div>
      </footer>
    </main>
  );
}
