import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSeo, SITE } from "@/lib/seo/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { howToSchema, faqSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = getSeo(locale);
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}/guia`;
  return {
    title: seo.guideTitle,
    description: seo.guideDescription,
    keywords: seo.keywords,
    alternates: { canonical: `/${locale}/guia`, languages },
    openGraph: { title: seo.guideTitle, description: seo.guideDescription, url: `${SITE.url}/${locale}/guia`, type: "article" },
  };
}

export default async function GuiaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const seo = getSeo(locale);

  return (
    <main className="min-h-screen bg-canvas">
      <JsonLd
        data={[
          howToSchema(seo),
          faqSchema(seo.faq),
          breadcrumbSchema([
            { name: SITE.name, url: `${SITE.url}/${locale}` },
            { name: seo.guideH1, url: `${SITE.url}/${locale}/guia` },
          ]),
        ]}
      />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-violet hover:underline">
          ← {SITE.name}
        </Link>

        <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{seo.guideH1}</h1>
        <p className="mt-4 text-base leading-relaxed text-inkSoft">{seo.guideIntro}</p>

        {/* passo a passo (HowTo) */}
        <h2 className="mt-12 font-display text-2xl font-semibold text-ink">{seo.stepsTitle}</h2>
        <ol className="mt-5 space-y-4">
          {seo.steps.map((s, i) => (
            <li key={i} className="flex gap-4 rounded-2xl border border-ink/5 bg-surface p-4 shadow-soft">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/15 font-display font-bold text-gold-deep">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-ink">{s.name}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-inkSoft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link href="/sorteio" className="btn-gold inline-block px-8 py-3.5 text-base">
            {seo.guideCta}
          </Link>
        </div>

        {/* FAQ (FAQPage) */}
        <h2 className="mt-14 font-display text-2xl font-semibold text-ink">{seo.faqTitle}</h2>
        <div className="mt-5 space-y-3">
          {seo.faq.map((f, i) => (
            <details key={i} className="group rounded-2xl border border-ink/5 bg-surface p-4 shadow-soft">
              <summary className="cursor-pointer list-none font-medium text-ink">{f.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-inkSoft">{f.a}</p>
            </details>
          ))}
        </div>

        {/* link interno para a pillar de vídeo (silos de conteúdo) */}
        <div className="mt-12 border-t border-ink/5 pt-6">
          <Link href="/instagram-giveaway-video" className="text-sm text-violet hover:underline">
            →{" "}
            {locale === "pt-br"
              ? "Sorteio de Instagram com vídeo de revelação"
              : locale === "es"
                ? "Sorteo de Instagram con vídeo de revelación"
                : locale === "fr-ma"
                  ? "Tirage au sort Instagram avec vidéo de révélation"
                  : locale === "ar-ma"
                    ? "سحب على إنستغرام مع فيديو الكشف"
                    : "Instagram giveaway with a video reveal"}
          </Link>
        </div>
      </article>
    </main>
  );
}
