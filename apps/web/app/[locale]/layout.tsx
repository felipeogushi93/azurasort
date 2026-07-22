import type { Metadata } from "next";
import Script from "next/script";
import { Unbounded, Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, isRtl } from "@/i18n/routing";
import { getSeo } from "@/lib/seo/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { VisitTracker } from "@/components/VisitTracker";
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
    // Bing Webmaster Tools — verificação de propriedade do site
    verification: { other: { "msvalidate.01": "B080399F204BBDCFA7014F02D6A59A19" } },
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
        <VisitTracker />
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
gtag('config', 'G-3H6JSKZNM5');
// allow_enhanced_conversions=true → Google Ads auto-detecta email/phone digitados
// no site e usa como user identifier hasheado, elevando o match rate quando o
// browser bloqueia cookies / o cliente fecha aba antes do simulator carregar.
// Precisa Enhanced Conversions ligado no dashboard Google Ads.
// SÓ a conta AzuraSort BR — as outras duas (AW-18276235962 fantasma e
// AW-18240050787 Rafflecopter US) foram removidas: nao existiam/eram conta errada.
gtag('config', 'AW-18290962377', { 'allow_enhanced_conversions': true });`}
        </Script>
        {/* Meta Pixel (Facebook/Instagram Ads) — base PageView; eventos de conversão (Purchase)
            disparados no GiveawaySimulator junto do GA4/Google Ads */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1714547693072201');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src="https://www.facebook.com/tr?id=1714547693072201&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </html>
  );
}
