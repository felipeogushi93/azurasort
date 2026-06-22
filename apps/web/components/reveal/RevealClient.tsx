"use client";

import dynamic from "next/dynamic";
import type { RevealSpec } from "@prizegram/reveal-spec";
import type { RevealVariant } from "./RevealStage";

/**
 * Fronteira cliente para a cena 3D.
 * O R3F (Canvas) nao pode ser renderizado no servidor, entao carregamos o
 * RevealStage com ssr:false a partir deste client component.
 */
const RevealStage = dynamic(
  () => import("./RevealStage").then((m) => m.RevealStage),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-void text-lo">
        <span className="animate-pulse tracking-widest">preparando a cena…</span>
      </div>
    ),
  }
);

export function RevealClient({
  spec,
  variant = "page",
  loop = false,
}: {
  spec: RevealSpec;
  variant?: RevealVariant;
  loop?: boolean;
}) {
  if (variant === "embed") {
    return <RevealStage spec={spec} variant="embed" loop={loop} />;
  }
  return (
    <div className="h-screen w-screen">
      <RevealStage spec={spec} variant="page" loop={loop} />
    </div>
  );
}
