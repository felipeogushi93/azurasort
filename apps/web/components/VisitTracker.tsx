"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";

/**
 * Registra uma visita em TODA página pública (home, landings de SEO, /sorteio,
 * /gratis, etc.) — não só nas páginas da ferramenta. Dispara a cada mudança de
 * rota. Fire-and-forget: nunca quebra a UX. Fica no layout [locale].
 */
export function VisitTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track("visit");
  }, [pathname]);
  return null;
}
