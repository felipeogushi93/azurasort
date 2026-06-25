/**
 * Renderiza uma pillar page a partir do seu conteúdo (PillarContent).
 * Inclui JSON-LD (HowTo + FAQPage + BreadcrumbList) e um rodapé de links
 * internos para as outras pillars + o guia (silo de conteúdo).
 */
import { Link } from "@/i18n/navigation";
import { SITE, getSeo } from "@/lib/seo/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { pillarBySlug, PILLARS } from "@/lib/seo/pillars/registry";

export function PillarArticle({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) {
  const def = pillarBySlug(slug);
  if (!def) return null;
  const p = def.get(locale);
  const seo = getSeo(locale);

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: p.h1,
    description: p.metaDescription,
    step: p.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  // outras pillars (para o rodapé de links internos)
  const related = PILLARS.filter((x) => x.slug !== slug);

  return (
    <main className="min-h-screen bg-canvas">
      <JsonLd
        data={[
          howTo,
          faqSchema(p.faq.map((f) => ({ q: f.q, a: f.a }))),
          breadcrumbSchema([
            { name: SITE.name, url: `${SITE.url}/${locale}` },
            { name: p.breadcrumb, url: `${SITE.url}/${locale}/${slug}` },
          ]),
        ]}
      />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-violet hover:underline">
          ← {SITE.name}
        </Link>

        <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {p.h1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-inkSoft">{p.intro}</p>

        {/* Seção "por que" (diferencial / comparação / critérios) */}
        <h2 className="mt-12 font-display text-2xl font-semibold text-ink">
          {p.whyTitle}
        </h2>
        <div className="mt-4 space-y-4">
          {p.whyParas.map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-inkSoft">
              {para}
            </p>
          ))}
        </div>

        {/* Passo a passo (HowTo) */}
        <h2 className="mt-12 font-display text-2xl font-semibold text-ink">
          {p.stepsTitle}
        </h2>
        <ol className="mt-5 space-y-4">
          {p.steps.map((s, i) => (
            <li
              key={i}
              className="flex gap-4 rounded-2xl border border-ink/5 bg-surface p-4 shadow-soft"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/15 font-display font-bold text-gold-deep">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-ink">{s.name}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-inkSoft">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <Link href="/sorteio" className="btn-gold inline-block px-8 py-3.5 text-base">
            {p.cta}
          </Link>
        </div>

        {/* FAQ (FAQPage) */}
        <h2 className="mt-14 font-display text-2xl font-semibold text-ink">
          {p.faqTitle}
        </h2>
        <div className="mt-5 space-y-3">
          {p.faq.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-ink/5 bg-surface p-4 shadow-soft"
            >
              <summary className="cursor-pointer list-none font-medium text-ink">
                {f.q}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-inkSoft">{f.a}</p>
            </details>
          ))}
        </div>

        {/* Links internos: outras pillars + guia (silo de conteúdo) */}
        <nav className="mt-12 border-t border-ink/5 pt-6">
          <p className="text-sm font-semibold text-ink">{SITE.name}</p>
          <ul className="mt-3 space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/${r.slug}`}
                  className="text-sm text-violet hover:underline"
                >
                  → {r.get(locale).breadcrumb}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/guia" className="text-sm text-violet hover:underline">
                → {seo.guideH1}
              </Link>
            </li>
          </ul>
        </nav>
      </article>
    </main>
  );
}
