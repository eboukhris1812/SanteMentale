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

const dsmFreq04Scale = {
  min: 0,
  max: 4,
  anchors: {
    0: "Jamais (0)",
    1: "Occasionnellement (1)",
    2: "La moitié du temps (2)",
    3: "La plupart du temps (3)",
    4: "Tout le temps (4)",
  },
} as const;

const lsasScale = {
  min: 0,
  max: 3,
  anchors: {
    0: "Aucune / Jamais (0)",
    1: "Légère / Rarement (1)",
    2: "Modérée / Souvent (2)",
    3: "Sévère / Habituellement (3)",
  },
} as const;

const fascScale = {
  min: 1,
  max: 5,
  anchors: {
    1: "Pas du tout (1)",
    2: "Un peu (2)",
    3: "Assez (3)",
    4: "Beaucoup (4)",
    5: "Énormément (5)",
  },
} as const;

const pdssSrThresholds: readonly Threshold[] = [
  { min: 0, max: 7, label: "Panique minimale", severity: "minimal", clinicalMeaning: "Symptômes faibles ou absents." },
  { min: 8, max: 15, label: "Panique légère", severity: "mild", clinicalMeaning: "Symptômes légers." },
  { min: 16, max: 23, label: "Panique modérée", severity: "moderate", clinicalMeaning: "Retentissement clinique notable." },
  { min: 24, max: 31, label: "Panique sévère", severity: "sévère", clinicalMeaning: "Retentissement important." },
  { min: 32, max: 40, label: "Panique extrême", severity: "positive-screen", clinicalMeaning: "Sévérité très élevée, évaluation spécialisée recommandée." },
];

export const pdssSrDefinition: QuestionnaireDefinition = {
  id: "pdssSr",
  version: "2.0.0",
  title: "Severity Measure for Panic Disorder (DSM-5, 10 items)",
  items: [
    { id: "pdss_1", prompt: "Au cours des 7 derniers jours, as-tu ressenti des attaques de panique soudaines ?" },
    { id: "pdss_2", prompt: "Au cours des 7 derniers jours, as-tu eu peur d'avoir une autre attaque de panique ?" },
    { id: "pdss_3", prompt: "Au cours des 7 derniers jours, les attaques de panique t'ont-elles causé de la détresse ?" },
    { id: "pdss_4", prompt: "Au cours des 7 derniers jours, as-tu évité des situations par peur d'une attaque ?" },
    { id: "pdss_5", prompt: "Au cours des 7 derniers jours, les symptômes physiques de panique t'ont-ils inquiété(e) ?" },
    { id: "pdss_6", prompt: "Au cours des 7 derniers jours, as-tu eu des difficultés à fonctionner à cause de la panique ?" },
    { id: "pdss_7", prompt: "Au cours des 7 derniers jours, as-tu eu des limitations dans tes activités sociales ?" },
    { id: "pdss_8", prompt: "Au cours des 7 derniers jours, as-tu eu des limitations dans tes activités scolaires/professionnelles ?" },
    { id: "pdss_9", prompt: "Au cours des 7 derniers jours, as-tu eu besoin d'être rassuré(e) fréquemment à cause de la panique ?" },
    { id: "pdss_10", prompt: "Au cours des 7 derniers jours, la panique a-t-elle perturbé ton quotidien global ?" },
  ],
  scale: dsmFreq04Scale,
  scoringRules: {
    method: "pdss-sr-official",
    requiredItems: 10,
    source:
      "DSM-5 Severity Measure for Panic Disorder (Adult), APA 2013. Raw score 0-40; average score 0-4.",
  },
  thresholds: pdssSrThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, pdssSrThresholds, "pdssSr"),
};

const pasThresholds: readonly Threshold[] = [
  { min: 0, max: 7, label: "Agoraphobie minimale", severity: "minimal", clinicalMeaning: "Symptômes faibles ou absents." },
  { min: 8, max: 15, label: "Agoraphobie légère", severity: "mild", clinicalMeaning: "Symptômes légers." },
  { min: 16, max: 23, label: "Agoraphobie modérée", severity: "moderate", clinicalMeaning: "Retentissement clinique notable." },
  { min: 24, max: 31, label: "Agoraphobie sévère", severity: "sévère", clinicalMeaning: "Retentissement important." },
  { min: 32, max: 40, label: "Agoraphobie extrême", severity: "positive-screen", clinicalMeaning: "Sévérité très élevée, évaluation spécialisée recommandée." },
];

export const pasDefinition: QuestionnaireDefinition = {
  id: "pas",
  version: "2.0.0",
  title: "Severity Measure for Agoraphobia (DSM-5, 10 items)",
  items: [
    { id: "pas_1", prompt: "Au cours des 7 derniers jours, as-tu eu peur dans les foules ou files d'attente ?" },
    { id: "pas_2", prompt: "Au cours des 7 derniers jours, as-tu eu peur dans les lieux publics ouverts ?" },
    { id: "pas_3", prompt: "Au cours des 7 derniers jours, as-tu eu peur dans les lieux fermés (cinéma, magasin, etc.) ?" },
    { id: "pas_4", prompt: "Au cours des 7 derniers jours, as-tu eu peur dans les transports publics ?" },
    { id: "pas_5", prompt: "Au cours des 7 derniers jours, as-tu eu peur d'être seul(e) hors de chez toi ?" },
    { id: "pas_6", prompt: "Au cours des 7 derniers jours, as-tu évité ces situations par anxiété ?" },
    { id: "pas_7", prompt: "Au cours des 7 derniers jours, as-tu eu besoin d'être accompagné(e) pour sortir ?" },
    { id: "pas_8", prompt: "Au cours des 7 derniers jours, as-tu limité tes activités à cause de cette peur ?" },
    { id: "pas_9", prompt: "Au cours des 7 derniers jours, ces peurs ont-elles gêné ton fonctionnement social/scolaire/pro ?" },
    { id: "pas_10", prompt: "Au cours des 7 derniers jours, l'agoraphobie a-t-elle perturbé ton quotidien global ?" },
  ],
  scale: dsmFreq04Scale,
  scoringRules: {
    method: "agoraphobia-severity-10",
    requiredItems: 10,
    source:
      "DSM-5 Severity Measure for Agoraphobia (Adult), APA 2013. Raw score 0-40; average score 0-4.",
  },
  thresholds: pasThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, pasThresholds, "pas"),
};

const lsasThresholds: readonly Threshold[] = [
  { min: 0, max: 29, label: "Anxiété sociale très faible", severity: "minimal", clinicalMeaning: "Absence ou anxiété sociale très légère." },
  { min: 30, max: 49, label: "Anxiété sociale légère", severity: "mild", clinicalMeaning: "Anxiété sociale légère." },
  { min: 50, max: 59, label: "Anxiété sociale modérée", severity: "moderate", clinicalMeaning: "Anxiété sociale modérée." },
  { min: 60, max: 79, label: "Anxiété sociale marquée", severity: "sévère", clinicalMeaning: "Trouble anxieux social probable (seuil fréquent >=60)." },
  { min: 80, max: 144, label: "Anxiété sociale sévère", severity: "positive-screen", clinicalMeaning: "Forme sévère et invalidante." },
];

const lsasSituations = [
  "Téléphoner en public",
  "Participer à un petit groupe",
  "Manger dans un lieu public",
  "Boire dans un lieu public",
  "Parler à des personnes en autorité",
  "Agir, jouer, ou faire un exposé devant un public",
  "Aller à une fête",
  "Travailler sous le regard d'autres personnes",
  "Écrire sous observation",
  "Appeler quelqu'un que tu connais peu",
  "Parler avec des personnes que tu connais peu",
  "Rencontrer des inconnus",
  "Utiliser des toilettes publiques",
  "Entrer dans une pièce où les autres sont déjà assis",
  "Être au centre de l'attention",
  "Prendre la parole en réunion",
  "Passer une évaluation de compétences",
  "Exprimer un désaccord à quelqu'un que tu connais peu",
  "Regarder dans les yeux une personne que tu connais peu",
  "Faire un rapport oral à un groupe",
  "Aborder une personne qui t'attire",
  "Retourner un article dans un magasin",
  "Organiser une fête",
  "Résister à un vendeur insistant",
] as const;

const lsasFearItems = lsasSituations.map((situation, index) => ({
  id: `lsas_f_${index + 1}`,
  prompt: `Peur/Anxiété - ${situation}`,
}));

const lsasAvoidanceItems = lsasSituations.map((situation, index) => ({
  id: `lsas_a_${index + 1}`,
  prompt: `Évitement - ${situation}`,
}));

export const lsasDefinition: QuestionnaireDefinition = {
  id: "lsas",
  version: "2.0.0",
  title: "LSAS-SR (Liebowitz Social Anxiety Scale, 24 situations)",
  items: [...lsasFearItems, ...lsasAvoidanceItems],
  scale: lsasScale,
  scoringRules: {
    method: "lsas-sr-official",
    requiredItems: 48,
    source:
      "Liebowitz Social Anxiety Scale - Self Report (LSAS-SR): 24 situations, fear + avoidance ratings, total 0-144.",
  },
  thresholds: lsasThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, lsasThresholds, "lsas"),
};

const fascThresholds: readonly Threshold[] = [
  { min: 52, max: 99, label: "Peurs très faibles", severity: "minimal", clinicalMeaning: "Anxiété phobique non significative." },
  { min: 100, max: 159, label: "Peurs légères à modérées", severity: "mild", clinicalMeaning: "Certaines peurs spécifiques présentes." },
  { min: 160, max: 209, label: "Peurs marquées", severity: "moderate", clinicalMeaning: "Phobies multiples probables." },
  { min: 210, max: 260, label: "Peurs sévères généralisées", severity: "positive-screen", clinicalMeaning: "Retentissement fonctionnel potentiellement majeur." },
];

const fascPrompts = [
  "Plaies ouvertes", "Être seul(e)", "Être dans un endroit inconnu", "Les morts", "Parler en public", "Traverser la rue", "Tomber", "Être taquiné(e)", "L'échec", "Entrer dans une pièce où les autres sont déjà assis", "Les hauteurs sur terre", "Les personnes avec des difformités", "Les vers", "Recevoir une injection", "Les inconnus", "Les chauves-souris", "Voyager en train", "Voyager en bus", "Voyager en voiture", "Les figures d'autorité", "Les insectes volants", "Voir quelqu'un recevoir une injection", "Les foules", "Les grands espaces ouverts", "Voir une personne intimider une autre", "Les personnes qui paraissent menaçantes", "Être observé(e) pendant un travail", "La saleté", "Les insectes rampants", "Voir des bagarres", "Les personnes jugées laides", "Les personnes malades", "Être critiqué(e)", "Les formes étranges", "Être dans un ascenseur", "Voir une opération chirurgicale", "Les souris", "Le sang humain", "Le sang animal", "Les espaces clos", "Être rejeté(e) par les autres", "Les avions", "Les odeurs médicales", "Se sentir désapprouvé(e)", "Les serpents non dangereux", "Les cimetières", "Être ignoré(e)", "Hommes nus", "Femmes nues", "Les médecins", "Faire des erreurs", "Avoir l'air ridicule",
] as const;

export const fascDefinition: QuestionnaireDefinition = {
  id: "fasc",
  version: "2.0.0",
  title: "FASC/FSCS Fear Survey (52 items)",
  items: fascPrompts.map((prompt, index) => ({
    id: `fasc_${index + 1}`,
    prompt: `J'ai peur de: ${prompt}`,
  })),
  scale: fascScale,
  scoringRules: {
    method: "sum",
    requiredItems: 52,
    source:
      "Fear Survey schedule type child/adolescent (52 items, scale 1-5). Interpretation by profile and severity bands.",
  },
  thresholds: fascThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, fascThresholds, "fasc"),
};
