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

const eat26Thresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 19,
    label: "dépistage négatif",
    severity: "minimal",
    clinicalMeaning: "Score EAT-26 sous le seuil de dépistage (20). Une vigilance clinique reste utile selon le contexte.",
  },
  {
    min: 20,
    max: 78,
    label: "dépistage positif EAT-26",
    severity: "positive-screen",
    clinicalMeaning: "Seuil de dépistage atteint (>=20). Une évaluation spécialisée des troubles des conduites alimentaires est recommandee.",
  },
];

export const eat26Definition: QuestionnaireDefinition = {
  id: "eat26",
  version: "2.0.0",
  title: "EAT-26 (scoring officiel)",
  items: [
    { id: "eat26_1", prompt: "Je suis tres preoccupe(e) par la nourriture." },
    { id: "eat26_2", prompt: "J'evite certains aliments parce qu'ils font grossir." },
    { id: "eat26_3", prompt: "Je me sens mal apres avoir mange." },
    { id: "eat26_4", prompt: "Je fais des regimes stricts." },
    { id: "eat26_5", prompt: "Je pense souvent a bruler les calories mangees." },
    { id: "eat26_6", prompt: "Je me sens coupable quand je mange." },
    { id: "eat26_7", prompt: "J'ai peur de prendre du poids." },
    { id: "eat26_8", prompt: "Je saute des repas pour controler mon poids." },
    { id: "eat26_9", prompt: "Je me compare souvent aux autres sur le physique." },
    { id: "eat26_10", prompt: "Je me sens en perte de controle quand je mange." },
    { id: "eat26_11", prompt: "Je me pese ou me controle tres frequemment." },
    { id: "eat26_12", prompt: "Mon humeur depend beaucoup de mon apparence physique." },
    { id: "eat26_13", prompt: "Mes habitudes alimentaires perturbent ma vie scolaire/sociale." },
    { id: "eat26_14", prompt: "Je limite fortement les portions que je mange." },
    { id: "eat26_15", prompt: "Je ressens de l'angoisse avant ou apres les repas." },
    { id: "eat26_16", prompt: "Je me sens mieux si je n'ai pas mange." },
    { id: "eat26_17", prompt: "Je m'inquiete souvent de devenir gros(se)." },
    { id: "eat26_18", prompt: "Je cache parfois mes habitudes alimentaires." },
    { id: "eat26_19", prompt: "Je me sens oblige(e) de compenser apres avoir mange." },
    { id: "eat26_20", prompt: "Je pense que ma valeur depend de mon poids." },
    { id: "eat26_21", prompt: "Je me sens mal a l'aise en mangeant avec d'autres personnes." },
    { id: "eat26_22", prompt: "Je me sens insatisfait(e) de mon corps la plupart du temps." },
    { id: "eat26_23", prompt: "Je me critique durement sur mon apparence." },
    { id: "eat26_24", prompt: "Je pense souvent a des méthodes rapides pour perdre du poids." },
    { id: "eat26_25", prompt: "Je sens que l'alimentation prend trop de place dans ma tete." },
    { id: "eat26_26", prompt: "Mon rapport a l'alimentation me fait souffrir." },
  ],
  scale: {
    min: 0,
    max: 5,
    anchors: {
      0: "Toujours",
      1: "Habituellement",
      2: "Souvent",
      3: "Parfois",
      4: "Rarement",
      5: "Jamais",
    },
  },
  scoringRules: {
    method: "eat26-official",
    requiredItems: 26,
    source: "Garner DM et al. Eating Attitudes Test (EAT-26). Scoring officiel: seuil >=20, item 26 cote a l'inverse.",
  },
  thresholds: eat26Thresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, eat26Thresholds, "eat26"),
};

const besThresholds: readonly Threshold[] = [
  {
    min: 0,
    max: 17,
    label: "Risque hyperphagie faible",
    severity: "minimal",
    clinicalMeaning: "Peu d'indicateurs d'hyperphagie boulimique selon BES.",
  },
  {
    min: 18,
    max: 26,
    label: "Risque hyperphagie modéré",
    severity: "moderate",
    clinicalMeaning: "Signaux cliniques intermédiaires; évaluation clinique recommandee.",
  },
  {
    min: 27,
    max: 46,
    label: "Risque hyperphagie élevé",
    severity: "positive-screen",
    clinicalMeaning: "Profil compatible avec une hyperphagie cliniquement significative; évaluation spécialisée recommandee.",
  },
];

export const besDefinition: QuestionnaireDefinition = {
  id: "bes",
  version: "2.0.0",
  title: "BES (scoring officiel)",
  items: [
    {
      id: "bes_1",
      prompt: "Quand je commence a manger, la quantite que je prends...",
      choices: {
        0: "Reste proche de portions habituelles.",
        1: "Depasse parfois ce que j'avais prevu.",
        2: "Est souvent excessive.",
        3: "Devient tres importante et difficile a limiter.",
      },
    },
    {
      id: "bes_2",
      prompt: "Pendant ces episodes, mon impression de controle est...",
      choices: {
        0: "Je garde globalement le controle.",
        1: "Le controle baisse parfois.",
        2: "Je me sens souvent depasse(e).",
        3: "Je me sens totalement hors de controle.",
      },
    },
    {
      id: "bes_3",
      prompt: "La vitesse a laquelle je mange pendant ces moments est...",
      choices: {
        0: "Normale.",
        1: "Un peu plus rapide.",
        2: "Clairement rapide.",
        3: "Tres rapide, presque automatique.",
      },
    },
    {
      id: "bes_4",
      prompt: "Je mange alors que je n'ai pas vraiment faim...",
      choices: {
        0: "Rarement.",
        1: "Parfois.",
        2: "Souvent.",
        3: "Presque toujours lors des episodes.",
      },
    },
    {
      id: "bes_5",
      prompt: "La fréquence de ces episodes est...",
      choices: {
        0: "Occasionnelle.",
        1: "Reguliere mais limitee.",
        2: "Frequente.",
        3: "Tres frequente.",
      },
    },
    {
      id: "bes_6",
      prompt: "Apres avoir mange, le malaise emotionnel est...",
      maxOption: 2,
      choices: {
        0: "Faible ou absent.",
        1: "Present mais gerable.",
        2: "Fort et envahissant.",
      },
    },
    {
      id: "bes_7",
      prompt: "La culpabilite apres avoir mange est...",
      choices: {
        0: "Minime.",
        1: "Parfois presente.",
        2: "Souvent presente.",
        3: "Intense et repetitive.",
      },
    },
    {
      id: "bes_8",
      prompt: "Je continue de manger malgre l'inconfort physique...",
      choices: {
        0: "Rarement.",
        1: "Parfois.",
        2: "Souvent.",
        3: "Tres souvent.",
      },
    },
    {
      id: "bes_9",
      prompt: "Je cache ou dissimule mes episodes alimentaires...",
      choices: {
        0: "Non ou tres rarement.",
        1: "Parfois.",
        2: "Souvent.",
        3: "Presque systematiquement.",
      },
    },
    {
      id: "bes_10",
      prompt: "Mes pensees sur la nourriture occupent mon esprit...",
      choices: {
        0: "Peu.",
        1: "Par moments.",
        2: "Souvent.",
        3: "Quasiment en continu.",
      },
    },
    {
      id: "bes_11",
      prompt: "Arreter un episode une fois commence est...",
      choices: {
        0: "Plutot facile.",
        1: "Parfois difficile.",
        2: "Souvent difficile.",
        3: "Tres difficile, voire impossible.",
      },
    },
    {
      id: "bes_12",
      prompt: "La honte ou détresse liee a l'alimentation est...",
      choices: {
        0: "Faible.",
        1: "modérée.",
        2: "Importante.",
        3: "Tres importante.",
      },
    },
    {
      id: "bes_13",
      prompt: "L'impression de compulsion a manger est...",
      choices: {
        0: "Rare.",
        1: "Parfois presente.",
        2: "Souvent presente.",
        3: "Tres forte et recurrente.",
      },
    },
    {
      id: "bes_14",
      prompt: "L'impact sur ma vie sociale/scolaire/pro est...",
      choices: {
        0: "Faible.",
        1: "modéré.",
        2: "Net.",
        3: "Majeur.",
      },
    },
    {
      id: "bes_15",
      prompt: "Mes tentatives de controle alimentaire finissent...",
      choices: {
        0: "Le plus souvent bien.",
        1: "Parfois par une perte de controle.",
        2: "Souvent par une perte de controle.",
        3: "Presque toujours par une perte de controle.",
      },
    },
    {
      id: "bes_16",
      prompt: "Globalement, ma souffrance liee a ces comportements est...",
      maxOption: 2,
      choices: {
        0: "Limitee.",
        1: "Significative.",
        2: "Tres importante.",
      },
    },
  ],
  scale: {
    min: 0,
    max: 3,
    anchors: {
      0: "Niveau 0 - absent ou tres leger",
      1: "Niveau 1 - leger",
      2: "Niveau 2 - modéré",
      3: "Niveau 3 - marque",
    },
  },
  scoringRules: {
    method: "bes-official",
    requiredItems: 16,
    source: "Gormally J et al. Binge Eating Scale (BES). Scoring officiel: somme ponderee des 16 items, plage 0-46; seuils usuels <=17, 18-26, >=27. Formulation des items adaptee pour usage éducatif.",
  },
  thresholds: besThresholds,
  interpretation: (totalScore) => interpretFromThresholds(totalScore, besThresholds, "bes"),
};



