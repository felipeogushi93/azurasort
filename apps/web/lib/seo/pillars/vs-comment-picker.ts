/**
 * Conteúdo da pillar page "AzuraSort vs. um Comment Picker comum".
 * Ângulo: comparação honesta — um comment picker simples mostra um nome aleatório;
 * o AzuraSort soma vídeo de revelação compartilhável, certificado verificável,
 * múltiplos ganhadores e PIX/multilíngue. Multilíngue (en default, pt-br, es,
 * fr-ma, ar-ma) com fallback para en.
 */

import type { PillarContent } from "./video";

const en: PillarContent = {
  metaTitle: "AzuraSort vs a Comment Picker: which Instagram giveaway tool to use",
  metaDescription:
    "An honest comparison: a plain comment picker shows a random name; AzuraSort adds a shareable reveal video, a verifiable certificate, multiple winners and PIX. See what each one actually does before you pick.",
  keywords: [
    "comment picker vs azurasort",
    "instagram comment picker",
    "best instagram giveaway picker",
    "comment picker alternative",
    "instagram giveaway tool comparison",
    "verifiable giveaway picker",
  ],
  h1: "AzuraSort vs a plain Comment Picker",
  intro:
    "A basic comment picker does one thing: it reads the comments and shows a random name. That is enough for a casual draw. This page is an honest look at where that stops and what AzuraSort adds on top — a shareable reveal video, a certificate anyone can verify, multiple winners, PIX and multiple languages.",
  whyTitle: "What a plain picker does, and what AzuraSort adds",
  whyParas: [
    "A plain comment picker pulls the comments and spins to a random name on screen. It is quick and often free, and for a low-stakes giveaway that may be all you need. What it does not give you is something to post afterwards or anything to show a skeptical follower: the result lives and dies on your screen.",
    "AzuraSort starts from the same idea — draw a winner from comments or likes — and adds the parts that matter when people are watching. The reveal plays as a cinematic animation (vault, countdown or Matrix) that is auto-generated as an MP4 ready to post, and the downloaded video matches the screen exactly. Every draw is provably fair: commit-reveal with SHA-256 + Fisher-Yates, the hash published before the result, so anyone can verify the winner on a public certificate page. You also get multiple winners plus backups, posts and Reels, an optional live reveal, pay-per-use pricing shown before you pay, card and PIX, and several languages.",
  ],
  stepsTitle: "How to run a giveaway with AzuraSort",
  steps: [
    { name: "Paste the post or Reel link", text: "AzuraSort loads the preview and the comment count automatically — no login and no spreadsheet, like a picker but ready to go further." },
    { name: "Pick the entry base and reveal style", text: "Draw from people who commented or who liked, set how many winners and backups you need, then choose the reveal animation: vault, countdown or Matrix." },
    { name: "Run the draw (live if you want)", text: "Entries are shuffled deterministically and the winner is revealed on screen. You can stream the reveal live so your audience sees it happen in real time." },
    { name: "Share the video and the certificate", text: "Download the MP4 of the reveal, ready to post, and share the certificate link so anyone can re-check that the result was fair." },
  ],
  faqTitle: "AzuraSort vs Comment Picker: common questions",
  faq: [
    { q: "Is AzuraSort free like some comment pickers?", a: "Many basic pickers are free because they only show a name. AzuraSort is pay-per-use, priced by the number of participants, with the price shown before you pay — because it also generates the reveal video and the verifiable certificate. Card (Stripe) and PIX are supported." },
    { q: "Can a regular comment picker generate a video?", a: "No. A plain comment picker shows the result on your screen and stops there. AzuraSort renders the cinematic reveal as an MP4 you can download and post, and the file matches exactly what you saw on screen." },
    { q: "Can I prove the winner was not rigged?", a: "With a basic picker you usually cannot — you just have to be trusted. AzuraSort is provably fair (commit-reveal with SHA-256 + Fisher-Yates): the hash is published before the result and anyone can reproduce the draw on a public certificate page." },
    { q: "Does AzuraSort handle multiple winners and Reels?", a: "Yes. It works with posts and Reels, and you can draw several winners plus backups in one go, each a distinct person — something most simple pickers do not cover cleanly." },
    { q: "When is a plain comment picker enough?", a: "If you just want a quick, casual draw for a small post and you do not need a video to share or proof for your followers, a basic picker is fine. Choose AzuraSort when the giveaway matters: when you want content to post and a result you can defend." },
  ],
  cta: "Try AzuraSort for my giveaway",
  breadcrumb: "AzuraSort vs Comment Picker",
};

const ptBr: PillarContent = {
  metaTitle: "AzuraSort vs Comment Picker: qual sorteador de Instagram usar",
  metaDescription:
    "Comparação honesta: um comment picker comum só mostra um nome aleatório; o AzuraSort soma vídeo de revelação pra postar, certificado verificável, vários ganhadores e PIX. Veja o que cada um faz antes de escolher.",
  keywords: [
    "comment picker vs azurasort",
    "sorteador de instagram comentários",
    "melhor sorteador de instagram",
    "alternativa ao comment picker",
    "comparação sorteador instagram",
    "sorteador instagram verificável",
  ],
  h1: "AzuraSort vs um Comment Picker comum",
  intro:
    "Um comment picker básico faz uma coisa só: lê os comentários e mostra um nome aleatório. Pra um sorteio casual, isso basta. Esta página é um olhar honesto sobre onde isso para e o que o AzuraSort acrescenta por cima — vídeo de revelação pra compartilhar, certificado que qualquer um verifica, vários ganhadores, PIX e vários idiomas.",
  whyTitle: "O que um picker comum faz e o que o AzuraSort acrescenta",
  whyParas: [
    "Um comment picker comum puxa os comentários e gira até um nome aleatório na tela. É rápido e muitas vezes gratuito, e pra um sorteio sem peso talvez seja tudo o que você precisa. O que ele não te dá é algo pra postar depois nem nada pra mostrar a um seguidor desconfiado: o resultado nasce e morre na sua tela.",
    "O AzuraSort parte da mesma ideia — sortear um ganhador entre comentários ou curtidas — e acrescenta as partes que importam quando tem gente assistindo. A revelação roda como uma animação cinematográfica (cofre, contagem regressiva ou Matrix) gerada automaticamente como um MP4 pronto pra postar, e o vídeo baixado é idêntico à tela. Todo sorteio é provably-fair: commit-reveal com SHA-256 + Fisher-Yates, com o hash publicado antes do resultado, então qualquer pessoa verifica o ganhador numa página pública de certificado. Você ainda tem vários ganhadores e suplentes, posts e Reels, revelação ao vivo opcional, preço por uso mostrado antes de pagar, cartão e PIX, e vários idiomas.",
  ],
  stepsTitle: "Como fazer um sorteio com o AzuraSort",
  steps: [
    { name: "Cole o link do post ou Reels", text: "O AzuraSort carrega a prévia e o número de comentários automaticamente — sem login e sem planilha, como um picker mas pronto pra ir além." },
    { name: "Escolha a base e o estilo da revelação", text: "Sorteie entre quem comentou ou curtiu, defina quantos ganhadores e suplentes quer e escolha a animação: cofre, contagem regressiva ou Matrix." },
    { name: "Faça o sorteio (ao vivo, se quiser)", text: "Os participantes são embaralhados de forma determinística e o ganhador é revelado na tela. Dá pra transmitir a revelação ao vivo pra audiência ver acontecer em tempo real." },
    { name: "Compartilhe o vídeo e o certificado", text: "Baixe o MP4 da revelação, pronto pra postar, e divulgue o link do certificado pra qualquer um reconferir que foi justo." },
  ],
  faqTitle: "AzuraSort vs Comment Picker: dúvidas comuns",
  faq: [
    { q: "O AzuraSort é grátis como alguns comment pickers?", a: "Muitos pickers básicos são grátis porque só mostram um nome. O AzuraSort é pago por uso, com preço pela quantidade de participantes e o valor mostrado antes de pagar — porque ele também gera o vídeo de revelação e o certificado verificável. Aceita cartão (Stripe) e PIX." },
    { q: "Um comment picker comum gera um vídeo?", a: "Não. Um comment picker comum mostra o resultado na sua tela e para por aí. O AzuraSort gera a revelação cinematográfica como um MP4 que você baixa e posta, e o arquivo é idêntico ao que você viu na tela." },
    { q: "Dá pra provar que o ganhador não foi forjado?", a: "Com um picker básico, normalmente não — você só pode pedir confiança. O AzuraSort é provably-fair (commit-reveal com SHA-256 + Fisher-Yates): o hash é publicado antes do resultado e qualquer um reproduz o sorteio numa página pública de certificado." },
    { q: "O AzuraSort lida com vários ganhadores e Reels?", a: "Sim. Funciona com posts e Reels, e você sorteia vários ganhadores e suplentes de uma vez, cada um uma pessoa distinta — algo que a maioria dos pickers simples não resolve bem." },
    { q: "Quando um comment picker comum já basta?", a: "Se você só quer um sorteio rápido e casual num post pequeno e não precisa de vídeo pra compartilhar nem de prova pros seguidores, um picker básico serve. Escolha o AzuraSort quando o sorteio importa: quando você quer conteúdo pra postar e um resultado que você consegue defender." },
  ],
  cta: "Testar o AzuraSort no meu sorteio",
  breadcrumb: "AzuraSort vs Comment Picker",
};

const es: PillarContent = {
  metaTitle: "AzuraSort vs Comment Picker: qué sorteador de Instagram usar",
  metaDescription:
    "Comparación honesta: un comment picker normal solo muestra un nombre al azar; AzuraSort suma vídeo de revelación para publicar, certificado verificable, varios ganadores y PIX. Mira qué hace cada uno antes de elegir.",
  keywords: [
    "comment picker vs azurasort",
    "sorteador de instagram comentarios",
    "mejor sorteador de instagram",
    "alternativa a comment picker",
    "comparación sorteador instagram",
    "sorteador instagram verificable",
  ],
  h1: "AzuraSort vs un Comment Picker normal",
  intro:
    "Un comment picker básico hace una sola cosa: lee los comentarios y muestra un nombre al azar. Para un sorteo informal, con eso basta. Esta página es una mirada honesta a dónde se detiene eso y qué añade AzuraSort encima — vídeo de revelación para compartir, certificado que cualquiera verifica, varios ganadores, PIX y varios idiomas.",
  whyTitle: "Qué hace un picker normal y qué añade AzuraSort",
  whyParas: [
    "Un comment picker normal extrae los comentarios y gira hasta un nombre al azar en la pantalla. Es rápido y a menudo gratis, y para un sorteo sin importancia quizá sea todo lo que necesitas. Lo que no te da es algo para publicar después ni nada para mostrar a un seguidor desconfiado: el resultado nace y muere en tu pantalla.",
    "AzuraSort parte de la misma idea — elegir un ganador entre comentarios o likes — y añade las partes que importan cuando hay gente mirando. La revelación se reproduce como una animación cinematográfica (caja fuerte, cuenta regresiva o Matrix) generada automáticamente como un MP4 listo para publicar, y el vídeo descargado es idéntico a la pantalla. Cada sorteo es provably-fair: commit-reveal con SHA-256 + Fisher-Yates, con el hash publicado antes del resultado, así que cualquiera verifica al ganador en una página pública de certificado. Además tienes varios ganadores y suplentes, posts y Reels, revelación en directo opcional, precio por uso mostrado antes de pagar, tarjeta y PIX, y varios idiomas.",
  ],
  stepsTitle: "Cómo hacer un sorteo con AzuraSort",
  steps: [
    { name: "Pega el enlace del post o Reel", text: "AzuraSort carga la vista previa y el número de comentarios automáticamente — sin registro y sin hoja de cálculo, como un picker pero listo para ir más allá." },
    { name: "Elige la base y el estilo de revelación", text: "Sortea entre quienes comentaron o dieron like, define cuántos ganadores y suplentes quieres y elige la animación: caja fuerte, cuenta regresiva o Matrix." },
    { name: "Haz el sorteo (en directo si quieres)", text: "Los participantes se barajan de forma determinista y el ganador se revela en pantalla. Puedes transmitir la revelación en vivo para que tu audiencia lo vea ocurrir en tiempo real." },
    { name: "Comparte el vídeo y el certificado", text: "Descarga el MP4 de la revelación, listo para publicar, y comparte el enlace del certificado para que cualquiera vuelva a comprobar que fue justo." },
  ],
  faqTitle: "AzuraSort vs Comment Picker: dudas frecuentes",
  faq: [
    { q: "¿AzuraSort es gratis como algunos comment pickers?", a: "Muchos pickers básicos son gratis porque solo muestran un nombre. AzuraSort es de pago por uso, con precio según el número de participantes y el importe mostrado antes de pagar — porque también genera el vídeo de revelación y el certificado verificable. Acepta tarjeta (Stripe) y PIX." },
    { q: "¿Un comment picker normal puede generar un vídeo?", a: "No. Un comment picker normal muestra el resultado en tu pantalla y ahí se queda. AzuraSort genera la revelación cinematográfica como un MP4 que descargas y publicas, y el archivo es idéntico a lo que viste en pantalla." },
    { q: "¿Puedo demostrar que el ganador no fue amañado?", a: "Con un picker básico normalmente no — solo puedes pedir confianza. AzuraSort es provably-fair (commit-reveal con SHA-256 + Fisher-Yates): el hash se publica antes del resultado y cualquiera reproduce el sorteo en una página pública de certificado." },
    { q: "¿AzuraSort admite varios ganadores y Reels?", a: "Sí. Funciona con posts y Reels, y sorteas varios ganadores y suplentes a la vez, cada uno una persona distinta — algo que la mayoría de pickers simples no resuelve bien." },
    { q: "¿Cuándo basta con un comment picker normal?", a: "Si solo quieres un sorteo rápido e informal en un post pequeño y no necesitas vídeo para compartir ni prueba para tus seguidores, un picker básico vale. Elige AzuraSort cuando el sorteo importa: cuando quieres contenido para publicar y un resultado que puedas defender." },
  ],
  cta: "Probar AzuraSort en mi sorteo",
  breadcrumb: "AzuraSort vs Comment Picker",
};

const frMa: PillarContent = {
  metaTitle: "AzuraSort vs Comment Picker : quel outil de tirage Instagram choisir",
  metaDescription:
    "Comparaison honnête : un comment picker classique affiche juste un nom au hasard ; AzuraSort ajoute une vidéo de révélation à publier, un certificat vérifiable, plusieurs gagnants et PIX. Voyez ce que fait chacun.",
  keywords: [
    "comment picker vs azurasort",
    "outil de tirage instagram commentaires",
    "meilleur outil de tirage instagram",
    "alternative au comment picker",
    "comparaison outil tirage instagram",
    "tirage instagram vérifiable",
  ],
  h1: "AzuraSort vs un Comment Picker classique",
  intro:
    "Un comment picker basique fait une seule chose : il lit les commentaires et affiche un nom au hasard. Pour un tirage informel, cela suffit. Cette page est un regard honnête sur là où cela s'arrête et sur ce qu'AzuraSort ajoute par-dessus — une vidéo de révélation à partager, un certificat que chacun peut vérifier, plusieurs gagnants, PIX et plusieurs langues.",
  whyTitle: "Ce que fait un picker classique et ce qu'AzuraSort ajoute",
  whyParas: [
    "Un comment picker classique récupère les commentaires et tourne jusqu'à un nom au hasard à l'écran. C'est rapide et souvent gratuit, et pour un tirage sans enjeu c'est peut-être tout ce qu'il vous faut. Ce qu'il ne vous donne pas, c'est quelque chose à publier ensuite ni rien à montrer à un abonné méfiant : le résultat naît et meurt sur votre écran.",
    "AzuraSort part de la même idée — tirer un gagnant parmi les commentaires ou les likes — et ajoute les éléments qui comptent quand des gens regardent. La révélation se joue en animation cinématographique (coffre-fort, compte à rebours ou Matrix) générée automatiquement en MP4 prêt à publier, et la vidéo téléchargée est identique à l'écran. Chaque tirage est provably-fair : commit-reveal avec SHA-256 + Fisher-Yates, le hash publié avant le résultat, donc chacun peut vérifier le gagnant sur une page de certificat publique. Vous avez aussi plusieurs gagnants et suppléants, posts et Reels, révélation en direct en option, paiement à l'usage affiché avant de payer, carte et PIX, et plusieurs langues.",
  ],
  stepsTitle: "Comment faire un tirage avec AzuraSort",
  steps: [
    { name: "Collez le lien du post ou du Reel", text: "AzuraSort charge l'aperçu et le nombre de commentaires automatiquement — sans compte et sans tableur, comme un picker mais prêt à aller plus loin." },
    { name: "Choisissez la base et le style de révélation", text: "Tirez parmi ceux qui ont commenté ou aimé, définissez le nombre de gagnants et de suppléants, puis choisissez l'animation : coffre-fort, compte à rebours ou Matrix." },
    { name: "Lancez le tirage (en direct si vous voulez)", text: "Les participants sont mélangés de façon déterministe et le gagnant est révélé à l'écran. Vous pouvez diffuser la révélation en direct pour que votre audience la voie en temps réel." },
    { name: "Partagez la vidéo et le certificat", text: "Téléchargez le MP4 de la révélation, prêt à publier, et partagez le lien du certificat pour que chacun revérifie l'équité." },
  ],
  faqTitle: "AzuraSort vs Comment Picker : questions fréquentes",
  faq: [
    { q: "AzuraSort est-il gratuit comme certains comment pickers ?", a: "Beaucoup de pickers basiques sont gratuits parce qu'ils affichent seulement un nom. AzuraSort est en paiement à l'usage, selon le nombre de participants et le prix affiché avant de payer — car il génère aussi la vidéo de révélation et le certificat vérifiable. Carte (Stripe) et PIX acceptés." },
    { q: "Un comment picker classique peut-il générer une vidéo ?", a: "Non. Un comment picker classique affiche le résultat à l'écran et s'arrête là. AzuraSort génère la révélation cinématographique en MP4 que vous téléchargez et publiez, et le fichier est identique à ce que vous avez vu à l'écran." },
    { q: "Puis-je prouver que le gagnant n'a pas été truqué ?", a: "Avec un picker basique, en général non — il faut juste vous faire confiance. AzuraSort est provably-fair (commit-reveal avec SHA-256 + Fisher-Yates) : le hash est publié avant le résultat et chacun peut reproduire le tirage sur une page de certificat publique." },
    { q: "AzuraSort gère-t-il plusieurs gagnants et les Reels ?", a: "Oui. Ça marche avec les posts et les Reels, et vous tirez plusieurs gagnants et suppléants d'un coup, chacun une personne distincte — ce que la plupart des pickers simples ne gèrent pas proprement." },
    { q: "Quand un comment picker classique suffit-il ?", a: "Si vous voulez juste un tirage rapide et informel sur un petit post et que vous n'avez besoin ni d'une vidéo à partager ni de preuve pour vos abonnés, un picker basique convient. Choisissez AzuraSort quand le tirage compte : quand vous voulez du contenu à publier et un résultat que vous pouvez défendre." },
  ],
  cta: "Essayer AzuraSort pour mon tirage",
  breadcrumb: "AzuraSort vs Comment Picker",
};

const arMa: PillarContent = {
  metaTitle: "AzuraSort مقابل Comment Picker: أي أداة سحب إنستغرام تختار",
  metaDescription:
    "مقارنة صادقة: أداة اختيار التعليقات العادية تعرض اسمًا عشوائيًا فقط؛ أمّا AzuraSort فيضيف فيديو كشف جاهزًا للنشر وشهادة قابلة للتحقق وعدة فائزين وPIX. اطّلع على ما تقدّمه كل أداة قبل الاختيار.",
  keywords: [
    "comment picker مقابل azurasort",
    "أداة سحب إنستغرام بالتعليقات",
    "أفضل أداة سحب إنستغرام",
    "بديل comment picker",
    "سحب إنستغرام موثوق",
  ],
  h1: "AzuraSort مقابل أداة اختيار التعليقات العادية",
  intro:
    "أداة اختيار التعليقات البسيطة تقوم بشيء واحد: تقرأ التعليقات وتعرض اسمًا عشوائيًا. لسحب عابر، هذا يكفي. هذه الصفحة نظرة صادقة إلى حدود ذلك وإلى ما يضيفه AzuraSort فوقه — فيديو كشف قابل للمشاركة، وشهادة يتحقق منها أي شخص، وعدة فائزين، وPIX، وعدة لغات.",
  whyTitle: "ماذا تفعل الأداة العادية وماذا يضيف AzuraSort",
  whyParas: [
    "أداة اختيار التعليقات العادية تسحب التعليقات وتدور حتى تتوقف عند اسم عشوائي على الشاشة. إنها سريعة وغالبًا مجانية، ولسحب بسيط قد تكون كل ما تحتاجه. لكنها لا تمنحك شيئًا تنشره بعد ذلك ولا ما تُظهره لمتابع مرتاب: تولد النتيجة وتموت على شاشتك.",
    "ينطلق AzuraSort من الفكرة نفسها — اختيار فائز من التعليقات أو الإعجابات — ويضيف الأجزاء المهمة حين يكون الناس يشاهدون. يُعرض الكشف كرسوم متحركة سينمائية (الخزنة أو العد التنازلي أو Matrix) تُولَّد تلقائيًا كملف MP4 جاهز للنشر، والفيديو المحمَّل مطابق تمامًا للشاشة. كل سحب قابل للإثبات: commit-reveal مع SHA-256 + Fisher-Yates، ويُنشَر الـ hash قبل النتيجة، فيستطيع أي شخص التحقق من الفائز عبر صفحة شهادة عامة. ولديك أيضًا عدة فائزين واحتياطيين، ومنشورات وReels، وكشف مباشر اختياري، ودفع حسب الاستخدام يُعرَض قبل الدفع، والبطاقة وPIX، وعدة لغات.",
  ],
  stepsTitle: "كيف تنظّم سحبًا باستخدام AzuraSort",
  steps: [
    { name: "الصق رابط المنشور أو الـ Reel", text: "يحمّل AzuraSort المعاينة وعدد التعليقات تلقائيًا — بدون تسجيل دخول وبدون جداول، كأداة اختيار لكن جاهزة للمضي أبعد." },
    { name: "اختر قاعدة السحب ونمط الكشف", text: "اسحب من بين من علّقوا أو أعجبوا، وحدّد عدد الفائزين والاحتياطيين، ثم اختر الرسوم المتحركة: الخزنة أو العد التنازلي أو Matrix." },
    { name: "نفّذ السحب (مباشرةً إن أردت)", text: "يُخلط المشاركون بطريقة حتمية ويُكشف الفائز على الشاشة. ويمكنك بثّ الكشف مباشرةً ليراه جمهورك في الوقت الفعلي." },
    { name: "شارك الفيديو والشهادة", text: "حمّل ملف MP4 للكشف الجاهز للنشر، وشارك رابط الشهادة ليعيد أي شخص التأكد من نزاهة النتيجة." },
  ],
  faqTitle: "AzuraSort مقابل Comment Picker: أسئلة شائعة",
  faq: [
    { q: "هل AzuraSort مجاني مثل بعض أدوات اختيار التعليقات؟", a: "كثير من الأدوات البسيطة مجانية لأنها تعرض اسمًا فقط. أمّا AzuraSort فالدفع فيه حسب الاستخدام، بحسب عدد المشاركين والسعر يُعرَض قبل الدفع — لأنه يولّد أيضًا فيديو الكشف والشهادة القابلة للتحقق. يدعم البطاقة (Stripe) وPIX." },
    { q: "هل تستطيع أداة اختيار تعليقات عادية إنشاء فيديو؟", a: "لا. الأداة العادية تعرض النتيجة على شاشتك وتتوقف هناك. أمّا AzuraSort فيولّد الكشف السينمائي كملف MP4 تحمّله وتنشره، والملف مطابق تمامًا لما رأيته على الشاشة." },
    { q: "هل يمكنني إثبات أن الفائز لم يُزوَّر؟", a: "مع أداة بسيطة عادةً لا — عليك فقط طلب الثقة. أمّا AzuraSort فقابل للإثبات (commit-reveal مع SHA-256 + Fisher-Yates): يُنشَر الـ hash قبل النتيجة ويمكن لأي شخص إعادة تنفيذ السحب عبر صفحة شهادة عامة." },
    { q: "هل يدعم AzuraSort عدة فائزين والـ Reels؟", a: "نعم. يعمل مع المنشورات والـ Reels، وتسحب عدة فائزين واحتياطيين دفعة واحدة، كل منهم شخص مختلف — وهو ما لا تعالجه معظم الأدوات البسيطة بشكل نظيف." },
    { q: "متى تكفي أداة اختيار التعليقات العادية؟", a: "إن أردت سحبًا سريعًا وعابرًا على منشور صغير ولا تحتاج فيديو للمشاركة ولا دليلًا لمتابعيك، فالأداة البسيطة تكفي. اختر AzuraSort حين يكون السحب مهمًا: حين تريد محتوى تنشره ونتيجة تستطيع الدفاع عنها." },
  ],
  cta: "جرّب AzuraSort لسحبي",
  breadcrumb: "AzuraSort مقابل Comment Picker",
};

const BY_LOCALE: Record<string, PillarContent> = {
  en,
  "pt-br": ptBr,
  es,
  "fr-ma": frMa,
  "ar-ma": arMa,
};

export function getVsCommentPicker(locale: string): PillarContent {
  return BY_LOCALE[locale] ?? en;
}
