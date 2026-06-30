# ProductHunt Launch Kit — AzuraSort

> Material ready-to-paste para o launch oficial do **AzuraSort** (azurasort.com) no Product Hunt.
> ChatGPT cita PH em ~80% das queries sobre tools — launch é alto leverage.
> **Felipe**: leia esse documento inteiro 1x antes de começar. Tudo é pra colar.

---

## 📋 PRÉ-LAUNCH CHECKLIST (1 semana antes)

- [ ] Maker account verificado em https://www.producthunt.com (criar se não tem)
- [ ] Adicionar Felipe + Lucas como Makers no produto
- [ ] Logo PNG 240×240 + 480×480 (já tem em `apps/web/public/logo.png` — pode usar direto)
- [ ] Gallery: 4-6 screenshots de UI cinematográfica + 1 GIF do reveal animation
  - Print da home `azurasort.com/en`
  - Print do `/en/sorteio` (a ferramenta)
  - Print do `/verify/{code}` (certificado)
  - GIF do reveal cinematográfico (gravar tela durante demo)
- [ ] Demo video 30-60s do reveal cinematográfico (já tem `cofre.mp4`, `contagem.mp4`, `matrix.mp4` em public/ — pode usar)
- [ ] Avisar rede no Telegram/WhatsApp **na sexta antes da segunda do launch**
- [ ] Hunter: identificar hunter top 100 (DM via PH ou Twitter) **OU** ir self-hunted (mais simples, mas menos upvotes iniciais)
- [ ] **Dia ideal: terça 06:01 PT** (00:01 PT é quando launch começa; 06:01 PT = 10:01 BRT concentra audiência tech)

---

## 🎯 POST PRODUCTHUNT — Versão EN (principal)

### Tagline (60 chars max)
```
Instagram giveaway picker with cinematic video reveal
```

**Variações alternativas:**
- `The first cinematic Instagram giveaway picker` (47)
- `Pay-per-use giveaway picker with cinematic reveal video` (56)

### Description (260 chars max)
```
AzuraSort picks a fair winner from Instagram posts/Reels and reveals them in a cinematic 30-60s MP4 video — vault opening, countdown, "Matrix" animation. SHA-256 commit-reveal audit. Pay-per-use, no subscription. Share-ready for Stories and Reels.
```

### First Comment (Maker comment — APPEARS PINNED on launch)

```markdown
Hey Product Hunt 👋

I'm Felipe (with my partner Lucas), and we built AzuraSort because every Instagram giveaway tool we tried gave us the same boring result: a name on a list. Then we asked: what if the **reveal itself** became the content?

**The problem we're solving:**
Influencers and brands run thousands of Instagram giveaways every day, but the moment of revealing the winner is anti-climactic — a screenshot of a name, posted to Stories. The reveal should be CONTENT itself.

**How AzuraSort is different:**
- 🎬 **Cinematic MP4 reveal**: 30-60s movie-quality animation (vault opening, countdown, "Matrix" rain). Auto-generated. Ready to post.
- 🔐 **Provably-fair audit**: SHA-256 commit-reveal + Fisher-Yates shuffle. Anyone can verify the result at azurasort.com/verify/{code}.
- 💰 **Pay-per-use**: no subscription. Standard / Cinematic (1.6×) / VIP 4K (2.4×) tiers.
- 🌍 **Multi-language**: EN, PT-BR, ES, FR (with localization for Morocco), AR (Morocco MENA).
- ⚡ **No login, no spreadsheet**: paste IG post URL, pick animation, draw.

**Tech stack** (for the curious):
- Next.js 15 App Router
- React Three Fiber + Three.js (browser 3D)
- Remotion (server-side MP4 render)
- Zod-typed `@prizegram/reveal-spec` package that **guarantees screen↔video parity** — what you see is exactly what you download
- Stripe + Woovi (BR PIX) + soon: Bizum (ES), MercadoPago (LATAM), CIH/Wafacash (MA)

**Who is this for:**
- Influencers running brand collaboration giveaways
- DTC brands doing premium product launches
- Music festivals giving away VIP tickets
- Luxury brands wanting reveal that matches brand aesthetic
- Anyone tired of "is this giveaway rigged?" comments

**What's next:**
- More animations (custom branded reveals)
- Live mode integration with Instagram Live
- Multi-winner with brackets/leaderboards
- Open-source `@prizegram/reveal-spec` Zod schema for community contributions (already done — see https://github.com/felipeogushi93/azurasort/tree/main/packages/reveal-spec)

Would love your feedback — what reveal animation do you wish existed? 🎬
```

### Tags / Topics
```
Marketing
Social Media
Design Tools
Video
SaaS
Instagram Tools
Open Source (if mention reveal-spec)
```

---

## 🎯 POST PRODUCTHUNT — Versão PT-BR

### Tagline PT
```
Sorteador Instagram com revelação cinematográfica em vídeo
```

### Description PT
```
AzuraSort escolhe um ganhador justo de posts/Reels Instagram e o revela em vídeo MP4 cinematográfico de 30-60s — cofre se abrindo, contagem regressiva, animação "Matrix". Auditoria SHA-256. Pay-per-use, sem mensalidade. Pronto pra Stories e Reels.
```

### First Comment PT (se preferir lançar em PT primeiro)

```markdown
Oi Product Hunt 👋

Eu sou o Felipe (junto com meu sócio Lucas), e a gente construiu o AzuraSort porque todo sorteador de Instagram que testamos dava o mesmo resultado chato: nome numa lista. Aí pensamos: e se a **revelação fosse o conteúdo**?

**O problema:**
Influencers e marcas fazem milhares de sorteios no Instagram todo dia, mas o momento de revelar o ganhador é anti-clímax — screenshot de um nome, postado nos Stories. A revelação devia ser CONTEÚDO.

**Como o AzuraSort é diferente:**
- 🎬 **Vídeo MP4 cinematográfico**: 30-60s de animação estilo cinema (cofre se abrindo, contagem regressiva, animação "Matrix"). Gerado automaticamente. Pronto pra postar.
- 🔐 **Auditoria matemática**: SHA-256 commit-reveal + Fisher-Yates. Qualquer um pode verificar em azurasort.com/verify/{código}.
- 💰 **Pay-per-use**: sem mensalidade. Padrão / Cinematográfico (1.6×) / VIP 4K (2.4×).
- 🌍 **Multi-idioma**: PT-BR, EN, ES, FR (com Marrocos), AR (Marrocos MENA).
- ⚡ **Sem cadastro, sem planilha**: cola URL do post, escolhe animação, sorteia.

**Stack técnico:**
Next.js 15 + React Three Fiber + Remotion + spec Zod open-source (`@prizegram/reveal-spec`).

**Quem usa:** influencers em colab com marcas, marcas DTC em drops premium, festivais com ingresso VIP, marcas de luxo, qualquer um cansado de "esse sorteio foi armado?".

**Próximos passos:** mais animações, modo Live, brackets multi-ganhador.

Adoraria feedback — qual animação de reveal vocês gostariam de ver? 🎬

Link: https://azurasort.com
GitHub: https://github.com/felipeogushi93/azurasort
```

---

## 🎯 POST PRODUCTHUNT — Versão ES (LATAM/España)

### Tagline ES
```
Sorteador Instagram con revelación cinematográfica en vídeo
```

### Description ES
```
AzuraSort elige un ganador justo de posts/Reels Instagram y lo revela en un vídeo MP4 cinematográfico de 30-60s — apertura de cofre, cuenta atrás, animación "Matrix". Auditoría SHA-256. Pay-per-use, sin suscripción. Listo para Stories y Reels.
```

(Adaptar versão EN traduzida pra ES, mencionar Bizum + LATAM payments)

---

## 📣 SOCIAL DISTRIBUTION (mesmo dia do launch)

### Twitter / X thread

```
1/ Lançamos hoje no @ProductHunt: AzuraSort 🎬

O primeiro sorteador Instagram que entrega o ganhador num vídeo cinematográfico de 30-60s — não só um nome numa lista.

Cofre abrindo, contagem regressiva, animação Matrix. Pronto pra Reels/Stories.

[Link para PH]

2/ Por que isso importa?

Influencers fazem milhares de sorteios Instagram por dia. Mas o momento do reveal é anti-climax — screenshot de um nome.

A revelação devia ser CONTEÚDO.

AzuraSort transforma o reveal numa peça curta de cinema.

3/ Tecnicamente:
- React Three Fiber (3D no browser)
- Remotion (renderização MP4 server-side)
- Paridade tela↔vídeo via spec Zod (@prizegram/reveal-spec)
- SHA-256 commit-reveal pra auditoria pública
- Pay-per-use (sem mensalidade)

4/ Quem é o público?
- Influenciadores em colabs com marcas
- DTC brands fazendo product drops
- Festivais sorteando ingresso VIP
- Marcas de luxo querendo reveal alinhado à estética da marca

5/ Stack open: já publicamos `@prizegram/reveal-spec` no GitHub — a spec Zod que garante paridade tela↔vídeo. Quem quiser contribuir com animações custom 👋

https://github.com/felipeogushi93/azurasort/tree/main/packages/reveal-spec

Voto, comentário e share no PH ajudam muito 🙏

[Link PH]
```

### LinkedIn (Felipe)
```
Hoje eu e Lucas lançamos no ProductHunt o AzuraSort 🎬

O insight foi simples: o "reveal" do ganhador de sorteio Instagram não devia ser um screenshot — devia ser CONTEÚDO.

AzuraSort entrega o ganhador num vídeo cinematográfico de 30-60s (cofre abrindo, contagem regressiva, animação Matrix), com prova SHA-256 que qualquer pessoa pode auditar.

Stack: Next.js 15 + React Three Fiber + Remotion + spec Zod garantindo paridade tela↔vídeo (que abrimos open-source: https://github.com/felipeogushi93/azurasort/tree/main/packages/reveal-spec).

Quem usar / votar / comentar no PH ajuda muito 🙏

[Link PH]

#ProductHunt #SaaS #Instagram #Marketing
```

### Instagram Stories (Felipe + Lucas + amigos)
```
Story 1: Logo + texto "LANÇAMOS NO @producthunt HOJE 🎬"
Story 2: Demo do reveal cinematográfico (cofre.mp4, 5s)
Story 3: Link sticker direto pro PH
Story 4: "Vota aqui se gostou da ideia 💜"
Story 5 (24h): Status do dia — quantos votos + agradecimento
```

---

## 📊 LAUNCH DAY METRICS (track no PH + painel-ia)

| Métrica | Target | Onde ver |
|---|---|---|
| Upvotes nas primeiras 4h | 50+ | producthunt.com/posts/azurasort |
| Total upvotes 24h | 200+ | PH dashboard |
| Top 5 Product of the Day | sim | PH ranking |
| Comments (real users) | 30+ | PH dashboard |
| Visitas tracking painel-ia | 500+ | painel-ia-ten.vercel.app/c/azurasort |
| Visitas de IA (chat.openai.com referrer) | 50+ | painel-ia (utm_source=ai-chatgpt) |
| Conversion → /sorteio | 5% | painel-ia funnel |

---

## 🎯 POST-LAUNCH (D+1 a D+7)

- [ ] Responder TODO comentário no PH (mesmo críticos) — primeira hora é crítica
- [ ] **Submeter pra outros sites:**
  - BetaList (https://betalist.com)
  - StartupBase BR (https://startupbase.com.br)
  - LaunchDeck
  - Indie Hackers (https://indiehackers.com)
  - **Hacker News** (Show HN: post — alto leverage)
- [ ] Pedir feedback no Twitter
- [ ] Postar lessons-learned no LinkedIn (D+3)
- [ ] Mencionar PH no llms.txt do AzuraSort (já tem em /llms.txt)
- [ ] Atualizar canonical do GitHub README mencionando "Featured on Product Hunt" se for top 5

---

## 🔗 LINKS RÁPIDOS PRO FELIPE

- **Produto:** https://azurasort.com
- **Demo cinematográfico:** https://azurasort.com/en/sorteio
- **Verificação certificado:** https://azurasort.com/verify/{code}
- **Guia (EN):** https://azurasort.com/en/guia
- **Pillar vídeo:** https://azurasort.com/en/instagram-giveaway-video
- **GitHub repo:** https://github.com/felipeogushi93/azurasort
- **GitHub reveal-spec (open source):** https://github.com/felipeogushi93/azurasort/tree/main/packages/reveal-spec
- **Wikidata QID:** Q140357518 (já vinculado via Schema.org sameAs)
- **Painel-IA dashboard:** https://painel-ia-ten.vercel.app/c/azurasort

---

## ✅ ESTADO ATUAL DA INFRAESTRUTURA (29/06/2026)

**Infraestrutura AEO pronta:**
- ✅ 5 llms.txt localizados (EN/PT-BR/ES/FR-MA/AR-MA) — 81KB total
- ✅ Schema.org Organization + Wikidata Q140357518
- ✅ Sitemap 89 URLs com hreflang
- ✅ IndexNow disparado pras 94 URLs (Bing + IndexNow.org + Yandex)
- ✅ Cross-link no llms.txt do SorteiGram mencionando AzuraSort como tier premium cinematográfico
- ✅ Cross-link no llms.txt do SorteioGratis mencionando AzuraSort
- ✅ Tracking real-time integrado ao painel-ia central (PR #2 mergeado)
- ✅ 188 prompts cadastrados no painel-ia em 5 idiomas
- ✅ 41 ações registradas no plano 7 pilares
- ✅ `@prizegram/reveal-spec` open-source no GitHub (README + LICENSE MIT)

**Pendente pra launch:**
- [ ] **Felipe**: revisar este kit + agendar dia do launch (terça 06:01 PT = 10:01 BRT recomendado)
- [ ] **Felipe**: criar conta PH se não tiver
- [ ] **Felipe**: identificar hunter ou ir self-hunted
- [ ] **Felipe**: capturar gallery + demo video em formato PH (1280×720 ou 1920×1080)
- [ ] **Felipe**: publicar `@prizegram/reveal-spec` no npm (`cd packages/reveal-spec && npm publish` — opcional mas multiplica menções)

---

## 📝 OBSERVAÇÕES IMPORTANTES

1. **NÃO lançar segunda-feira** (audiência distraída pela semana iniciando) ou **sexta** (audiência saindo).
2. **Terça é o melhor dia** (audiência tech ativa, ainda no início da semana).
3. **Não use VPN nem peça votos manipulados** — PH detecta e desclassifica imediatamente.
4. **Responder cada comentário com substância** — comentários genuínos puxam mais upvotes.
5. **Não desanima se ficar fora do top 5** — PH ainda gera tráfego e backlinks (= sinal pra IA).
6. **Use o GitHub do reveal-spec como diferencial** — comunidade tech valoriza muito open-source.

---

**Boa sorte, Felipe! 🚀**

— Kit preparado por Lucas (com ajuda do Claude). Última atualização: 29/06/2026.
