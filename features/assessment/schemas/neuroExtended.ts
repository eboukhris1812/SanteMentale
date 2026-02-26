import {
  type InterpretationResult,
  type QuestionnaireDefinition,
  type Threshold,
} from "@/features/assessment/engine/types";

function interpretFromThresholds(
  totalScore: number,
  thresholds: readonly Threshold[],
  questionnaireId: string
): InterpretationResult {
  const match = thresholds.find((threshold) => totalScore >= threshold.min && totalScore <= threshold.max);
  if (!match) {
    throw new Error(`Score ${questionnaireId} hors plage: ${totalScore}`);
  }
  return {
    label: match.label,
    severity: match.severity,
    clinicalMeaning: match.clinicalMeaning,
  };
}

const freq04Scale = {
  min: 0,
  max: 4,
  anchors: {
    0: "Pas du tout (0)",
    1: "Un peu (1)",
    2: "Assez souvent (2)",
    3: "Très souvent (3)",
    4: "Tout le temps (4)",
  },
} as const;

const asrsThresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 72,
    label: "Score ASRS-18",
    severity: "moderate",
    clinicalMeaning: "Plus le score est élevé, plus les symptomes TDAH sont frequents; pas de cutoff universel, dépistage non diagnostique.",
  },
];

export const asrsV11Definition: QuestionnaireDefinition = {
  id: "asrsV11",
  version: "1.0.0",
  title: "ASRS v1.1 (18 items)",
  items: [
    { id: "asrs_1", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous eu du mal a finaliser les details d'un projet une fois les parties difficiles terminees ?" },
    { id: "asrs_2", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous eu des difficultés a organiser des taches demandant de l'organisation ?" },
    { id: "asrs_3", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous eu des problèmes pour vous souvenir de rendez-vous ou d'obligations ?" },
    { id: "asrs_4", prompt: "Ces 6 derniers mois, lorsqu'une tache demande beaucoup de reflexion, a quelle fréquence l'avez-vous evitee ou retardee ?" },
    { id: "asrs_5", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous remue les mains ou les pieds quand vous deviez rester assis(e) longtemps ?" },
    { id: "asrs_6", prompt: "Ces 6 derniers mois, a quelle fréquence vous etes-vous senti(e) hyperactif(ve), comme pousse(e) par un moteur ?" },
    { id: "asrs_7", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous fait des erreurs d'inattention quand un travail etait ennuyeux ou difficile ?" },
    { id: "asrs_8", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous eu du mal a maintenir votre attention pendant un travail repetitif ?" },
    { id: "asrs_9", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous eu du mal a vous concentrer sur ce que les gens vous disent directement ?" },
    { id: "asrs_10", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous egare des objets ou eu du mal a les retrouver a la maison ou au travail ?" },
    { id: "asrs_11", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous ete distrait(e) par les bruits ou l'activite autour de vous ?" },
    { id: "asrs_12", prompt: "Ces 6 derniers mois, a quelle fréquence vous etes-vous leve(e) de votre place dans des situations ou vous etiez cense(e) rester assis(e) ?" },
    { id: "asrs_13", prompt: "Ces 6 derniers mois, a quelle fréquence vous etes-vous senti(e) agite(e) ou remuant(e) ?" },
    { id: "asrs_14", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous eu du mal a vous detendre quand vous aviez du temps pour vous ?" },
    { id: "asrs_15", prompt: "Ces 6 derniers mois, a quelle fréquence vous etes-vous surpris(e) a trop parler en situation sociale ?" },
    { id: "asrs_16", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous termine les phrases des autres avant qu'ils aient fini de parler ?" },
    { id: "asrs_17", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous eu du mal a attendre votre tour dans les situations qui le demandent ?" },
    { id: "asrs_18", prompt: "Ces 6 derniers mois, a quelle fréquence avez-vous pris des decisions rapides sans reflechir aux conséquences ?" },
  ],
  scale: {
    min: 0,
    max: 4,
    anchors: {
      0: "Jamais (0)",
      1: "Rarement (1)",
      2: "Parfois (2)",
      3: "Souvent (3)",
      4: "Tres souvent (4)",
    },
  },
  scoringRules: {
    method: "sum",
    requiredItems: 18,
    source: "Adult ADHD Self-Report Scale (ASRS) v1.1, version complète 18 items.",
  },
  thresholds: asrsThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, asrsThresholds, "asrsV11"),
};

const aq10Thresholds: readonly Threshold[] = [
  { min: 0, max: 5, label: "Peu ou pas de traits autistiques significatifs", severity: "minimal", clinicalMeaning: "Seuil clinique non atteint au dépistage AQ-10." },
  { min: 6, max: 10, label: "Seuil clinique AQ-10 atteint", severity: "positive-screen", clinicalMeaning: "dépistage positif; évaluation clinique approfondie recommandee." },
];

export const aq10Definition: QuestionnaireDefinition = {
  id: "aq10",
  version: "1.0.0",
  title: "AQ-10",
  items: [
    { id: "aq10_1", prompt: "Je remarque souvent de petits sons que les autres ne remarquent pas." },
    { id: "aq10_2", prompt: "Je me concentre habituellement davantage sur l'ensemble que sur les petits details." },
    { id: "aq10_3", prompt: "Je trouve facile de faire plus d'une chose a la fois." },
    { id: "aq10_4", prompt: "S'il y a une interruption, je peux revenir rapidement a ce que je faisais." },
    { id: "aq10_5", prompt: "Je trouve facile de lire entre les lignes quand quelqu'un me parle." },
    { id: "aq10_6", prompt: "Je sais repèrer quand la personne qui m'ecoute commence a s'ennuyer." },
    { id: "aq10_7", prompt: "Quand je lis une histoire, j'ai du mal a comprendre les intentions des personnages." },
    { id: "aq10_8", prompt: "J'aime collectionner des informations sur des categories precises de choses." },
    { id: "aq10_9", prompt: "Je trouve facile de comprendre ce que quelqu'un pense ou ressent en regardant son visage." },
    { id: "aq10_10", prompt: "Je trouve difficile de comprendre les intentions des autres." },
  ],
  scale: {
    min: 0,
    max: 3,
    anchors: {
      0: "Tout a fait d'accord",
      1: "Plutot d'accord",
      2: "Plutot pas d'accord",
      3: "Pas du tout d'accord",
    },
  },
  scoringRules: {
    method: "aq10-keyed-binary",
    requiredItems: 10,
    source: "Allison C, Auyeung B, Baron-Cohen S (2012), AQ-10; NICE CG142.",
  },
  thresholds: aq10Thresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, aq10Thresholds, "aq10"),
};

const ygtssThresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 100,
    label: "Score YGTSS global",
    severity: "moderate",
    clinicalMeaning: "Score global YGTSS (severite des tics 0-50 + retentissement 0-50). Plus le score est élevé, plus la charge clinique est importante. Pas de cutoff universel.",
  },
];

export const ygtssDefinition: QuestionnaireDefinition = {
  id: "ygtss",
  version: "1.2.0",
  title: "YGTSS (global severity)",
  items: [
    { id: "ygtss_1", prompt: "Ces 7 derniers jours, quel etait le nombre de tics moteurs differents observes ?" },
    { id: "ygtss_2", prompt: "Ces 7 derniers jours, a quelle fréquence les tics moteurs sont-ils apparus ?" },
    { id: "ygtss_3", prompt: "Ces 7 derniers jours, quelle etait l'intensite moyenne des tics moteurs ?" },
    { id: "ygtss_4", prompt: "Ces 7 derniers jours, quel etait le niveau de complexite des tics moteurs ?" },
    { id: "ygtss_5", prompt: "Ces 7 derniers jours, a quel point les tics moteurs ont-ils interfere avec les activites ?" },
    { id: "ygtss_6", prompt: "Ces 7 derniers jours, quel etait le nombre de tics vocaux differents observes ?" },
    { id: "ygtss_7", prompt: "Ces 7 derniers jours, a quelle fréquence les tics vocaux sont-ils apparus ?" },
    { id: "ygtss_8", prompt: "Ces 7 derniers jours, quelle etait l'intensite moyenne des tics vocaux ?" },
    { id: "ygtss_9", prompt: "Ces 7 derniers jours, quel etait le niveau de complexite des tics vocaux ?" },
    { id: "ygtss_10", prompt: "Ces 7 derniers jours, a quel point les tics vocaux ont-ils interfere avec les activites ?" },
    { id: "ygtss_11", prompt: "Ces 7 derniers jours, quel a ete le retentissement global des tics sur l'ecole, la vie sociale et la vie familiale ?" },
  ],
  scale: {
    min: 0,
    max: 5,
    anchors: {
      0: "0 - Aucun (impairment: 0)",
      1: "1 - Tres leger (impairment: 10)",
      2: "2 - Leger (impairment: 20)",
      3: "3 - modéré (impairment: 30)",
      4: "4 - Marque (impairment: 40)",
      5: "5 - sévère (impairment: 50)",
    },
  },
  scoringRules: {
    method: "ygtss-global",
    requiredItems: 11,
    source: "Leckman JF et al. J Am Acad Child Adolesc Psychiatry. 1989;28(4):566-573; Storch EA et al. Neurology. 2019;92(15):e1711-e1724. Modele: Total Tic Severity Score (0-50) + Impairment (0-50) = Global Severity (0-100).",
  },
  thresholds: ygtssThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, ygtssThresholds, "ygtss"),
};




