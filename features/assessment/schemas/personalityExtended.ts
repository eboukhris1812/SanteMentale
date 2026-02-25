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

const pdq4Thresholds: readonly Threshold[] = [
  { min: 0, max: 2, label: "Traits faibles", severity: "minimal", clinicalMeaning: "Peu de traits de personnalité pathologiques repérés." },
  { min: 3, max: 5, label: "Traits modérés", severity: "moderate", clinicalMeaning: "Traits à discuter dans une évaluation clinique." },
  { min: 6, max: 8, label: "Traits élevés", severity: "positive-screen", clinicalMeaning: "Dépistage positif possible; confirmation clinique nécessaire." },
];

export const pdq4GroupeADefinition: QuestionnaireDefinition = {
  id: "pdq4A",
  version: "1.0.0",
  title: "PDQ-4+ Groupe A (version éducative)",
  items: [
    { id: "pdq4a_1", prompt: "Te méfies-tu souvent des intentions des autres ?" },
    { id: "pdq4a_2", prompt: "As-tu souvent l'impression que les autres veulent te nuire ?" },
    { id: "pdq4a_3", prompt: "As-tu du mal à te confier par peur que cela se retourne contre toi ?" },
    { id: "pdq4a_4", prompt: "Interprètes-tu parfois des remarques neutres comme des attaques ?" },
    { id: "pdq4a_5", prompt: "As-tu tendance à garder de la rancune longtemps ?" },
    { id: "pdq4a_6", prompt: "As-tu des idées ou croyances que les autres trouvent étranges ?" },
    { id: "pdq4a_7", prompt: "As-tu peu d'intérêt pour les relations proches ?" },
    { id: "pdq4a_8", prompt: "Les autres te décrivent-ils comme distant(e) ou froid(e) ?" },
  ],
  scale: binaryScale,
  scoringRules: { method: "sum", requiredItems: 8, source: "PDQ-4+ cluster A; adaptation éducative binaire." },
  thresholds: pdq4Thresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, pdq4Thresholds, "pdq4A"),
};

export const pdq4GroupeBDefinition: QuestionnaireDefinition = {
  id: "pdq4B",
  version: "1.0.0",
  title: "PDQ-4+ Groupe B (version éducative)",
  items: [
    { id: "pdq4b_1", prompt: "As-tu des réactions émotionnelles très intenses et rapides ?" },
    { id: "pdq4b_2", prompt: "As-tu souvent peur d'être rejeté(e) ou abandonné(e) ?" },
    { id: "pdq4b_3", prompt: "Tes relations deviennent-elles facilement instables ou conflictuelles ?" },
    { id: "pdq4b_4", prompt: "As-tu des comportements impulsifs que tu regrettes ensuite ?" },
    { id: "pdq4b_5", prompt: "As-tu tendance à agir sans penser aux conséquences pour les autres ?" },
    { id: "pdq4b_6", prompt: "As-tu besoin d'être au centre de l'attention pour te sentir bien ?" },
    { id: "pdq4b_7", prompt: "Ton image de toi change-t-elle beaucoup selon les moments ?" },
    { id: "pdq4b_8", prompt: "As-tu du mal à garder des limites stables dans tes relations ?" },
  ],
  scale: binaryScale,
  scoringRules: { method: "sum", requiredItems: 8, source: "PDQ-4+ cluster B; adaptation éducative binaire." },
  thresholds: pdq4Thresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, pdq4Thresholds, "pdq4B"),
};

export const pdq4GroupeCDefinition: QuestionnaireDefinition = {
  id: "pdq4C",
  version: "1.0.0",
  title: "PDQ-4+ Groupe C (version éducative)",
  items: [
    { id: "pdq4c_1", prompt: "Évites-tu des situations sociales par peur d'être critiqué(e) ?" },
    { id: "pdq4c_2", prompt: "As-tu souvent besoin d'être rassuré(e) avant de décider ?" },
    { id: "pdq4c_3", prompt: "As-tu du mal à faire les choses seul(e) par peur d'échouer ?" },
    { id: "pdq4c_4", prompt: "As-tu peur d'être désapprouvé(e) dans les relations ?" },
    { id: "pdq4c_5", prompt: "As-tu tendance à te voir moins capable que les autres ?" },
    { id: "pdq4c_6", prompt: "As-tu du mal à exprimer ton désaccord par peur de perdre le lien ?" },
    { id: "pdq4c_7", prompt: "As-tu du mal à commencer des projets sans soutien fort ?" },
    { id: "pdq4c_8", prompt: "As-tu du mal à supporter l'idée d'être seul(e) longtemps ?" },
  ],
  scale: binaryScale,
  scoringRules: { method: "sum", requiredItems: 8, source: "PDQ-4+ cluster C; adaptation éducative binaire." },
  thresholds: pdq4Thresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, pdq4Thresholds, "pdq4C"),
};
