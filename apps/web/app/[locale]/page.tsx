import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Hero } from "@/components/landing/Hero";
import { StepByStep } from "@/components/landing/StepByStep";
import { Features } from "@/components/landing/Features";
import { SceneGallery } from "@/components/landing/SceneGallery";
import { Differentials } from "@/components/landing/Differentials";
import { Faq } from "@/components/landing/Faq";
import { LocaleSwitcher } from "@/components/landing/LocaleSwitcher";
import { SorteiosMenu } from "@/components/SorteiosMenu";

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
          {/* menu "Sorteios" — fica FORA do bloco `hidden md:flex` de proposito:
              no celular aquele bloco some inteiro e a pessoa ficava sem nenhuma
              navegacao, tendo que rolar a home ate o fim pra achar as ferramentas. */}
          {locale === "pt-br" && (
            <div className="ml-4 mr-auto md:ml-8">
              <SorteiosMenu />
            </div>
          )}
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

      {/* 🧭 MAIS SORTEIOS — as ferramentas gratuitas nasceram orfas (so no sitemap).
          Sem link partindo do site, nem o visitante nem o Google as encontram —
          exatamente o problema que as ~60 paginas programaticas tinham. */}
      {locale === "pt-br" && (
        <section className="bg-canvas px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center font-display text-2xl font-bold text-ink sm:text-3xl">Mais sorteios</h2>
            <p className="mt-2 text-center text-sm text-inkSoft">
              Escolha o tipo de sorteio que você precisa fazer.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { href: "/sorteio", icone: "📸", nome: "Sorteio no Instagram", desc: "Puxa os comentários do seu post e gera o vídeo da revelação.", tag: "Pago" },
                { href: "/sorteador-de-nomes", icone: "🎲", nome: "Sorteador de nomes", desc: "Cole uma lista de nomes e sorteie na hora, com certificado.", tag: "Grátis" },
                { href: "/amigo-secreto", icone: "🎁", nome: "Amigo secreto", desc: "Sorteie os pares e mande um link secreto para cada pessoa.", tag: "Grátis" },
              ].map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group rounded-2xl border border-ink/10 bg-surface p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-gold/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{f.icone}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${f.tag === "Grátis" ? "bg-emerald/10 text-emerald" : "bg-gold/15 text-gold-deep"}`}>
                      {f.tag}
                    </span>
                  </div>
                  <p className="mt-3 font-display font-bold text-ink group-hover:text-gold-deep">{f.nome}</p>
                  <p className="mt-1 text-sm leading-relaxed text-inkSoft">{f.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
            <span className="bg-gradient-to-r from-[#8A6314] via-[#C2922E] to-[#E0B24E] bg-clip-text text-transparent">
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
          <nav className="flex items-center gap-4 text-xs">
            {/* 🔗 Hub de conteúdo. Sem este link, as ~60 paginas programaticas ficavam
                ORFAS: existiam no sitemap mas nenhuma pagina do site apontava pra elas,
                entao o Google as tratava como conteudo de baixa prioridade. */}
            {/* 🆓 O /gratis existia so no sitemap — nenhuma pagina linkava pra ele.
                O FAQ agora cita ele, entao precisa ser encontravel. */}
            <Link href="/gratis" className="hover:text-ink hover:underline">
              {locale === "pt-br" ? "Sorteio grátis" : locale === "es" ? "Sorteo gratis" : locale === "fr-ma" ? "Tirage gratuit" : locale === "ar-ma" ? "سحب مجاني" : "Free draw"}
            </Link>
            {locale === "pt-br" && (
              <>
                <Link href="/sorteador-de-nomes" className="hover:text-ink hover:underline">Sorteador de nomes</Link>
                <Link href="/amigo-secreto" className="hover:text-ink hover:underline">Amigo secreto</Link>
              </>
            )}
            <Link href="/recursos" className="hover:text-ink hover:underline">
              {locale === "pt-br" || locale === "es" ? "Recursos" : locale === "fr-ma" ? "Ressources" : locale === "ar-ma" ? "الموارد" : "Resources"}
            </Link>
            <Link href="/termos" className="hover:text-ink hover:underline">
              {locale === "pt-br" ? "Termos de Uso" : "Terms"}
            </Link>
            <Link href="/privacidade" className="hover:text-ink hover:underline">
              {locale === "pt-br" ? "Privacidade" : "Privacy"}
            </Link>
            <Link href="/guia" className="hover:text-ink hover:underline">
              {locale === "pt-br" ? "Como fazer um sorteio" : locale === "es" ? "Cómo hacer un sorteo" : locale === "fr-ma" ? "Comment faire un tirage" : locale === "ar-ma" ? "كيفية عمل سحب" : "How to run a giveaway"}
            </Link>
            <a
              href="https://wa.me/5548991420313"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink hover:underline"
            >
              💬 {locale === "pt-br" ? "Suporte" : locale === "es" ? "Soporte" : locale === "ar-ma" ? "الدعم" : "Support"}
            </a>
          </nav>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-center text-xs text-inkSoft/60">
          © 2026 AzuraSort · LPG Digital. {locale === "pt-br" ? "Não afiliado à Meta/Instagram." : "Not affiliated with Meta/Instagram."}
        </p>
      </footer>
    </main>
  );
}
