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

const SEVERITY_WEIGHT: Record<SeverityBand, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

function categoryBand(results: AssessmentResults, category: DominantCategory): SeverityBand {
  // IB note: prefer validated score thresholds when available for stronger psychometric traceability.
  if (category === "depression") return interpretSeverity(results.scores.phq9.totalScore, "depression");
  if (category === "anxiety") return interpretSeverity(results.scores.gad7.totalScore, "anxiety");
  if (category === "trauma") return interpretSeverity(results.scores.pcl5Short.totalScore, "ptsd");
  if (category === "ocd") return interpretSeverity(results.scores.miniToc.totalScore, "ocd");
  return interpretNormalizedSeverity(results.categoryScores[category] ?? 0);
}

function globalBand(results: AssessmentResults): SeverityBand {
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

function joinDomains(categories: DominantCategory[]): string {
  const labels = categories.map(domainLabel);
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0]!;
  if (labels.length === 2) return `${labels[0]} et ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} et ${labels[labels.length - 1]}`;
}

function introByGlobalBand(band: SeverityBand): string {
  if (band === "low") {
    return "Merci d’avoir répondu au bilan. Prendre ce temps pour toi est déjà une bonne démarche.";
  }
  if (band === "medium") {
    return "Merci d’avoir pris le temps de répondre à l’évaluation. Le fait de réfléchir à ce que tu ressens montre que tu prends ton bien-être au sérieux.";
  }
  return "Merci d’avoir complété l’évaluation avec sincérité. Mettre des mots sur ce que tu traverses demande du courage.";
}

function emotionalSummary(categories: DominantCategory[], band: SeverityBand): string {
  const domains = joinDomains(categories);
  if (band === "low") {
    return "Aucun signe préoccupant détecté dans ce bilan global.";
  }
  if (band === "medium") {
    return categories.length > 1
      ? `Tes réponses suggèrent une alerte modérée sur plusieurs dimensions: ${domains}. Cela peut rendre certaines journées plus fatigantes, mais des repères simples peuvent déjà t’aider.`
      : `Tes réponses suggèrent une alerte modérée autour de ${domains}. Cela peut rendre certaines journées plus fatigantes, mais il existe des stratégies simples pour alléger cette pression.`;
  }
  return categories.length > 1
    ? `Tes réponses montrent une alerte forte sur plusieurs dimensions: ${domains}. Cela peut peser sur ton quotidien, et il est important de chercher du soutien.`
    : `Tes réponses montrent une alerte forte autour de ${domains}. Cela peut peser sur ton quotidien (école, énergie, sommeil ou relations), et c’est important de chercher du soutien.`;
}

function dominantFocus(categories: DominantCategory[], band: SeverityBand): string {
  if (categories.length === 0) {
    return "Aucune catégorie dominante ne ressort pour le moment.";
  }

  const domains = joinDomains(categories);
  if (band === "medium") {
    return categories.length > 1
      ? `Plusieurs catégories ressortent au même niveau: ${domains}. Tu peux avancer progressivement avec des habitudes régulières et du soutien.`
      : `En ce moment, ${domains} semble prendre plus de place que d’habitude. Avec des habitudes régulières et du soutien, tu peux améliorer la situation progressivement.`;
  }

  return categories.length > 1
    ? `Plusieurs catégories ressortent fortement au même niveau: ${domains}. À ce niveau, il est recommandé d’en parler à un adulte de confiance et, si besoin, à un professionnel.`
    : `Actuellement, ${domains} semble être la zone la plus sensible. À ce niveau, il est recommandé d’en parler à un adulte de confiance et, si besoin, à un professionnel.`;
}

function psychoeducation(categories: DominantCategory[]): string {
  if (categories.length === 0) {
    return "À l’adolescence, les émotions peuvent varier selon le sommeil, l’école, les relations et le stress du moment. Ces variations sont fréquentes. Continuer à observer ton bien-être reste une bonne habitude.";
  }

  if (categories.length > 1) {
    return "À l’adolescence, plusieurs dimensions du bien-être peuvent se chevaucher en même temps (école, relations, fatigue, stress). Ce mélange est fréquent et ne veut pas dire que “tout va mal”. Comprendre ces signaux aide à mieux s’organiser et à demander du soutien au bon moment.";
  }

  const category = categories[0]!;
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

function recommendations(categories: DominantCategory[], band: SeverityBand): string[] {
  if (band === "low" || categories.length === 0) {
    return [
      "Garde un rythme de sommeil régulier autant que possible.",
      "Bouge un peu chaque jour pour entretenir ton équilibre.",
      "Continue des activités qui te font du bien.",
      "Parle à un adulte de confiance si quelque chose te préoccupe.",
    ];
  }

  if (band === "medium") {
    return [
      "Garde des repères simples: sommeil, repas, pauses et mouvement.",
      "Quand une difficulté arrive, écris ce que tu ressens puis une petite action possible.",
      "Évite de rester seul·e avec la pression: parle à un adulte de confiance.",
      "Si cela dure, demander l’avis d’un professionnel peut t’aider à avancer plus vite.",
    ];
  }

  return [
    "Essaie de garder une petite structure de journée, même quand c’est difficile.",
    "Parle rapidement à un adulte de confiance pour ne pas rester seul·e avec ça.",
    "Demande un soutien professionnel pour apprendre des outils adaptés à ta situation.",
    "En cas de détresse importante, cherche de l’aide sans attendre.",
  ];
}

function encouragement(band: SeverityBand): string {
  if (band === "low") {
    return "Tu as déjà fait un pas utile. Continue à prendre soin de toi.";
  }
  if (band === "medium") {
    return "Ce que tu ressens aujourd’hui ne définit pas qui tu es. Avec des petits ajustements et du soutien, les choses peuvent s’améliorer.";
  }
  return "Même si c’est lourd en ce moment, ça peut évoluer. Demander de l’aide est une façon intelligente de prendre soin de toi.";
}

export function generateNaturalReport(results: AssessmentResults): NaturalReport {
  // IB note: deterministic server-side generation from scored data only.
  const gBand = globalBand(results);
  const categories = results.dominantCategories;

  let dBand: SeverityBand = "low";
  for (const category of categories) {
    const candidate = categoryBand(results, category);
    if (SEVERITY_WEIGHT[candidate] > SEVERITY_WEIGHT[dBand]) {
      dBand = candidate;
    }
  }

  const effectiveBand = categories.length === 0 ? "low" : dBand;

  return {
    introduction: introByGlobalBand(gBand),
    emotionalSummary: emotionalSummary(categories, effectiveBand),
    dominantFocus: dominantFocus(categories, effectiveBand),
    psychoeducation: psychoeducation(categories),
    recommendations: recommendations(categories, effectiveBand),
    encouragement: encouragement(effectiveBand),
    ethicalNotice:
      "Ce bilan n’est pas un diagnostic médical. Il sert uniquement à mieux comprendre ce que tu traverses et à ouvrir la discussion avec un adulte ou un professionnel si besoin.",
  };
}
