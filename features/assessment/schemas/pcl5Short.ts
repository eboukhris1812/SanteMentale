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
    clinicalMeaning: "Sous les seuils de dépistage habituellement utilisés pour les formes courtes.",
  },
  {
    min: 5,
    max: 5,
    label: "Dépistage limite",
    severity: "mild",
    clinicalMeaning: "Zone frontière dans les études de validation courte; interprétation contextuelle nécessaire.",
  },
  {
    min: 6,
    max: 16,
    label: "Dépistage positif PTSD (forme courte)",
    severity: "positive-screen",
    clinicalMeaning: "Au-dessus d'un seuil utilisé dans la littérature de validation courte.",
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
    {
      id: "pcl5s_2",
      prompt:
        "Ces 7 derniers jours, as-tu fait des cauchemars liés à un événement très stressant ou traumatique que tu as vécu (ou vu) ?",
    },
    {
      id: "pcl5s_4",
      prompt:
        "Ces 7 derniers jours, à quel point t'es-tu senti(e) bouleversé(e) quand quelque chose te rappelait cet événement ?",
    },
    {
      id: "pcl5s_13",
      prompt: "Ces 7 derniers jours, à quel point t'es-tu senti(e) distant(e) ou coupé(e) des autres ?",
    },
    {
      id: "pcl5s_15",
      prompt:
        "Ces 7 derniers jours, à quel point as-tu eu des problèmes de sommeil depuis cet événement (endormissement, réveils, cauchemars) ?",
    },
  ],
  scale: {
    min: 0,
    max: 4,
    anchors: {
      0: "Pas du tout (0)",
      1: "Un peu (1)",
      2: "Assez souvent (2)",
      3: "Très souvent (3)",
      4: "Tout le temps (4)",
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
