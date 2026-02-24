import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

const thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 4,
    label: "Anxiete minimale",
    severity: "minimal",
    clinicalMeaning: "Sous le seuil clinique usuel.",
  },
  {
    min: 5,
    max: 9,
    label: "Anxiete legere",
    severity: "mild",
    clinicalMeaning: "Surveillance des symptomes et psychoeducation utiles.",
  },
  {
    min: 10,
    max: 14,
    label: "Anxiete moderee",
    severity: "moderate",
    clinicalMeaning: "Plage cliniquement pertinente; evaluation complementaire recommandee.",
  },
  {
    min: 15,
    max: 21,
    label: "Anxiete severe",
    severity: "severe",
    clinicalMeaning: "Charge symptomatique elevee; suivi clinique recommande.",
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
    { id: "gad7_1", prompt: "Se sentir nerveux(se), anxieux(se) ou a bout." },
    { id: "gad7_2", prompt: "Ne pas reussir a arreter de s'inquieter." },
    { id: "gad7_3", prompt: "S'inquieter trop pour differentes choses." },
    { id: "gad7_4", prompt: "Avoir du mal a se detendre." },
    { id: "gad7_5", prompt: "Etre tellement agite(e) qu'il est difficile de rester en place." },
    { id: "gad7_6", prompt: "Devenir facilement irritable." },
    { id: "gad7_7", prompt: "Avoir peur que quelque chose de grave arrive." },
  ],
  scale: {
    min: 0,
    max: 3,
    anchors: {
      0: "Pas du tout",
      1: "Plusieurs jours",
      2: "Plus de la moitie des jours",
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
