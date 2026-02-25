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

const eat26Thresholds: readonly Threshold[] = [
  { min: 0, max: 15, label: "Risque TCA faible", severity: "minimal", clinicalMeaning: "Peu d'indicateurs de trouble des conduites alimentaires." },
  { min: 16, max: 29, label: "Risque TCA modéré", severity: "moderate", clinicalMeaning: "Signaux présents; suivi éducatif/clinique recommandé." },
  { min: 30, max: 78, label: "Risque TCA élevé", severity: "positive-screen", clinicalMeaning: "Dépistage positif probable; évaluation spécialisée recommandée." },
];

export const eat26Definition: QuestionnaireDefinition = {
  id: "eat26",
  version: "1.0.0",
  title: "EAT-26 (version éducative simplifiée)",
  items: [
    { id: "eat26_1", prompt: "Je suis très préoccupé(e) par la nourriture." },
    { id: "eat26_2", prompt: "J'évite certains aliments parce qu'ils font grossir." },
    { id: "eat26_3", prompt: "Je me sens mal après avoir mangé." },
    { id: "eat26_4", prompt: "Je fais des régimes stricts." },
    { id: "eat26_5", prompt: "Je pense souvent à brûler les calories mangées." },
    { id: "eat26_6", prompt: "Je me sens coupable quand je mange." },
    { id: "eat26_7", prompt: "J'ai peur de prendre du poids." },
    { id: "eat26_8", prompt: "Je saute des repas pour contrôler mon poids." },
    { id: "eat26_9", prompt: "Je me compare souvent aux autres sur le physique." },
    { id: "eat26_10", prompt: "Je me sens en perte de contrôle quand je mange." },
    { id: "eat26_11", prompt: "Je me pèse ou me contrôle très fréquemment." },
    { id: "eat26_12", prompt: "Mon humeur dépend beaucoup de mon apparence physique." },
    { id: "eat26_13", prompt: "Mes habitudes alimentaires perturbent ma vie scolaire/sociale." },
    { id: "eat26_14", prompt: "Je limite fortement les portions que je mange." },
    { id: "eat26_15", prompt: "Je ressens de l'angoisse avant ou après les repas." },
    { id: "eat26_16", prompt: "Je me sens mieux si je n'ai pas mangé." },
    { id: "eat26_17", prompt: "Je m'inquiète souvent de devenir gros(se)." },
    { id: "eat26_18", prompt: "Je cache parfois mes habitudes alimentaires." },
    { id: "eat26_19", prompt: "Je me sens obligé(e) de compenser après avoir mangé." },
    { id: "eat26_20", prompt: "Je pense que ma valeur dépend de mon poids." },
    { id: "eat26_21", prompt: "Je me sens mal à l'aise en mangeant avec d'autres personnes." },
    { id: "eat26_22", prompt: "Je me sens insatisfait(e) de mon corps la plupart du temps." },
    { id: "eat26_23", prompt: "Je me critique durement sur mon apparence." },
    { id: "eat26_24", prompt: "Je pense souvent à des méthodes rapides pour perdre du poids." },
    { id: "eat26_25", prompt: "Je sens que l'alimentation prend trop de place dans ma tête." },
    { id: "eat26_26", prompt: "Mon rapport à l'alimentation me fait souffrir." },
  ],
  scale: {
    min: 0,
    max: 3,
    anchors: {
      0: "Jamais (0)",
      1: "Rarement (1)",
      2: "Souvent (2)",
      3: "Très souvent (3)",
    },
  },
  scoringRules: {
    method: "sum",
    requiredItems: 26,
    source: "Garner DM et al. EAT-26; adaptation éducative de l'ancrage des réponses.",
  },
  thresholds: eat26Thresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, eat26Thresholds, "eat26"),
};

const besThresholds: readonly Threshold[] = [
  { min: 0, max: 15, label: "Hyperphagie faible", severity: "minimal", clinicalMeaning: "Peu de signes d'hyperphagie boulimique." },
  { min: 16, max: 30, label: "Hyperphagie modérée", severity: "moderate", clinicalMeaning: "Signes cliniques intermédiaires." },
  { min: 31, max: 48, label: "Hyperphagie élevée", severity: "severe", clinicalMeaning: "Signes élevés; évaluation spécialisée recommandée." },
];

export const besDefinition: QuestionnaireDefinition = {
  id: "bes",
  version: "1.0.0",
  title: "BES (version éducative)",
  items: [
    { id: "bes_1", prompt: "Ces 7 derniers jours, j'ai mangé rapidement une grande quantité de nourriture." },
    { id: "bes_2", prompt: "Ces 7 derniers jours, j'ai eu du mal à m'arrêter de manger une fois commencé." },
    { id: "bes_3", prompt: "Ces 7 derniers jours, j'ai mangé même sans faim physique." },
    { id: "bes_4", prompt: "Ces 7 derniers jours, j'ai mangé pour gérer des émotions difficiles." },
    { id: "bes_5", prompt: "Ces 7 derniers jours, j'ai caché mes épisodes alimentaires aux autres." },
    { id: "bes_6", prompt: "Ces 7 derniers jours, je me suis senti(e) coupable après avoir mangé." },
    { id: "bes_7", prompt: "Ces 7 derniers jours, j'ai ressenti une perte de contrôle pendant les repas." },
    { id: "bes_8", prompt: "Ces 7 derniers jours, j'ai continué à manger malgré un inconfort physique." },
    { id: "bes_9", prompt: "Ces 7 derniers jours, j'ai été préoccupé(e) par le prochain épisode alimentaire." },
    { id: "bes_10", prompt: "Ces 7 derniers jours, j'ai eu du mal à réguler la taille de mes portions." },
    { id: "bes_11", prompt: "Ces 7 derniers jours, j'ai eu des envies alimentaires très difficiles à résister." },
    { id: "bes_12", prompt: "Ces 7 derniers jours, j'ai mangé quand je me sentais stressé(e) ou seul(e)." },
    { id: "bes_13", prompt: "Ces 7 derniers jours, mon alimentation m'a fait perdre confiance en moi." },
    { id: "bes_14", prompt: "Ces 7 derniers jours, j'ai pensé souvent à compenser après avoir mangé." },
    { id: "bes_15", prompt: "Ces 7 derniers jours, j'ai ressenti de la honte liée à la nourriture." },
    { id: "bes_16", prompt: "Ces 7 derniers jours, mes épisodes alimentaires ont perturbé mon quotidien." },
  ],
  scale: {
    min: 0,
    max: 3,
    anchors: {
      0: "Jamais (0)",
      1: "Parfois (1)",
      2: "Souvent (2)",
      3: "Presque toujours (3)",
    },
  },
  scoringRules: {
    method: "sum",
    requiredItems: 16,
    source: "Gormally J et al. BES; adaptation éducative des modalités de réponse.",
  },
  thresholds: besThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, besThresholds, "bes"),
};
