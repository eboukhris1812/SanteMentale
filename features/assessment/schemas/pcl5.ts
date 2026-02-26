import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

const thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 10,
    label: "Charge traumatique faible",
    severity: "minimal",
    clinicalMeaning:
      "Score bas sur le PCL-5. Le dépistage ne suggere pas de TSPT probable a ce stade.",
  },
  {
    min: 11,
    max: 30,
    label: "Symptomes post-traumatiques presents",
    severity: "mild",
    clinicalMeaning:
      "Symptomes presents mais score sous les seuils de dépistage PCL-5 habituellement utilises.",
  },
  {
    min: 31,
    max: 33,
    label: "Zone seuil PCL-5",
    severity: "positive-screen",
    clinicalMeaning:
      "Zone de cut-off frequente (31-33). Une évaluation clinique complementaire est recommandee.",
  },
  {
    min: 34,
    max: 80,
    label: "dépistage positif PTSD probable",
    severity: "positive-screen",
    clinicalMeaning:
      "Score au-dessus du cut-off usuel du PCL-5. Confirmer par évaluation clinique spécialisée.",
  },
];

function interpret(totalScore: number): InterpretationResult {
  const match = thresholds.find(
    (threshold) => totalScore >= threshold.min && totalScore <= threshold.max
  );

  if (!match) {
    throw new Error(`Score PCL-5 hors plage: ${totalScore}`);
  }

  return {
    label: match.label,
    severity: match.severity,
    clinicalMeaning: match.clinicalMeaning,
  };
}

export const pcl5Definition: QuestionnaireDefinition = {
  id: "pcl5",
  version: "1.0.0",
  title: "PCL-5 (PTSD Checklist for DSM-5, 20 items)",
  items: [
    {
      id: "pcl5_1",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu ete affecte(e) par des souvenirs repetes, penibles et involontaires de l'experience stressanté ?",
    },
    {
      id: "pcl5_2",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu ete affecte(e) par des reves repetes et penibles de l'experience stressanté ?",
    },
    {
      id: "pcl5_3",
      prompt:
        "Dans le dernier mois, dans quelle mesure t'est-il arrive de te sentir ou d'agir soudainement comme si tu revivais l'experience stressanté ?",
    },
    {
      id: "pcl5_4",
      prompt:
        "Dans le dernier mois, dans quelle mesure t'es-tu senti(e) mal quand quelque chose te rappelait l'evenement ?",
    },
    {
      id: "pcl5_5",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu eu de fortes reactions physiques quand quelque chose te rappelait l'evenement (coeur qui s'accelere, souffle court, transpiration) ?",
    },
    {
      id: "pcl5_6",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu essaye d'éviter les souvenirs, pensees ou sentiments lies a l'evenement ?",
    },
    {
      id: "pcl5_7",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu essaye d'éviter les personnes, lieux, activites ou objets qui rappellent l'evenement ?",
    },
    {
      id: "pcl5_8",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu eu des difficultés a te rappeler des parties importantes de l'evenement ?",
    },
    {
      id: "pcl5_9",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu eu des croyances negatives sur toi, les autres ou le monde (ex: je suis nul(le), personne n'est fiable, le monde est dangereux) ?",
    },
    {
      id: "pcl5_10",
      prompt:
        "Dans le dernier mois, dans quelle mesure t'es-tu blame(e) ou as-tu blame quelqu'un d'autre pour l'evenement ou ses conséquences ?",
    },
    {
      id: "pcl5_11",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu ressenti des emotions negatives intenses (peur, horreur, colere, culpabilite, honte) ?",
    },
    {
      id: "pcl5_12",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu perdu de l'interet pour des activites que tu aimais avant ?",
    },
    {
      id: "pcl5_13",
      prompt:
        "Dans le dernier mois, dans quelle mesure t'es-tu senti(e) distant(e) ou coupe(e) des autres ?",
    },
    {
      id: "pcl5_14",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu eu du mal a ressentir des emotions positives (joie, amour, affection) ?",
    },
    {
      id: "pcl5_15",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu eu un comportement irritable, des explosions de colere ou des reactions agressives ?",
    },
    {
      id: "pcl5_16",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu pris des risques inconsideres ou adopte des conduites potentiellement dangereuses ?",
    },
    {
      id: "pcl5_17",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu ete en etat de super-alerte, hypervigilant(e) ou constamment sur tes gardes ?",
    },
    {
      id: "pcl5_18",
      prompt: "Dans le dernier mois, dans quelle mesure as-tu sursaute facilement ?",
    },
    {
      id: "pcl5_19",
      prompt: "Dans le dernier mois, dans quelle mesure as-tu eu du mal a te concentrer ?",
    },
    {
      id: "pcl5_20",
      prompt:
        "Dans le dernier mois, dans quelle mesure as-tu eu du mal a t'endormir ou a rester endormi(e) ?",
    },
  ],
  scale: {
    min: 0,
    max: 4,
    anchors: {
      0: "Pas du tout (0)",
      1: "Un peu (1)",
      2: "modérément (2)",
      3: "Beaucoup (3)",
      4: "Extremêment (4)",
    },
  },
  scoringRules: {
    method: "pcl5-official",
    requiredItems: 20,
    source:
      "PCL-5 (VA/NCPTSD): score total 0-80, cut-off usuel 31-33; regle DSM-5 provisoire par clusters B/C/D/E.",
  },
  thresholds,
  interpretation: interpret,
};

