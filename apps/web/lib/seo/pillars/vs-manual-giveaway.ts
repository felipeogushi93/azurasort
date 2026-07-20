/**
 * Pillar "AzuraSort vs sortear na mão (manual)".
 * Ângulo: fazer o sorteio manualmente (rolar comentários, random.org, print) vs.
 * automático + auditável. Dor: tempo, suspeita de manipulação, zero prova.
 * Multilíngue (en default, pt-br, es, fr-ma, ar-ma) com fallback para en.
 */

import type { PillarContent } from "./video";

const en: PillarContent = {
  metaTitle: "Picking an Instagram giveaway winner by hand vs AzuraSort",
  metaDescription:
    "Doing an Instagram giveaway manually — scrolling comments, random.org, a screenshot — is slow and impossible to prove. See how AzuraSort automates the draw and gives you a verifiable certificate and a reveal video.",
  keywords: [
    "pick instagram giveaway winner by hand",
    "manual instagram giveaway",
    "how to choose a giveaway winner",
    "random.org instagram giveaway",
    "instagram giveaway winner generator",
    "provably fair giveaway",
  ],
  h1: "Picking a winner by hand vs AzuraSort",
  intro:
    "Plenty of people still run giveaways manually: scroll the comments, count them, drop a number into random.org and screenshot the result. It works, but it is slow, easy to get wrong, and — the real problem — impossible to prove to a skeptical follower. This page compares the manual way with what AzuraSort automates.",
  whyTitle: "Where the manual method breaks down",
  whyParas: [
    "The manual route has three weak points. First, time: on a post with thousands of comments you cannot realistically read them all, so you sample — and sampling is not fair. Second, duplicates and rule-checking (one entry per person, required mentions, hashtags) are almost impossible to enforce by hand. Third, proof: a screenshot of random.org proves nothing, because nobody saw how you got that number. Your most engaged followers are exactly the ones who wonder if it was rigged.",
    "AzuraSort automates all three. It pulls every comment, applies your rules (block duplicates, require mentions or hashtags), and draws with a provably-fair algorithm: commit-reveal with SHA-256 + Fisher-Yates. The hash is published before the result, so anyone can reproduce the draw on a public certificate page — real proof, not a screenshot. And instead of a static image, you get a cinematic reveal video (MP4) ready to post, plus multiple winners and backups in one run. Manual is free; AzuraSort is pay-per-use, with the price shown before you pay, by card or PIX.",
  ],
  stepsTitle: "The automated way, step by step",
  steps: [
    { name: "Paste the post or Reel link", text: "AzuraSort loads the preview and the comment count automatically — no scrolling, no counting, no spreadsheet." },
    { name: "Set your rules", text: "Block duplicate users, require mentions or hashtags, pick how many winners and backups — enforced automatically, not by eye." },
    { name: "Run the draw", text: "Every eligible comment is shuffled deterministically and the winner is revealed on screen, live if you want." },
    { name: "Share proof and video", text: "Post the reveal MP4 and share the certificate link so anyone can re-check the result was fair — something a manual draw can never give you." },
  ],
  faqTitle: "Manual giveaway vs AzuraSort: common questions",
  faq: [
    { q: "Is random.org enough for an Instagram giveaway?", a: "It gives you a random number, but it cannot read your comments, remove duplicates or prove the result to your audience. You still do all the work by hand and end up with a screenshot nobody can verify. AzuraSort does the collection, the rules and the proof for you." },
    { q: "Why does proof matter?", a: "The bigger the prize and the audience, the more people quietly wonder if the winner was a friend. A manual draw asks them to just trust you. AzuraSort publishes a hash before the draw and a public certificate after, so the fairness is mathematical, not a matter of trust." },
    { q: "Isn't doing it manually cheaper?", a: "Yes — manual is free. AzuraSort is pay-per-use because it also gives you a shareable video and a verifiable certificate. If the giveaway is casual, manual is fine. If it matters, the small fee buys you time saved and credibility." },
    { q: "How does AzuraSort handle thousands of comments?", a: "It collects them automatically, so post size is not a problem — unlike reading them by hand, where large posts force you to sample and lose fairness." },
    { q: "Can I still do a live reveal?", a: "Yes. You can stream the reveal so your audience watches the winner come up in real time, then keep the MP4 and certificate afterwards." },
  ],
  cta: "Automate my next giveaway",
  breadcrumb: "Manual vs AzuraSort",
};

const ptBr: PillarContent = {
  metaTitle: "Sortear no Instagram na mão vs AzuraSort",
  metaDescription:
    "Fazer o sorteio manual — rolar os comentários, random.org, um print — é lento e impossível de provar. Veja como o AzuraSort automatiza o sorteio e ainda gera um certificado verificável e um vídeo de revelação.",
  keywords: [
    "sortear no instagram na mão",
    "sorteio manual instagram",
    "como escolher ganhador de sorteio",
    "random.org sorteio instagram",
    "gerador de ganhador instagram",
    "sorteio verificável",
  ],
  h1: "Sortear na mão vs AzuraSort",
  intro:
    "Muita gente ainda faz sorteio manualmente: rola os comentários, conta, joga um número no random.org e tira um print. Funciona, mas é lento, fácil de errar e — o problema de verdade — impossível de provar pra um seguidor desconfiado. Esta página compara o jeito manual com o que o AzuraSort automatiza.",
  whyTitle: "Onde o método manual falha",
  whyParas: [
    "O caminho manual tem três pontos fracos. Primeiro, tempo: num post com milhares de comentários você não lê todos de verdade, então amostra — e amostrar não é justo. Segundo, duplicados e regras (um por pessoa, marcações, hashtags) são quase impossíveis de garantir na mão. Terceiro, prova: um print do random.org não prova nada, porque ninguém viu como você chegou naquele número. Seus seguidores mais engajados são justamente os que desconfiam se foi armado.",
    "O AzuraSort automatiza os três. Ele puxa todos os comentários, aplica suas regras (bloquear duplicados, exigir marcações ou hashtags) e sorteia com algoritmo provably-fair: commit-reveal com SHA-256 + Fisher-Yates. O hash é publicado antes do resultado, então qualquer um reproduz o sorteio numa página pública de certificado — prova de verdade, não um print. E no lugar de uma imagem estática, você recebe um vídeo de revelação cinematográfico (MP4) pronto pra postar, além de vários ganhadores e suplentes de uma vez. Manual é grátis; o AzuraSort é pago por uso, com o preço mostrado antes de pagar, no cartão ou PIX.",
  ],
  stepsTitle: "O jeito automático, passo a passo",
  steps: [
    { name: "Cole o link do post ou Reels", text: "O AzuraSort carrega a prévia e a contagem de comentários automaticamente — sem rolar, sem contar, sem planilha." },
    { name: "Defina suas regras", text: "Bloqueie usuários duplicados, exija marcações ou hashtags, escolha quantos ganhadores e suplentes — tudo aplicado automaticamente, não no olho." },
    { name: "Faça o sorteio", text: "Cada comentário elegível é embaralhado de forma determinística e o ganhador é revelado na tela, ao vivo se você quiser." },
    { name: "Compartilhe prova e vídeo", text: "Poste o MP4 da revelação e divulgue o link do certificado pra qualquer um reconferir que foi justo — algo que o sorteio manual nunca te dá." },
  ],
  faqTitle: "Sorteio manual vs AzuraSort: dúvidas comuns",
  faq: [
    { q: "O random.org já basta pra um sorteio de Instagram?", a: "Ele te dá um número aleatório, mas não lê seus comentários, não remove duplicados nem prova o resultado pra sua audiência. Você continua fazendo tudo na mão e termina com um print que ninguém verifica. O AzuraSort faz a coleta, as regras e a prova por você." },
    { q: "Por que a prova importa?", a: "Quanto maior o prêmio e o público, mais gente se pergunta em silêncio se o ganhador foi um amigo. O sorteio manual pede pra confiarem em você. O AzuraSort publica um hash antes do sorteio e um certificado público depois, então a justiça é matemática, não confiança." },
    { q: "Não é mais barato fazer na mão?", a: "Sim — manual é grátis. O AzuraSort é pago por uso porque também te dá um vídeo pra compartilhar e um certificado verificável. Se o sorteio é casual, manual serve. Se importa, a taxa pequena compra tempo economizado e credibilidade." },
    { q: "Como o AzuraSort lida com milhares de comentários?", a: "Ele coleta tudo automaticamente, então o tamanho do post não é problema — diferente de ler na mão, onde posts grandes te obrigam a amostrar e perder a justiça." },
    { q: "Ainda dá pra fazer revelação ao vivo?", a: "Sim. Você transmite a revelação pra audiência ver o ganhador surgir em tempo real, e depois guarda o MP4 e o certificado." },
  ],
  cta: "Automatizar meu próximo sorteio",
  breadcrumb: "Manual vs AzuraSort",
};

const es: PillarContent = {
  metaTitle: "Hacer un sorteo de Instagram a mano vs AzuraSort",
  metaDescription:
    "Hacer el sorteo manual — desplazar los comentarios, random.org, una captura — es lento e imposible de probar. Mira cómo AzuraSort automatiza el sorteo y genera un certificado verificable y un vídeo de revelación.",
  keywords: [
    "hacer sorteo instagram a mano",
    "sorteo manual instagram",
    "cómo elegir ganador de sorteo",
    "random.org sorteo instagram",
    "generador de ganador instagram",
    "sorteo verificable",
  ],
  h1: "Sortear a mano vs AzuraSort",
  intro:
    "Mucha gente todavía hace sorteos manualmente: desplaza los comentarios, cuenta, mete un número en random.org y hace una captura. Funciona, pero es lento, fácil de equivocar y — el problema real — imposible de probar ante un seguidor desconfiado. Esta página compara la forma manual con lo que AzuraSort automatiza.",
  whyTitle: "Dónde falla el método manual",
  whyParas: [
    "La vía manual tiene tres puntos débiles. Primero, tiempo: en un post con miles de comentarios no los lees todos de verdad, así que muestreas — y muestrear no es justo. Segundo, duplicados y reglas (uno por persona, menciones, hashtags) son casi imposibles de garantizar a mano. Tercero, prueba: una captura de random.org no prueba nada, porque nadie vio cómo llegaste a ese número. Tus seguidores más fieles son justo los que sospechan si estuvo amañado.",
    "AzuraSort automatiza los tres. Extrae todos los comentarios, aplica tus reglas (bloquear duplicados, exigir menciones o hashtags) y sortea con un algoritmo provably-fair: commit-reveal con SHA-256 + Fisher-Yates. El hash se publica antes del resultado, así que cualquiera reproduce el sorteo en una página pública de certificado — prueba real, no una captura. Y en lugar de una imagen estática, recibes un vídeo de revelación cinematográfico (MP4) listo para publicar, además de varios ganadores y suplentes de una vez. Manual es gratis; AzuraSort es de pago por uso, con el precio mostrado antes de pagar, con tarjeta o PIX.",
  ],
  stepsTitle: "La forma automática, paso a paso",
  steps: [
    { name: "Pega el enlace del post o Reel", text: "AzuraSort carga la vista previa y el número de comentarios automáticamente — sin desplazar, sin contar, sin hoja de cálculo." },
    { name: "Define tus reglas", text: "Bloquea usuarios duplicados, exige menciones o hashtags, elige cuántos ganadores y suplentes — aplicado automáticamente, no a ojo." },
    { name: "Haz el sorteo", text: "Cada comentario elegible se baraja de forma determinista y el ganador se revela en pantalla, en directo si quieres." },
    { name: "Comparte prueba y vídeo", text: "Publica el MP4 de la revelación y comparte el enlace del certificado para que cualquiera revise que fue justo — algo que un sorteo manual nunca te da." },
  ],
  faqTitle: "Sorteo manual vs AzuraSort: preguntas frecuentes",
  faq: [
    { q: "¿Basta con random.org para un sorteo de Instagram?", a: "Te da un número al azar, pero no lee tus comentarios, no quita duplicados ni prueba el resultado a tu audiencia. Sigues haciendo todo a mano y acabas con una captura que nadie verifica. AzuraSort hace la recolección, las reglas y la prueba por ti." },
    { q: "¿Por qué importa la prueba?", a: "Cuanto mayor es el premio y la audiencia, más gente se pregunta en silencio si el ganador fue un amigo. El sorteo manual pide que confíen en ti. AzuraSort publica un hash antes del sorteo y un certificado público después, así la justicia es matemática, no confianza." },
    { q: "¿No es más barato hacerlo a mano?", a: "Sí — manual es gratis. AzuraSort es de pago por uso porque también te da un vídeo para compartir y un certificado verificable. Si el sorteo es informal, manual vale. Si importa, la pequeña tarifa compra tiempo y credibilidad." },
    { q: "¿Cómo maneja AzuraSort miles de comentarios?", a: "Los recoge automáticamente, así que el tamaño del post no es problema — a diferencia de leerlos a mano, donde los posts grandes te obligan a muestrear y pierdes la justicia." },
    { q: "¿Puedo hacer la revelación en directo?", a: "Sí. Transmites la revelación para que tu audiencia vea al ganador aparecer en tiempo real, y luego guardas el MP4 y el certificado." },
  ],
  cta: "Automatizar mi próximo sorteo",
  breadcrumb: "Manual vs AzuraSort",
};

const frMa: PillarContent = {
  metaTitle: "Tirer au sort un gagnant Instagram à la main vs AzuraSort",
  metaDescription:
    "Faire un tirage Instagram manuellement — faire défiler les commentaires, random.org, une capture d'écran — est lent et impossible à prouver. Découvrez comment AzuraSort automatise le tirage et vous donne un certificat vérifiable et une vidéo de révélation.",
  keywords: [
    "tirage au sort instagram à la main",
    "tirage instagram manuel",
    "comment choisir un gagnant de tirage",
    "random.org tirage instagram",
    "générateur de gagnant instagram",
    "tirage au sort vérifiable",
  ],
  h1: "Tirage à la main vs AzuraSort",
  intro:
    "Beaucoup de gens font encore leurs tirages manuellement : faire défiler les commentaires, les compter, saisir un nombre sur random.org et faire une capture d'écran. Ça marche, mais c'est lent, facile à rater et — le vrai problème — impossible à prouver à un abonné sceptique. Cette page compare la méthode manuelle à ce qu'AzuraSort automatise.",
  whyTitle: "Là où la méthode manuelle s'effondre",
  whyParas: [
    "La voie manuelle a trois points faibles. D'abord le temps : sur un post à plusieurs milliers de commentaires, vous ne pouvez pas tous les lire, donc vous échantillonnez — et échantillonner n'est pas équitable. Ensuite, les doublons et le respect des règles (une participation par personne, mentions obligatoires, hashtags) sont quasi impossibles à contrôler à la main. Enfin la preuve : une capture d'écran de random.org ne prouve rien, puisque personne n'a vu comment vous avez obtenu ce nombre. Vos abonnés les plus engagés sont justement ceux qui se demandent si c'était truqué.",
    "AzuraSort automatise les trois. Il récupère tous les commentaires, applique vos règles (bloquer les doublons, exiger des mentions ou des hashtags) et tire au sort avec un algorithme prouvablement équitable : commit-reveal avec SHA-256 + Fisher-Yates. Le hash est publié avant le résultat, donc chacun peut reproduire le tirage sur une page de certificat public — une vraie preuve, pas une capture d'écran. Et au lieu d'une image figée, vous obtenez une vidéo de révélation cinématographique (MP4) prête à publier, plus plusieurs gagnants et suppléants en une seule fois. Le manuel est gratuit ; AzuraSort fonctionne au paiement à l'usage, avec le prix affiché avant de payer, par carte ou PIX.",
  ],
  stepsTitle: "La méthode automatisée, étape par étape",
  steps: [
    { name: "Collez le lien du post ou du Reel", text: "AzuraSort charge l'aperçu et le nombre de commentaires automatiquement — sans défilement, sans comptage, sans tableur." },
    { name: "Définissez vos règles", text: "Bloquez les comptes en double, exigez des mentions ou des hashtags, choisissez le nombre de gagnants et de suppléants — appliqué automatiquement, pas à l'œil." },
    { name: "Lancez le tirage", text: "Chaque commentaire éligible est mélangé de façon déterministe et le gagnant est révélé à l'écran, en direct si vous voulez." },
    { name: "Partagez la preuve et la vidéo", text: "Publiez le MP4 de la révélation et diffusez le lien du certificat pour que chacun revérifie l'équité du résultat — ce qu'un tirage manuel ne pourra jamais vous offrir." },
  ],
  faqTitle: "Tirage manuel vs AzuraSort : questions fréquentes",
  faq: [
    { q: "random.org suffit-il pour un tirage Instagram ?", a: "Il vous donne un nombre aléatoire, mais il ne lit pas vos commentaires, ne supprime pas les doublons et ne prouve rien à votre audience. Vous faites toujours tout à la main et vous finissez avec une capture d'écran que personne ne peut vérifier. AzuraSort se charge de la collecte, des règles et de la preuve." },
    { q: "Pourquoi la preuve compte-t-elle ?", a: "Plus le lot et l'audience sont importants, plus les gens se demandent en silence si le gagnant était un ami. Un tirage manuel leur demande de vous croire sur parole. AzuraSort publie un hash avant le tirage et un certificat public après : l'équité devient mathématique, pas une question de confiance." },
    { q: "Le faire à la main n'est-il pas moins cher ?", a: "Si — le manuel est gratuit. AzuraSort est payant à l'usage parce qu'il vous donne aussi une vidéo à partager et un certificat vérifiable. Si le tirage est informel, le manuel suffit. S'il compte, la petite somme vous achète du temps et de la crédibilité." },
    { q: "Comment AzuraSort gère-t-il des milliers de commentaires ?", a: "Il les collecte automatiquement, donc la taille du post n'est pas un problème — contrairement à une lecture à la main, où les gros posts vous obligent à échantillonner et à perdre l'équité." },
    { q: "Puis-je quand même faire une révélation en direct ?", a: "Oui. Vous pouvez diffuser la révélation pour que votre audience voie le gagnant apparaître en temps réel, puis conserver le MP4 et le certificat." },
  ],
  cta: "Automatiser mon prochain tirage",
  breadcrumb: "Manuel vs AzuraSort",
};

const arMa: PillarContent = {
  metaTitle: "اختيار الفائز يدويًا على إنستغرام مقابل AzuraSort",
  metaDescription:
    "إجراء سحب إنستغرام يدويًا — تصفّح التعليقات وrandom.org ولقطة شاشة — بطيء ويستحيل إثباته. اكتشف كيف يُؤتمت AzuraSort السحب ويمنحك شهادة قابلة للتحقق وفيديو كشف جاهزًا.",
  keywords: [
    "اختيار فائز إنستغرام يدويًا",
    "سحب إنستغرام يدوي",
    "كيف تختار الفائز في السحب",
    "random.org سحب إنستغرام",
    "مولّد فائز إنستغرام",
    "سحب قابل للتحقق",
  ],
  h1: "السحب اليدوي مقابل AzuraSort",
  intro:
    "لا يزال كثيرون يُجرون السحوبات يدويًا: تصفّح التعليقات، عدّها، إدخال رقم في random.org، ثم أخذ لقطة شاشة. الطريقة تعمل، لكنها بطيئة وسهلة الخطأ، والمشكلة الحقيقية أنها يستحيل إثباتها لمتابع مرتاب. تقارن هذه الصفحة بين الطريقة اليدوية وما يُؤتمته AzuraSort.",
  whyTitle: "أين تنهار الطريقة اليدوية",
  whyParas: [
    "للمسار اليدوي ثلاث نقاط ضعف. أولًا الوقت: في منشور بآلاف التعليقات لا يمكنك واقعيًا قراءتها كلها، فتلجأ إلى عيّنة — والعيّنة ليست عادلة. ثانيًا، المكرّرون وضبط الشروط (مشاركة واحدة لكل شخص، الإشارات المطلوبة، الوسوم) شبه مستحيل يدويًا. ثالثًا، الإثبات: لقطة شاشة من random.org لا تُثبت شيئًا، لأن أحدًا لم يرَ كيف وصلت إلى ذلك الرقم. ومتابعوك الأكثر تفاعلًا هم بالضبط من يتساءلون إن كان السحب مُرتّبًا.",
    "يُؤتمت AzuraSort الثلاثة معًا. يسحب كل التعليقات، ويطبّق شروطك (حجب المكرّرين، اشتراط الإشارات أو الوسوم)، ويجري السحب بخوارزمية قابلة للإثبات: commit-reveal مع SHA-256 وخلط Fisher-Yates. يُنشر الهاش قبل النتيجة، فيستطيع أي شخص إعادة إنتاج السحب على صفحة شهادة عامة — إثبات حقيقي لا لقطة شاشة. وبدل صورة ثابتة، تحصل على فيديو كشف سينمائي (MP4) جاهز للنشر، إضافة إلى عدة فائزين واحتياطيين في تشغيل واحد. الطريقة اليدوية مجانية؛ أما AzuraSort فالدفع فيه حسب الاستخدام، والسعر يظهر قبل الدفع، بالبطاقة أو PIX.",
  ],
  stepsTitle: "الطريقة الآلية خطوة بخطوة",
  steps: [
    { name: "الصق رابط المنشور أو الـ Reel", text: "يحمّل AzuraSort المعاينة وعدد التعليقات تلقائيًا — بلا تصفّح ولا عدّ ولا جداول." },
    { name: "اضبط شروطك", text: "احجب الحسابات المكرّرة، اشترط الإشارات أو الوسوم، وحدّد عدد الفائزين والاحتياطيين — تُطبَّق تلقائيًا لا بالتقدير." },
    { name: "نفّذ السحب", text: "يُخلط كل تعليق مؤهَّل بطريقة حتمية ويُكشف الفائز على الشاشة، مباشرةً إن أردت." },
    { name: "شارك الدليل والفيديو", text: "انشر ملف MP4 للكشف وشارك رابط الشهادة ليُعيد أي شخص التحقق من نزاهة النتيجة — وهو ما لا يمنحك إياه السحب اليدوي أبدًا." },
  ],
  faqTitle: "السحب اليدوي مقابل AzuraSort: أسئلة شائعة",
  faq: [
    { q: "هل يكفي random.org لسحب على إنستغرام؟", a: "يمنحك رقمًا عشوائيًا، لكنه لا يقرأ تعليقاتك ولا يزيل المكرّرين ولا يُثبت النتيجة لجمهورك. تبقى تؤدي كل العمل يدويًا وتنتهي بلقطة شاشة لا يستطيع أحد التحقق منها. أما AzuraSort فيتولّى الجمع والشروط والإثبات نيابةً عنك." },
    { q: "لماذا يهمّ الإثبات؟", a: "كلما كبرت الجائزة والجمهور، ازداد عدد من يتساءلون بصمت إن كان الفائز صديقًا. السحب اليدوي يطلب منهم الثقة بك فحسب. أما AzuraSort فينشر هاشًا قبل السحب وشهادة عامة بعده، فتصبح النزاهة رياضية لا مسألة ثقة." },
    { q: "أليس القيام به يدويًا أرخص؟", a: "بلى — اليدوي مجاني. AzuraSort يعمل بالدفع حسب الاستخدام لأنه يمنحك أيضًا فيديو قابلًا للمشاركة وشهادة قابلة للتحقق. إن كان السحب عابرًا فاليدوي يكفي، أما إن كان مهمًّا فالرسم الصغير يشتري لك وقتًا ومصداقية." },
    { q: "كيف يتعامل AzuraSort مع آلاف التعليقات؟", a: "يجمعها تلقائيًا، فلا يشكّل حجم المنشور مشكلة — بخلاف قراءتها يدويًا حيث تُجبرك المنشورات الكبيرة على أخذ عيّنة وفقدان العدالة." },
    { q: "هل ما زال بإمكاني إجراء كشف مباشر؟", a: "نعم. يمكنك بثّ الكشف ليشاهد جمهورك ظهور الفائز لحظةً بلحظة، ثم تحتفظ بملف MP4 والشهادة بعد ذلك." },
  ],
  cta: "أتمتة سحبي القادم",
  breadcrumb: "اليدوي مقابل AzuraSort",
};

const BY_LOCALE: Record<string, PillarContent> = {
  en,
  "pt-br": ptBr,
  es,
  "fr-ma": frMa,
  "ar-ma": arMa,
};

export function getVsManualGiveaway(locale: string): PillarContent {
  return BY_LOCALE[locale] ?? en;
}
