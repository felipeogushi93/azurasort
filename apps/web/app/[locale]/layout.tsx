import type { Metadata } from "next";
import Script from "next/script";
import { Unbounded, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, isRtl } from "@/i18n/routing";
import { getSeo } from "@/lib/seo/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema, softwareAppSchema } from "@/lib/seo/schema";
import "../globals.css";

// display divertida/arrojada (rounded) + corpo moderno e legível
const display = Unbounded({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const seo = getSeo(locale); // títulos/descrições ricos em palavra-chave por idioma

  // hreflang: cada idioma + x-default
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}`;
  languages["x-default"] = "/en";

  return {
    metadataBase: new URL("https://azurasort.com"),
    title: seo.homeTitle,
    description: seo.homeDescription,
    keywords: seo.keywords,
    alternates: { canonical: `/${locale}`, languages },
    openGraph: {
      title: seo.homeTitle,
      description: seo.homeDescription,
      url: `https://azurasort.com/${locale}`,
      siteName: "AzuraSort",
      locale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title: seo.homeTitle, description: seo.homeDescription },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const seo = getSeo(locale);

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="bg-canvas font-sans text-ink antialiased">
        <JsonLd data={[organizationSchema(), websiteSchema(), softwareAppSchema(seo)]} />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        {/* Painel-IA central: rastreia origem do lead (ChatGPT/Claude/Google/ads), visitor_id e
            jornada — junto dos outros sites. Mesma URL/script que os demais sites usam. */}
        <Script src="https://painel-ia-ten.vercel.app/t.js?c=azurasort" strategy="afterInteractive" />
        {/* Google Analytics 4 — painel de visitas + base das campanhas (Google/Meta) */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-3H6JSKZNM5" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-3H6JSKZNM5');`}
        </Script>
      </body>
    </html>
  );
}
