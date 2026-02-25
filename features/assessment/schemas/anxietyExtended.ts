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

const pdssSrThresholds: readonly Threshold[] = [
  { min: 0, max: 7, label: "Panique faible", severity: "minimal", clinicalMeaning: "Symptômes panique peu marqués." },
  { min: 8, max: 15, label: "Panique modérée", severity: "moderate", clinicalMeaning: "Retentissement notable; évaluation clinique utile." },
  { min: 16, max: 28, label: "Panique élevée", severity: "severe", clinicalMeaning: "Retentissement important; suivi spécialisé recommandé." },
];

export const pdssSrDefinition: QuestionnaireDefinition = {
  id: "pdssSr",
  version: "1.0.0",
  title: "PDSS-SR (version éducative)",
  items: [
    { id: "pdss_1", prompt: "Ces 7 derniers jours, à quel point as-tu eu des attaques de panique imprévues ?" },
    { id: "pdss_2", prompt: "Ces 7 derniers jours, à quel point as-tu craint d'avoir une nouvelle attaque ?" },
    { id: "pdss_3", prompt: "Ces 7 derniers jours, à quel point les attaques t'ont-elles causé de la détresse ?" },
    { id: "pdss_4", prompt: "Ces 7 derniers jours, à quel point as-tu évité des situations par peur d'une attaque ?" },
    { id: "pdss_5", prompt: "Ces 7 derniers jours, à quel point les symptômes physiques t'ont-ils inquiété(e) ?" },
    { id: "pdss_6", prompt: "Ces 7 derniers jours, à quel point cela a gêné ta vie scolaire/sociale ?" },
    { id: "pdss_7", prompt: "Ces 7 derniers jours, à quel point cela a perturbé ton quotidien ?" },
  ],
  scale: freq04Scale,
  scoringRules: {
    method: "sum",
    requiredItems: 7,
    source: "Shear MK et al. Am J Psychiatry. 1997; adaptation auto-questionnaire PDSS-SR.",
  },
  thresholds: pdssSrThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, pdssSrThresholds, "pdssSr"),
};

const pasThresholds: readonly Threshold[] = [
  { min: 0, max: 11, label: "Agoraphobie faible", severity: "minimal", clinicalMeaning: "Évitement agoraphobique faible." },
  { min: 12, max: 23, label: "Agoraphobie modérée", severity: "moderate", clinicalMeaning: "Évitement significatif; accompagnement recommandé." },
  { min: 24, max: 40, label: "Agoraphobie élevée", severity: "severe", clinicalMeaning: "Retentissement fort; évaluation spécialisée recommandée." },
];

export const pasDefinition: QuestionnaireDefinition = {
  id: "pas",
  version: "1.0.0",
  title: "PAS (version éducative courte)",
  items: [
    { id: "pas_1", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur dans les transports en commun ?" },
    { id: "pas_2", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur dans les lieux bondés ?" },
    { id: "pas_3", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur de sortir seul(e) de chez toi ?" },
    { id: "pas_4", prompt: "Ces 7 derniers jours, à quel point as-tu évité des lieux par peur de ne pas pouvoir t'échapper ?" },
    { id: "pas_5", prompt: "Ces 7 derniers jours, à quel point as-tu eu besoin d'être accompagné(e) pour te sentir en sécurité ?" },
    { id: "pas_6", prompt: "Ces 7 derniers jours, à quel point as-tu ressenti une panique soudaine dans ces situations ?" },
    { id: "pas_7", prompt: "Ces 7 derniers jours, à quel point cela a limité tes activités ?" },
    { id: "pas_8", prompt: "Ces 7 derniers jours, à quel point cela a réduit ton autonomie ?" },
  ],
  scale: freq04Scale,
  scoringRules: {
    method: "sum",
    requiredItems: 8,
    source: "Bandelow B. Panic and Agoraphobia Scale; adaptation éducative courte.",
  },
  thresholds: pasThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, pasThresholds, "pas"),
};

const lsasThresholds: readonly Threshold[] = [
  { min: 0, max: 11, label: "Anxiété sociale faible", severity: "minimal", clinicalMeaning: "Anxiété sociale sous-seuil." },
  { min: 12, max: 23, label: "Anxiété sociale modérée", severity: "moderate", clinicalMeaning: "Gêne sociale notable." },
  { min: 24, max: 36, label: "Anxiété sociale élevée", severity: "severe", clinicalMeaning: "Évitement social important; évaluation spécialisée utile." },
];

export const lsasDefinition: QuestionnaireDefinition = {
  id: "lsas",
  version: "1.0.0",
  title: "LSAS (version éducative courte)",
  items: [
    { id: "lsas_1", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur de parler devant la classe ?" },
    { id: "lsas_2", prompt: "Ces 7 derniers jours, à quel point as-tu évité de prendre la parole en public ?" },
    { id: "lsas_3", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur de rencontrer de nouvelles personnes ?" },
    { id: "lsas_4", prompt: "Ces 7 derniers jours, à quel point as-tu évité les échanges avec des inconnus ?" },
    { id: "lsas_5", prompt: "Ces 7 derniers jours, à quel point as-tu craint d'être observé(e) pendant une activité ?" },
    { id: "lsas_6", prompt: "Ces 7 derniers jours, à quel point as-tu évité les activités sociales (pause, cantine, sorties) ?" },
    { id: "lsas_7", prompt: "Ces 7 derniers jours, à quel point as-tu craint d'être jugé(e) négativement ?" },
    { id: "lsas_8", prompt: "Ces 7 derniers jours, à quel point cette peur a-t-elle limité tes relations ?" },
    { id: "lsas_9", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur de rougir, trembler ou bégayer devant les autres ?" },
    { id: "lsas_10", prompt: "Ces 7 derniers jours, à quel point as-tu évité les présentations orales ?" },
    { id: "lsas_11", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur d'être au centre de l'attention ?" },
    { id: "lsas_12", prompt: "Ces 7 derniers jours, à quel point as-tu évité les situations où tu pouvais être évalué(e) ?" },
  ],
  scale: {
    min: 0,
    max: 3,
    anchors: {
      0: "Jamais (0)",
      1: "Rarement (1)",
      2: "Souvent (2)",
      3: "Très souvent (3)",
    },
  },
  scoringRules: {
    method: "sum",
    requiredItems: 12,
    source: "Liebowitz MR. LSAS; adaptation éducative courte orientée adolescents.",
  },
  thresholds: lsasThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, lsasThresholds, "lsas"),
};

const fascThresholds: readonly Threshold[] = [
  { min: 0, max: 10, label: "Phobie spécifique faible", severity: "minimal", clinicalMeaning: "Peurs spécifiques peu invalidantes." },
  { min: 11, max: 25, label: "Phobie spécifique modérée", severity: "moderate", clinicalMeaning: "Peur significative dans plusieurs contextes." },
  { min: 26, max: 40, label: "Phobie spécifique élevée", severity: "severe", clinicalMeaning: "Peur intense et évitement marqués." },
];

export const fascDefinition: QuestionnaireDefinition = {
  id: "fasc",
  version: "1.0.0",
  title: "FASC/Fear Survey (version éducative)",
  items: [
    { id: "fasc_1", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur des animaux/insectes ?" },
    { id: "fasc_2", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur des hauteurs ?" },
    { id: "fasc_3", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur du sang, des blessures ou des injections ?" },
    { id: "fasc_4", prompt: "Ces 7 derniers jours, à quel point as-tu eu peur des orages ou bruits intenses ?" },
    { id: "fasc_5", prompt: "Ces 7 derniers jours, à quel point as-tu évité ce qui te fait peur ?" },
    { id: "fasc_6", prompt: "Ces 7 derniers jours, à quel point cette peur t'a empêché(e) de faire des activités normales ?" },
    { id: "fasc_7", prompt: "Ces 7 derniers jours, à quel point ton corps a réagi (palpitations, tremblements) face à la peur ?" },
    { id: "fasc_8", prompt: "Ces 7 derniers jours, à quel point as-tu pensé souvent à cette peur ?" },
    { id: "fasc_9", prompt: "Ces 7 derniers jours, à quel point as-tu eu besoin d'aide pour affronter ces situations ?" },
    { id: "fasc_10", prompt: "Ces 7 derniers jours, à quel point cette peur a perturbé ton quotidien ?" },
  ],
  scale: freq04Scale,
  scoringRules: {
    method: "sum",
    requiredItems: 10,
    source: "Fear Survey Schedule; adaptation éducative multi-phobies.",
  },
  thresholds: fascThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, fascThresholds, "fasc"),
};
