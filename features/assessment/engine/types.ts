export type SeverityLevel =
  | "minimal"
  | "mild"
  | "moderate"
  | "moderately-sévère"
  | "sévère"
  | "positive-screen";

export type QuestionnaireItem = {
  id: string;
  prompt: string;
  // Some instruments have item-specific response ceilings (e.g., BES items with 3 options).
  maxOption?: number;
  // Optional item-specific option labels keyed by numeric score.
  choices?: Record<number, string>;
};

export type QuestionnaireScale = {
  min: number;
  max: number;
  anchors: Record<number, string>;
};

export type ScoringRules = {
  method:
    | "sum"
    | "aq10-keyed-binary"
    | "mdq-official"
    | "pdss-sr-official"
    | "agoraphobia-severity-10"
    | "lsas-sr-official"
    | "ygtss-global"
    | "eat26-official"
    | "bes-official"
    | "pcl5-official"
    | "rada-dsm5-split";
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
  components?: Record<string, number>;
  interpretation: InterpretationResult;
};

// IB note: these report types are separated from scoring primitives to keep
// deterministic generation auditable and easy to evolve without touching scoring math.
export type DominantCategory =
  | "depression"
  | "anxiety"
  | "trauma"
  | "ocd"
  | "personality"
  | "eating"
  | "neurodevelopment";

// IB note: this severity scale is intentionally simple for adolescent readability.
export type ReportSeverityLevel = "minimal" | "mild" | "moderate" | "high";

export type ScaleType = "depression" | "anxiety" | "ptsd" | "ocd";

export interface AssessmentResults {
  scores: {
    phq9: QuestionnaireScore;
    gad7: QuestionnaireScore;
    pcl5Short: QuestionnaireScore;
    miniToc: QuestionnaireScore;
  };
  categoryScores: Record<DominantCategory, number>;
  dominantCategory: DominantCategory;
}

export interface NaturalReport {
  introduction: string;
  emotionalSummary: string;
  dominantFocus: string;
  psychoeducation: string;
  recommendations: string[];
  encouragement: string;
  ethicalNotice: string;
}

export type IntensityBand = "light" | "moderate" | "high";

export interface SpecificTestNaturalReport {
  introduction: string;
  emotionalSummary: string;
  dominantFocus: string;
}
