import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

const thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 4,
    label: "Minimal depression",
    severity: "minimal",
    clinicalMeaning: "Symptom burden is typically below clinical concern.",
  },
  {
    min: 5,
    max: 9,
    label: "Mild depression",
    severity: "mild",
    clinicalMeaning: "Monitor symptoms and psychosocial functioning.",
  },
  {
    min: 10,
    max: 14,
    label: "Moderate depression",
    severity: "moderate",
    clinicalMeaning: "Clinically relevant range; further assessment is recommended.",
  },
  {
    min: 15,
    max: 19,
    label: "Moderately severe depression",
    severity: "moderately-severe",
    clinicalMeaning: "High symptom burden; active clinical follow-up is recommended.",
  },
  {
    min: 20,
    max: 27,
    label: "Severe depression",
    severity: "severe",
    clinicalMeaning: "Very high burden; urgent clinical evaluation is recommended.",
  },
];

function interpret(totalScore: number): InterpretationResult {
  const match = thresholds.find(
    (threshold) => totalScore >= threshold.min && totalScore <= threshold.max
  );

  if (!match) {
    throw new Error(`PHQ-9 score out of range: ${totalScore}`);
  }

  return {
    label: match.label,
    severity: match.severity,
    clinicalMeaning: match.clinicalMeaning,
  };
}

export const phq9Definition: QuestionnaireDefinition = {
  id: "phq9",
  version: "1.0.0",
  title: "Patient Health Questionnaire-9",
  items: [
    { id: "phq9_1", prompt: "Little interest or pleasure in doing things." },
    { id: "phq9_2", prompt: "Feeling down, depressed, or hopeless." },
    { id: "phq9_3", prompt: "Trouble falling/staying asleep, or sleeping too much." },
    { id: "phq9_4", prompt: "Feeling tired or having little energy." },
    { id: "phq9_5", prompt: "Poor appetite or overeating." },
    { id: "phq9_6", prompt: "Feeling bad about yourself, or that you are a failure." },
    {
      id: "phq9_7",
      prompt: "Trouble concentrating on things, such as schoolwork or reading.",
    },
    { id: "phq9_8", prompt: "Moving/speaking slowly, or being restless/fidgety." },
    { id: "phq9_9", prompt: "Thoughts that you would be better off dead or self-harm." },
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
    requiredItems: 9,
    // Official PHQ-9 cut-points from Kroenke et al. 2001.
    source: "Kroenke K, Spitzer RL, Williams JBW. J Gen Intern Med. 2001;16(9):606-613.",
  },
  thresholds,
  interpretation: interpret,
};
