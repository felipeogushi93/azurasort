import { RevealClient } from "@/components/reveal/RevealClient";
import { VideoReveal } from "@/components/reveal/VideoReveal";
import { CofreReveal } from "@/components/reveal/CofreReveal";
import { buildDemoSpec, buildStageHostSpec } from "@/lib/demoSpecs";

export default async function RevealPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;

  // Cena "Cofre" = video do cofre + @ do vencedor em dourado.
  if (id === "cofre" || id === "vault") {
    return (
      <div className="h-screen w-screen">
        <CofreReveal handle="mari.costa" loop />
      </div>
    );
  }

  // Cena "Palco com Apresentadora" = video real + overlay (a abordagem realista).
  if (id === "stage" || id === "palco") {
    const spec = buildStageHostSpec(id, "pt-BR");
    return (
      <div className="h-screen w-screen">
        <VideoReveal spec={spec} loop />
      </div>
    );
  }

  // Demais cenas: experiencia 3D (R3F).
  const spec = buildDemoSpec(id);
  return <RevealClient spec={spec} />;
}
