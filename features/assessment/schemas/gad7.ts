import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

const thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 4,
    label: "Minimal anxiety",
    severity: "minimal",
    clinicalMeaning: "Below usual clinical cut-point.",
  },
  {
    min: 5,
    max: 9,
    label: "Mild anxiety",
    severity: "mild",
    clinicalMeaning: "Monitor symptoms; psychoeducation can help.",
  },
  {
    min: 10,
    max: 14,
    label: "Moderate anxiety",
    severity: "moderate",
    clinicalMeaning: "Clinically relevant range; further assessment recommended.",
  },
  {
    min: 15,
    max: 21,
    label: "Severe anxiety",
    severity: "severe",
    clinicalMeaning: "High symptom burden; clinical follow-up recommended.",
  },
];

function interpret(totalScore: number): InterpretationResult {
  const match = thresholds.find(
    (threshold) => totalScore >= threshold.min && totalScore <= threshold.max
  );

  if (!match) {
    throw new Error(`GAD-7 score out of range: ${totalScore}`);
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
    { id: "gad7_1", prompt: "Feeling nervous, anxious, or on edge." },
    { id: "gad7_2", prompt: "Not being able to stop or control worrying." },
    { id: "gad7_3", prompt: "Worrying too much about different things." },
    { id: "gad7_4", prompt: "Trouble relaxing." },
    { id: "gad7_5", prompt: "Being so restless that it is hard to sit still." },
    { id: "gad7_6", prompt: "Becoming easily annoyed or irritable." },
    { id: "gad7_7", prompt: "Feeling afraid as if something awful might happen." },
  ],
  scale: {
    min: 0,
    max: 3,
    anchors: {
      0: "Not at all",
      1: "Several days",
      2: "More than half the days",
      3: "Nearly every day",
    },
  },
  scoringRules: {
    method: "sum",
    requiredItems: 7,
    // Official GAD-7 severity thresholds from Spitzer et al. 2006.
    source: "Spitzer RL, Kroenke K, Williams JBW, Lowe B. Arch Intern Med. 2006;166(10):1092-1097.",
  },
  thresholds,
  interpretation: interpret,
};
