# Prizegram

> Nao sorteie. Faca um espetaculo.

O sorteador de Instagram mais cinematografico do mundo. O diferencial nao e sortear — e a **revelacao do vencedor** como uma cena de cinema, e o **video compartilhavel** gerado automaticamente.

Veja o blueprint completo em [`docs/PRIZEGRAM-BLUEPRINT.md`](docs/PRIZEGRAM-BLUEPRINT.md).

## Monorepo

```
prizegram/
├─ apps/
│  └─ web/              # Next.js 15 (App Router) + R3F — frontend e cenas de revelacao
├─ packages/
│  ├─ reveal-spec/      # Contrato compartilhado tela<->video (Zod + tipos)
│  └─ ui-tokens/        # Design tokens premium (cores, motion, easing)
└─ docs/                # Blueprint mestre
```

> **A peca central:** `packages/reveal-spec` define o JSON que descreve uma revelacao.
> A MESMA spec alimenta a cena 3D no browser (R3F) e a composicao de video (Remotion),
> garantindo que o MP4 baixado seja identico ao que o usuario viu na tela.

## Rodar

```bash
npm install
npm run dev          # http://localhost:3000
```

Demo da cena Oscar: http://localhost:3000/reveal/demo

## Stack (Fase 0/1)

Next.js 15 · TypeScript · Tailwind · React Three Fiber / Three.js · Framer Motion · Zod

## Status

Fase 0 (fundacao) — scaffold + prova de conceito da cena Oscar provando a paridade tela<->video.
