# Deploy do Prizegram + domínio próprio

Objetivo: site no ar no SEU domínio. Caminho recomendado: **GitHub + Vercel** (mais simples para Next.js, deploy automático a cada commit, SSL grátis).

> Eu (Claude) preparo todo o código. As etapas com 🔑 exigem o SEU login e você executa — eu te guio em cada clique.

---

## Pré-requisito (✅ já feito)
- [x] Projeto vira repositório git + 1º commit (feito localmente).

## Passo 1 — Subir o código no GitHub 🔑
1. Crie uma conta em https://github.com (se não tiver).
2. Crie um repositório **vazio** (sem README): https://github.com/new → nome `prizegram` → **Private** → Create.
3. Me passe a URL do repositório (ex: `https://github.com/seuusuario/prizegram.git`).
   - Eu adiciono o remote e deixo tudo pronto; **o push final você roda no seu terminal** (precisa do seu login GitHub) — eu te dou o comando exato.
   - Alternativa sem terminal: **GitHub Desktop** (https://desktop.github.com) → "Add existing repository" → aponta para `C:\dev\prizegram` → Publish.

## Passo 2 — Conectar ao Vercel 🔑
1. Entre em https://vercel.com → **Sign up** com a conta GitHub.
2. **Add New → Project** → selecione o repositório `prizegram`.
3. Em **Configure Project**, defina:
   - **Root Directory:** `apps/web`  ← (importante: é um monorepo)
   - Framework: **Next.js** (detecta sozinho)
   - Build/Install: deixe o padrão
4. **Deploy.** Em ~2 min sai uma URL tipo `prizegram.vercel.app`. Já é o site no ar (teste aqui antes do domínio).

## Passo 3 — Apontar o seu domínio 🔑
1. No projeto do Vercel: **Settings → Domains → Add** → digite seu domínio (ex: `prizegram.com`).
2. O Vercel mostra os registros DNS a configurar. Em geral:
   - Domínio raiz (`prizegram.com`): registro **A** → `76.76.21.21`
   - `www`: registro **CNAME** → `cname.vercel-dns.com`
   - (O Vercel mostra os valores exatos na tela — siga os dele.)
3. Vá no site **onde você comprou o domínio** (registrador: Registro.br, GoDaddy, Hostinger, Namecheap…) → área de **DNS / Gerenciar DNS** → adicione os registros que o Vercel pediu.
4. Volte ao Vercel e aguarde verificar (DNS pode levar de minutos a algumas horas). O **SSL (https)** é automático.
5. Pronto: site no ar em `https://seudominio`.

---

## O que eu preciso de você
1. **Onde comprou o domínio** (registrador) e **qual é o domínio**.
2. Vai usar **GitHub** (recomendado) ou prefere **GitHub Desktop**?

## Importante (expectativa)
Este deploy coloca no ar a **landing + o simulador** (ótimo para validar e captar lista de espera).
O **produto que fatura** (pagamento + scraping de comentários reais) ainda precisa dos pilares de backend — ver `GAP-ANALISE-LANCAMENTO.md`. Esses entram depois e vão ao ar automaticamente a cada novo commit.

## Variáveis de ambiente (mais tarde)
Quando integrarmos pagamento/scraping, as chaves vão em **Vercel → Settings → Environment Variables** (nunca no código). Eu deixo a lista pronta.
