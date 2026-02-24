import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

const thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 4,
    label: "Low PTSD symptom load (short form)",
    severity: "minimal",
    clinicalMeaning: "Below commonly used short-form screening thresholds.",
  },
  {
    min: 5,
    max: 5,
    label: "Borderline positive screen",
    severity: "mild",
    clinicalMeaning: "Borderline range in short-form studies; monitor context.",
  },
  {
    min: 6,
    max: 16,
    label: "Positive PTSD screen (short form)",
    severity: "positive-screen",
    clinicalMeaning: "At/above a validated short-form cut-point used in method papers.",
  },
];

function interpret(totalScore: number): InterpretationResult {
  const match = thresholds.find(
    (threshold) => totalScore >= threshold.min && totalScore <= threshold.max
  );

  if (!match) {
    throw new Error(`PCL-5 short score out of range: ${totalScore}`);
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
  title: "PCL-5 Short Form (4-item)",
  items: [
    {
      id: "pcl5s_2",
      prompt: "Repeated, disturbing dreams of the stressful experience.",
    },
    {
      id: "pcl5s_4",
      prompt: "Feeling very upset when reminded of the stressful experience.",
    },
    {
      id: "pcl5s_13",
      prompt: "Feeling distant or cut off from other people.",
    },
    {
      id: "pcl5s_15",
      prompt: "Trouble falling or staying asleep.",
    },
  ],
  scale: {
    min: 0,
    max: 4,
    anchors: {
      0: "Not at all",
      1: "A little bit",
      2: "Moderately",
      3: "Quite a bit",
      4: "Extremely",
    },
  },
  scoringRules: {
    method: "sum",
    requiredItems: 4,
    // There is no single universally official cut-point for all short forms.
    // This implementation uses a published 4-item PCL-5 short form and a
    // commonly cited cut-point (>=6) from short-form validation work.
    source:
      "Zuromski KL et al. J Affect Disord. 2021;291:1-8. Full PCL-5 guidance: VA/NCPTSD recommends 31-33 on 20-item form.",
  },
  thresholds,
  interpretation: interpret,
};
