import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

const thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 4,
    label: "Anxiété minimale",
    severity: "minimal",
    clinicalMeaning: "Sous le seuil clinique usuel.",
  },
  {
    min: 5,
    max: 9,
    label: "Anxiété légère",
    severity: "mild",
    clinicalMeaning: "Surveillance des symptômes et psychoéducation utiles.",
  },
  {
    min: 10,
    max: 14,
    label: "Anxiété modérée",
    severity: "moderate",
    clinicalMeaning: "Plage cliniquement pertinente; évaluation complémentaire recommandée.",
  },
  {
    min: 15,
    max: 21,
    label: "Anxiété sévère",
    severity: "sévère",
    clinicalMeaning: "Charge symptomatique élevée; suivi clinique recommandé.",
  },
];

function interpret(totalScore: number): InterpretationResult {
  const match = thresholds.find(
    (threshold) => totalScore >= threshold.min && totalScore <= threshold.max
  );

  if (!match) {
    throw new Error(`Score GAD-7 hors plage: ${totalScore}`);
  }

  return {
    label: match.label,
    severity: match.severity,
    clinicalMeaning: match.clinicalMeaning,
  };
}

export const gad7Definition: QuestionnaireDefinition = {
  id: "gad7",
  version: "1.0.0",
  title: "Generalized Anxiety Disorder-7",
  items: [
    {
      id: "gad7_1",
      prompt: "Au cours des 2 dernières semaines, t'es-tu senti(e) nerveux(se), anxieux(se) ou à bout ?",
    },
    {
      id: "gad7_2",
      prompt: "Au cours des 2 dernières semaines, as-tu eu du mal à arrêter de t'inquiéter ?",
    },
    {
      id: "gad7_3",
      prompt: "Au cours des 2 dernières semaines, t'es-tu trop inquiété(e) pour plusieurs choses à la fois ?",
    },
    {
      id: "gad7_4",
      prompt: "Au cours des 2 dernières semaines, as-tu eu du mal à te détendre ?",
    },
    {
      id: "gad7_5",
      prompt: "Au cours des 2 dernières semaines, t'es-tu senti(e) tellement agité(e) qu'il était difficile de rester en place ?",
    },
    {
      id: "gad7_6",
      prompt: "Au cours des 2 dernières semaines, as-tu été facilement irritable ou énervé(e) ?",
    },
    {
      id: "gad7_7",
      prompt: "Au cours des 2 dernières semaines, as-tu eu peur que quelque chose de grave arrive ?",
    },
  ],
  scale: {
    min: 0,
    max: 3,
    anchors: {
      0: "Pas du tout",
      1: "Plusieurs jours",
      2: "Plus de la moitié des jours",
      3: "Presque tous les jours",
    },
  },
  scoringRules: {
    method: "sum",
    requiredItems: 7,
    source: "Spitzer RL, Kroenke K, Williams JBW, Lowe B. Arch Intern Med. 2006;166(10):1092-1097.",
  },
  thresholds,
  interpretation: interpret,
};
