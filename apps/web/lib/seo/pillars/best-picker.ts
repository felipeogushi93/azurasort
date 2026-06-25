/**
 * Conteúdo da pillar page "Best Instagram giveaway picker / tool".
 * Ângulo: buyer's-guide objetivo para o head-term — quais critérios definem a
 * melhor ferramenta de sorteio (nazidade/verificabilidade, output compartilhável,
 * facilidade, modelo de preço, idiomas) e onde o AzuraSort se encaixa.
 * Multilíngue (en default, pt-br, es, fr-ma, ar-ma) com fallback para en.
 */

import type { PillarContent } from "./video";

const en: PillarContent = {
  metaTitle: "Best Instagram giveaway picker (2026): what to look for",
  metaDescription:
    "A buyer's guide to the best Instagram giveaway picker. The criteria that matter — provable fairness, a shareable video reveal, ease of use, price model and languages — and how AzuraSort measures up.",
  keywords: [
    "best instagram giveaway picker",
    "best instagram giveaway tool",
    "instagram comment picker",
    "instagram giveaway app",
    "best giveaway picker 2026",
    "provably fair giveaway tool",
  ],
  h1: "Best Instagram giveaway picker: what to look for",
  intro:
    "Most Instagram giveaway pickers do the same basic job — pull comments and pick a name. What separates a good one is whether the result is verifiable, whether the output is worth sharing, and whether the price is fair. This guide lays out the criteria that matter, then shows where AzuraSort fits.",
  whyTitle: "What makes a giveaway tool the best",
  whyParas: [
    "Five criteria do most of the work when comparing tools. First, fairness you can prove: the draw should be auditable, not just a black box. Second, shareable output: a giveaway is content, so a tool that produces something postable adds real value. Third, ease: no login, no spreadsheet, works with posts and Reels. Fourth, an honest price model: you should see the cost before you pay. Fifth, languages: it should speak to your audience.",
    "Against those criteria, AzuraSort scores well. The draw is provably fair — commit-reveal with SHA-256 plus a Fisher-Yates shuffle — and every result gets a public certificate anyone can re-check. It is also the only picker that auto-generates a cinematic MP4 reveal you can post. It runs with no login from posts or Reels, draws from comments or likes, supports multiple winners and backups, is multilingual, and is pay-per-use (priced by participants, shown before you pay). It will not be the cheapest free toy, and it is built for one-off draws rather than subscriptions — worth knowing before you choose.",
  ],
  stepsTitle: "How to run a giveaway with AzuraSort",
  steps: [
    { name: "Paste the post or Reel link", text: "AzuraSort loads the preview and the comment count automatically — no login, no spreadsheet." },
    { name: "Choose the entry base and reveal style", text: "Draw from people who commented or who liked, set how many winners and backups you want, then pick the reveal animation." },
    { name: "Run the draw", text: "Entries are shuffled deterministically and the winner is revealed on screen — you can stream it live if you want." },
    { name: "Share the video and the certificate", text: "Download the ready-to-post MP4 of the reveal and share the certificate link so anyone can verify the result was fair." },
  ],
  faqTitle: "Frequently asked questions",
  faq: [
    { q: "What's the best free Instagram giveaway picker?", a: "Free pickers are fine for a casual draw, but most can't prove the result was fair and give you nothing to share. If a giveaway matters to your brand, a tool with a verifiable certificate and a shareable reveal is usually worth a small per-draw fee. AzuraSort charges per use, not a subscription." },
    { q: "What should a good giveaway tool have?", a: "Provable fairness you can show your audience, output worth sharing, no login or spreadsheets, support for posts and Reels with multiple winners, an honest price you see before paying, and your language. Those are the criteria we'd compare any tool against." },
    { q: "Is AzuraSort good for influencers and ecommerce?", a: "Yes. The shareable video reveal turns the draw into content that gets reshared, and the public certificate gives followers and customers proof the result was fair — useful for both audience trust and brand credibility." },
    { q: "Does it work with Reels?", a: "Yes. AzuraSort works with both posts and Reels, and can draw from comments or likes, with multiple winners and backups." },
    { q: "How much does it cost?", a: "Pay-per-use, priced by the number of participants. You see the price before paying. Card (Stripe) and PIX are supported." },
  ],
  cta: "Try AzuraSort for my giveaway",
  breadcrumb: "Best giveaway picker",
};

const ptBr: PillarContent = {
  metaTitle: "Melhor sorteador de Instagram (2026): o que avaliar",
  metaDescription:
    "Guia de compra do melhor sorteador de Instagram. Os critérios que importam — sorteio comprovadamente justo, vídeo de revelação compartilhável, facilidade, modelo de preço e idiomas — e onde o AzuraSort se encaixa.",
  keywords: [
    "melhor sorteador de instagram",
    "melhor ferramenta de sorteio instagram",
    "sorteador de comentários instagram",
    "app de sorteio instagram",
    "melhor sorteador instagram 2026",
    "sorteador instagram verificável",
  ],
  h1: "Melhor sorteador de Instagram: o que avaliar",
  intro:
    "A maioria dos sorteadores de Instagram faz o mesmo básico — puxar comentários e escolher um nome. O que separa um bom sorteador é se o resultado é verificável, se a saída vale a pena compartilhar e se o preço é justo. Este guia lista os critérios que importam e mostra onde o AzuraSort se encaixa.",
  whyTitle: "O que torna uma ferramenta de sorteio a melhor",
  whyParas: [
    "Cinco critérios resolvem quase tudo na hora de comparar. Primeiro, justiça que você consegue provar: o sorteio deve ser auditável, não uma caixa-preta. Segundo, saída compartilhável: um sorteio é conteúdo, então uma ferramenta que gera algo postável agrega valor real. Terceiro, facilidade: sem login, sem planilha, funciona com posts e Reels. Quarto, preço honesto: você deve ver o valor antes de pagar. Quinto, idiomas: precisa falar a língua do seu público.",
    "Diante desses critérios, o AzuraSort se sai bem. O sorteio é comprovadamente justo — commit-reveal com SHA-256 e embaralhamento Fisher-Yates — e cada resultado gera um certificado público que qualquer um reconfere. É também o único sorteador que gera automaticamente um vídeo MP4 cinematográfico pronto pra postar. Funciona sem login a partir de posts ou Reels, sorteia entre comentários ou curtidas, aceita vários ganhadores e suplentes, é multilíngue e é pago por uso (preço pela quantidade de participantes, exibido antes do pagamento). Não vai ser o brinquedo grátis mais barato, e foi feito para sorteios pontuais, não assinaturas — bom saber antes de escolher.",
  ],
  stepsTitle: "Como fazer um sorteio com o AzuraSort",
  steps: [
    { name: "Cole o link do post ou Reels", text: "O AzuraSort carrega a prévia e o número de comentários automaticamente — sem login, sem planilha." },
    { name: "Escolha a base e o estilo da revelação", text: "Sorteie entre quem comentou ou curtiu, defina quantos ganhadores e suplentes quer e escolha a animação da revelação." },
    { name: "Faça o sorteio", text: "Os participantes são embaralhados de forma determinística e o ganhador é revelado na tela — dá pra transmitir ao vivo se quiser." },
    { name: "Compartilhe o vídeo e o certificado", text: "Baixe o MP4 da revelação pronto pra postar e divulgue o link do certificado pra qualquer um verificar que foi justo." },
  ],
  faqTitle: "Perguntas frequentes",
  faq: [
    { q: "Qual é o melhor sorteador de Instagram grátis?", a: "Sorteadores grátis servem pra um sorteio casual, mas a maioria não prova que o resultado foi justo e não te dá nada pra compartilhar. Se o sorteio importa pra sua marca, uma ferramenta com certificado verificável e revelação compartilhável costuma valer uma pequena taxa por sorteio. O AzuraSort cobra por uso, sem assinatura." },
    { q: "O que uma boa ferramenta de sorteio precisa ter?", a: "Justiça comprovável que você mostra pro público, saída que vale a pena compartilhar, sem login nem planilhas, suporte a posts e Reels com vários ganhadores, preço honesto exibido antes de pagar e o seu idioma. São os critérios que usaríamos pra comparar qualquer ferramenta." },
    { q: "O AzuraSort é bom para influenciadores e e-commerce?", a: "Sim. O vídeo de revelação compartilhável transforma o sorteio em conteúdo que é recompartilhado, e o certificado público dá a seguidores e clientes a prova de que o resultado foi justo — útil tanto pra confiança da audiência quanto pra credibilidade da marca." },
    { q: "Funciona com Reels?", a: "Sim. O AzuraSort funciona com posts e Reels, e pode sortear entre comentários ou curtidas, com vários ganhadores e suplentes." },
    { q: "Quanto custa?", a: "Pague por uso, com preço pela quantidade de participantes. Você vê o valor antes de pagar. Aceita cartão (Stripe) e PIX." },
  ],
  cta: "Experimentar o AzuraSort no meu sorteio",
  breadcrumb: "Melhor sorteador",
};

const es: PillarContent = {
  metaTitle: "Mejor sorteador de Instagram (2026): qué tener en cuenta",
  metaDescription:
    "Guía de compra del mejor sorteador de Instagram. Los criterios que importan — sorteo demostrablemente justo, vídeo de revelación compartible, facilidad, modelo de precio e idiomas — y dónde encaja AzuraSort.",
  keywords: [
    "mejor sorteador de instagram",
    "mejor herramienta de sorteo instagram",
    "sorteador de comentarios instagram",
    "app de sorteo instagram",
    "mejor sorteador instagram 2026",
    "sorteador instagram verificable",
  ],
  h1: "Mejor sorteador de Instagram: qué tener en cuenta",
  intro:
    "La mayoría de los sorteadores de Instagram hacen lo mismo — recoger comentarios y elegir un nombre. Lo que distingue a uno bueno es si el resultado es verificable, si lo que produce vale la pena compartir y si el precio es justo. Esta guía expone los criterios que importan y muestra dónde encaja AzuraSort.",
  whyTitle: "Qué hace que una herramienta de sorteo sea la mejor",
  whyParas: [
    "Cinco criterios resuelven casi todo al comparar. Primero, equidad que puedas demostrar: el sorteo debe ser auditable, no una caja negra. Segundo, salida compartible: un sorteo es contenido, así que una herramienta que genera algo publicable aporta valor real. Tercero, facilidad: sin registro, sin hoja de cálculo, funciona con posts y Reels. Cuarto, un precio honesto: deberías ver el coste antes de pagar. Quinto, idiomas: debe hablarle a tu audiencia.",
    "Frente a esos criterios, AzuraSort sale bien parado. El sorteo es demostrablemente justo — commit-reveal con SHA-256 y barajado Fisher-Yates — y cada resultado genera un certificado público que cualquiera puede volver a comprobar. Además es el único sorteador que genera automáticamente un vídeo MP4 cinematográfico listo para publicar. Funciona sin registro desde posts o Reels, sortea entre comentarios o likes, admite varios ganadores y suplentes, es multilingüe y es de pago por uso (precio según los participantes, mostrado antes de pagar). No será el juguete gratuito más barato y está pensado para sorteos puntuales, no suscripciones — conviene saberlo antes de elegir.",
  ],
  stepsTitle: "Cómo hacer un sorteo con AzuraSort",
  steps: [
    { name: "Pega el enlace del post o Reel", text: "AzuraSort carga la vista previa y el número de comentarios automáticamente — sin registro, sin hoja de cálculo." },
    { name: "Elige la base y el estilo de revelación", text: "Sortea entre quienes comentaron o dieron like, define cuántos ganadores y suplentes quieres y elige la animación de la revelación." },
    { name: "Haz el sorteo", text: "Los participantes se barajan de forma determinista y el ganador se revela en pantalla — puedes transmitirlo en vivo si quieres." },
    { name: "Comparte el vídeo y el certificado", text: "Descarga el MP4 de la revelación listo para publicar y comparte el enlace del certificado para que cualquiera verifique que fue justo." },
  ],
  faqTitle: "Preguntas frecuentes",
  faq: [
    { q: "¿Cuál es el mejor sorteador de Instagram gratis?", a: "Los sorteadores gratuitos sirven para un sorteo casual, pero la mayoría no demuestra que el resultado fue justo ni te da nada para compartir. Si el sorteo importa para tu marca, una herramienta con certificado verificable y revelación compartible suele valer una pequeña tarifa por sorteo. AzuraSort cobra por uso, sin suscripción." },
    { q: "¿Qué debe tener una buena herramienta de sorteo?", a: "Equidad demostrable que puedas mostrar a tu audiencia, salida que valga la pena compartir, sin registro ni hojas de cálculo, soporte para posts y Reels con varios ganadores, un precio honesto que ves antes de pagar y tu idioma. Esos son los criterios con los que compararíamos cualquier herramienta." },
    { q: "¿AzuraSort es bueno para influencers y ecommerce?", a: "Sí. El vídeo de revelación compartible convierte el sorteo en contenido que se recomparte, y el certificado público da a seguidores y clientes la prueba de que el resultado fue justo — útil tanto para la confianza de la audiencia como para la credibilidad de la marca." },
    { q: "¿Funciona con Reels?", a: "Sí. AzuraSort funciona con posts y Reels, y puede sortear entre comentarios o likes, con varios ganadores y suplentes." },
    { q: "¿Cuánto cuesta?", a: "Pago por uso, según el número de participantes. Ves el precio antes de pagar. Acepta tarjeta (Stripe) y PIX." },
  ],
  cta: "Probar AzuraSort en mi sorteo",
  breadcrumb: "Mejor sorteador",
};

const frMa: PillarContent = {
  metaTitle: "Meilleur outil de tirage Instagram (2026) : que regarder",
  metaDescription:
    "Guide d'achat du meilleur outil de tirage au sort Instagram. Les critères qui comptent — équité prouvable, vidéo de révélation partageable, simplicité, modèle de prix et langues — et où se situe AzuraSort.",
  keywords: [
    "meilleur outil de tirage instagram",
    "meilleur tirage au sort instagram",
    "outil de tirage commentaires instagram",
    "application tirage instagram",
    "meilleur tirage instagram 2026",
    "outil de tirage instagram vérifiable",
  ],
  h1: "Meilleur outil de tirage Instagram : que regarder",
  intro:
    "La plupart des outils de tirage Instagram font la même chose — récupérer les commentaires et choisir un nom. Ce qui distingue un bon outil, c'est si le résultat est vérifiable, si ce qu'il produit vaut la peine d'être partagé et si le prix est juste. Ce guide pose les critères qui comptent, puis montre où se situe AzuraSort.",
  whyTitle: "Ce qui fait le meilleur outil de tirage",
  whyParas: [
    "Cinq critères font l'essentiel quand on compare. D'abord, une équité que vous pouvez prouver : le tirage doit être auditable, pas une boîte noire. Ensuite, un résultat partageable : un tirage, c'est du contenu, donc un outil qui produit quelque chose de publiable apporte une vraie valeur. Troisièmement, la simplicité : sans compte, sans tableur, compatible posts et Reels. Quatrièmement, un prix honnête : vous devriez voir le coût avant de payer. Cinquièmement, les langues : il doit parler à votre audience.",
    "Face à ces critères, AzuraSort s'en sort bien. Le tirage est prouvablement équitable — commit-reveal avec SHA-256 et mélange Fisher-Yates — et chaque résultat génère un certificat public que chacun peut revérifier. C'est aussi le seul outil qui génère automatiquement une vidéo MP4 cinématographique prête à publier. Il fonctionne sans compte à partir de posts ou Reels, tire parmi les commentaires ou les likes, gère plusieurs gagnants et suppléants, est multilingue et fonctionne au paiement à l'usage (prix selon les participants, affiché avant de payer). Ce ne sera pas le jouet gratuit le moins cher, et il est pensé pour des tirages ponctuels, pas des abonnements — bon à savoir avant de choisir.",
  ],
  stepsTitle: "Comment faire un tirage avec AzuraSort",
  steps: [
    { name: "Collez le lien du post ou du Reel", text: "AzuraSort charge l'aperçu et le nombre de commentaires automatiquement — sans compte, sans tableur." },
    { name: "Choisissez la base et le style de révélation", text: "Tirez parmi ceux qui ont commenté ou aimé, définissez le nombre de gagnants et de suppléants, puis choisissez l'animation de la révélation." },
    { name: "Lancez le tirage", text: "Les participants sont mélangés de façon déterministe et le gagnant est révélé à l'écran — vous pouvez le diffuser en direct si vous voulez." },
    { name: "Partagez la vidéo et le certificat", text: "Téléchargez le MP4 de la révélation prêt à publier et partagez le lien du certificat pour que chacun vérifie l'équité." },
  ],
  faqTitle: "Questions fréquentes",
  faq: [
    { q: "Quel est le meilleur outil de tirage Instagram gratuit ?", a: "Les outils gratuits conviennent pour un tirage occasionnel, mais la plupart ne prouvent pas l'équité du résultat et ne vous donnent rien à partager. Si le tirage compte pour votre marque, un outil avec certificat vérifiable et révélation partageable vaut souvent une petite somme par tirage. AzuraSort facture à l'usage, sans abonnement." },
    { q: "Que doit avoir un bon outil de tirage ?", a: "Une équité prouvable que vous pouvez montrer à votre audience, un résultat qui vaut la peine d'être partagé, sans compte ni tableur, la compatibilité posts et Reels avec plusieurs gagnants, un prix honnête affiché avant de payer et votre langue. Ce sont les critères avec lesquels nous comparerions tout outil." },
    { q: "AzuraSort est-il adapté aux influenceurs et au e-commerce ?", a: "Oui. La vidéo de révélation partageable transforme le tirage en contenu qui se repartage, et le certificat public donne aux abonnés et aux clients la preuve que le résultat était équitable — utile à la fois pour la confiance de l'audience et la crédibilité de la marque." },
    { q: "Ça marche avec les Reels ?", a: "Oui. AzuraSort fonctionne avec les posts et les Reels, et peut tirer parmi les commentaires ou les likes, avec plusieurs gagnants et suppléants." },
    { q: "Combien ça coûte ?", a: "Paiement à l'usage, selon le nombre de participants. Vous voyez le prix avant de payer. Carte (Stripe) et PIX acceptés." },
  ],
  cta: "Essayer AzuraSort pour mon tirage",
  breadcrumb: "Meilleur outil de tirage",
};

const arMa: PillarContent = {
  metaTitle: "أفضل أداة سحب على إنستغرام (2026): ما الذي تبحث عنه",
  metaDescription:
    "دليل لاختيار أفضل أداة سحب على إنستغرام. المعايير المهمة — نزاهة قابلة للإثبات، فيديو كشف قابل للمشاركة، سهولة، نموذج تسعير ولغات — وأين يقف AzuraSort منها.",
  keywords: [
    "أفضل أداة سحب إنستغرام",
    "أفضل أداة سحب على إنستغرام",
    "أداة سحب تعليقات إنستغرام",
    "تطبيق سحب إنستغرام",
    "أفضل أداة سحب إنستغرام 2026",
    "أداة سحب إنستغرام موثوقة",
  ],
  h1: "أفضل أداة سحب على إنستغرام: ما الذي تبحث عنه",
  intro:
    "معظم أدوات السحب على إنستغرام تقوم بالأمر نفسه — جمع التعليقات واختيار اسم. ما يميّز الأداة الجيدة هو ما إذا كانت النتيجة قابلة للتحقق، وما إذا كان ناتجها يستحق المشاركة، وما إذا كان السعر عادلًا. يضع هذا الدليل المعايير المهمة، ثم يبيّن أين يقف AzuraSort منها.",
  whyTitle: "ما الذي يجعل أداة السحب الأفضل",
  whyParas: [
    "خمسة معايير تحسم معظم المقارنة. أولًا، نزاهة يمكنك إثباتها: ينبغي أن يكون السحب قابلًا للتدقيق، لا صندوقًا أسود. ثانيًا، ناتج قابل للمشاركة: السحب محتوى بحد ذاته، فالأداة التي تنتج شيئًا قابلًا للنشر تضيف قيمة حقيقية. ثالثًا، السهولة: بدون تسجيل دخول، بدون جداول، تعمل مع المنشورات والـ Reels. رابعًا، سعر صادق: ينبغي أن ترى التكلفة قبل الدفع. خامسًا، اللغات: يجب أن تخاطب جمهورك.",
    "أمام هذه المعايير، يقدّم AzuraSort أداءً جيدًا. السحب قابل للإثبات — commit-reveal مع SHA-256 وخلط Fisher-Yates — وكل نتيجة تحصل على شهادة عامة يمكن لأي شخص إعادة التحقق منها. وهو أيضًا الأداة الوحيدة التي تُنشئ تلقائيًا فيديو MP4 سينمائيًا جاهزًا للنشر. يعمل بدون تسجيل دخول من المنشورات أو الـ Reels، يسحب من التعليقات أو الإعجابات، يدعم عدة فائزين واحتياطيين، متعدد اللغات، والدفع فيه حسب الاستخدام (السعر بحسب عدد المشاركين، ويُعرض قبل الدفع). لن يكون أرخص أداة مجانية، وهو مصمَّم لسحوبات فردية لا اشتراكات — من الجيد معرفة ذلك قبل الاختيار.",
  ],
  stepsTitle: "كيف تُجري سحبًا مع AzuraSort",
  steps: [
    { name: "الصق رابط المنشور أو الـ Reel", text: "يحمّل AzuraSort المعاينة وعدد التعليقات تلقائيًا — بدون تسجيل دخول وبدون جداول." },
    { name: "اختر قاعدة السحب ونمط الكشف", text: "اسحب من بين من علّقوا أو أعجبوا، حدّد عدد الفائزين والاحتياطيين، ثم اختر رسوم الكشف المتحركة." },
    { name: "نفّذ السحب", text: "يُخلط المشاركون بطريقة حتمية ويُكشف الفائز على الشاشة — ويمكنك بثّه مباشرةً إن أردت." },
    { name: "شارك الفيديو والشهادة", text: "حمّل ملف MP4 للكشف الجاهز للنشر، وشارك رابط الشهادة ليتحقق أي شخص من نزاهة النتيجة." },
  ],
  faqTitle: "الأسئلة الشائعة",
  faq: [
    { q: "ما أفضل أداة سحب مجانية على إنستغرام؟", a: "الأدوات المجانية تكفي لسحب عابر، لكن معظمها لا يُثبت نزاهة النتيجة ولا يمنحك شيئًا لمشاركته. إذا كان السحب مهمًّا لعلامتك، فإن أداة بشهادة قابلة للتحقق وكشف قابل للمشاركة تستحق غالبًا رسمًا صغيرًا لكل سحب. يحتسب AzuraSort الرسوم حسب الاستخدام، بلا اشتراك." },
    { q: "ما الذي ينبغي أن تتوفّر عليه أداة سحب جيدة؟", a: "نزاهة قابلة للإثبات تعرضها لجمهورك، ناتج يستحق المشاركة، بلا تسجيل دخول ولا جداول، دعم للمنشورات والـ Reels مع عدة فائزين، سعر صادق تراه قبل الدفع، ولغتك. هذه هي المعايير التي نقارن بها أي أداة." },
    { q: "هل AzuraSort مناسب للمؤثرين والتجارة الإلكترونية؟", a: "نعم. فيديو الكشف القابل للمشاركة يحوّل السحب إلى محتوى يُعاد نشره، والشهادة العامة تمنح المتابعين والعملاء دليلًا على نزاهة النتيجة — مفيد لثقة الجمهور ومصداقية العلامة معًا." },
    { q: "هل يعمل مع الـ Reels؟", a: "نعم. يعمل AzuraSort مع المنشورات والـ Reels، ويمكنه السحب من التعليقات أو الإعجابات، مع عدة فائزين واحتياطيين." },
    { q: "كم يكلّف؟", a: "الدفع حسب الاستخدام، بحسب عدد المشاركين. ترى السعر قبل الدفع. يدعم البطاقة (Stripe) وPIX." },
  ],
  cta: "جرّب AzuraSort في سحبك",
  breadcrumb: "أفضل أداة سحب",
};

const BY_LOCALE: Record<string, PillarContent> = {
  en,
  "pt-br": ptBr,
  es,
  "fr-ma": frMa,
  "ar-ma": arMa,
};

export function getBestPicker(locale: string): PillarContent {
  return BY_LOCALE[locale] ?? en;
}
