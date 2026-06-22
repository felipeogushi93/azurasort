import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/components/landing/Hero";
import { StepByStep } from "@/components/landing/StepByStep";
import { Features } from "@/components/landing/Features";
import { SceneGallery } from "@/components/landing/SceneGallery";
import { Differentials } from "@/components/landing/Differentials";
import { Faq } from "@/components/landing/Faq";
import { LocaleSwitcher } from "@/components/landing/LocaleSwitcher";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const nav = await getTranslations("nav");
  const cta = await getTranslations("cta");
  const footer = await getTranslations("footer");

  return (
    <main className="relative bg-canvas">
      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/5 bg-canvas/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight text-ink">
            Azura<span className="text-gold-deep">sort</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-inkSoft md:flex">
            <a href="#como-funciona" className="transition hover:text-ink">{nav("comoFunciona")}</a>
            <a href="#recursos" className="transition hover:text-ink">{nav("recursos")}</a>
            <a href="#galeria" className="transition hover:text-ink">{nav("galeria")}</a>
            <a href="#faq" className="transition hover:text-ink">{nav("faq")}</a>
          </div>
          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <Link href="/sorteio" className="btn-gold py-2 text-sm">
              {nav("criarSorteio")}
            </Link>
          </div>
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
            {cta("title")}
            <br />
            <span className="bg-gradient-to-r from-gold-deep to-gold bg-clip-text text-transparent">
              {cta("titleHighlight")}
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-inkSoft">{cta("subtitle")}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/sorteio" className="btn-gold text-base">
              {cta("ctaPrimary")}
            </Link>
            <Link href="/reveal/stage" className="btn-ghost text-base">
              {cta("ctaSecondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ink/5 bg-canvas px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-inkSoft sm:flex-row">
          <span className="font-display text-lg font-semibold text-ink">
            Azura<span className="text-gold-deep">sort</span>
          </span>
          <span>{footer("tagline")}</span>
          <span className="text-xs text-inkSoft/70">{footer("proto")}</span>
        </div>
      </footer>
    </main>
  );
}
