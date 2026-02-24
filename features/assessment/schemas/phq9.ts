import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

const thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 4,
    label: "Depression minimale",
    severity: "minimal",
    clinicalMeaning: "Charge symptomatique generalement sous le seuil de preoccupation clinique.",
  },
  {
    min: 5,
    max: 9,
    label: "Depression legere",
    severity: "mild",
    clinicalMeaning: "Surveillance des symptomes et du fonctionnement psychosocial recommandee.",
  },
  {
    min: 10,
    max: 14,
    label: "Depression moderee",
    severity: "moderate",
    clinicalMeaning: "Plage cliniquement significative; une evaluation complementaire est recommandee.",
  },
  {
    min: 15,
    max: 19,
    label: "Depression moderee a severe",
    severity: "moderately-severe",
    clinicalMeaning: "Charge symptomatique elevee; suivi clinique actif recommande.",
  },
  {
    min: 20,
    max: 27,
    label: "Depression severe",
    severity: "severe",
    clinicalMeaning: "Charge symptomatique tres elevee; evaluation clinique rapide recommandee.",
  },
];

function interpret(totalScore: number): InterpretationResult {
  const match = thresholds.find(
    (threshold) => totalScore >= threshold.min && totalScore <= threshold.max
  );

  if (!match) {
    throw new Error(`Score PHQ-9 hors plage: ${totalScore}`);
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
    { id: "phq9_1", prompt: "Peu d'interet ou de plaisir a faire les choses." },
    { id: "phq9_2", prompt: "Se sentir triste, deprime(e) ou sans espoir." },
    { id: "phq9_3", prompt: "Difficultes de sommeil (endormissement, reveils, ou trop dormir)." },
    { id: "phq9_4", prompt: "Se sentir fatigue(e) ou manquer d'energie." },
    { id: "phq9_5", prompt: "Peu d'appetit ou manger excessivement." },
    { id: "phq9_6", prompt: "Se sentir nul(le), en echec ou se culpabiliser." },
    { id: "phq9_7", prompt: "Difficulte a se concentrer (cours, lecture, devoirs)." },
    { id: "phq9_8", prompt: "Lenteur inhabituelle ou agitation importante." },
    { id: "phq9_9", prompt: "Pensees que tu serais mieux mort(e) ou de te faire du mal." },
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
    requiredItems: 9,
    source: "Kroenke K, Spitzer RL, Williams JBW. J Gen Intern Med. 2001;16(9):606-613.",
  },
  thresholds,
  interpretation: interpret,
};
