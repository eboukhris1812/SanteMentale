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

const pdq4Scale = {
  min: 0,
  max: 1,
  anchors: {
    0: "Faux",
    1: "Vrai",
  },
} as const;

const binaryScale = {
  min: 0,
  max: 1,
  anchors: {
    0: "Non",
    1: "Oui",
  },
} as const;

const sapasThresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 2,
    label: "Tri negatif SAPAS",
    severity: "minimal",
    clinicalMeaning: "Peu d'indices de trouble de la personnalite au tri ultra-court.",
  },
  {
    min: 3,
    max: 8,
    label: "Tri positif SAPAS",
    severity: "positive-screen",
    clinicalMeaning:
      "Seuil SAPAS atteint (>=3). Un dépistage complementaire (PDQ-4+ complet et/ou outil cible) puis une évaluation clinique sont recommandes.",
  },
];

const msiBpdThresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 6,
    label: "Tri BPD negatif",
    severity: "minimal",
    clinicalMeaning: "Peu d'indices de traits borderline au screening MSI-BPD.",
  },
  {
    min: 7,
    max: 10,
    label: "Tri BPD positif",
    severity: "positive-screen",
    clinicalMeaning:
      "Seuil MSI-BPD atteint (>=7). Une évaluation clinique structuree est recommandee.",
  },
];

// These sections are focused subsets derived from the full PDQ-4+ logic.
// Official PDQ-4+ uses 99 true/false items plus clinical significance follow-up.
const pdq4SectionThresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 8,
    label: "Score section PDQ-4+",
    severity: "moderate",
    clinicalMeaning:
      "Nombre d'items endorses (Vrai) dans cette section. Outil de repérage uniquement; la version complete PDQ-4+ et un entretien clinique restent necessaires.",
  },
];

export const pdq4GroupeADefinition: QuestionnaireDefinition = {
  id: "pdq4A",
  version: "2.0.0",
  title: "PDQ-4+ Section A (traits paranoides/schizoides/schizotypiques)",
  items: [
    { id: "pdq4a_1", prompt: "Depuis plusieurs annees, je me mefie souvent des intentions des autres." },
    { id: "pdq4a_2", prompt: "Depuis plusieurs annees, j'ai souvent l'impression que les autres veulent me nuire." },
    { id: "pdq4a_3", prompt: "Depuis plusieurs annees, j'ai du mal a me confier par peur que cela se retourne contre moi." },
    { id: "pdq4a_4", prompt: "Depuis plusieurs annees, j'interprete des remarques neutres comme des attaques." },
    { id: "pdq4a_5", prompt: "Depuis plusieurs annees, je garde de la rancune longtemps." },
    { id: "pdq4a_6", prompt: "Depuis plusieurs annees, j'ai des idees ou croyances que les autres trouvent etranges." },
    { id: "pdq4a_7", prompt: "Depuis plusieurs annees, les relations proches m'interessent peu." },
    { id: "pdq4a_8", prompt: "Depuis plusieurs annees, les autres me decrivent comme distant(e) ou froid(e)." },
  ],
  scale: pdq4Scale,
  scoringRules: {
    method: "sum",
    requiredItems: 8,
    source:
      "Hyler SE, PDQ-4+ (99 items vrai/faux, outil de dépistage). Cette section est une adaptation de repérage cluster A pour usage educatif.",
  },
  thresholds: pdq4SectionThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, pdq4SectionThresholds, "pdq4A"),
};

export const sapasDefinition: QuestionnaireDefinition = {
  id: "sapas",
  version: "1.0.0",
  title: "SAPAS (Standardized Assessment of Personality - Abbreviated Scale)",
  items: [
    { id: "sapas_1", prompt: "Diriez-vous que vous avez normalement des difficulté a vous faire et garder des amis proches ?" },
    { id: "sapas_2", prompt: "Diriez-vous que vous etes habituellement une personne solitaire ?" },
    { id: "sapas_3", prompt: "Diriez-vous que vous accordez generalement plus d'importance a l'avis des autres qu'au votre ?" },
    { id: "sapas_4", prompt: "Perdez-vous habituellement votre sang-froid facilement ?" },
    { id: "sapas_5", prompt: "Etes-vous normalement impulsif(ve) ?" },
    { id: "sapas_6", prompt: "Diriez-vous que vous etes en general une personne inquiet(e) ?" },
    { id: "sapas_7", prompt: "Dependez-vous habituellement beaucoup des autres ?" },
    { id: "sapas_8", prompt: "Etes-vous en general perfectionniste ?" },
  ],
  scale: binaryScale,
  scoringRules: {
    method: "sum",
    requiredItems: 8,
    source:
      "Moran P et al. SAPAS (8 items, screening des troubles de personnalite). Seuil usuel >=3.",
  },
  thresholds: sapasThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, sapasThresholds, "sapas"),
};

export const msiBpdDefinition: QuestionnaireDefinition = {
  id: "msiBpd",
  version: "1.0.0",
  title: "MSI-BPD (McLean Screening Instrument for BPD)",
  items: [
    { id: "msi_1", prompt: "Avez-vous de grosses peurs d'etre abandonne(e) ?" },
    { id: "msi_2", prompt: "Vos relations sont-elles souvent tres instables (idealisation puis devalorisation) ?" },
    { id: "msi_3", prompt: "Avez-vous une image de vous qui change fortement selon les moments ?" },
    { id: "msi_4", prompt: "Avez-vous des comportements impulsifs qui vous causent des problèmes ?" },
    { id: "msi_5", prompt: "Avez-vous fait des gestes auto-dommageables ou des tentatives de suicide ?" },
    { id: "msi_6", prompt: "Avez-vous de fortes variations d'humeur en quelques heures ?" },
    { id: "msi_7", prompt: "Ressentez-vous souvent un vide interieur persistant ?" },
    { id: "msi_8", prompt: "Vous mettez-vous facilement dans une colere intense ou difficile a controler ?" },
    { id: "msi_9", prompt: "Sous stress, avez-vous des episodes de mefiance intense ou de detachement de la realite ?" },
    { id: "msi_10", prompt: "Ces difficultés ont-elles ete presentes sur une longue periode, pas seulement en crise passagere ?" },
  ],
  scale: binaryScale,
  scoringRules: {
    method: "sum",
    requiredItems: 10,
    source:
      "Zanarini MC et al. MSI-BPD (10 items). Seuil de dépistage couramment utilise >=7.",
  },
  thresholds: msiBpdThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, msiBpdThresholds, "msiBpd"),
};

export const pdq4GroupeBDefinition: QuestionnaireDefinition = {
  id: "pdq4B",
  version: "2.0.0",
  title: "PDQ-4+ Section B (traits borderline/antisociaux/histrioniques/narcissiques)",
  items: [
    { id: "pdq4b_1", prompt: "Depuis plusieurs annees, j'ai des reactions emotionnelles tres intenses et rapides." },
    { id: "pdq4b_2", prompt: "Depuis plusieurs annees, j'ai souvent peur d'etre rejete(e) ou abandonne(e)." },
    { id: "pdq4b_3", prompt: "Depuis plusieurs annees, mes relations deviennent facilement instables ou conflictuelles." },
    { id: "pdq4b_4", prompt: "Depuis plusieurs annees, j'ai des comportements impulsifs que je regrette ensuite." },
    { id: "pdq4b_5", prompt: "Depuis plusieurs annees, j'agis parfois sans penser aux consequences pour les autres." },
    { id: "pdq4b_6", prompt: "Depuis plusieurs annees, j'ai besoin d'etre au centre de l'attention pour me sentir bien." },
    { id: "pdq4b_7", prompt: "Depuis plusieurs annees, l'image que j'ai de moi change beaucoup selon les moments." },
    { id: "pdq4b_8", prompt: "Depuis plusieurs annees, j'ai du mal a garder des limites stables dans mes relations." },
  ],
  scale: pdq4Scale,
  scoringRules: {
    method: "sum",
    requiredItems: 8,
    source:
      "Hyler SE, PDQ-4+ (99 items vrai/faux, outil de dépistage). Cette section est une adaptation de repérage cluster B pour usage educatif.",
  },
  thresholds: pdq4SectionThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, pdq4SectionThresholds, "pdq4B"),
};

export const pdq4GroupeCDefinition: QuestionnaireDefinition = {
  id: "pdq4C",
  version: "2.0.0",
  title: "PDQ-4+ Section C (traits evitants/dependants/obsessionnels)",
  items: [
    { id: "pdq4c_1", prompt: "Depuis plusieurs annees, j'evite des situations sociales par peur d'etre critique(e)." },
    { id: "pdq4c_2", prompt: "Depuis plusieurs annees, j'ai besoin d'etre rassure(e) avant de prendre des decisions." },
    { id: "pdq4c_3", prompt: "Depuis plusieurs annees, j'ai du mal a faire les choses seul(e) par peur d'echouer." },
    { id: "pdq4c_4", prompt: "Depuis plusieurs annees, j'ai peur d'etre desapprouve(e) dans mes relations." },
    { id: "pdq4c_5", prompt: "Depuis plusieurs annees, j'ai tendance a me voir moins capable que les autres." },
    { id: "pdq4c_6", prompt: "Depuis plusieurs annees, j'ai du mal a exprimer mon desaccord par peur de perdre le lien." },
    { id: "pdq4c_7", prompt: "Depuis plusieurs annees, j'ai du mal a commencer des projets sans soutien fort." },
    { id: "pdq4c_8", prompt: "Depuis plusieurs annees, j'ai du mal a supporter l'idee d'etre seul(e) longtemps." },
  ],
  scale: pdq4Scale,
  scoringRules: {
    method: "sum",
    requiredItems: 8,
    source:
      "Hyler SE, PDQ-4+ (99 items vrai/faux, outil de dépistage). Cette section est une adaptation de repérage cluster C pour usage educatif.",
  },
  thresholds: pdq4SectionThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, pdq4SectionThresholds, "pdq4C"),
};
