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

const binaryScale = {
  min: 0,
  max: 1,
  anchors: {
    0: "Non (0)",
    1: "Oui (1)",
  },
} as const;

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

const mdqThresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 6,
    label: "Signal maniaque faible",
    severity: "minimal",
    clinicalMeaning: "Critere symptomatique MDQ non atteint (< 7 symptomes).",
  },
  {
    min: 7,
    max: 13,
    label: "Seuil symptomatique MDQ atteint",
    severity: "moderate",
    clinicalMeaning:
      "Le critere A du MDQ est atteint (>= 7 symptomes). Le dépistage officiel exige aussi la simultanéité (item 14) et un retentissement modéré/sérieux (item 15).",
  },
];

export const mdqDefinition: QuestionnaireDefinition = {
  id: "mdq",
  version: "2.0.0",
  title: "MDQ (Mood Disorder Questionnaire, version officielle)",
  items: [
    {
      id: "mdq_1",
      prompt:
        "As-tu deja eu une periode ou tu te sentais tellement bien/excite(e) que les autres ont pense que ce n'etait pas habituel, ou que cela t'a cause des problèmes ?",
      choices: { 0: "Non (0)", 1: "Oui (1)" },
      maxOption: 1,
    },
    {
      id: "mdq_2",
      prompt:
        "As-tu deja ete irritable au point de crier, de provoquer des disputes ou des bagarres ?",
      choices: { 0: "Non (0)", 1: "Oui (1)" },
      maxOption: 1,
    },
    { id: "mdq_3", prompt: "As-tu deja eu beaucoup plus confiance en toi que d'habitude ?", choices: { 0: "Non (0)", 1: "Oui (1)" }, maxOption: 1 },
    { id: "mdq_4", prompt: "As-tu deja dormi beaucoup moins sans te sentir fatigue(e) ?", choices: { 0: "Non (0)", 1: "Oui (1)" }, maxOption: 1 },
    { id: "mdq_5", prompt: "As-tu deja parle plus vite ou beaucoup plus que d'habitude ?", choices: { 0: "Non (0)", 1: "Oui (1)" }, maxOption: 1 },
    { id: "mdq_6", prompt: "As-tu deja eu les pensees qui allaient tres vite, difficiles a ralentir ?", choices: { 0: "Non (0)", 1: "Oui (1)" }, maxOption: 1 },
    {
      id: "mdq_7",
      prompt:
        "As-tu deja ete facilement distrait(e) par ce qui se passait autour de toi ?",
      choices: { 0: "Non (0)", 1: "Oui (1)" },
      maxOption: 1,
    },
    { id: "mdq_8", prompt: "As-tu deja eu beaucoup plus d'energie que d'habitude ?", choices: { 0: "Non (0)", 1: "Oui (1)" }, maxOption: 1 },
    { id: "mdq_9", prompt: "As-tu deja ete beaucoup plus actif(ve) ou fait beaucoup plus de choses que d'habitude ?", choices: { 0: "Non (0)", 1: "Oui (1)" }, maxOption: 1 },
    {
      id: "mdq_10",
      prompt:
        "As-tu deja ete beaucoup plus sociable/extraverti(e) que d'habitude (ex: appeler la nuit) ?",
      choices: { 0: "Non (0)", 1: "Oui (1)" },
      maxOption: 1,
    },
    { id: "mdq_11", prompt: "As-tu deja ete beaucoup plus interesse(e) par le sexe que d'habitude ?", choices: { 0: "Non (0)", 1: "Oui (1)" }, maxOption: 1 },
    {
      id: "mdq_12",
      prompt:
        "As-tu deja fait des choses inhabituelles pour toi, excessives, bizarres ou risquees ?",
      choices: { 0: "Non (0)", 1: "Oui (1)" },
      maxOption: 1,
    },
    {
      id: "mdq_13",
      prompt:
        "As-tu deja depense beaucoup d'argent au point de causer des problèmes a toi ou ta famille ?",
      choices: { 0: "Non (0)", 1: "Oui (1)" },
      maxOption: 1,
    },
    {
      id: "mdq_14",
      prompt:
        "Si tu as repondu OUI a plusieurs points, est-ce que plusieurs de ces symptomes sont survenus pendant la même periode ?",
      choices: { 0: "Non (0)", 1: "Oui (1)" },
      maxOption: 1,
    },
    {
      id: "mdq_15",
      prompt:
        "A quel point ces comportements/impressions t'ont-ils cause des problèmes (travail/études, famille, argent, conflits) ?",
      choices: {
        0: "Aucun problème (0)",
        1: "problème mineur (1)",
        2: "problème modéré (2)",
        3: "problème sérieux (3)",
      },
      maxOption: 3,
    },
  ],
  scale: {
    min: 0,
    max: 3,
    anchors: {
      0: "Non / Aucun problème (0)",
      1: "Oui / problème mineur (1)",
      2: "problème modéré (2)",
      3: "problème sérieux (3)",
    },
  },
  scoringRules: {
    method: "mdq-official",
    requiredItems: 15,
    source:
      "Hirschfeld RMA et al. Am J Psychiatry. 2000;157(11):1873-1875. Seuil officiel: >=7 symptomes (items 1-13) + item 14=Oui + item 15=retentissement modéré/sérieux.",
  },
  thresholds: mdqThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, mdqThresholds, "mdq"),
};
const sasdsThresholds: readonly Threshold[] = [
  {
    min: 19,
    max: 39,
    label: "Stress aigu faible",
    severity: "minimal",
    clinicalMeaning: "Symptomes post-traumatiques aigus limites sur l'echelle de dépistage.",
  },
  {
    min: 40,
    max: 55,
    label: "Stress aigu modéré",
    severity: "moderate",
    clinicalMeaning: "Reactions de stress aigu presentes; surveillance clinique recommandee.",
  },
  {
    min: 56,
    max: 95,
    label: "dépistage positif stress aigu probable",
    severity: "positive-screen",
    clinicalMeaning:
      "Score au-dessus du cut-off de dépistage usuel de l'ASDS; évaluation clinique rapide recommandee.",
  },
];

export const sasdsDefinition: QuestionnaireDefinition = {
  id: "sasds",
  version: "1.1.0",
  title: "SASDS/ASDS (dépistage stress aigu, 19 items)",
  items: [
    {
      id: "sasds_1",
      prompt:
        "Au cours des 7 derniers jours, t'es-tu senti(e) engourdi(e) ou detache(e) de tes emotions ?",
    },
    {
      id: "sasds_2",
      prompt:
        "Au cours des 7 derniers jours, as-tu eu l'impression d'etre dans un etat de brouillard ou de confusion ?",
    },
    {
      id: "sasds_3",
      prompt:
        "Au cours des 7 derniers jours, les choses autour de toi t'ont-elles semble irreelles ou comme dans un reve ?",
    },
    {
      id: "sasds_4",
      prompt:
        "Au cours des 7 derniers jours, t'es-tu senti(e) comme separe(e) de toi-même ou observateur(trice) de toi depuis l'exterieur ?",
    },
    {
      id: "sasds_5",
      prompt:
        "Au cours des 7 derniers jours, as-tu eu du mal a te rappeler des parties importantes de ce qui s'est passe ?",
    },
    {
      id: "sasds_6",
      prompt:
        "Au cours des 7 derniers jours, des souvenirs de l'evenement te sont-ils revenus de facon repetitive et intrusive ?",
    },
    { id: "sasds_7", prompt: "Au cours des 7 derniers jours, as-tu fait des cauchemars lies a l'evenement ?" },
    {
      id: "sasds_8",
      prompt: "Au cours des 7 derniers jours, t'est-il arrive d'avoir l'impression de revivre l'evenement ?",
    },
    {
      id: "sasds_9",
      prompt:
        "Au cours des 7 derniers jours, t'es-tu senti(e) tres bouleverse(e) quand quelque chose te rappelait l'evenement ?",
    },
    { id: "sasds_10", prompt: "Au cours des 7 derniers jours, as-tu essaye d'éviter d'y penser ?" },
    { id: "sasds_11", prompt: "Au cours des 7 derniers jours, as-tu essaye d'éviter d'en parler ?" },
    {
      id: "sasds_12",
      prompt:
        "Au cours des 7 derniers jours, as-tu evite des personnes, lieux ou situations qui te rappellent l'evenement ?",
    },
    {
      id: "sasds_13",
      prompt:
        "Au cours des 7 derniers jours, as-tu essaye de ne pas ressentir de détresse en lien avec l'evenement ?",
    },
    {
      id: "sasds_14",
      prompt:
        "Au cours des 7 derniers jours, as-tu eu des difficultés de sommeil (endormissement, reveils, sommeil non réparateur) ?",
    },
    {
      id: "sasds_15",
      prompt: "Au cours des 7 derniers jours, t'es-tu senti(e) plus irritable que d'habitude ?",
    },
    { id: "sasds_16", prompt: "Au cours des 7 derniers jours, as-tu eu des difficultés a te concentrer ?" },
    {
      id: "sasds_17",
      prompt: "Au cours des 7 derniers jours, t'es-tu senti(e) en hypervigilance ou davantage sur tes gardes ?",
    },
    { id: "sasds_18", prompt: "Au cours des 7 derniers jours, as-tu sursaute facilement ?" },
    {
      id: "sasds_19",
      prompt:
        "Au cours des 7 derniers jours, as-tu eu des reactions physiques fortes en y pensant (tremblements, transpiration, coeur qui bat vite) ?",
    },
  ],
  scale: {
    min: 1,
    max: 5,
    anchors: {
      1: "Pas du tout (1)",
      2: "Legerement (2)",
      3: "modérément (3)",
      4: "Beaucoup (4)",
      5: "Extremêment (5)",
    },
  },
  scoringRules: {
    method: "sum",
    requiredItems: 19,
    source:
      "Bryant RA et al. Acute Stress Disorder Scale (ASDS), Psychological Assessment, 2000; SASRQ psychometrics: Cardena E et al., Journal of Traumatic Stress, 2000.",
  },
  thresholds: sasdsThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, sasdsThresholds, "sasds"),
};
const radaThresholds: readonly Threshold[] = [
  {
    min: 17,
    max: 39,
    label: "Signal attachement faible",
    severity: "minimal",
    clinicalMeaning: "Peu d'indicateurs cliniques au dépistage RADA parent-report.",
  },
  {
    min: 40,
    max: 50,
    label: "dépistage intermédiaire (a approfondir)",
    severity: "moderate",
    clinicalMeaning:
      "Zone recommandee pour évaluation complementaire (histoire developmentale, observations, multi-informants).",
  },
  {
    min: 51,
    max: 85,
    label: "dépistage positif RAD probable",
    severity: "positive-screen",
    clinicalMeaning:
      "Score élevé au dépistage RADA; évaluation spécialisée de l'attachement recommandee.",
  },
];

export const radaDefinition: QuestionnaireDefinition = {
  id: "rada",
  version: "1.2.0",
  title: "RADA (Reactive Attachment Disorder Assessment, parent-report)",
  items: [
    { id: "rada_1", prompt: "L'enfant a des difficultés a initier des interactions sociales appropriees a son age." },
    { id: "rada_2", prompt: "L'enfant repond mal aux interactions sociales des autres." },
    { id: "rada_3", prompt: "L'enfant est excessivement inhibe dans les situations sociales." },
    { id: "rada_4", prompt: "L'enfant est hypervigilant dans les situations sociales." },
    { id: "rada_5", prompt: "L'enfant semble ambivalent vis-a-vis des interactions sociales." },
    { id: "rada_6", prompt: "L'enfant commence parfois une interaction puis se retire rapidement." },
    { id: "rada_7", prompt: "L'enfant reste souvent a l'ecart en observant les interactions." },
    { id: "rada_8", prompt: "L'enfant est souvent difficile a consoler." },
    { id: "rada_9", prompt: "L'enfant est tres familier avec des inconnus au-dela de ce qui est habituel." },
    { id: "rada_10", prompt: "L'enfant forme des attachements trop rapidement." },
    { id: "rada_11", prompt: "On a l'impression que l'enfant differencie peu la figure parentale des autres adultes." },
    { id: "rada_12", prompt: "L'enfant a du mal a comprendre quand ses actions blessent autrui." },
    { id: "rada_13", prompt: "L'enfant appelle parfois des quasi-inconnus \"maman\" ou \"papa\"." },
    { id: "rada_14", prompt: "L'enfant semble surtout exprimer la colere et la joie." },
    { id: "rada_15", prompt: "L'enfant parait rarement triste." },
    { id: "rada_16", prompt: "Quand il/elle est repris(e), l'enfant semble plus gêné d'etre attrape que par son acte." },
    { id: "rada_17", prompt: "L'enfant semble avoir une réponse de peur atypique dans des situations a risque." },
  ],
  scale: {
    min: 1,
    max: 5,
    anchors: {
      1: "Presque complètement faux (1)",
      2: "Plutot faux (2)",
      3: "Neutre (3)",
      4: "Plutot vrai (4)",
      5: "Presque complètement vrai (5)",
    },
  },
  scoringRules: {
    method: "rada-dsm5-split",
    requiredItems: 17,
    source:
      "Hall C. Behavioral Development Bulletin (2009), screening base DSM-IV. Outil de dépistage uniquement; en DSM-5, RAD et DSED sont distincts et necessitent évaluation clinique multi-source.",
  },
  thresholds: radaThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, radaThresholds, "rada"),
};


