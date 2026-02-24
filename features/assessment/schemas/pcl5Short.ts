import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

const thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 4,
    label: "Charge traumatique faible (forme courte)",
    severity: "minimal",
    clinicalMeaning: "Sous les seuils de depistage habituellement utilises pour les formes courtes.",
  },
  {
    min: 5,
    max: 5,
    label: "Depistage limite",
    severity: "mild",
    clinicalMeaning: "Zone frontiere dans les etudes de validation courte; interpretation contextuelle necessaire.",
  },
  {
    min: 6,
    max: 16,
    label: "Depistage positif PTSD (forme courte)",
    severity: "positive-screen",
    clinicalMeaning: "Au-dessus d'un seuil utilise dans la litterature de validation courte.",
  },
];

function interpret(totalScore: number): InterpretationResult {
  const match = thresholds.find(
    (threshold) => totalScore >= threshold.min && totalScore <= threshold.max
  );

  if (!match) {
    throw new Error(`Score PCL-5 court hors plage: ${totalScore}`);
  }

  return {
    label: match.label,
    severity: match.severity,
    clinicalMeaning: match.clinicalMeaning,
  };
}

export const pcl5ShortDefinition: QuestionnaireDefinition = {
  id: "pcl5Short",
  version: "1.0.0",
  title: "PCL-5 Forme Courte (4 items)",
  items: [
    { id: "pcl5s_2", prompt: "Reves repetes et penibles lies a l'evenement stressant." },
    { id: "pcl5s_4", prompt: "Se sentir tres bouleverse(e) par des rappels de l'evenement." },
    { id: "pcl5s_13", prompt: "Se sentir distant(e) ou coupe(e) des autres." },
    { id: "pcl5s_15", prompt: "Difficultes pour s'endormir ou rester endormi(e)." },
  ],
  scale: {
    min: 0,
    max: 4,
    anchors: {
      0: "Pas du tout",
      1: "Un peu",
      2: "Moderement",
      3: "Beaucoup",
      4: "Extremement",
    },
  },
  scoringRules: {
    method: "sum",
    requiredItems: 4,
    source:
      "Zuromski KL et al. J Affect Disord. 2021;291:1-8. Full PCL-5 guidance: VA/NCPTSD recommends 31-33 on 20-item form.",
  },
  thresholds,
  interpretation: interpret,
};
