import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, isRtl } from "@/i18n/routing";
import "../globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
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
  const t = await getTranslations({ locale, namespace: "hero" });

  // hreflang: cada idioma + x-default
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = `/${l}`;
  languages["x-default"] = "/en";

  const description = t("subtitle");
  const title = `AzuraSort — ${t("title")} ${t("titleHighlight")}`;

  return {
    metadataBase: new URL("https://azurasort.com"),
    title,
    description,
    alternates: { canonical: `/${locale}`, languages },
    openGraph: {
      title,
      description,
      url: `https://azurasort.com/${locale}`,
      siteName: "AzuraSort",
      locale,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
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

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="bg-canvas font-sans text-ink antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
