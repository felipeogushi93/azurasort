import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LiveViewer } from "@/components/sorteio/LiveViewer";

export const dynamic = "force-dynamic";

// salas de live não são indexáveis
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Sorteio ao vivo · AzuraSort",
};

export default async function LivePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <LiveViewer id={id} />;
}
