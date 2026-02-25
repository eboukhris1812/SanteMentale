import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

function interpretFromThresholds(
  totalScore: number,
  thresholds: readonly Threshold[],
  questionnaireId: string
): InterpretationResult {
  const match = thresholds.find((threshold) => totalScore >= threshold.min && totalScore <= threshold.max);
  if (!match) {
    throw new Error(`Score ${questionnaireId} hors plage: ${totalScore}`);
  }
  return {
    label: match.label,
    severity: match.severity,
    clinicalMeaning: match.clinicalMeaning,
  };
}

const binaryScale = {
  min: 0,
  max: 1,
  anchors: {
    0: "Non (0)",
    1: "Oui (1)",
  },
} as const;

const freq04Scale = {
  min: 0,
  max: 4,
  anchors: {
    0: "Pas du tout (0)",
    1: "Un peu (1)",
    2: "Assez souvent (2)",
    3: "Très souvent (3)",
    4: "Tout le temps (4)",
  },
} as const;

const asrsThresholds: readonly Threshold[] = [
  { min: 0, max: 7, label: "Signal TDAH faible", severity: "minimal", clinicalMeaning: "Peu d'indices d'inattention/hyperactivité." },
  { min: 8, max: 15, label: "Signal TDAH modéré", severity: "moderate", clinicalMeaning: "Indices présents; évaluation clinique utile." },
  { min: 16, max: 24, label: "Signal TDAH élevé", severity: "positive-screen", clinicalMeaning: "Dépistage positif possible; bilan spécialisé recommandé." },
];

export const asrsV11Definition: QuestionnaireDefinition = {
  id: "asrsV11",
  version: "1.0.0",
  title: "ASRS v1.1 (partie A adaptée)",
  items: [
    { id: "asrs_1", prompt: "Ces 6 derniers mois, à quelle fréquence as-tu eu du mal à terminer ce que tu commences ?" },
    { id: "asrs_2", prompt: "Ces 6 derniers mois, à quelle fréquence as-tu du mal à organiser des tâches ?" },
    { id: "asrs_3", prompt: "Ces 6 derniers mois, à quelle fréquence évites-tu les tâches qui demandent un effort mental prolongé ?" },
    { id: "asrs_4", prompt: "Ces 6 derniers mois, à quelle fréquence perds-tu des objets nécessaires (stylos, cahiers, clés) ?" },
    { id: "asrs_5", prompt: "Ces 6 derniers mois, à quelle fréquence es-tu distrait(e) par ce qui t'entoure ?" },
    { id: "asrs_6", prompt: "Ces 6 derniers mois, à quelle fréquence te sens-tu agité(e) ou obligé(e) de bouger ?" },
  ],
  scale: freq04Scale,
  scoringRules: {
    method: "sum",
    requiredItems: 6,
    source: "Kessler RC et al. ASRS v1.1 screener; adaptation prudente pour usage éducatif.",
  },
  thresholds: asrsThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, asrsThresholds, "asrsV11"),
};

const aq10Thresholds: readonly Threshold[] = [
  { min: 0, max: 2, label: "Signal TSA faible", severity: "minimal", clinicalMeaning: "Peu d'indices TSA au dépistage." },
  { min: 3, max: 5, label: "Signal TSA intermédiaire", severity: "moderate", clinicalMeaning: "Indices partiels; discussion clinique possible." },
  { min: 6, max: 10, label: "Signal TSA élevé", severity: "positive-screen", clinicalMeaning: "Dépistage positif possible; bilan spécialisé recommandé." },
];

export const aq10Definition: QuestionnaireDefinition = {
  id: "aq10",
  version: "1.0.0",
  title: "AQ-10",
  items: [
    { id: "aq10_1", prompt: "Je remarque facilement quand une personne s'ennuie dans une conversation." },
    { id: "aq10_2", prompt: "Je préfère faire les choses toujours de la même manière." },
    { id: "aq10_3", prompt: "J'ai du mal à comprendre les intentions des autres." },
    { id: "aq10_4", prompt: "Je remarque de petits détails que les autres ne voient pas." },
    { id: "aq10_5", prompt: "Les situations sociales me fatiguent beaucoup." },
    { id: "aq10_6", prompt: "J'aime planifier précisément ce que je vais faire." },
    { id: "aq10_7", prompt: "Je trouve difficile de lire les expressions du visage." },
    { id: "aq10_8", prompt: "Je préfère souvent être seul(e) plutôt qu'en groupe." },
    { id: "aq10_9", prompt: "Je m'intéresse intensément à quelques sujets précis." },
    { id: "aq10_10", prompt: "Les changements imprévus me mettent facilement en difficulté." },
  ],
  scale: binaryScale,
  scoringRules: {
    method: "sum",
    requiredItems: 10,
    source: "Allison C et al. AQ-10; formulation simplifiée pour adolescents.",
  },
  thresholds: aq10Thresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, aq10Thresholds, "aq10"),
};

const ygtssThresholds: readonly Threshold[] = [
  { min: 0, max: 10, label: "Charge tics faible", severity: "minimal", clinicalMeaning: "Tics peu fréquents/peu invalidants." },
  { min: 11, max: 24, label: "Charge tics modérée", severity: "moderate", clinicalMeaning: "Tics avec retentissement notable." },
  { min: 25, max: 40, label: "Charge tics élevée", severity: "severe", clinicalMeaning: "Retentissement important; avis spécialisé recommandé." },
];

export const ygtssDefinition: QuestionnaireDefinition = {
  id: "ygtss",
  version: "1.0.0",
  title: "YGTSS (auto-rapport éducatif adapté)",
  items: [
    { id: "ygtss_1", prompt: "Ces 7 derniers jours, à quel point as-tu eu des tics moteurs (mouvements involontaires) ?" },
    { id: "ygtss_2", prompt: "Ces 7 derniers jours, à quel point as-tu eu des tics vocaux (sons involontaires) ?" },
    { id: "ygtss_3", prompt: "Ces 7 derniers jours, à quel point ces tics étaient fréquents ?" },
    { id: "ygtss_4", prompt: "Ces 7 derniers jours, à quel point il était difficile de les contrôler ?" },
    { id: "ygtss_5", prompt: "Ces 7 derniers jours, à quel point les tics ont gêné l'école ou les relations ?" },
    { id: "ygtss_6", prompt: "Ces 7 derniers jours, à quel point les tics t'ont fait te sentir mal à l'aise ?" },
    { id: "ygtss_7", prompt: "Ces 7 derniers jours, à quel point les tics ont varié selon le stress ?" },
    { id: "ygtss_8", prompt: "Ces 7 derniers jours, à quel point tu as essayé de retenir les tics ?" },
    { id: "ygtss_9", prompt: "Ces 7 derniers jours, à quel point cela t'a fatigué(e) mentalement ?" },
    { id: "ygtss_10", prompt: "Ces 7 derniers jours, à quel point l'ensemble de ces symptômes a perturbé ton quotidien ?" },
  ],
  scale: freq04Scale,
  scoringRules: {
    method: "sum",
    requiredItems: 10,
    source: "YGTSS est initialement clinicien; version auto-rapport éducative adaptée pour orientation.",
  },
  thresholds: ygtssThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, ygtssThresholds, "ygtss"),
};
