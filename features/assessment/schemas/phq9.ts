import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

const thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 4,
    label: "Dépression minimale",
    severity: "minimal",
    clinicalMeaning: "Charge symptomatique généralement sous le seuil de préoccupation clinique.",
  },
  {
    min: 5,
    max: 9,
    label: "Dépression légère",
    severity: "mild",
    clinicalMeaning: "Surveillance des symptômes et du fonctionnement psychosocial recommandée.",
  },
  {
    min: 10,
    max: 14,
    label: "Dépression modérée",
    severity: "moderate",
    clinicalMeaning: "Plage cliniquement significative; une évaluation complémentaire est recommandée.",
  },
  {
    min: 15,
    max: 19,
    label: "Dépression modérée à sévère",
    severity: "moderately-severe",
    clinicalMeaning: "Charge symptomatique élevée; suivi clinique actif recommandé.",
  },
  {
    min: 20,
    max: 27,
    label: "Dépression sévère",
    severity: "severe",
    clinicalMeaning: "Charge symptomatique très élevée; évaluation clinique rapide recommandée.",
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
    {
      id: "phq9_1",
      prompt: "Ces 7 derniers jours, as-tu eu moins d'envie ou de plaisir à faire tes activités ?",
    },
    {
      id: "phq9_2",
      prompt: "Ces 7 derniers jours, t'es-tu senti(e) triste, découragé(e) ou sans espoir ?",
    },
    {
      id: "phq9_3",
      prompt:
        "Ces 7 derniers jours, as-tu eu des problèmes de sommeil (difficulté à t'endormir, réveils, ou trop dormir) ?",
    },
    {
      id: "phq9_4",
      prompt: "Ces 7 derniers jours, t'es-tu senti(e) fatigué(e) ou sans énergie ?",
    },
    {
      id: "phq9_5",
      prompt:
        "Ces 7 derniers jours, as-tu remarqué que ton appétit avait beaucoup changé (moins faim ou plus faim) ?",
    },
    {
      id: "phq9_6",
      prompt: "Ces 7 derniers jours, t'es-tu senti(e) nul(le), en échec ou trop coupable ?",
    },
    {
      id: "phq9_7",
      prompt:
        "Ces 7 derniers jours, as-tu eu du mal à te concentrer (en cours, en lisant ou pour les devoirs) ?",
    },
    {
      id: "phq9_8",
      prompt: "Ces 7 derniers jours, as-tu été beaucoup plus lent(e) que d'habitude, ou au contraire très agité(e) ?",
    },
    {
      id: "phq9_9",
      prompt: "Ces 7 derniers jours, as-tu eu des pensées de mort ou l'idée de te faire du mal ?",
    },
  ],
  scale: {
    min: 0,
    max: 3,
    anchors: {
      0: "Jamais (0 jour)",
      1: "Rarement (1 à 2 jours)",
      2: "Souvent (3 à 4 jours)",
      3: "Très souvent (5 à 7 jours)",
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
