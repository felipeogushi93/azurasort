# PRIZEGRAM — Blueprint de Produto & Engenharia
**O sorteador de Instagram mais cinematográfico do mundo.**
Versão 1.0 — Documento mestre de arquitetura, design, SEO, roadmap e go-to-market.

---

## 0. A VERDADE INCONVENIENTE (leia antes de tudo)

Todo o produto depende de uma coisa: **conseguir os comentários de um post do Instagram.** É aqui que 90% dos concorrentes mentem para o cliente. Decisão de arquiteto:

| Caminho | Como funciona | Risco | Decisão |
|---|---|---|---|
| **A. Instagram Graph API (oficial)** | Só lê comentários de posts de contas **Business/Creator que o usuário conecta via OAuth** (Facebook Login). Exige App Review da Meta (`instagram_manage_comments`). | Baixo (legal). Limita ao próprio perfil do cliente. | **PRINCIPAL — MVP.** |
| **B. Importação manual / colar comentários** | Usuário cola lista ou sobe CSV exportado. | Zero risco, fricção alta. | **Fallback sempre disponível.** |
| **C. Scraping não-oficial** | Bots, sessões headless, APIs piratas. | **Alto** — viola ToS da Meta, ban, processo. | **NÃO no core.** Opcional como "bring your own data". |

**Posicionamento honesto:** Prizegram é a ferramenta para **donos de contas Business/Creator** (que é exatamente o público pagante: marcas, influencers, agências). Eles conectam o próprio perfil → 100% legal → e ganham a experiência de revelação que ninguém tem. O scraping de perfil de terceiros fica fora do produto oficial. Isso vira um **diferencial de marca** ("o único sorteador 100% oficial Meta").

Tudo abaixo assume o caminho A + B.

---

## 1. VISÃO & POSICIONAMENTO

**One-liner:** *"Não sorteie. Faça um espetáculo."*

**Categoria:** os concorrentes (Comment Picker, Easypromos, SorteoGram, AppSorteos) vendem "ferramenta". Prizegram vende **momento**. O sorteio é commodity; **a revelação cinematográfica + o vídeo compartilhável** é o produto.

**Tese de crescimento:** cada sorteio gera um vídeo com marca d'água "Made with Prizegram" que vai ao ar para a audiência inteira do cliente (story/reels). É um **loop viral nativo**: o produto se anuncia dentro do conteúdo do cliente.

**Personas:**
1. **Micro-influencer (BR/ES/MA)** — quer parecer maior do que é. Quer reels lindo. Plano free→pro.
2. **Marca / e-commerce** — quer transparência (certificado) + branding (logo no vídeo). Plano business.
3. **Agência** — gerencia N clientes, white-label, API. Plano agency.

---

## 2. ARQUITETURA COMPLETA

### 2.1 Visão macro (monorepo, event-driven)

```
                          ┌─────────────────────────────────────────┐
                          │            Cloudflare (edge)             │
                          │   DNS · WAF · DDoS · CDN · Cache · Bot   │
                          └───────────────┬─────────────────────────┘
                                          │
                ┌─────────────────────────┼──────────────────────────┐
                │                          │                          │
        ┌───────▼────────┐        ┌────────▼────────┐        ┌────────▼────────┐
        │  WEB (Next.js) │        │  API (NestJS)   │        │  CDN estático   │
        │  SSR/ISR/Edge  │◄──REST/│  REST + tRPC    │        │  S3/R2 + assets │
        │  R3F/Three/GSAP│  WS────►│  WebSocket gw   │        │  vídeos/result. │
        └───────┬────────┘        └────┬───────┬────┘        └─────────────────┘
                │                       │       │
                │              ┌────────▼──┐ ┌──▼──────────┐
                │              │ PostgreSQL│ │   Redis     │
                │              │ (Prisma)  │ │ cache+pubsub│
                │              └───────────┘ └──┬──────────┘
                │                               │
                │                        ┌──────▼───────────────────┐
                │                        │   BullMQ (filas)          │
                │                        │  ingest · draw · render   │
                │                        └──┬──────────┬──────────┬──┘
                │                           │          │          │
                │              ┌────────────▼──┐ ┌─────▼─────┐ ┌──▼────────────┐
                │              │ Ingest Worker │ │Draw Worker│ │Render Worker  │
                │              │ IG Graph API  │ │ RNG       │ │ Remotion+ffmpeg│
                │              └───────────────┘ └───────────┘ └──┬────────────┘
                │                                                  │ MP4 → S3
                └──────────────────── Realtime (WS) ◄─────────────┘
```

### 2.2 Serviços (deploy independente em K8s)

| Serviço | Stack | Escala | Responsabilidade |
|---|---|---|---|
| `web` | Next.js 15 (App Router), RSC, Edge runtime para SEO | HPA por CPU/RPS | UI, render 3D, SSR/ISR das páginas de SEO |
| `api` | NestJS, Prisma, Passport (OAuth Meta), Zod | HPA | Auth, CRUD, orquestração de jobs, WebSocket |
| `worker-ingest` | NestJS standalone + BullMQ | KEDA por tamanho de fila | Importa comentários via Graph API, paginação, dedupe |
| `worker-draw` | Node, RNG auditável | KEDA | Executa sorteio determinístico + seed assinado |
| `worker-render` | Remotion + ffmpeg (GPU node pool) | KEDA, nodepool dedicado | Gera MP4 9:16 / 16:9 / 1:1 |
| `realtime` | (pode viver dentro de `api`) Socket.IO + Redis adapter | HPA | Stream do estado do sorteio para a tela de revelação |

### 2.3 Decisões-chave
- **Render de vídeo isolado** num **nodepool com GPU/CPU alto** (Remotion é pesado). Nunca no mesmo pod da API.
- **RNG auditável**: seed = `HMAC-SHA256(secret_servidor, draw_id + lista_ordenada_de_ids + timestamp)`. Resultado reproduzível e verificável → base do **Certificado de Transparência**.
- **Realtime para a revelação**: a animação 3D roda no cliente, mas o *gatilho* do reveal e os dados do vencedor chegam por WebSocket, para que a apresentação possa ser projetada/transmitida e sincronizada (modo "ao vivo" no palco/live).
- **Storage**: Cloudflare R2 (sem egress) ou S3 + CloudFront. Vídeos e certificados em buckets separados com URLs assinadas e expiração.

---

## 3. ESTRUTURA DE PASTAS (monorepo Turborepo + pnpm)

```
prizegram/
├─ apps/
│  ├─ web/                      # Next.js 15 (frontend + páginas SEO)
│  │  ├─ app/
│  │  │  ├─ [locale]/           # i18n: pt-BR, es-ES, ar-MA, en
│  │  │  │  ├─ (marketing)/     # landing, pricing, SEO programático
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ sorteador-instagram/[slug]/page.tsx   # pSEO
│  │  │  │  │  └─ vs/[competitor]/page.tsx              # pSEO comparativo
│  │  │  │  ├─ (app)/           # área logada
│  │  │  │  │  ├─ dashboard/
│  │  │  │  │  ├─ giveaways/[id]/
│  │  │  │  │  └─ reveal/[id]/  # a EXPERIÊNCIA (R3F)
│  │  │  │  └─ layout.tsx
│  │  │  ├─ sitemap.ts / robots.ts
│  │  │  └─ api/                # route handlers leves (webhooks, og-image)
│  │  ├─ components/
│  │  │  ├─ reveal/             # cada módulo de revelação = 1 cena R3F
│  │  │  │  ├─ engine/          # RevealStage, Camera, Lighting, Audio, FX
│  │  │  │  ├─ scenes/          # OscarEnvelope/, Vault/, Hologram/, Matrix/...
│  │  │  │  └─ registry.ts      # mapa id → cena (lazy import)
│  │  │  └─ ui/                 # design system (shadcn-base custom)
│  │  ├─ lib/ hooks/ stores/ (zustand)
│  │  └─ messages/             # pt-BR.json, es-ES.json, ar-MA.json, en.json
│  ├─ api/                     # NestJS
│  │  └─ src/
│  │     ├─ modules/
│  │     │  ├─ auth/  (Meta OAuth, JWT, refresh)
│  │     │  ├─ instagram/ (graph client, ingest)
│  │     │  ├─ giveaways/ (CRUD, filtros)
│  │     │  ├─ draws/ (RNG, multi-winner)
│  │     │  ├─ certificates/ (geração + verificação)
│  │     │  ├─ render/ (enfileira Remotion)
│  │     │  ├─ billing/ (Stripe)
│  │     │  └─ realtime/ (gateway WS)
│  │     ├─ queue/ (BullMQ producers)
│  │     └─ common/ (guards, interceptors, filters, logger)
│  ├─ worker-render/           # Remotion project + consumer BullMQ
│  │  └─ src/compositions/     # composições por formato (9:16,16:9,1:1)
│  └─ worker-ingest/  worker-draw/
├─ packages/
│  ├─ db/                      # Prisma schema + migrations + seed
│  ├─ types/                   # tipos compartilhados (zod schemas)
│  ├─ config/                  # eslint, tsconfig, tailwind preset
│  ├─ ui-tokens/               # design tokens (cores, motion, easing)
│  └─ reveal-spec/             # contrato de dados de cada revelação (web⇆render)
├─ infra/
│  ├─ docker/ (Dockerfiles por app)
│  ├─ k8s/ (helm charts, HPA, KEDA, ingress)
│  └─ terraform/ (R2/S3, Cloudflare, DB, secrets)
├─ turbo.json  pnpm-workspace.yaml
```

**Chave de reuso:** `packages/reveal-spec` define o JSON que descreve um reveal (vencedor, cores, logo, textos, módulo). **A mesma spec** alimenta a cena R3F no browser *e* a composição Remotion no worker → o vídeo é idêntico ao que o usuário viu na tela. Isso é o coração técnico do produto.

---

## 4. BANCO DE DADOS (PostgreSQL — Prisma)

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?
  locale       String   @default("pt-BR")
  plan         Plan     @default(FREE)
  igAccounts   IgAccount[]
  giveaways    Giveaway[]
  createdAt    DateTime @default(now())
}

model IgAccount {           // conta Instagram conectada via OAuth
  id            String  @id @default(cuid())
  userId        String
  user          User    @relation(fields: [userId], references: [id])
  igUserId      String  @unique
  username      String
  accessToken   String  // criptografado (KMS) — long-lived token
  tokenExpires  DateTime
}

model Giveaway {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  igAccountId String?
  mediaUrl    String              // post do IG
  mediaId     String?             // id do media na Graph API
  title       String
  status      GiveawayStatus @default(DRAFT) // DRAFT|IMPORTING|READY|DRAWN
  filters     Json                // ver bloco filtros
  source      CommentSource       // GRAPH_API | MANUAL_CSV
  comments    Comment[]
  draws       Draw[]
  createdAt   DateTime @default(now())
}

model Comment {
  id          String  @id @default(cuid())
  giveawayId  String
  giveaway    Giveaway @relation(fields: [giveawayId], references: [id])
  igCommentId String?
  authorName  String
  authorHandle String
  text        String
  mentions    String[]            // @handles extraídos
  hashtags    String[]
  likeCount   Int     @default(0)
  eligible    Boolean @default(true)
  reason      String?             // por que foi excluído (filtro)
  createdAt   DateTime
  @@index([giveawayId, eligible])
}

model Draw {
  id           String   @id @default(cuid())
  giveawayId   String
  giveaway     Giveaway @relation(fields: [giveawayId], references: [id])
  winnersCount Int      @default(1)
  revealModule String              // ex: "oscar_envelope"
  seed         String              // seed determinístico
  algorithm    String   @default("hmac-sha256-fisher-yates")
  winners      Winner[]
  certificate  Certificate?
  videos       Video[]
  drawnAt      DateTime @default(now())
}

model Winner {
  id        String @id @default(cuid())
  drawId    String
  draw      Draw   @relation(fields: [drawId], references: [id])
  commentId String
  position  Int                   // 1=principal, 2..n=suplentes/multi
  isBackup  Boolean @default(false)
}

model Certificate {              // transparência verificável
  id         String  @id @default(cuid())
  drawId     String  @unique
  draw       Draw    @relation(fields: [drawId], references: [id])
  hash       String              // hash do payload (lista+seed+resultado)
  signature  String              // assinatura do servidor
  publicUrl  String              // /verify/:id
  payload    Json
  createdAt  DateTime @default(now())
}

model Video {
  id        String   @id @default(cuid())
  drawId    String
  draw      Draw     @relation(fields: [drawId], references: [id])
  format    VideoFormat          // VERTICAL | HORIZONTAL | SQUARE
  url       String
  status    RenderStatus @default(QUEUED)
  durationMs Int?
}

enum Plan { FREE PRO BUSINESS AGENCY }
enum GiveawayStatus { DRAFT IMPORTING READY DRAWN }
enum CommentSource { GRAPH_API MANUAL_CSV }
enum VideoFormat { VERTICAL HORIZONTAL SQUARE }
enum RenderStatus { QUEUED RENDERING DONE FAILED }
```

**Filtros (campo `Giveaway.filters` JSON):**
```json
{
  "mustHaveHashtags": ["#sorteio"],
  "mustMentionCount": 2,
  "mentionMustBeReal": false,
  "minComments": 1,
  "blockDuplicateUsers": true,
  "blockOrganizer": true,
  "excludeHandles": ["@marca"]
}
```

---

## 5. FLUXOS DE USUÁRIO

**Fluxo principal (Graph API):**
```
1. Login (Meta OAuth) → conecta conta Business/Creator
2. Escolhe um post (lista de mídias via Graph API)
3. Importa comentários (worker-ingest, barra de progresso realtime)
4. Configura filtros (hashtag, menções, dedupe, nº vencedores)
5. Pré-visualiza pool elegível ("3.214 participantes válidos")
6. Escolhe o MÓDULO DE REVELAÇÃO (galeria 3D)
7. Personaliza: logo, cores, nome do sorteio, música
8. CLICA EM "REVELAR"  →  experiência cinematográfica fullscreen
9. Vencedor revelado + confetes + som
10. Pós-reveal: baixar 3 MP4s, certificado, recompartilhar, redo
```

**Fluxo fallback (manual/CSV):** pula 1-3, usuário cola/sobe comentários → segue do passo 4.

**Fluxo "Modo Palco / Ao Vivo":** organizador abre `/reveal/:id` numa tela grande (evento, live), controla pelo celular (remote), reveal dispara via WebSocket. Ideal para eventos e lives — momento de marketing.

---

## 6. WIREFRAMES (low-fi)

**Galeria de Revelações (mobile-first):**
```
┌─────────────────────────┐
│  ←   Escolha a cena   ⚙ │
├─────────────────────────┤
│ ┌─────────┐ ┌─────────┐ │
│ │ [3D]    │ │ [3D]    │ │   cards com preview 3D em loop
│ │ Oscar   │ │ Cofre   │ │   (autorrotação, hover = play)
│ │ ⭐ PRO   │ │         │ │
│ └─────────┘ └─────────┘ │
│ ┌─────────┐ ┌─────────┐ │
│ │ Holo    │ │ Matrix  │ │
│ └─────────┘ └─────────┘ │
├─────────────────────────┤
│      [ USAR ESTA CENA ] │  ← CTA fixo, sticky
└─────────────────────────┘
```

**Tela de Revelação (fullscreen, sem cromo):**
```
┌─────────────────────────┐
│                         │
│      [CANVAS R3F]       │   100vh, sem UI
│   cena 3D ocupa tudo    │
│                         │
│   ●●●○○  (suspense bar)  │   indicador sutil de progresso
│                         │
│         (skip ⏭ canto)   │
└─────────────────────────┘
      ↓ após reveal ↓
┌─────────────────────────┐
│   🏆  @vencedor          │
│  "João Silva"           │
│ ┌────┐┌────┐┌────┐      │
│ │9:16││16:9││1:1 │ ↓MP4 │
│ └────┘└────┘└────┘      │
│ [Certificado] [Refazer] │
│ [Compartilhar]          │
└─────────────────────────┘
```

**Dashboard:** lista de sorteios (cards com thumbnail do vídeo), botão "+ Novo", filtro por status, métricas (participantes totais, vídeos gerados, views).

---

## 7. DESIGN SYSTEM

**Princípio:** "Dark luxury + neon premium". Nada de SaaS azul genérico. Referências: Apple keynote, Linear, abertura de filme A24, cassino Bellagio.

**Tokens:**
```
Cores base:
  --bg-void:      #05060A   (preto azulado profundo)
  --bg-elevated:  #0D0F17
  --gold:         #E8C26B → #B8862F  (gradiente Oscar)
  --neon-cyan:    #3DF5FF
  --neon-magenta: #FF2DAA
  --neon-violet:  #8A5BFF
  --text-hi:      #F5F7FF
  --text-lo:      #8A90A6

Tipografia:
  Display: "Clash Display" / "Satoshi"  (impactante, geométrica)
  UI/Body: "Inter" var
  RTL (árabe-MA): "IBM Plex Sans Arabic"

Motion (a alma do produto):
  --ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1)   (overshoot suave)
  --ease-snap:      cubic-bezier(0.7, 0, 0.2, 1)
  durations: micro 120ms · ui 320ms · reveal beats 600–1400ms
  Regra: 60fps sagrado. Sem layout thrash. transform/opacity only.

Glass/Depth:
  blur 24px, borda 1px rgba(255,255,255,0.08), glow interno neon.
  Profundidade real via Three.js, fake via box-shadow em UI 2D.
```

**Componentes:** Button (neon-glow, magnetic hover), Card3D (tilt parallax), ProgressOrb, ConfettiSystem, AudioToggle, ShareSheet, CertificateBadge, LocaleSwitcher (com flag + dir RTL).

**Acessibilidade:** `prefers-reduced-motion` → versão estática elegante (sem cair em feio). Contraste AA no texto. Legendas nos vídeos.

---

## 8. MÓDULOS DE REVELAÇÃO (24 cenas)

Cada cena segue o contrato: **roteiro · câmera · iluminação · som · duração · momento do reveal · impacto.** Todas implementáveis em R3F (browser) e Remotion (vídeo) a partir da mesma `reveal-spec`.

### Tier 1 — Carro-chefe

**1. Envelope Dourado (Oscar)**
- *Roteiro:* envelope dourado flutua, lacre de cera estoura, carta desliza, nome em foil.
- *Câmera:* dolly-in lento + leve shake na abertura; close no nome.
- *Luz:* spot quente cenital, key dourada, rim light.
- *Som:* respiração de plateia → silêncio → "envelope tearing" → fanfarra + aplauso.
- *Duração:* 8s. *Reveal:* 5,5s (carta aberta).
- *Impacto:* prestígio, "ganhei um prêmio de verdade".

**2. Cofre de Banco**
- *Roteiro:* cofre de aço, dial gira, 3 cliques, porta pesada abre, luz dourada vaza, nome em lingote.
- *Câmera:* frontal estática → push-in quando a porta abre.
- *Luz:* fria (aço) vira quente (ouro) no reveal.
- *Som:* dial clicks, trava mecânica, "whoosh" de luz, baixo grave.
- *Duração:* 9s. *Reveal:* 6,5s. *Impacto:* tesouro, valor, exclusividade.

**3. Holograma Futurista**
- *Roteiro:* grid de partículas azuis se forma, scanline, glitch, partículas colapsam no rosto/nome holográfico.
- *Câmera:* órbita 180° + zoom.
- *Luz:* emissiva cyan/violeta, bloom forte.
- *Som:* hum sci-fi, beeps, "data assembling", impacto sub-bass.
- *Duração:* 7s. *Reveal:* 5s. *Impacto:* high-tech, futuro, "IA escolheu".

**4. Matrix de Comentários**
- *Roteiro:* chuva de @handles caindo (estilo Matrix), velocidade aumenta, congela, um handle fica vermelho/dourado e dá zoom.
- *Câmera:* travelling vertical acompanhando a chuva, freeze.
- *Luz:* verde-neon → dourado no escolhido.
- *Som:* digital rain, aceleração, "glitch stop", ping.
- *Duração:* 7s. *Reveal:* 5,5s. *Impacto:* "entre milhares, foi você" — escala visível.

### Tier 2 — Emoção & espetáculo

**5. Cassino Premium (Roleta)**
- *Roteiro:* roleta dourada gira, bola pula entre nomes, desacelera, para no vencedor, fichas voam.
- *Câmera:* top-down → close lateral na bola.
- *Luz:* lustres, reflexos em verniz.
- *Som:* roleta girando, bola quicando, ficha caindo, jackpot bell.
- *Duração:* 10s. *Reveal:* 7s. *Impacto:* sorte, adrenalina, "deu verde".

**6. Loot Box Gamer**
- *Roteiro:* caixa flutua, pulsa, raios de raridade (cinza→roxo→dourado→lendário), explode, nome "LENDÁRIO".
- *Câmera:* shake crescente + flash.
- *Luz:* RGB pulsante, partículas épicas.
- *Som:* build-up tick, "rarity reveal" stinger, explosão.
- *Duração:* 8s. *Reveal:* 6s. *Impacto:* dopamina gamer, raridade.

**7. Tapete Vermelho**
- *Roteiro:* corredor com flashes de paparazzi, holofotes, nome em letreiro de marquise.
- *Câmera:* steadicam avançando pelo tapete.
- *Luz:* flashes estroboscópicos brancos, marquise quente.
- *Som:* gritos de fãs, flashes, música de gala.
- *Duração:* 9s. *Reveal:* 6,5s. *Impacto:* fama, celebridade.

**8. Palco de Show / Arena**
- *Roteiro:* arquibancada escura, holofotes varrem, fumaça, pirotecnia, nome em telão + spot no "vencedor".
- *Câmera:* aérea de palco → drop pro telão.
- *Luz:* moving heads, lasers, strobe.
- *Som:* crowd roar, drop de música, pirotecnia.
- *Duração:* 10s. *Reveal:* 7s. *Impacto:* euforia coletiva, headliner.

**9. IA Revelando (Oráculo)**
- *Roteiro:* orbe de IA "pensando" (partículas neurais), processa, "ANALISANDO 3.214 PARTICIPANTES…", veredito.
- *Câmera:* estática hipnótica + micro-zoom no veredito.
- *Luz:* núcleo emissivo, reflexos.
- *Som:* hum neural, typing, voz sintetizada opcional, chime.
- *Duração:* 8s. *Reveal:* 6s. *Impacto:* imparcialidade, "a máquina decidiu".

**10. Telão de Estádio (Jumbotron)**
- *Roteiro:* câmera "kiss cam" varre a torcida pixelada, para num quadrante, zoom, nome no telão de LED.
- *Câmera:* sweep de jumbotron, zoom digital.
- *Luz:* LED matrix, flares.
- *Som:* estádio, "ohhh", buzina, gol/torcida.
- *Duração:* 9s. *Reveal:* 6,5s. *Impacto:* "apareci no telão", pertencimento.

### Tier 3 — Variedade temática

**11. Portal Dimensional** — fenda de energia se rasga, suga partículas, cospe o nome de outra dimensão. Câmera atravessa o portal. Som whoosh/sub-bass. 7s / reveal 5s. Impacto: épico, surreal.

**12. Galáxia / Cosmos** — câmera viaja por estrelas, uma estrela brilha mais, vira o nome em constelação. Travelling espacial. Som ambiente cósmico + sino. 9s / 6,5s. Impacto: "você é a estrela".

**13. Relâmpago / Tempestade** — nuvens carregadas, tensão, raio cai e "queima" o nome em luz. Câmera baixa heroica. Trovão + crack elétrico. 7s / 5s. Impacto: poder, destino.

**14. Fogos de Artifício** — céu noturno, contagem, fogos explodem formando o nome. Câmera aérea. Whistle + booms. 8s / 6s. Impacto: celebração, festa.

**15. Máquina de Bolinhas (Loteria Oficial)** — globo com bolinhas numeradas/handles giram, sobem pelo tubo, uma sai, abre. Estética "loteria nacional" = credibilidade. Câmera frontal. Som de bolinhas + sopro. 9s / 6,5s. Impacto: transparência, oficial.

**16. Slot Machine / Caça-níquel** — 3 rolos com avatares giram, travam um a um (suspense máximo no último), JACKPOT. Câmera close nos rolos. Alavanca + spin + jackpot. 9s / 7s. Impacto: tensão crescente clássica.

**17. Tela Quebrando (Glass Shatter)** — UI "trava", rachadura se espalha, vidro estilhaça revelando o nome atrás. Câmera com impacto. Crack + shards. 6s / 4,5s. Impacto: surpresa, ruptura.

**18. Caixa de Presente Gigante** — presente embrulhado, laço se desfaz, tampa voa, luz e confete saem, nome no cartão. Câmera push-in. Papel rasgando + pop. 7s / 5,5s. Impacto: dádiva, generosidade da marca.

**19. Neon Cyberpunk (Cidade)** — skyline neon chuvoso, outdoor gigante glitcha o nome em letreiro. Câmera drone pela cidade. Synthwave + glitch. 9s / 6,5s. Impacto: estética cool, jovem.

**20. Submundo do Ouro / Caverna do Tesouro** — câmera mergulha em caverna, moedas, baú lendário abre, nome gravado em ouro. Travelling descendente. Eco + ouro derramando. 9s / 6,5s. Impacto: aventura, recompensa.

**21. Linha do Tempo / Speedrun de Nomes** — todos os participantes passam num feed ultrarrápido com motion blur, freio dramático, lupa no escolhido. Som de aceleração + freada. 7s / 5,5s. Impacto: "olha quanta gente concorreu".

**22. Origami / Papel que Monta** — papel dobra em 3D formando troféu e depois o nome (estilo Apple). Câmera macro elegante. Foley de papel + chime suave. 8s / 6s. Impacto: sofisticação, design premium.

**23. Aquário / Mensagem na Garrafa** — fundo do mar, garrafa flutua, rolha solta, pergaminho com o nome desenrola. Câmera subaquática lenta. Bolhas + ambiente. 8s / 6s. Impacto: leve, encantador.

**24. Countdown de Foguete (Lançamento)** — plataforma, contagem 3-2-1, ignição, foguete sobe deixando rastro que escreve o nome no céu. Câmera baixa heroica → sky. Contagem + ignição + rugido. 10s / 7s (na ignição). Impacto: clímax, "decolou".

> **Estrutura comum de beats (timeline):** `[0–1s setup ambiente] → [1–N build-up/suspense crescente] → [pre-reveal: pico de tensão + pausa/silêncio] → [REVEAL: impacto sonoro+visual sincronizado] → [celebração: confete/aplauso] → [card final com handle + CTA]`. O **silêncio antes do reveal** é a arma mais poderosa — sempre 0,4–0,8s de quase-silêncio antes do clímax.

---

## 9. PIPELINE DE VÍDEO (Remotion)

```
Draw concluído
   → grava reveal-spec (vencedor, módulo, cores, logo, textos, locale)
   → enfileira 3 jobs render (VERTICAL 1080×1920 / HORIZONTAL 1920×1080 / SQUARE 1080×1080)
   → worker-render (GPU nodepool):
        Remotion renderiza a MESMA cena da spec (paridade com a tela)
        ffmpeg: encode H.264 + áudio + marca d'água + logo do cliente
   → upload S3/R2 → URL assinada → notifica via WS → cards de download aparecem
```
- **Marca d'água:** "Made with Prizegram" (removível só em planos pagos).
- **Overlays dinâmicos:** nome do vencedor, nome do sorteio, logo do cliente, @handle, data, hash do certificado (QR opcional).
- **Otimização:** caching de assets, render concorrente por formato, fila prioritária para planos pagos. Tempo-alvo: < 60s por vídeo.

---

## 10. ESTRATÉGIA SEO INTERNACIONAL

**Mercados:** 🇧🇷 Brasil (pt-BR) · 🇪🇸 Espanha (es-ES) · 🇲🇦 Marrocos (ar-MA + fr-MA). Base internacional: en.

**Estrutura de URL — subpasta com locale (melhor para autoridade de domínio único):**
```
prizegram.com/pt-br/...      (Brasil)
prizegram.com/es-es/...      (Espanha)
prizegram.com/ar-ma/...      (Marrocos árabe, RTL)
prizegram.com/fr-ma/...      (Marrocos francês)
prizegram.com/en/...         (global)
```

**hreflang (em cada página, gerado no `layout`/metadata):**
```html
<link rel="alternate" hreflang="pt-BR" href="https://prizegram.com/pt-br/sorteador-instagram" />
<link rel="alternate" hreflang="es-ES" href="https://prizegram.com/es-es/sorteo-instagram" />
<link rel="alternate" hreflang="ar-MA" href="https://prizegram.com/ar-ma/..." />
<link rel="alternate" hreflang="fr-MA" href="https://prizegram.com/fr-ma/..." />
<link rel="alternate" hreflang="x-default" href="https://prizegram.com/en/..." />
```

**Sitemap internacional:** `sitemap.ts` no Next gera index + sitemaps por locale, cada URL com seus `alternates`. Submeter no Search Console (e Yandex/Bing para MA).

**SEO programático (pSEO) — o motor de tráfego:**
- `/{locale}/sorteador-instagram/{nicho}` → "Sorteador de Instagram para [moda / fitness / gastronomia / games...]" (centenas de páginas por nicho × locale).
- `/{locale}/sorteador-instagram/{cidade}` → geolocalizado ("São Paulo", "Madrid", "Casablanca").
- `/{locale}/vs/{concorrente}` → comparativos ("Prizegram vs Comment Picker").
- `/{locale}/modelos/{modulo-reveal}` → landing por cada cena (24 × locales) com vídeo demo → ótimo para "ideias de sorteio instagram".
- `/{locale}/blog/...` → conteúdo localizado (regras de sorteio legal por país — importante: BR tem regras de "distribuição gratuita de prêmios", ES tem LOPD/sorteos, MA tem suas normas).

**Conteúdo localizado (não tradução literal):** termos locais reais — BR: "sorteio", "concorrer", ES: "sorteo", "concursos", MA: árabe darija + francês. Moeda, exemplos culturais, depoimentos locais.

**Técnico:** ISR para páginas pSEO, Core Web Vitals impecáveis (mas a área 3D logada não precisa rankear — separar SEO pages leves de app pesado), structured data (`SoftwareApplication`, `FAQPage`, `VideoObject` nas demos), OG dinâmico por página, `dir="rtl"` no árabe.

---

## 11. SEGURANÇA, INFRA & OBSERVABILIDADE

- **Cloudflare:** WAF (regras OWASP), DDoS L3-7, Bot Management, rate limiting por IP/rota (login, ingest, render), Turnstile no signup.
- **API:** rate limit por usuário/plano (Redis), validação Zod em toda entrada, Helmet, CORS restrito, tokens IG criptografados com KMS, segredos no Vault/Secrets Manager.
- **Auth:** Meta OAuth + JWT curto + refresh rotativo, RBAC (user/agency/admin).
- **Auditoria:** tabela append-only de eventos sensíveis (criação de sorteio, draw, export). O **certificado** é auditoria pública.
- **Alta disponibilidade:** K8s multi-AZ, HPA + KEDA (escala por fila), PgBouncer + réplicas read, Redis em cluster, PodDisruptionBudgets, health/readiness probes.
- **Observabilidade:** OpenTelemetry → Grafana/Tempo/Loki/Prometheus, Sentry (front+back), logs estruturados JSON com trace-id, alertas (fila travada, render falhando, p99 API).
- **Backups:** PITR no Postgres, versionamento no bucket, DR runbook.

---

## 12. ROADMAP DE DESENVOLVIMENTO

**Fase 0 — Fundação (semanas 1–3):** monorepo, design system, auth Meta OAuth, schema DB, CI/CD, infra base (1 cluster, R2).

**Fase 1 — MVP (semanas 4–9):**
- Importação manual/CSV + Graph API (1 conta), filtros, draw com RNG auditável + certificado.
- **3 cenas de revelação** (Oscar, Matrix, Holograma) em R3F.
- Geração de 1 formato de vídeo (9:16).
- Landing pt-BR + pricing + Stripe (Free/Pro).
- → **Objetivo: primeiro vídeo viral nas mãos de influencers BR.**

**Fase 2 — Produto (semanas 10–18):**
- +9 cenas (12 total), 3 formatos de vídeo, histórico, export.
- Modo Palco/Ao Vivo (WebSocket).
- i18n es-ES + ar-MA, hreflang, sitemap, primeiras pSEO.
- Planos Business (white-label parcial, sem marca d'água).

**Fase 3 — Escala (semanas 19–30):**
- 24 cenas, plano Agency + API + white-label total.
- pSEO em massa (nichos × cidades × locales), blog localizado.
- Observabilidade completa, KEDA, multi-AZ, hardening.
- App "embed" (widget de sorteio no site do cliente).

**Fase 4 — Referência mundial (30+):** marketplace de cenas (criadores vendem reveals), integrações (TikTok, YouTube, X), IA generativa de cena por prompt, parcerias com Meta.

---

## 13. PLANO DE MONETIZAÇÃO

| Plano | Preço alvo | Limites | Ganchos |
|---|---|---|---|
| **Free** | R$0 | 1 sorteio/mês, 3 cenas básicas, **com marca d'água**, vídeo 9:16, até 1.000 comentários | Loop viral (marca d'água anuncia o produto) |
| **Pro** | ~R$39/mês | Sorteios ilimitados, 12 cenas, **sem marca d'água**, 3 formatos, certificado, histórico | Influencers |
| **Business** | ~R$149/mês | Todas as cenas, logo do cliente, modo ao vivo, múltiplas contas IG, prioridade de render | Marcas/e-commerce |
| **Agency** | ~R$499/mês | White-label, API, sub-contas, branding próprio, SLA | Agências |

**Extras:** pay-per-reveal (cena premium avulsa), marketplace de cenas (rev-share), créditos de render extra, eventos ao vivo (sorteio em palco com suporte).

**Geo-pricing:** PPP por país (MA e BR com preço ajustado), Pix no Brasil, cartão local na ES/MA.

---

## 14. DIFERENCIAIS COMPETITIVOS

1. **A revelação cinematográfica 3D** — ninguém tem. É a categoria inteira.
2. **Vídeo automático em 3 formatos** — concorrentes dão print; nós damos um reels pronto.
3. **Paridade tela↔vídeo** (mesma spec) — o que viu é o que baixa.
4. **Certificado de transparência verificável** (RNG assinado, página pública /verify).
5. **100% oficial Meta** — confiança, sem risco de ban (vs. ferramentas de scraping).
6. **Marca d'água = motor viral** embutido no modelo de negócio.
7. **Modo Ao Vivo** para eventos/lives — caso de uso que ninguém atende.
8. **SEO programático multilíngue** dominando 3 mercados subexplorados (MA é oceano azul).

---

## 15. IDEIAS DE VIRALIZAÇÃO

- **Marca d'água viral:** todo vídeo free leva "Made with Prizegram" + QR/handle → cada sorteio = anúncio.
- **Programa de criadores:** influencers ganham plano grátis por postar reveals com a hashtag.
- **#PrizegramReveal:** desafio/UGC, melhor reveal do mês ganha prêmio.
- **Template TikTok/Reels:** sons e formatos pensados para o algoritmo (suspense = retenção alta = alcance).
- **Embed "ao vivo":** lives de revelação geram comentários em tempo real → mais engajamento → mais alcance.
- **Comparativos pSEO** capturam quem procura concorrentes.
- **Partnership com agências de influência** (BR/ES) como canal B2B2C.
- **Free tools de isca:** "calculadora de engajamento", "gerador de regras de sorteio legal por país" → captura de leads + SEO.

---

## 16. ESTRATÉGIA PARA SER REFERÊNCIA MUNDIAL

1. **Vença em uma categoria nova, não na antiga.** Não somos "mais um comment picker"; somos "o sorteio que vira espetáculo". Dono da narrativa = dono do mercado.
2. **Loop de produto-led growth:** cada vídeo é distribuição grátis. CAC tende a zero conforme o conteúdo dos clientes circula.
3. **Domine 3 mercados subatendidos primeiro** (BR/ES/MA) com SEO + localização real, depois expanda (MX, IT, FR, mundo árabe).
4. **Moat de conteúdo:** biblioteca de cenas crescente + marketplace = vantagem que escala com criadores externos.
5. **Moat de confiança:** o selo "oficial Meta + certificado verificável" vira padrão de mercado — marcas exigem isso.
6. **Comunidade:** criadores que fazem cenas, agências que revendem, influencers que evangelizam.
7. **Métricas-norte:** vídeos gerados/mês, views totais dos vídeos (alcance da marca), % de sorteios que viram vídeo público, viral coefficient (k > 1).

---

## PRÓXIMOS PASSOS RECOMENDADOS
1. Validar caminho de ingestão (App Review Meta leva semanas — **iniciar já**).
2. Prototipar **1 cena** (Oscar) em R3F + Remotion para provar a paridade tela↔vídeo (é o maior risco técnico).
3. Scaffold do monorepo (Fase 0).
4. Landing pt-BR para captar lista de espera enquanto se constrói.
```
