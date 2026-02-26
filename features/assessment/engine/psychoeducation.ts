import type {
  DominantCategory,
  IntensityBand,
  ReportSeverityLevel,
} from "@/features/assessment/engine/types";

const BASE_EXPLANATION =
  "À l'adolescence, le corps, le cerveau, l'école et les relations changent vite en même temps.";

const CATEGORY_EXPLANATIONS: Record<DominantCategory, string> = {
  depression:
    "Quand l'énergie baisse, il devient plus dur de se motiver, même pour des choses qu'on aime d'habitude.",
  anxiety:
    "Quand la pression monte, le cerveau peut rester en mode alerte et rendre le repos plus difficile.",
  trauma:
    "Après un moment très difficile, certaines réactions peuvent revenir même quand on voudrait passer à autre chose.",
  ocd:
    "Quand l'anxiété monte, certaines pensées ou vérifications peuvent donner une impression de contrôle, puis fatiguer.",
  personality:
    "Quand on construit son identité, les émotions et les relations peuvent paraître plus intenses qu'avant.",
  eating:
    "L'image de soi, les réseaux et les comparaisons peuvent influencer fortement le rapport au corps et aux repas.",
  neurodevelopment:
    "Chaque cerveau fonctionne à son rythme, et certains profils ont besoin de stratégies d'organisation plus claires.",
};

const NORMALIZING_LINES: Record<IntensityBand, string> = {
  // IB note: this block normalizes emotional variability without minimizing distress.
  light: "Ce que tu ressens est compréhensible, et ça peut déjà s'améliorer avec de petits ajustements.",
  moderate:
    "Ce que tu ressens est fréquent chez les ados, mais mérite qu'on t'accompagne pour éviter que ça s'installe.",
  high:
    "Ce que tu ressens est important et mérite du soutien; demander de l'aide n'est pas exagérer.",
};

const SAFETY_BRIDGES: Record<ReportSeverityLevel, string> = {
  minimal: "Tu peux avancer pas à pas.",
  mild: "Tu peux avancer pas à pas avec des appuis simples.",
  moderate: "Tu peux avancer pas à pas, en t'appuyant sur des adultes de confiance.",
  high: "Tu peux avancer pas à pas, en t'entourant rapidement d'adultes qui peuvent t'aider.",
};

export function buildPsychoeducation(
  category: DominantCategory,
  globalBand: IntensityBand,
  dominantSeverity: ReportSeverityLevel
): string {
  // IB note: output is capped to concise sentences for accessibility and reading comfort.
  const sentences = [
    BASE_EXPLANATION,
    CATEGORY_EXPLANATIONS[category],
    NORMALIZING_LINES[globalBand],
    "Ressentir cela ne veut pas dire qu'il y a quelque chose de 'cassé' chez toi.",
    "Comprendre ce qui se passe est déjà une étape utile pour reprendre la main.",
    SAFETY_BRIDGES[dominantSeverity],
  ];

  return sentences.join(" ");
}
