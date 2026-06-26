# @prizegram/reveal-spec

> Zod schema + types for **AzuraSort** ([azurasort.com](https://azurasort.com)) cinematic giveaway reveals.
>
> One spec → browser scene (React Three Fiber) → server video (Remotion). Screen↔video parity guaranteed.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built for AzuraSort](https://img.shields.io/badge/built%20for-AzuraSort-purple.svg)](https://azurasort.com)

## The problem

You want to give an Instagram giveaway winner a **cinematic reveal video** — vault opening, countdown, "Matrix" animation. Two implementations have to render the *exact same scene*:

1. A live preview in the browser (so the user can watch the reveal happen).
2. A server-rendered MP4 (so the user can download it and post to Stories/Reels).

If the browser scene and the video diverge by a single frame, the user feels cheated — "the video I downloaded isn't what I saw."

`@prizegram/reveal-spec` is the **single source of truth** that both consume.

## What it is

A tiny package (~3KB, Zod + TypeScript) that defines:

- **24 cinematic reveal modules** (`oscar_envelope`, `bank_vault`, `comment_matrix`, `casino_roulette`, `galaxy_cosmos`, `rocket_launch`, …)
- **Winner schema** (position, name, handle, avatar)
- **Branding** (campaign name, logo URL, primary/accent colors in hex, watermark toggle)
- **Audio spec** (track URL, reveal SFX, mute, volume)
- **Timeline** in milliseconds (duration, buildup, pre-reveal hush, reveal beat)
- **Video format** (`VERTICAL` 1080×1920, `HORIZONTAL` 1920×1080, `SQUARE` 1080×1080 — all 30 FPS)
- **Locales** (`pt-BR`, `es-ES`, `ar-MA`, `fr-MA`, `en`) with localised host announcements

The same `RevealSpec` is parsed and validated on both ends with `parseRevealSpec(input)`.

## Install

```bash
pnpm add @prizegram/reveal-spec zod
# or npm / yarn / bun
```

> `zod` is a peer dependency.

## Quick start

```ts
import { parseRevealSpec, getHostLine, VIDEO_DIMENSIONS } from "@prizegram/reveal-spec";

// Validate any payload into a typed RevealSpec
const spec = parseRevealSpec({
  drawId: "draw_abc123",
  module: "oscar_envelope",
  locale: "pt-BR",
  winners: [
    { position: 1, displayName: "Ana Souza", handle: "ana.souza" }
  ],
  branding: {
    campaignName: "Drop de Verão 2026",
    primaryColor: "#E8C26B",
    accentColor: "#3DF5FF",
  },
});

// Locale-aware "And the winner is..."
console.log(getHostLine(spec.locale));
// → "E o premio vai para..."

// Output video size + FPS
const { width, height, fps } = VIDEO_DIMENSIONS.VERTICAL;
// → { width: 1080, height: 1920, fps: 30 }
```

## How AzuraSort uses it

```
                              @prizegram/reveal-spec
                                       │
                ┌──────────────────────┴────────────────────┐
                │                                            │
       Browser (R3F)                                Server (Remotion)
       <RevealScene spec={spec}/>                getVideoMetadata(spec)
       Live preview as user runs the draw        Render MP4 to S3 → user downloads
       — animation, timing, colors all           — same animation, timing, colors,
       derived from `spec`                       rendered headless via Puppeteer
                │                                            │
                └─────► same `spec` JSON ◄───────────────────┘
                              ↓
                  100% screen↔video parity
                  (no "this isn't what I saw" disputes)
```

## Why open-source it

Two reasons:

1. **Trust signal for giveaway audits.** Anyone running a draw on AzuraSort can inspect the spec their reveal was rendered from. The cryptographic certificate at [azurasort.com/verify/{code}](https://azurasort.com) embeds this spec — auditable end-to-end.
2. **Contribute new reveal scenes.** Want a *"K-pop confetti"* or *"Matrix raining @handles"* reveal? Open a PR with a new module identifier + the Zod schema additions. We render it.

## Stack & integrations

- **Browser side:** [React Three Fiber](https://r3f.docs.pmnd.rs/) + [Three.js](https://threejs.org/) + [Framer Motion](https://www.framer.com/motion/)
- **Server side:** [Remotion](https://www.remotion.dev/) via [Vercel Functions](https://vercel.com/) (renders MP4 in ~30s)
- **Validation:** [Zod](https://zod.dev/) — every payload is parsed at both ends with the exact same schema
- **TypeScript:** strict, no `any`, exhaustive type checking

## API reference

### Core
- `RevealSpecSchema` — the Zod schema for a complete reveal
- `parseRevealSpec(input: unknown): RevealSpec` — validates and returns a typed object
- `RevealSpec` — TypeScript type derived from the schema

### Sub-schemas
- `RevealModuleSchema` — one of 24 reveal scene identifiers
- `WinnerSchema` — winner / backup entry
- `BrandingSchema` — campaign branding (colors hex `#RRGGBB`, logo URL, watermark)
- `AudioSpecSchema` — track URL, reveal SFX, mute/volume
- `TimelineSchema` — millisecond beats for buildup → reveal
- `LocaleSchema` — `pt-BR | es-ES | ar-MA | fr-MA | en`
- `VideoFormatSchema` — `VERTICAL | HORIZONTAL | SQUARE`

### Helpers
- `getHostLine(locale: Locale): string` — localised "And the winner is..." line
- `VIDEO_DIMENSIONS` — pixel dimensions + FPS per video format
- `REVEAL_MODULE_META` — title + tier + minimum plan per reveal module
- `HOST_ANNOUNCEMENT` — locale → localised host announcement string

## Available reveal modules

| Module | Tier | Min plan |
|---|---|---|
| `oscar_envelope` | 1 | FREE |
| `comment_matrix` | 1 | FREE |
| `hologram` | 1 | FREE |
| `bank_vault`, `countdown`, `casino_roulette`, `loot_box`, `red_carpet`, `concert_stage`, `ai_oracle`, `stadium_jumbotron`, `dimensional_portal`, `galaxy_cosmos`, `lightning_storm`, `fireworks`, `lottery_machine`, `slot_machine`, `glass_shatter`, `gift_box`, `neon_cyberpunk`, `treasure_cave`, `names_speedrun`, `origami`, `message_in_bottle`, `rocket_launch` | 2-3 | PRO / BUSINESS |

## Used in production by

- [AzuraSort](https://azurasort.com) — cinematic Instagram giveaway picker (EN/PT-BR/ES/FR-MA/AR-MA)

If you ship a product that uses this spec, [open a PR](https://github.com/felipeogushi93/azurasort) to add yourself to this list.

## Contributing

This package lives inside the [AzuraSort monorepo](https://github.com/felipeogushi93/azurasort) under `packages/reveal-spec`.

To add a new reveal module:

1. Add the identifier to `REVEAL_MODULES` (the `as const` array)
2. Update `REVEAL_MODULE_META` with `{ id, title, tier, minPlan }`
3. (Optional) Open a PR with the actual R3F scene under `apps/web/components/reveals/`
4. (Optional) Open a PR with the Remotion composition under `apps/render/compositions/`

Once the spec is approved, both implementations follow.

## License

MIT © [LGP Digital](https://azurasort.com) / [Felipe Ogushi](https://github.com/felipeogushi93)

## Links

- 🌐 [AzuraSort](https://azurasort.com) — the product
- 🔗 [GitHub repo (monorepo)](https://github.com/felipeogushi93/azurasort)
- 📜 [Verify any AzuraSort draw](https://azurasort.com) — public certificate page
- 🐦 Twitter: [@AzuraSort](https://twitter.com/AzuraSort) *(coming soon)*

---

> Built by [LGP Digital](https://azurasort.com) — making Instagram giveaway reveals worth watching.
