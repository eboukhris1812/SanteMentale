import type {
  QuestionnaireScore,
  SpecificTestNaturalReport,
} from "@/features/assessment/engine/types";

type Band = "light" | "moderate" | "high";
type Domain =
  | "humeur"
  | "anxiete"
  | "trauma"
  | "obsessions"
  | "personnalite"
  | "alimentation"
  | "neurodev";

const TEST_TO_DOMAIN: Record<string, Domain> = {
  phq9: "humeur",
  mdq: "humeur",
  sasds: "humeur",
  gad7: "anxiete",
  pdssSr: "anxiete",
  pas: "anxiete",
  lsas: "anxiete",
  fasc: "anxiete",
  pcl5: "trauma",
  pcl5Short: "trauma",
  rada: "trauma",
  miniToc: "obsessions",
  sapas: "personnalite",
  msiBpd: "personnalite",
  pdq4A: "personnalite",
  pdq4B: "personnalite",
  pdq4C: "personnalite",
  pdq4Full: "personnalite",
  eat26: "alimentation",
  bes: "alimentation",
  asrsV11: "neurodev",
  aq10: "neurodev",
  ygtss: "neurodev",
};

const TEST_LABELS: Record<string, string> = {
  phq9: "PHQ-9",
  gad7: "GAD-7",
  pcl5: "PCL-5",
  pcl5Short: "PCL-5 court",
  miniToc: "Mini-TOC",
  pdssSr: "PDSS-SR",
  pas: "PAS",
  lsas: "LSAS",
  fasc: "FASC",
  mdq: "MDQ",
  sasds: "SASDS",
  rada: "RADA",
  sapas: "SAPAS",
  msiBpd: "MSI-BPD",
  pdq4A: "PDQ-4 groupe A",
  pdq4B: "PDQ-4 groupe B",
  pdq4C: "PDQ-4 groupe C",
  pdq4Full: "PDQ-4 complet",
  eat26: "EAT-26",
  bes: "BES",
  asrsV11: "ASRS v1.1",
  aq10: "AQ-10",
  ygtss: "YGTSS",
};

const TEST_FOCUS: Record<string, string> = {
  phq9: "baisse d'elan, fatigue, perte d'interet ou autocritique",
  gad7: "inquietudes persistantes, tension corporelle et difficulte a relacher",
  pcl5: "intrusions, evitement, hypervigilance et alterations de l'humeur",
  pcl5Short: "souvenirs intrusifs, evitement et reactivite physiologique",
  miniToc: "pensees intrusives, doutes repetitifs et rituels de neutralisation",
  pdssSr: "peur des sensations corporelles et anticipation des crises",
  pas: "anxiete anticipatoire et evitement des lieux ou situations",
  lsas: "peur du regard d'autrui et evitement social",
  fasc: "preoccupation de l'image corporelle et controle alimentaire",
  mdq: "episodes d'activation de l'humeur et fluctuations marquees",
  sasds: "baisse de rythme, perte d'initiative et pessimisme",
  rada: "inhibition relationnelle ou sociabilite desinhibee apres stress",
  sapas: "rigidite des schemas relationnels et reactivite emotionnelle",
  msiBpd: "instabilite emotionnelle, impulsivite et sensibilite relationnelle",
  pdq4A: "particularites cognitives et relationnelles du groupe A",
  pdq4B: "impulsivite, variabilite emotionnelle et conflits interpersonnels",
  pdq4C: "anxiete sociale, dependance ou inhibition",
  pdq4Full: "profils de personnalite et impact fonctionnel transversal",
  eat26: "restriction, preoccupations ponderales et controle de l'alimentation",
  bes: "perte de controle alimentaire et culpabilite",
  asrsV11: "inattention, desorganisation et impulsivite",
  aq10: "communication sociale et flexibilite cognitive",
  ygtss: "frequence/intensite des tics et retentissement fonctionnel",
};

function inferBand(score: QuestionnaireScore): Band {
  const severityRaw = String(score.interpretation.severity ?? "").toLowerCase();
  const normalized = Number.isFinite(score.normalizedScore)
    ? Math.max(0, Math.min(1, score.normalizedScore))
    : 0;

  if (
    severityRaw.includes("severe") ||
    severityRaw.includes("high") ||
    severityRaw.includes("positive")
  ) {
    return "high";
  }
  if (severityRaw.includes("moderate")) return "moderate";
  if (severityRaw.includes("mild") || severityRaw.includes("minimal")) return "light";
  if (normalized < 0.34) return "light";
  if (normalized < 0.67) return "moderate";
  return "high";
}

function normalizedPercent(score: QuestionnaireScore): number {
  return Math.round(Math.max(0, Math.min(1, score.normalizedScore)) * 100);
}

function domainLabel(domain: Domain): string {
  if (domain === "humeur") return "l'humeur";
  if (domain === "anxiete") return "l'anxiete";
  if (domain === "trauma") return "les reactions post-traumatiques";
  if (domain === "obsessions") return "les obsessions et compulsions";
  if (domain === "personnalite") return "la regulation emotionnelle et relationnelle";
  if (domain === "alimentation") return "le rapport a l'alimentation";
  return "l'attention et l'organisation";
}

function psychoeducation(domain: Domain): string {
  if (domain === "humeur") {
    return "Les variations de l'humeur refletent souvent l'interaction entre sommeil, charge cognitive, stress chronique et soutien social. Ce sont des mecanismes modulables, pas des traits figes.";
  }
  if (domain === "anxiete") {
    return "L'anxiete est un systeme d'alarme utile devenu trop sensible. L'objectif est d'abaisser la fausse alerte par des expositions progressives et des routines de regulation.";
  }
  if (domain === "trauma") {
    return "Apres un evenement marquant, le cerveau peut continuer a detecter du danger en avance. Cette memoire d'alarme peut se recalibrer avec une prise en charge adaptee.";
  }
  if (domain === "obsessions") {
    return "La verification ou la neutralisation soulage a court terme mais renforce le cycle a long terme. Diminuer progressivement les rituels restaure la tolerance a l'incertitude.";
  }
  if (domain === "alimentation") {
    return "Le rapport a l'alimentation est souvent influence par la regulation emotionnelle. Stabiliser les rythmes et reduire la culpabilite diminue generalement les episodes reactifs.";
  }
  if (domain === "personnalite") {
    return "Les traits de personnalite decrivent des styles de fonctionnement modulables, en particulier via les competences emotionnelles et relationnelles.";
  }
  return "Les profils neurodeveloppementaux reposent sur des variations du traitement de l'information. Les adaptations environnementales sont souvent plus efficaces qu'un effort de compensation permanent.";
}

function intro(testId: string, band: Band): string {
  const label = TEST_LABELS[testId] ?? testId.toUpperCase();
  if (band === "light") {
    return `Merci d'avoir complete le test ${label}. Cette auto-evaluation fournit un reperage utile de votre etat actuel, sans conclure a elle seule a un trouble clinique.`;
  }
  if (band === "moderate") {
    return `Merci d'avoir complete le test ${label} avec serieux. Vos reponses offrent une base exploitable pour cibler des ajustements concrets et suivre l'evolution dans le temps.`;
  }
  return `Merci d'avoir realise le test ${label} malgre une charge possiblement importante. Cette etape permet de prioriser les actions de soutien et de clarifier rapidement les besoins.`;
}

function emotionalSummary(testId: string, domain: Domain, band: Band, score: QuestionnaireScore): string {
  const label = domainLabel(domain);
  const interpretation = score.interpretation.label;
  const intensity = normalizedPercent(score);
  const focus = TEST_FOCUS[testId] ?? "symptomes cibles par ce questionnaire";
  if (band === "light") {
    return `Le profil est actuellement faible sur le domaine de ${label} (${interpretation}), avec une intensite estimee a ${intensity}%. Quelques signaux ponctuels peuvent apparaitre autour de ${focus}, sans retentissement majeur a ce stade.`;
  }
  if (band === "moderate") {
    return `Le test suggere une charge moderee sur ${label} (${interpretation}), avec une intensite estimee a ${intensity}%. Les manifestations les plus probables concernent ${focus}, avec un impact possible sur l'energie, la concentration ou le sommeil.`;
  }
  return `Le test met en evidence une charge elevee sur ${label} (${interpretation}), avec une intensite estimee a ${intensity}%. Le retentissement fonctionnel peut devenir notable, en particulier lorsque ${focus} occupent une part importante de la journee.`;
}

function dominantFocus(testId: string, domain: Domain, band: Band): string {
  const label = domainLabel(domain);
  const focus = TEST_FOCUS[testId] ?? "les symptomes dominants";
  const psycho = psychoeducation(domain);
  if (band === "light") {
    return `Le point principal est la prevention: maintenir des habitudes protectrices pour eviter que ${label} prenne plus de place. Une surveillance simple des situations liees a ${focus} est suffisante. ${psycho}`;
  }
  if (band === "moderate") {
    return `Le focus prioritaire concerne ${label}: identifier les situations declenchantes et installer des reponses regulieres peut reduire la charge. Un plan court avec objectifs hebdomadaires sur ${focus} est generalement efficace. ${psycho}`;
  }
  return `Le focus prioritaire concerne ${label}, avec un besoin de plan d'action structure et, idealement, d'accompagnement professionnel. Cibler en premier ${focus} permet souvent d'obtenir un gain fonctionnel rapide. ${psycho}`;
}

export function generateSpecificTestReport(
  testId: string,
  score: QuestionnaireScore
): SpecificTestNaturalReport {
  const domain = TEST_TO_DOMAIN[testId] ?? "anxiete";
  const band = inferBand(score);
  return {
    introduction: intro(testId, band),
    emotionalSummary: emotionalSummary(testId, domain, band, score),
    dominantFocus: dominantFocus(testId, domain, band),
    hasDominantCategory: band !== "light",
  };
}
