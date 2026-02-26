import {
  interpretNormalizedSeverity,
  interpretSeverity,
  type SeverityBand,
} from "@/features/assessment/engine/severityInterpreter";
import type {
  AssessmentResults,
  DominantCategory,
  NaturalReport,
} from "@/features/assessment/engine/types";

function getDominantBand(results: AssessmentResults): SeverityBand {
  const category = results.dominantCategory;

  // IB note: when a validated test exists (PHQ-9, GAD-7, PCL-5 court, Mini-TOC),
  // we prioritize its raw score thresholds for scientific coherence.
  if (category === "depression") {
    return interpretSeverity(results.scores.phq9.totalScore, "depression");
  }
  if (category === "anxiety") {
    return interpretSeverity(results.scores.gad7.totalScore, "anxiety");
  }
  if (category === "trauma") {
    return interpretSeverity(results.scores.pcl5Short.totalScore, "ptsd");
  }
  if (category === "ocd") {
    return interpretSeverity(results.scores.miniToc.totalScore, "ocd");
  }

  return interpretNormalizedSeverity(results.categoryScores[category] ?? 0);
}

function getGlobalBand(results: AssessmentResults): SeverityBand {
  const values = Object.values(results.categoryScores);
  if (values.length === 0) return "low";
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  return interpretNormalizedSeverity(avg);
}

function domainLabel(category: DominantCategory): string {
  if (category === "depression") return "l’humeur";
  if (category === "anxiety") return "le stress et l’anxiété";
  if (category === "trauma") return "les réactions liées à des événements difficiles";
  if (category === "ocd") return "les pensées qui tournent en boucle";
  if (category === "personality") return "la relation à toi-même et aux autres";
  if (category === "eating") return "le rapport à l’alimentation";
  return "l’attention et l’organisation";
}

function withDeContraction(phraseWithArticle: string): string {
  if (phraseWithArticle.startsWith("le ")) {
    return `du ${phraseWithArticle.slice(3)}`;
  }
  if (phraseWithArticle.startsWith("les ")) {
    return `des ${phraseWithArticle.slice(4)}`;
  }
  if (phraseWithArticle.startsWith("la ")) {
    return `de la ${phraseWithArticle.slice(3)}`;
  }
  return `de ${phraseWithArticle}`;
}

function introductionByBand(band: SeverityBand): string {
  if (band === "low") {
    return "Merci d’avoir répondu au test. Prendre ce temps pour toi est déjà une bonne démarche.";
  }
  if (band === "medium") {
    return "Merci d’avoir pris le temps de répondre à l’évaluation. Le fait de réfléchir à ce que tu ressens montre que tu prends ton bien-être au sérieux.";
  }
  return "Merci d’avoir complété l’évaluation avec sincérité. Mettre des mots sur ce que tu traverses demande du courage.";
}

function emotionalSummaryByBand(category: DominantCategory, band: SeverityBand): string {
  const label = domainLabel(category);
  const deLabel = withDeContraction(label);
  if (band === "low") {
    return `Tes réponses ne montrent pas de signes préoccupants pour ${label}.`;
  }
  if (band === "medium") {
    return `Tes réponses suggèrent une alerte modérée autour ${deLabel}. Cela peut rendre certaines journées plus fatigantes, mais il existe des stratégies simples pour alléger cette pression.`;
  }
  return `Tes réponses montrent une alerte forte autour ${deLabel}. Cela peut peser sur ton quotidien (école, énergie, sommeil ou relations), et c’est important de chercher du soutien.`;
}

function dominantFocusByBand(category: DominantCategory, band: SeverityBand): string {
  const label = domainLabel(category);
  if (band === "low") {
    return `Ton rapport à ${label} est plutôt équilibré pour le moment.`;
  }
  if (band === "medium") {
    return `En ce moment, ${label} semble prendre plus de place que d’habitude. Avec des habitudes régulières et du soutien, tu peux améliorer la situation progressivement.`;
  }
  return `Actuellement, ${label} semble être la zone la plus sensible. À ce niveau, il est recommandé d’en parler à un adulte de confiance et, si besoin, à un professionnel.`;
}

function psychoeducationByCategory(category: DominantCategory): string {
  if (category === "depression") {
    return "À l’adolescence, les émotions peuvent varier fortement à cause des changements scolaires, sociaux et corporels. Une baisse d’énergie ou de motivation peut apparaître dans les périodes de pression. Ce type de ressenti est plus fréquent qu’on ne le pense.";
  }
  if (category === "anxiety") {
    return "À l’adolescence, le cerveau devient plus sensible aux attentes et au regard des autres. Cela peut activer plus vite le stress. L’anxiété n’est pas une faiblesse: c’est un signal interne qui peut être mieux régulé avec de bons repères.";
  }
  if (category === "trauma") {
    return "Après un événement difficile, certaines réactions peuvent revenir même longtemps après. Ce n’est pas un manque de volonté. Comprendre ces réactions aide déjà à reprendre un peu de contrôle.";
  }
  if (category === "ocd") {
    return "Quand la tension monte, certaines pensées peuvent tourner en boucle pour chercher de la sécurité. C’est fatigant, mais on peut apprendre à réduire leur impact avec des outils adaptés.";
  }
  if (category === "personality") {
    return "Construire son identité à l’adolescence peut rendre les émotions et les relations plus intenses. Ce n’est pas “anormal”. Avec de l’accompagnement, on peut trouver des façons plus stables de se sentir et de réagir.";
  }
  if (category === "eating") {
    return "Le rapport au corps et à l’alimentation peut être influencé par le stress, les comparaisons et les réseaux sociaux. Ce que tu ressens est légitime. En parler permet souvent de réduire la pression.";
  }
  return "Chaque cerveau a son rythme de fonctionnement. Certaines personnes ont besoin de stratégies plus structurées pour l’attention, l’organisation et la régulation. Avec les bons outils, le quotidien peut devenir plus simple.";
}

function recommendationsByBand(category: DominantCategory, band: SeverityBand): string[] {
  const sharedLow = [
    "Garde un rythme de sommeil régulier autant que possible.",
    "Bouge un peu chaque jour pour relâcher la tension.",
    "Parle de ce que tu ressens à un adulte de confiance quand tu en as besoin.",
    "Continue des activités qui te font du bien et te recentrent.",
  ];

  if (band === "low") {
    return sharedLow;
  }

  if (band === "medium") {
    return [
      "Garde des repères simples: sommeil, repas, pauses, mouvement.",
      "Quand une difficulté arrive, écris ce que tu ressens puis une petite action possible.",
      "Évite de rester seul·e avec la pression: parle à un adulte de confiance.",
      "Si cela dure, demander l’avis d’un professionnel peut t’aider à avancer plus vite.",
    ];
  }

  const domainSpecific =
    category === "anxiety"
      ? "Teste une respiration lente (ex: inspire 4 secondes, expire 6 secondes) plusieurs fois par jour."
      : "Essaie de garder une petite structure de journée, même quand c’est difficile.";

  return [
    domainSpecific,
    "Parle rapidement à un adulte de confiance pour ne pas rester seul·e avec ça.",
    "Demande un soutien professionnel pour apprendre des outils adaptés à ta situation.",
    "En cas de détresse importante, cherche de l’aide sans attendre.",
  ];
}

function encouragementByBand(band: SeverityBand): string {
  if (band === "low") {
    return "Tu as déjà fait un pas utile. Continue à prendre soin de toi.";
  }
  if (band === "medium") {
    return "Ce que tu ressens aujourd’hui ne définit pas qui tu es. Avec des petits ajustements et du soutien, les choses peuvent s’améliorer.";
  }
  return "Même si c’est lourd en ce moment, ça peut évoluer. Demander de l’aide est une façon intelligente de prendre soin de toi.";
}

export function generateNaturalReport(results: AssessmentResults): NaturalReport {
  // IB note: full report is deterministic and generated server-side from scored data only.
  const dominantBand = getDominantBand(results);
  const globalBand = getGlobalBand(results);
  const category = results.dominantCategory;

  // IB note: section tone follows real score bands (low/medium/high) to guarantee
  // consistency between psychometric signal and narrative feedback.
  return {
    introduction: introductionByBand(globalBand),
    emotionalSummary: emotionalSummaryByBand(category, dominantBand),
    dominantFocus: dominantFocusByBand(category, dominantBand),
    psychoeducation: psychoeducationByCategory(category),
    recommendations: recommendationsByBand(category, dominantBand),
    encouragement: encouragementByBand(dominantBand),
    ethicalNotice:
      "Ce bilan n’est pas un diagnostic médical. Il sert uniquement à mieux comprendre ce que tu traverses et à ouvrir la discussion avec un adulte ou un professionnel si besoin.",
  };
}
