import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

const thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 3,
    label: "Low OCD symptom load",
    severity: "minimal",
    clinicalMeaning: "Below common OCI-4 screening cut-points.",
  },
  {
    min: 4,
    max: 5,
    label: "Elevated OCD symptoms",
    severity: "mild",
    clinicalMeaning: "At/above broad screening threshold (community-oriented).",
  },
  {
    min: 6,
    max: 16,
    label: "Probable OCD - positive screen",
    severity: "positive-screen",
    clinicalMeaning:
      "At/above stricter threshold used to distinguish OCD from anxiety controls.",
  },
];

function interpret(totalScore: number): InterpretationResult {
  const match = thresholds.find(
    (threshold) => totalScore >= threshold.min && totalScore <= threshold.max
  );

  if (!match) {
    throw new Error(`Mini-TOC (OCI-4) score out of range: ${totalScore}`);
  }

  return {
    label: match.label,
    severity: match.severity,
    clinicalMeaning: match.clinicalMeaning,
  };
}

export const miniTocDefinition: QuestionnaireDefinition = {
  id: "miniToc",
  version: "1.0.0",
  title: "Mini-TOC (OCI-4 proxy)",
  items: [
    { id: "mini_toc_1", prompt: "Unwanted upsetting thoughts or images." },
    { id: "mini_toc_2", prompt: "Repeated checking behaviors." },
    { id: "mini_toc_3", prompt: "Excessive washing/cleaning rituals." },
    { id: "mini_toc_4", prompt: "Need for order/symmetry causing distress." },
  ],
  scale: {
    min: 0,
    max: 4,
    anchors: {
      0: "Not at all",
      1: "A little",
      2: "Moderately",
      3: "A lot",
      4: "Extremely",
    },
  },
  scoringRules: {
    method: "sum",
    requiredItems: 4,
    // OCI-4 short OCD screener thresholds from validation literature.
    source: "Abramovitch A et al. J Obsessive Compuls Relat Disord. 2021;31:100696.",
  },
  thresholds,
  interpretation: interpret,
};
