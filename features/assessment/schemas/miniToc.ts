import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

const thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 3,
    label: "Charge TOC faible",
    severity: "minimal",
    clinicalMeaning: "Sous les seuils de depistage OCI-4 couramment utilises.",
  },
  {
    min: 4,
    max: 5,
    label: "Symptomes TOC eleves",
    severity: "mild",
    clinicalMeaning: "Au-dessus d'un seuil de depistage large (orientation communautaire).",
  },
  {
    min: 6,
    max: 16,
    label: "TOC probable - depistage positif",
    severity: "positive-screen",
    clinicalMeaning:
      "Au-dessus d'un seuil plus specifique pour distinguer TOC et troubles anxieux.",
  },
];

function interpret(totalScore: number): InterpretationResult {
  const match = thresholds.find(
    (threshold) => totalScore >= threshold.min && totalScore <= threshold.max
  );

  if (!match) {
    throw new Error(`Score Mini-TOC (OCI-4) hors plage: ${totalScore}`);
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
  title: "Mini-TOC (proxy OCI-4)",
  items: [
    { id: "mini_toc_1", prompt: "Pensees intrusives et penibles." },
    { id: "mini_toc_2", prompt: "Comportements repetes de verification." },
    { id: "mini_toc_3", prompt: "Rituels repetitifs de lavage/nettoyage." },
    { id: "mini_toc_4", prompt: "Besoin d'ordre/symetrie avec detresse." },
  ],
  scale: {
    min: 0,
    max: 4,
    anchors: {
      0: "Pas du tout",
      1: "Un peu",
      2: "Moderement",
      3: "Beaucoup",
      4: "Extremement",
    },
  },
  scoringRules: {
    method: "sum",
    requiredItems: 4,
    source: "Abramovitch A et al. J Obsessive Compuls Relat Disord. 2021;31:100696.",
  },
  thresholds,
  interpretation: interpret,
};
