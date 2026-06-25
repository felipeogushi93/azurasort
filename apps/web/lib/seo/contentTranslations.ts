/**
 * Traduções de SEO/GEO (ES, FR-MA, AR-MA) para o conteúdo definido em ./content.
 * Termos de busca de alta intenção por mercado; estrutura idêntica ao objeto `en`.
 */
import type { SeoContent } from "./content";

const es: SeoContent = {
  homeTitle: "AzuraSort — Sorteos de Instagram con revelación en vídeo y certificado",
  homeDescription:
    "Haz sorteos en Instagram de forma justa y auditable: elige al ganador entre los comentarios, revélalo en un vídeo cinematográfico y genera un certificado verificable. Rápido, económico y fiable.",
  keywords: [
    "sorteo instagram", "sortear comentarios instagram", "elegir ganador instagram", "cómo hacer un sorteo en instagram",
    "sorteador de instagram", "app para sorteos instagram", "sorteo comentarios", "herramienta de sorteos",
  ],
  guideTitle: "Cómo hacer un sorteo en Instagram: guía paso a paso fiable (2026)",
  guideDescription:
    "Guía completa para hacer un sorteo en Instagram entre los comentarios, elegir al ganador de forma justa y demostrar que fue honesto con un certificado verificable.",
  guideH1: "Cómo hacer un sorteo en Instagram",
  guideIntro:
    "Hacer un sorteo en Instagram aumenta la interacción y hace crecer tu perfil, pero tiene que ser justo y transparente. En esta guía aprenderás a elegir un ganador entre los comentarios de una publicación o Reels, de forma aleatoria y auditable, y además a revelar el resultado en un vídeo listo para publicar. Sin hojas de cálculo y sin complicaciones.",
  stepsTitle: "Paso a paso",
  steps: [
    { name: "Pega el enlace de la publicación", text: "Copia el enlace de tu publicación o Reels de Instagram y pégalo en AzuraSort. El sistema carga la vista previa y el número de comentarios." },
    { name: "Elige la base del sorteo", text: "Decide si vas a sortear entre quienes comentaron o entre quienes dieron me gusta a la publicación." },
    { name: "Elige la animación de la revelación", text: "Selecciona cómo se revelará al ganador (caja fuerte, cuenta atrás o Matrix) y, si quieres, transmite en directo." },
    { name: "Haz el sorteo", text: "AzuraSort baraja a los participantes con un algoritmo determinista (Fisher-Yates + SHA-256) y revela al ganador." },
    { name: "Comparte con prueba", text: "Descarga el vídeo de la revelación y comparte la página del certificado, donde cualquiera puede verificar que el resultado fue justo." },
  ],
  faqTitle: "Preguntas frecuentes",
  faq: [
    { q: "¿El sorteo es fiable y auditable?", a: "Sí. AzuraSort usa un algoritmo provably-fair (commit-reveal con SHA-256): el hash del sorteo se genera antes del resultado y cualquiera puede verificar al ganador en la página pública del certificado." },
    { q: "¿Puedo sortear entre los comentarios de una publicación?", a: "Sí. Solo tienes que pegar el enlace de la publicación o Reels y AzuraSort recopila los comentarios para el sorteo." },
    { q: "¿Puedo tener varios ganadores y suplentes?", a: "Sí. Tú decides cuántos ganadores y cuántos suplentes quieres; cada ganador es una persona distinta." },
    { q: "¿Funciona con Reels?", a: "Sí, funciona tanto con publicaciones como con Reels de Instagram." },
    { q: "¿Cómo verifico que el resultado fue justo?", a: "Cada sorteo genera un certificado con un código público. En la página de verificación se reproduce el algoritmo a partir de la semilla revelada y de los participantes, demostrando que nadie manipuló el resultado." },
    { q: "¿Cuánto cuesta?", a: "El precio depende del número de participantes y del plan elegido, desde importes bajos por sorteo. Ves el precio antes de pagar." },
  ],
  guideCta: "Hacer mi sorteo ahora",
};

const fr: SeoContent = {
  homeTitle: "AzuraSort — Tirage au sort Instagram avec révélation vidéo et certificat",
  homeDescription:
    "Organisez des tirages au sort Instagram équitables et vérifiables : choisissez le gagnant parmi les commentaires, révélez-le dans une vidéo cinématographique et générez un certificat vérifiable. Rapide, abordable et fiable.",
  keywords: [
    "tirage au sort instagram", "comment faire un tirage au sort instagram", "choisir un gagnant instagram", "tirage au sort commentaires instagram",
    "outil tirage au sort instagram", "sélectionner gagnant instagram", "tirage au sort en ligne", "concours instagram",
  ],
  guideTitle: "Comment faire un tirage au sort sur Instagram : guide étape par étape fiable (2026)",
  guideDescription:
    "Guide complet pour faire un tirage au sort sur Instagram parmi les commentaires, choisir le gagnant équitablement et prouver son honnêteté avec un certificat vérifiable.",
  guideH1: "Comment faire un tirage au sort sur Instagram",
  guideIntro:
    "Faire un tirage au sort sur Instagram booste l'engagement et fait grandir votre profil, mais il doit être équitable et transparent. Dans ce guide, vous apprendrez à choisir un gagnant parmi les commentaires d'une publication ou d'un Reels, de façon aléatoire et vérifiable, et même à révéler le résultat dans une vidéo prête à publier. Sans tableur et sans prise de tête.",
  stepsTitle: "Étape par étape",
  steps: [
    { name: "Collez le lien de la publication", text: "Copiez le lien de votre publication ou Reels Instagram et collez-le dans AzuraSort. Le système charge l'aperçu et le nombre de commentaires." },
    { name: "Choisissez la base du tirage", text: "Décidez si vous tirez parmi ceux qui ont commenté ou ceux qui ont aimé la publication." },
    { name: "Choisissez l'animation de la révélation", text: "Sélectionnez comment le gagnant sera révélé (coffre-fort, compte à rebours ou Matrix) et, si vous le souhaitez, diffusez en direct." },
    { name: "Lancez le tirage", text: "AzuraSort mélange les participants avec un algorithme déterministe (Fisher-Yates + SHA-256) et révèle le gagnant." },
    { name: "Partagez avec preuve", text: "Téléchargez la vidéo de la révélation et partagez la page du certificat, où chacun peut vérifier que le résultat était équitable." },
  ],
  faqTitle: "Questions fréquentes",
  faq: [
    { q: "Le tirage est-il fiable et vérifiable ?", a: "Oui. AzuraSort utilise un algorithme provably-fair (commit-reveal avec SHA-256) : le hash du tirage est généré avant le résultat et chacun peut vérifier le gagnant sur la page publique du certificat." },
    { q: "Puis-je tirer parmi les commentaires d'une publication ?", a: "Oui. Il suffit de coller le lien de la publication ou du Reels et AzuraSort collecte les commentaires pour le tirage." },
    { q: "Puis-je avoir plusieurs gagnants et des suppléants ?", a: "Oui. Vous choisissez le nombre de gagnants et de suppléants ; chaque gagnant est une personne distincte." },
    { q: "Est-ce que ça fonctionne avec les Reels ?", a: "Oui, cela fonctionne aussi bien avec les publications qu'avec les Reels Instagram." },
    { q: "Comment vérifier que le résultat était équitable ?", a: "Chaque tirage génère un certificat avec un code public. Sur la page de vérification, l'algorithme est reproduit à partir de la graine révélée et des participants, prouvant que personne n'a manipulé le résultat." },
    { q: "Combien ça coûte ?", a: "Le prix dépend du nombre de participants et du plan choisi, à partir de tarifs bas par tirage. Vous voyez le prix avant de payer." },
  ],
  guideCta: "Faire mon tirage maintenant",
};

const ar: SeoContent = {
  homeTitle: "AzuraSort — سحب عشوائي على انستقرام مع كشف بالفيديو وشهادة موثقة",
  homeDescription:
    "نظّم سحوبات انستقرام عادلة وقابلة للتدقيق: اختر الفائز من التعليقات، واكشف عنه في فيديو سينمائي، وأنشئ شهادة قابلة للتحقق. سريع واقتصادي وموثوق.",
  keywords: [
    "سحب عشوائي انستقرام", "كيفية عمل سحب على انستقرام", "اختيار فائز انستقرام", "سحب عشوائي من التعليقات",
    "أداة سحب انستقرام", "سحب عشوائي تعليقات انستقرام", "مسابقة انستقرام", "اختيار رابح عشوائي",
  ],
  guideTitle: "كيفية عمل سحب عشوائي على انستقرام: دليل موثوق خطوة بخطوة (2026)",
  guideDescription:
    "دليل شامل لعمل سحب عشوائي على انستقرام من التعليقات، واختيار الفائز بعدل، وإثبات نزاهته عبر شهادة قابلة للتحقق.",
  guideH1: "كيفية عمل سحب عشوائي على انستقرام",
  guideIntro:
    "عمل سحب عشوائي على انستقرام يزيد التفاعل ويُنمّي حسابك، لكنه يجب أن يكون عادلاً وشفافاً. في هذا الدليل ستتعلم كيفية اختيار فائز من تعليقات منشور أو Reels بطريقة عشوائية وقابلة للتدقيق، بل وكشف النتيجة في فيديو جاهز للنشر. بدون جداول بيانات وبدون تعقيد.",
  stepsTitle: "خطوة بخطوة",
  steps: [
    { name: "الصق رابط المنشور", text: "انسخ رابط منشورك أو Reels على انستقرام والصقه في AzuraSort. سيحمّل النظام المعاينة وعدد التعليقات." },
    { name: "اختر أساس السحب", text: "حدّد ما إذا كنت ستسحب من بين من علّقوا أو من أعجبوا بالمنشور." },
    { name: "اختر حركة الكشف", text: "اختر طريقة الكشف عن الفائز (خزنة أو عدّ تنازلي أو Matrix)، وإن أردت يمكنك البث المباشر." },
    { name: "نفّذ السحب", text: "يخلط AzuraSort المشاركين باستخدام خوارزمية حتمية (Fisher-Yates + SHA-256) ثم يكشف عن الفائز." },
    { name: "شارك مع الإثبات", text: "نزّل فيديو الكشف وشارك صفحة الشهادة، حيث يمكن لأي شخص التحقق من أن النتيجة كانت عادلة." },
  ],
  faqTitle: "الأسئلة الشائعة",
  faq: [
    { q: "هل السحب موثوق وقابل للتدقيق؟", a: "نعم. يستخدم AzuraSort خوارزمية provably-fair (commit-reveal مع SHA-256): يُنشأ hash السحب قبل النتيجة، ويمكن لأي شخص التحقق من الفائز في صفحة الشهادة العامة." },
    { q: "هل يمكنني السحب من تعليقات منشور؟", a: "نعم. ما عليك سوى لصق رابط المنشور أو Reels وسيجمع AzuraSort التعليقات للسحب." },
    { q: "هل يمكنني الحصول على أكثر من فائز ومرشحين احتياطيين؟", a: "نعم. أنت تحدّد عدد الفائزين وعدد الاحتياطيين؛ وكل فائز شخص مختلف." },
    { q: "هل يعمل مع Reels؟", a: "نعم، يعمل مع منشورات انستقرام و Reels على حد سواء." },
    { q: "كيف أتحقق من أن النتيجة كانت عادلة؟", a: "يُنشئ كل سحب شهادة برمز عام. في صفحة التحقق تُعاد الخوارزمية انطلاقاً من البذرة المكشوفة والمشاركين، ما يثبت أن لا أحد تلاعب بالنتيجة." },
    { q: "كم التكلفة؟", a: "يعتمد السعر على عدد المشاركين والخطة المختارة، بدءاً من مبالغ منخفضة لكل سحب. ترى السعر قبل الدفع." },
  ],
  guideCta: "ابدأ سحبي الآن",
};

export const seoTranslations: Record<string, SeoContent> = { es, "fr-ma": fr, "ar-ma": ar };
