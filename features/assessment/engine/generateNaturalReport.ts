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

const PHQ9_SYMPTOMS = [
  "baisse d'interet",
  "tristesse",
  "sommeil perturbe",
  "fatigue",
  "appetit modifie",
  "autocritique",
  "difficulte de concentration",
  "ralentissement ou agitation",
  "pensees de mort",
] as const;

const GAD7_SYMPTOMS = [
  "tension nerveuse",
  "inquietudes difficiles a stopper",
  "anticipation negative",
  "difficulte a se detendre",
  "agitation",
  "irritabilite",
  "peur qu'un probleme grave arrive",
] as const;

const PCL5_SHORT_SYMPTOMS = [
  "cauchemars lies a un evenement difficile",
  "detresse face aux rappels",
  "sentiment de distance relationnelle",
  "sommeil perturbe depuis l'evenement",
] as const;

const MINI_TOC_SYMPTOMS = [
  "pensees intrusives",
  "besoin de verification",
  "besoin de nettoyage",
  "besoin d'ordre ou de symetrie",
] as const;

function categoryBand(results: AssessmentResults, category: DominantCategory): SeverityBand {
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
  if (category === "depression") return "l'humeur depressive";
  if (category === "anxiety") return "l'anxiete";
  if (category === "trauma") return "les reactions post-traumatiques";
  if (category === "ocd") return "les obsessions et compulsions";
  if (category === "personality") return "la regulation emotionnelle et relationnelle";
  if (category === "eating") return "le rapport a l'alimentation";
  return "le fonctionnement attentionnel";
}

function joinLabels(labels: string[]): string {
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0] ?? "";
  if (labels.length === 2) return `${labels[0]} et ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} et ${labels[labels.length - 1]}`;
}

function topSymptomNames(values: number[] | undefined, labels: readonly string[], limit: number): string[] {
  if (!values || values.length === 0) return [];
  return values
    .map((value, index) => ({ value, label: labels[index] }))
    .filter((item): item is { value: number; label: string } => typeof item.label === "string" && item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)
    .map((item) => item.label);
}

function extractDominantSymptoms(results: AssessmentResults, categories: DominantCategory[]): string[] {
  const itemScores = results.itemScores;
  if (!itemScores) return [];

  const symptoms: string[] = [];
  for (const category of categories) {
    if (category === "depression") {
      symptoms.push(...topSymptomNames(itemScores.phq9, PHQ9_SYMPTOMS, 2));
    } else if (category === "anxiety") {
      symptoms.push(...topSymptomNames(itemScores.gad7, GAD7_SYMPTOMS, 2));
    } else if (category === "trauma") {
      symptoms.push(...topSymptomNames(itemScores.pcl5Short, PCL5_SHORT_SYMPTOMS, 2));
    } else if (category === "ocd") {
      symptoms.push(...topSymptomNames(itemScores.miniToc, MINI_TOC_SYMPTOMS, 2));
    }
  }

  return Array.from(new Set(symptoms)).slice(0, 4);
}

function seedFromResults(results: AssessmentResults): number {
  const values = [
    results.scores.phq9.totalScore,
    results.scores.gad7.totalScore,
    results.scores.pcl5Short.totalScore,
    results.scores.miniToc.totalScore,
  ];
  return values.reduce((acc, value, index) => acc + value * (index + 7), 0);
}

function pickBySeed(seed: number, variants: string[]): string {
  if (variants.length === 0) return "";
  const index = Math.abs(seed) % variants.length;
  return variants[index] ?? variants[0] ?? "";
}

function introduction(global: SeverityBand, seed: number): string {
  if (global === "low") {
    return pickBySeed(seed, [
      "Merci d'avoir complete ce bilan. Prendre ce temps d'auto-observation constitue deja une demarche utile.",
      "Vos reponses ont ete renseignees avec soin, ce qui permet une lecture plus fiable de votre etat actuel.",
    ]);
  }
  if (global === "medium") {
    return pickBySeed(seed, [
      "Merci d'avoir repondu avec attention. Ce bilan met en lumiere des signaux concrets sur lesquels agir progressivement.",
      "Vos reponses montrent une bonne implication. Cela aide a identifier les points qui meritent un soutien cible.",
    ]);
  }
  return pickBySeed(seed, [
    "Merci d'avoir complete ce bilan malgre des difficultes possiblement importantes. Cette etape est utile pour orienter les priorites de soutien.",
    "Le fait d'avoir repondu jusqu'au bout est deja un signal de mobilisation personnelle, meme lorsque la periode est difficile.",
  ]);
}

function emotionalSummary(
  categories: DominantCategory[],
  band: SeverityBand,
  symptoms: string[]
): string {
  if (categories.length === 0 || band === "low") {
    if (symptoms.length > 0) {
      return `Le profil global reste plutot rassurant, avec quelques signaux ponctuels (${joinLabels(symptoms)}) a surveiller sans dramatiser.`;
    }
    return "Le profil global est bas, sans alerte clinique dominante. Des fluctuations emotionnelles legeres restent possibles selon le contexte.";
  }

  const domains = joinLabels(categories.map(domainLabel));
  const symptomPart = symptoms.length > 0 ? ` Les manifestations les plus visibles sont ${joinLabels(symptoms)}.` : "";

  if (band === "medium") {
    return `Le bilan suggere une charge moderee autour de ${domains}. Cette intensite peut affecter l'energie, la concentration ou le sommeil.${symptomPart}`;
  }

  return `Le bilan indique une charge elevee autour de ${domains}, avec un retentissement probable sur le quotidien.${symptomPart}`;
}

function dominantFocus(categories: DominantCategory[], band: SeverityBand): string {
  if (categories.length === 0) {
    return "Aucune categorie ne domine nettement pour le moment. L'objectif principal est de maintenir des routines protectrices et de suivre l'evolution.";
  }

  const labels = categories.map(domainLabel);
  const joined = joinLabels(labels);

  if (band === "medium") {
    return categories.length > 1
      ? `Plusieurs dimensions ressortent au meme niveau (${joined}). Une approche progressive, avec priorisation des situations les plus genantes, est recommandee.`
      : `La dimension dominante est ${joined}. Cibler en priorite ce domaine permet souvent une amelioration plus rapide.`;
  }

  return categories.length > 1
    ? `Plusieurs dimensions sont elevees simultanement (${joined}). Un accompagnement professionnel peut aider a structurer un plan d'action realiste.`
    : `La dimension la plus sensible est ${joined}. A ce niveau, un soutien professionnel est conseille pour limiter l'aggravation et retrouver de la stabilite.`;
}

function psychoeducation(categories: DominantCategory[]): string {
  if (categories.length === 0) {
    return "Les etats emotionnels varient selon la fatigue, le stress, les relations et l'environnement. Ces variations sont frequentes et ne signifient pas a elles seules un trouble installe.";
  }

  if (categories.length > 1) {
    return "Quand plusieurs dimensions se chevauchent (humeur, anxiete, controle, fatigue), le cerveau reste plus longtemps en mode alerte. Cela peut entretenir un cercle stress-fatigue, mais ce cercle se modifie avec des actions regulieres et ciblees.";
  }

  const category = categories[0];
  if (category === "depression") {
    return "Une baisse d'humeur prolongee s'accompagne souvent d'une diminution d'energie et d'initiative. Ce n'est pas un manque de volonte: c'est un ralentissement psychophysiologique qu'on peut progressivement inverser.";
  }
  if (category === "anxiety") {
    return "L'anxiete correspond a un systeme d'anticipation du danger devenu trop sensible. Le travail therapeutique vise a recalibrer ce systeme, pas a supprimer toute vigilance.";
  }
  if (category === "trauma") {
    return "Apres un evenement difficile, des rappels internes (souvenirs, sensations) peuvent reactiver l'alerte longtemps apres les faits. Cette reactivite est frequente et peut etre reduite avec une prise en charge adaptee.";
  }
  if (category === "ocd") {
    return "Dans les profils obsessionnels-compulsifs, la tentative de neutraliser l'incertitude soulage a court terme mais entretient le symptome a long terme. Les approches basees sur l'exposition progressive sont efficaces pour casser ce cycle.";
  }
  if (category === "eating") {
    return "Le rapport a l'alimentation peut devenir un regulateur emotionnel sous stress. L'objectif n'est pas la perfection, mais la stabilite: regularite, reduction de la culpabilite et soutien specialise si besoin.";
  }
  if (category === "personality") {
    return "Les difficultes relationnelles et de regulation emotionnelle peuvent fluctuer selon le contexte. Un travail centre sur les competences emotionnelles et interpersonnelles apporte souvent des ameliorations concretes.";
  }
  return "Les difficultes attentionnelles ou d'organisation ne traduisent pas un manque d'effort. Des strategies externes (structuration, environnement, routines) peuvent fortement ameliorer le fonctionnement quotidien.";
}

function recommendations(categories: DominantCategory[], band: SeverityBand, seed: number): string[] {
  const base = [
    "Stabiliser le rythme veille-sommeil (heures de coucher/lever proches chaque jour).",
    "Planifier une activite physique moderee au moins 3 fois par semaine.",
    "Utiliser une technique breve de regulation (respiration lente, coherence cardiaque, pause sensorielle) 1 a 2 fois par jour.",
  ];

  if (categories.includes("anxiety") || categories.includes("ocd")) {
    base.push("Noter les anticipations catastrophiques et reformuler une hypothese alternative plus realiste.");
  } else if (categories.includes("depression")) {
    base.push("Fractionner les taches en etapes de 10 a 20 minutes pour relancer l'initiative sans surcharge.");
  } else if (categories.includes("trauma")) {
    base.push("Identifier les declencheurs principaux et preparer un plan de stabilisation (ancrage, respiration, lieu ressource). ");
  } else {
    base.push("Conserver un moment hebdomadaire de bilan personnel pour ajuster les habitudes qui fonctionnent.");
  }

  if (band === "high") {
    base.push("Ne pas rester seul face a la charge actuelle: contacter rapidement un professionnel de sante mentale.");
  } else if (band === "medium") {
    base.push("Si la gene persiste au-dela de quelques semaines, demander un avis professionnel pour accelerer l'amelioration.");
  }

  const rotated = [...base.slice(seed % 2), ...base.slice(0, seed % 2)];
  return rotated.slice(0, 5);
}

function encouragement(band: SeverityBand): string {
  if (band === "low") {
    return "Vous disposez deja de ressources utiles. En maintenant quelques routines protectrices, vous consolidez cet equilibre.";
  }
  if (band === "medium") {
    return "Une amelioration est realiste avec des actions simples mais regulieres. Les progres viennent souvent par accumulation de petits ajustements.";
  }
  return "Meme en phase difficile, une evolution favorable est possible. Le plus important est d'activer du soutien sans attendre l'epuisement complet.";
}

export function generateNaturalReport(results: AssessmentResults): NaturalReport {
  const gBand = globalBand(results);
  const categories = results.dominantCategories;
  const symptoms = extractDominantSymptoms(results, categories);

  let dBand: SeverityBand = "low";
  for (const category of categories) {
    const candidate = categoryBand(results, category);
    if (SEVERITY_WEIGHT[candidate] > SEVERITY_WEIGHT[dBand]) {
      dBand = candidate;
    }
  }

  const effectiveBand = categories.length === 0 ? gBand : dBand;
  const seed = seedFromResults(results);

  return {
    introduction: introduction(gBand, seed),
    emotionalSummary: emotionalSummary(categories, effectiveBand, symptoms),
    dominantFocus: dominantFocus(categories, effectiveBand),
    psychoeducation: psychoeducation(categories),
    recommendations: recommendations(categories, effectiveBand, seed),
    encouragement: encouragement(effectiveBand),
    ethicalNotice:
      "Ce bilan est un outil de depistage educatif. Il n'etablit pas de diagnostic et ne remplace pas une evaluation clinique par un professionnel de sante.",
  };
}
