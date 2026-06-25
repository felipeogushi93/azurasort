import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE } from "@/lib/seo/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { isRtl } from "@/i18n/routing";
import {
  allProgrammaticParams,
  getTopic,
  alternatesForSlug,
  siblingTopics,
} from "@/lib/seo/programmatic";

// só os slugs conhecidos existem; qualquer outro → 404
export const dynamicParams = false;

export function generateStaticParams() {
  return allProgrammaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const topic = getTopic(locale, slug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.description,
    keywords: topic.keywords,
    alternates: { canonical: `/${locale}/${slug}`, languages: alternatesForSlug(locale, slug) },
    openGraph: {
      title: topic.title,
      description: topic.description,
      url: `${SITE.url}/${locale}/${slug}`,
      type: "article",
    },
  };
}

export default async function ProgrammaticPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const topic = getTopic(locale, slug);
  if (!topic) notFound();
  setRequestLocale(locale);
  const rtl = isRtl(locale);
  const siblings = siblingTopics(locale, slug, 4);

  return (
    <main className="min-h-screen bg-canvas" dir={rtl ? "rtl" : "ltr"}>
      <JsonLd
        data={[
          faqSchema(topic.faq),
          breadcrumbSchema([
            { name: SITE.name, url: `${SITE.url}/${locale}` },
            { name: topic.h1, url: `${SITE.url}/${locale}/${slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: topic.h1,
            description: topic.description,
            author: { "@type": "Organization", name: SITE.name },
            publisher: { "@type": "Organization", name: SITE.name },
            mainEntityOfPage: `${SITE.url}/${locale}/${slug}`,
          },
        ]}
      />

      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/" className="text-sm text-violet hover:underline">
          ← {SITE.name}
        </Link>

        <h1 className="mt-6 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{topic.h1}</h1>
        <p className="mt-4 text-base leading-relaxed text-inkSoft">{topic.intro}</p>

        <div className="mt-8">
          <Link href="/sorteio" className="btn-gold inline-block px-8 py-3.5 text-base">
            {topic.cta}
          </Link>
        </div>

        {topic.sections.map((s, i) => (
          <section key={i} className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-ink">{s.h2}</h2>
            <p className="mt-3 text-base leading-relaxed text-inkSoft">{s.body}</p>
          </section>
        ))}

        {/* FAQ (FAQPage) */}
        {topic.faq.length > 0 && (
          <>
            <h2 className="mt-14 font-display text-2xl font-semibold text-ink">FAQ</h2>
            <div className="mt-5 space-y-3">
              {topic.faq.map((f, i) => (
                <details key={i} className="group rounded-2xl border border-ink/5 bg-surface p-4 shadow-soft">
                  <summary className="cursor-pointer list-none font-medium text-ink">{f.q}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-inkSoft">{f.a}</p>
                </details>
              ))}
            </div>
          </>
        )}

        <div className="mt-12 rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 to-surface p-6 text-center">
          <p className="font-display text-xl font-semibold text-ink">{topic.h1}</p>
          <Link href="/sorteio" className="btn-gold mt-4 inline-block px-8 py-3.5 text-base">
            {topic.cta}
          </Link>
        </div>

        {/* links internos (hub-and-spoke) */}
        {siblings.length > 0 && (
          <nav className="mt-12 border-t border-ink/10 pt-8">
            <ul className="grid gap-2 sm:grid-cols-2">
              {siblings.map((sib) => (
                <li key={sib.slug}>
                  <Link href={`/${sib.slug}`} className="text-sm text-violet hover:underline">
                    → {sib.h1}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/guia" className="text-sm text-violet hover:underline">→ {SITE.name} · guia</Link>
              </li>
            </ul>
          </nav>
        )}
      </article>
    </main>
  );
}
