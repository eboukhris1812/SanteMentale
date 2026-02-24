export type TestStatus = "implemented" | "adapted" | "planned" | "undefined";

export type TroubleTest = {
  slug: string;
  code: string;
  name: string;
  status: TestStatus;
  notes?: string;
};

export type Trouble = {
  slug: string;
  name: string;
  categorySlug: string;
  summary: string;
  signs: string[];
  orientation: string[];
  test?: TroubleTest;
};

export type TroubleCategory = {
  slug: string;
  name: string;
  description: string;
};

export const troubleCategories: TroubleCategory[] = [
  {
    slug: "troubles-anxieux",
    name: "Troubles anxieux",
    description: "Manifestations d'anxiété persistante et invalidante au quotidien.",
  },
  {
    slug: "troubles-humeur",
    name: "Troubles de l'humeur",
    description: "Variations pathologiques de l'humeur: dépression et bipolarité.",
  },
  {
    slug: "troubles-traumatisme-stress",
    name: "Troubles liés à un traumatisme ou à un stress",
    description: "Troubles apparaissant après exposition à un événement stressant ou traumatique.",
  },
  {
    slug: "troubles-personnalite",
    name: "Troubles de la personnalité",
    description: "Modes durables de fonctionnement émotionnel et relationnel inadaptés.",
  },
  {
    slug: "troubles-conduites-alimentaires",
    name: "Troubles des conduites alimentaires",
    description: "Troubles liés aux comportements alimentaires et à l'image corporelle.",
  },
  {
    slug: "troubles-neurodeveloppementaux",
    name: "Troubles neurodéveloppementaux",
    description: "Troubles du développement affectant attention, communication et comportement.",
  },
];

export const troubles: Trouble[] = [
  {
    slug: "trouble-anxieux-generalise",
    name: "Trouble anxieux généralisé",
    categorySlug: "troubles-anxieux",
    summary: "Anxiété excessive, persistante et difficile à contrôler dans plusieurs domaines de la vie.",
    signs: [
      "Inquiétudes quasi quotidiennes",
      "Tension physique, fatigue, irritabilité",
      "Difficulté de concentration",
    ],
    orientation: [
      "Psychoéducation sur l'anxiété",
      "Repérage des facteurs déclencheurs",
      "Orientation vers un professionnel si retentissement marqué",
    ],
    test: { slug: "gad7", code: "GAD-7", name: "Generalized Anxiety Disorder-7", status: "implemented" },
  },
  {
    slug: "toc",
    name: "Trouble obsessionnel-compulsif (TOC)",
    categorySlug: "troubles-anxieux",
    summary: "Présence d'obsessions et/ou de compulsions envahissantes avec retentissement fonctionnel.",
    signs: [
      "Pensées intrusives répétées",
      "Rituels de vérification/lavage/comptage",
      "Détresse importante si les rituels sont empêchés",
    ],
    orientation: [
      "Psychoéducation TOC",
      "Repérage des compulsions et évitements",
      "Orientation vers thérapies spécialisées (exposition avec prévention de la réponse)",
    ],
    test: { slug: "mini-toc", code: "Mini-TOC", name: "Dépistage court de symptômes TOC", status: "implemented" },
  },
  {
    slug: "trouble-panique",
    name: "Trouble panique",
    categorySlug: "troubles-anxieux",
    summary: "Attaques de panique récurrentes avec peur anticipatoire de nouvelles crises.",
    signs: ["Crises soudaines de peur intense", "Palpitations, dyspnée, vertiges", "Évitement de situations par peur"],
    orientation: ["Explication du cycle panique", "Techniques respiratoires", "Évaluation clinique spécialisée"],
    test: { slug: "pdss-sr", code: "PDSS-SR", name: "Panic Disorder Severity Scale", status: "planned" },
  },
  {
    slug: "agoraphobie",
    name: "Agoraphobie",
    categorySlug: "troubles-anxieux",
    summary: "Peur marquée des lieux ou situations où s'échapper serait difficile.",
    signs: ["Évitement des transports/espaces publics", "Dépendance à l'accompagnement", "Détresse anticipatoire"],
    orientation: ["Travail progressif d'exposition", "Réduction de l'évitement", "Accompagnement thérapeutique"],
    test: { slug: "pas", code: "PAS", name: "Panic and Agoraphobia Scale", status: "planned" },
  },
  {
    slug: "phobie-sociale",
    name: "Phobie sociale",
    categorySlug: "troubles-anxieux",
    summary: "Peur persistante d'être jugé négativement en situation sociale.",
    signs: ["Évitement de prises de parole", "Crainte du regard des autres", "Retrait social progressif"],
    orientation: ["Restructuration des pensées sociales", "Expositions graduées", "Soutien psychologique"],
    test: { slug: "lsas", code: "LSAS", name: "Liebowitz Social Anxiety Scale", status: "planned" },
  },
  {
    slug: "phobies-specifiques",
    name: "Phobies spécifiques",
    categorySlug: "troubles-anxieux",
    summary: "Peur intense et disproportionnée d'un objet ou d'une situation précise.",
    signs: ["Réaction de panique au stimulus phobique", "Évitement systématique", "Retentissement scolaire/social"],
    orientation: ["Identification du stimulus", "Exposition progressive encadrée", "Orientation spécialisée si handicap"],
    test: {
      slug: "fasc",
      code: "FASC",
      name: "Fear Survey Schedule (ou questionnaire personnalisé)",
      status: "planned",
    },
  },

  {
    slug: "depression-majeure",
    name: "Trouble dépressif caractérisé (dépression majeure)",
    categorySlug: "troubles-humeur",
    summary: "Humeur dépressive durable et perte d'intérêt avec altération du fonctionnement.",
    signs: ["Tristesse persistante", "Perte d'élan", "Troubles sommeil/appétit", "Auto-dévalorisation"],
    orientation: ["Évaluation de la sévérité", "Repérage du risque suicidaire", "Orientation clinique rapide si nécessaire"],
    test: { slug: "phq9", code: "PHQ-9", name: "Patient Health Questionnaire-9", status: "implemented" },
  },
  {
    slug: "bipolaire-type-1",
    name: "Trouble bipolaire de type I",
    categorySlug: "troubles-humeur",
    summary: "Alternance d'épisodes maniaques (ou mixtes) et dépressifs.",
    signs: ["Périodes d'euphorie/irritabilité marquées", "Réduction du besoin de sommeil", "Conduites à risque"],
    orientation: ["Repérage des épisodes thymiques", "Évaluation psychiatrique spécialisée", "Suivi longitudinal"],
    test: { slug: "mdq", code: "MDQ", name: "Mood Disorder Questionnaire", status: "planned", notes: "Utilisé aussi pour type II et cyclothymique." },
  },
  {
    slug: "bipolaire-type-2",
    name: "Trouble bipolaire de type II",
    categorySlug: "troubles-humeur",
    summary: "Association d'épisodes dépressifs et d'épisodes hypomaniaques.",
    signs: ["Fluctuations marquées d'énergie", "Périodes d'activation inhabituelle", "Retentissement fonctionnel"],
    orientation: ["Anamnèse des phases d'humeur", "Différenciation avec dépression unipolaire", "Orientation spécialisée"],
    test: { slug: "mdq", code: "MDQ", name: "Mood Disorder Questionnaire", status: "planned" },
  },
  {
    slug: "trouble-cyclothymique",
    name: "Trouble cyclothymique",
    categorySlug: "troubles-humeur",
    summary: "Instabilité chronique de l'humeur avec symptômes hypomaniaques et dépressifs sous-seuil.",
    signs: ["Oscillations thymiques fréquentes", "Variabilité émotionnelle durable", "Impact relationnel"],
    orientation: ["Suivi de l'évolution dans le temps", "Hygiène de vie et rythmes", "Évaluation spécialisée"],
    test: { slug: "mdq", code: "MDQ", name: "Mood Disorder Questionnaire", status: "planned" },
  },

  {
    slug: "tspt",
    name: "Trouble de stress post-traumatique (TSPT)",
    categorySlug: "troubles-traumatisme-stress",
    summary: "Réexpériences, évitement et hyperactivation après un événement traumatique.",
    signs: ["Flashbacks ou cauchemars", "Évitement des rappels", "Hypervigilance"],
    orientation: ["Sécurisation immédiate", "Évaluation spécialisée trauma", "Soutien psychothérapeutique"],
    test: {
      slug: "pcl5-court",
      code: "PCL-5",
      name: "PTSD Checklist for DSM-5",
      status: "adapted",
      notes: "Version courte actuellement implémentée: PCL-5 court.",
    },
  },
  {
    slug: "stress-aigu",
    name: "Trouble de stress aigu",
    categorySlug: "troubles-traumatisme-stress",
    summary: "Symptômes post-traumatiques précoces dans le mois suivant l'événement.",
    signs: ["Intrusions", "Anesthésie émotionnelle", "Hyperréactivité"],
    orientation: ["Surveillance rapprochée", "Intervention précoce", "Réévaluation à distance"],
    test: { slug: "sasds", code: "SASDS", name: "Stanford Acute Stress Reaction Questionnaire (SASDS)", status: "planned" },
  },
  {
    slug: "attachement-reactionnel",
    name: "Trouble réactionnel de l'attachement",
    categorySlug: "troubles-traumatisme-stress",
    summary: "Difficultés relationnelles majeures liées à des expériences précoces de négligence/carence.",
    signs: ["Retrait social", "Faible recherche de réconfort", "Réactivité émotionnelle atypique"],
    orientation: ["Évaluation développementale", "Approche pluridisciplinaire", "Travail avec les figures d'attachement"],
    test: { slug: "rada", code: "RADA", name: "Reactive Attachment Disorder Assessment", status: "planned" },
  },

  {
    slug: "personnalite-paranoiaque",
    name: "Personnalité paranoïaque (Groupe A)",
    categorySlug: "troubles-personnalite",
    summary: "Méfiance envahissante et interprétation hostile des intentions d'autrui.",
    signs: ["Soupçons persistants", "Hypervigilance interpersonnelle", "Rigidité relationnelle"],
    orientation: ["Évaluation clinique spécialisée", "Alliance thérapeutique prudente", "Travail sur les cognitions"],
    test: { slug: "pdq4-groupe-a", code: "PDQ-4+", name: "Section Groupe A", status: "planned" },
  },
  {
    slug: "personnalite-antisociale",
    name: "Personnalité antisociale (Groupe B)",
    categorySlug: "troubles-personnalite",
    summary: "Transgression répétée des normes et faible prise en compte d'autrui.",
    signs: ["Impulsivité", "Comportements à risque", "Manque de remords"],
    orientation: ["Évaluation spécialisée", "Cadre thérapeutique structuré", "Travail sur la régulation comportementale"],
    test: { slug: "test-a-definir-groupe-b", code: "À définir", name: "Outil spécifique non encore défini", status: "undefined" },
  },
  {
    slug: "personnalite-borderline",
    name: "Personnalité borderline (limite) (Groupe B)",
    categorySlug: "troubles-personnalite",
    summary: "Instabilité émotionnelle, relationnelle et identitaire importante.",
    signs: ["Variations émotionnelles intenses", "Peur de l'abandon", "Impulsivité"],
    orientation: ["Repérage du risque auto-agressif", "Approches validées (ex: TCD)", "Suivi spécialisé"],
    test: { slug: "test-a-definir-groupe-b", code: "À définir", name: "Outil spécifique non encore défini", status: "undefined" },
  },
  {
    slug: "personnalite-evitante",
    name: "Personnalité évitante (Groupe C)",
    categorySlug: "troubles-personnalite",
    summary: "Inhibition sociale marquée et hypersensibilité au jugement négatif.",
    signs: ["Évitement relationnel", "Sentiment d'infériorité", "Peur de la critique"],
    orientation: ["Exposition sociale progressive", "Travail cognitif", "Soutien psychothérapeutique"],
    test: { slug: "test-a-definir-groupe-c", code: "À définir", name: "Outil spécifique non encore défini", status: "undefined" },
  },
  {
    slug: "personnalite-dependante",
    name: "Personnalité dépendante (Groupe C)",
    categorySlug: "troubles-personnalite",
    summary: "Besoin excessif d'être pris en charge, avec difficulté d'autonomie décisionnelle.",
    signs: ["Recherche constante de réassurance", "Difficulté à décider seul", "Crainte de séparation"],
    orientation: ["Renforcement de l'autonomie", "Travail assertif", "Accompagnement spécialisé"],
    test: { slug: "test-a-definir-groupe-c", code: "À définir", name: "Outil spécifique non encore défini", status: "undefined" },
  },

  {
    slug: "anorexie-mentale",
    name: "Anorexie mentale",
    categorySlug: "troubles-conduites-alimentaires",
    summary: "Restriction alimentaire persistante et peur intense de prendre du poids.",
    signs: ["Perte de poids", "Contrôle alimentaire strict", "Distorsion de l'image corporelle"],
    orientation: ["Évaluation somatique et psychique", "Prise en charge pluridisciplinaire", "Suivi nutritionnel"],
    test: { slug: "eat26", code: "EAT-26", name: "Eating Attitudes Test-26", status: "planned", notes: "Aussi utilisé pour la boulimie." },
  },
  {
    slug: "boulimie",
    name: "Boulimie",
    categorySlug: "troubles-conduites-alimentaires",
    summary: "Épisodes d'hyperphagie avec comportements compensatoires répétés.",
    signs: ["Crises alimentaires", "Vomissements/compensations", "Honte post-crise"],
    orientation: ["Repérage de la fréquence des crises", "Approche TCC spécialisée", "Suivi nutritionnel et médical"],
    test: { slug: "eat26", code: "EAT-26", name: "Eating Attitudes Test-26", status: "planned" },
  },
  {
    slug: "hyperphagie-boulimique",
    name: "Hyperphagie boulimique",
    categorySlug: "troubles-conduites-alimentaires",
    summary: "Crises alimentaires récurrentes sans comportements compensatoires réguliers.",
    signs: ["Manger rapidement en grande quantité", "Perte de contrôle", "Détresse associée"],
    orientation: ["Évaluation des déclencheurs émotionnels", "Intervention psycho-nutritionnelle", "Suivi spécialisé"],
    test: { slug: "bes", code: "BES", name: "Binge Eating Scale", status: "planned" },
  },

  {
    slug: "tdah",
    name: "Trouble déficit de l'attention avec ou sans hyperactivité (TDAH)",
    categorySlug: "troubles-neurodeveloppementaux",
    summary: "Difficultés d'attention et/ou hyperactivité-impulsivité persistantes.",
    signs: ["Inattention", "Agitation motrice", "Impulsivité"],
    orientation: ["Évaluation neurodéveloppementale", "Adaptations scolaires", "Approche multimodale"],
    test: { slug: "asrs-v11", code: "ASRS v1.1", name: "Adult ADHD Self-Report Scale v1.1 (adaptation prudente)", status: "planned" },
  },
  {
    slug: "tsa",
    name: "Trouble du spectre de l'autisme (TSA)",
    categorySlug: "troubles-neurodeveloppementaux",
    summary: "Particularités durables de la communication sociale et des comportements restreints/répétitifs.",
    signs: ["Difficultés sociales", "Intérêts restreints", "Rigidités comportementales"],
    orientation: ["Bilan spécialisé TSA", "Soutien psychoéducatif", "Adaptations de l'environnement"],
    test: { slug: "aq10", code: "AQ-10", name: "Autism Spectrum Quotient-10", status: "planned" },
  },
  {
    slug: "gilles-tourette",
    name: "Syndrome de Gilles de la Tourette",
    categorySlug: "troubles-neurodeveloppementaux",
    summary: "Présence de tics moteurs et vocaux évoluant dans le temps.",
    signs: ["Tics moteurs", "Tics vocaux", "Variabilité selon stress/fatigue"],
    orientation: ["Évaluation neurologique/psychiatrique", "Psychoéducation", "Prise en charge adaptée"],
    test: { slug: "ygtss", code: "YGTSS", name: "Yale Global Tic Severity Scale", status: "planned" },
  },
];

export function getCategoryBySlug(slug: string): TroubleCategory | undefined {
  return troubleCategories.find((c) => c.slug === slug);
}

export function getTroubleBySlug(slug: string): Trouble | undefined {
  return troubles.find((t) => t.slug === slug);
}

export function getTroublesByCategorySlug(categorySlug: string): Trouble[] {
  return troubles.filter((t) => t.categorySlug === categorySlug);
}

export function getTroubleByTestSlug(testSlug: string): Trouble | undefined {
  return troubles.find((t) => t.test?.slug === testSlug);
}
