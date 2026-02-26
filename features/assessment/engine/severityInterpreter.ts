import type { ScaleType } from "@/features/assessment/engine/types";

export type SeverityBand = "low" | "medium" | "high";

// IB note: this file centralizes all score-to-level rules so interpretation
// remains deterministic, reviewable, and easy to justify in academic work.
type ThresholdRule = {
  lowMax: number;
  mediumMax: number;
};

const RULES: Record<ScaleType, ThresholdRule> = {
  // PHQ-9 / GAD-7: low under clinical alert threshold, medium around moderate alert.
  depression: { lowMax: 9, mediumMax: 14 },
  anxiety: { lowMax: 9, mediumMax: 14 },
  // Short PTSD/OCD screens: conservative educational bands for adolescent guidance.
  ptsd: { lowMax: 5, mediumMax: 9 },
  ocd: { lowMax: 5, mediumMax: 9 },
};

export function interpretSeverity(score: number, scaleType: ScaleType): SeverityBand {
  const safeScore = Number.isFinite(score) ? Math.max(0, score) : 0;
  const rule = RULES[scaleType];

  if (safeScore <= rule.lowMax) return "low";
  if (safeScore <= rule.mediumMax) return "medium";
  return "high";
}

export function interpretNormalizedSeverity(normalizedScore: number): SeverityBand {
  const safe = Number.isFinite(normalizedScore)
    ? Math.min(1, Math.max(0, normalizedScore))
    : 0;

  if (safe < 0.34) return "low";
  if (safe < 0.67) return "medium";
  return "high";
}
