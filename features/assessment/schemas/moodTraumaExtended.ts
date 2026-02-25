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

const mdqThresholds: readonly Threshold[] = [
  { min: 0, max: 4, label: "Signal maniaque faible", severity: "minimal", clinicalMeaning: "Peu de signes d'activation thymique." },
  { min: 5, max: 8, label: "Signal maniaque intermédiaire", severity: "moderate", clinicalMeaning: "Signes présents; contexte clinique à explorer." },
  { min: 9, max: 13, label: "Signal maniaque élevé", severity: "positive-screen", clinicalMeaning: "Dépistage positif possible; évaluation spécialisée recommandée." },
];

export const mdqDefinition: QuestionnaireDefinition = {
  id: "mdq",
  version: "1.0.0",
  title: "MDQ (version éducative)",
  items: [
    { id: "mdq_1", prompt: "As-tu déjà eu une période où tu te sentais anormalement plein(e) d'énergie ?" },
    { id: "mdq_2", prompt: "As-tu déjà dormi très peu sans te sentir fatigué(e) ?" },
    { id: "mdq_3", prompt: "As-tu déjà parlé beaucoup plus vite ou plus que d'habitude ?" },
    { id: "mdq_4", prompt: "As-tu déjà eu des pensées qui allaient très vite ?" },
    { id: "mdq_5", prompt: "As-tu déjà été facilement distrait(e) par de petites choses ?" },
    { id: "mdq_6", prompt: "As-tu déjà été beaucoup plus sociable ou extraverti(e) que d'habitude ?" },
    { id: "mdq_7", prompt: "As-tu déjà eu davantage confiance en toi de manière inhabituelle ?" },
    { id: "mdq_8", prompt: "As-tu déjà pris des décisions impulsives ou risquées ?" },
    { id: "mdq_9", prompt: "As-tu déjà dépensé trop d'argent ou agi sans mesurer les conséquences ?" },
    { id: "mdq_10", prompt: "As-tu déjà été plus irritable que d'habitude pendant ces périodes ?" },
    { id: "mdq_11", prompt: "As-tu déjà eu des conflits relationnels à cause de cette montée d'énergie ?" },
    { id: "mdq_12", prompt: "As-tu déjà commencé beaucoup d'activités sans les terminer ?" },
    { id: "mdq_13", prompt: "As-tu déjà eu l'impression que ces changements n'étaient pas habituels pour toi ?" },
  ],
  scale: binaryScale,
  scoringRules: {
    method: "sum",
    requiredItems: 13,
    source: "Hirschfeld RMA et al. MDQ; version éducative simplifiée (sans critère de co-occurrence).",
  },
  thresholds: mdqThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, mdqThresholds, "mdq"),
};

const sasdsThresholds: readonly Threshold[] = [
  { min: 0, max: 14, label: "Stress aigu faible", severity: "minimal", clinicalMeaning: "Symptômes post-traumatiques précoces limités." },
  { min: 15, max: 29, label: "Stress aigu modéré", severity: "moderate", clinicalMeaning: "Réaction de stress marquée." },
  { min: 30, max: 40, label: "Stress aigu élevé", severity: "severe", clinicalMeaning: "Détresse importante; évaluation rapide recommandée." },
];

export const sasdsDefinition: QuestionnaireDefinition = {
  id: "sasds",
  version: "1.0.0",
  title: "SASDS (version éducative)",
  items: [
    { id: "sasds_1", prompt: "Ces 7 derniers jours, à quel point des souvenirs de l'événement se sont imposés à toi ?" },
    { id: "sasds_2", prompt: "Ces 7 derniers jours, à quel point as-tu fait des cauchemars liés à l'événement ?" },
    { id: "sasds_3", prompt: "Ces 7 derniers jours, à quel point as-tu évité de penser à ce qui s'est passé ?" },
    { id: "sasds_4", prompt: "Ces 7 derniers jours, à quel point as-tu évité des lieux/personnes qui te rappellent l'événement ?" },
    { id: "sasds_5", prompt: "Ces 7 derniers jours, à quel point as-tu eu du mal à ressentir des émotions positives ?" },
    { id: "sasds_6", prompt: "Ces 7 derniers jours, à quel point t'es-tu senti(e) en alerte permanente ?" },
    { id: "sasds_7", prompt: "Ces 7 derniers jours, à quel point as-tu sursauté facilement ?" },
    { id: "sasds_8", prompt: "Ces 7 derniers jours, à quel point as-tu eu des difficultés de concentration ?" },
    { id: "sasds_9", prompt: "Ces 7 derniers jours, à quel point as-tu eu des troubles du sommeil ?" },
    { id: "sasds_10", prompt: "Ces 7 derniers jours, à quel point ces symptômes ont perturbé ta vie quotidienne ?" },
  ],
  scale: freq04Scale,
  scoringRules: {
    method: "sum",
    requiredItems: 10,
    source: "SASRQ/SASDS instruments; adaptation éducative pour orientation.",
  },
  thresholds: sasdsThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, sasdsThresholds, "sasds"),
};

const radaThresholds: readonly Threshold[] = [
  { min: 0, max: 10, label: "Signal attachement faible", severity: "minimal", clinicalMeaning: "Peu d'indicateurs d'attachement perturbé." },
  { min: 11, max: 24, label: "Signal attachement modéré", severity: "moderate", clinicalMeaning: "Indices relationnels à explorer avec un adulte référent." },
  { min: 25, max: 40, label: "Signal attachement élevé", severity: "severe", clinicalMeaning: "Évaluation spécialisée développementale recommandée." },
];

export const radaDefinition: QuestionnaireDefinition = {
  id: "rada",
  version: "1.0.0",
  title: "RADA (version éducative)",
  items: [
    { id: "rada_1", prompt: "Ces 7 derniers jours, à quel point t'es-tu senti(e) distant(e) des adultes qui te soutiennent ?" },
    { id: "rada_2", prompt: "Ces 7 derniers jours, à quel point as-tu eu du mal à faire confiance ?" },
    { id: "rada_3", prompt: "Ces 7 derniers jours, à quel point as-tu évité de demander du réconfort quand ça n'allait pas ?" },
    { id: "rada_4", prompt: "Ces 7 derniers jours, à quel point t'es-tu senti(e) émotionnellement coupé(e) des autres ?" },
    { id: "rada_5", prompt: "Ces 7 derniers jours, à quel point as-tu eu des réactions émotionnelles très fortes et imprévisibles ?" },
    { id: "rada_6", prompt: "Ces 7 derniers jours, à quel point as-tu eu du mal à te sentir en sécurité dans les relations proches ?" },
    { id: "rada_7", prompt: "Ces 7 derniers jours, à quel point as-tu eu du mal à accepter l'aide des autres ?" },
    { id: "rada_8", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur d'être abandonné(e) ?" },
    { id: "rada_9", prompt: "Ces 7 derniers jours, à quel point as-tu évité les liens affectifs ?" },
    { id: "rada_10", prompt: "Ces 7 derniers jours, à quel point ces difficultés ont perturbé ton quotidien ?" },
  ],
  scale: freq04Scale,
  scoringRules: {
    method: "sum",
    requiredItems: 10,
    source: "Reactive Attachment Disorder scales; adaptation éducative non diagnostique.",
  },
  thresholds: radaThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, radaThresholds, "rada"),
};
