export type SeverityLevel =
  | "minimal"
  | "mild"
  | "moderate"
  | "moderately-severe"
  | "severe"
  | "positive-screen";

export type QuestionnaireItem = {
  id: string;
  prompt: string;
};

export type QuestionnaireScale = {
  min: number;
  max: number;
  anchors: Record<number, string>;
};

export type ScoringRules = {
  method: "sum";
  requiredItems: number;
  // Scientific provenance for IB report/audit.
  source: string;
};

export type Threshold = {
  min: number;
  max: number;
  label: string;
  severity: SeverityLevel;
  clinicalMeaning: string;
};

export type InterpretationResult = {
  label: string;
  severity: SeverityLevel;
  clinicalMeaning: string;
};

export type QuestionnaireDefinition = {
  id: string;
  version: string;
  title: string;
  items: readonly QuestionnaireItem[];
  scale: QuestionnaireScale;
  scoringRules: ScoringRules;
  thresholds: readonly Threshold[];
  interpretation: (totalScore: number) => InterpretationResult;
};

export type QuestionnaireScore = {
  questionnaireId: string;
  version: string;
  totalScore: number;
  maxScore: number;
  normalizedScore: number;
  interpretation: InterpretationResult;
};
