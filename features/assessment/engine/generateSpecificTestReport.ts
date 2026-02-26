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

function inferBand(score: QuestionnaireScore): Band {
  const severityRaw = String(score.interpretation.severity ?? "").toLowerCase();
  const normalized = Number.isFinite(score.normalizedScore)
    ? Math.max(0, Math.min(1, score.normalizedScore))
    : 0;

  // IB note: deterministic mapping from standard severity labels to simple readable bands.
  if (
    severityRaw.includes("sévère") ||
    severityRaw.includes("severe") ||
    severityRaw.includes("high") ||
    severityRaw.includes("positive")
  ) {
    return "high";
  }
  if (severityRaw.includes("moderate")) {
    return "moderate";
  }
  if (severityRaw.includes("mild") || severityRaw.includes("minimal")) {
    return "light";
  }

  if (normalized < 0.34) return "light";
  if (normalized < 0.67) return "moderate";
  return "high";
}

function introByBand(band: Band): string {
  if (band === "light") {
    return "Merci d’avoir répondu au test. Prendre ce temps pour toi est déjà une bonne démarche.";
  }
  if (band === "moderate") {
    return "Merci d’avoir complété ce test avec sérieux. Mettre des mots sur ce que tu ressens est important.";
  }
  return "Bravo d’avoir fait ce test avec honnêteté. Quand c’est plus intense, cette étape compte vraiment.";
}

function domainLabel(domain: Domain): string {
  if (domain === "humeur") return "l’humeur";
  if (domain === "anxiete") return "le stress et l’anxiété";
  if (domain === "trauma") return "les réactions liées à des événements difficiles";
  if (domain === "obsessions") return "les pensées qui tournent en boucle";
  if (domain === "personnalite") return "la relation à soi et aux autres";
  if (domain === "alimentation") return "le rapport à l’alimentation";
  return "l’attention et l’organisation";
}

function withDeContraction(phraseWithArticle: string): string {
  if (phraseWithArticle.startsWith("le ")) {
    return `du ${phraseWithArticle.slice(3)}`;
  }
  if (phraseWithArticle.startsWith("les ")) {
    return `des ${phraseWithArticle.slice(4)}`;
  }
  if (phraseWithArticle.startsWith("la ")) {
    return `de la ${phraseWithArticle.slice(3)}`;
  }
  // l’ / l'
  return `de ${phraseWithArticle}`;
}

function emotionalSummary(domain: Domain, band: Band): string {
  const label = domainLabel(domain);
  if (band === "light") {
    return `D’après tes réponses, ${label} semble un peu sensible en ce moment, mais avec des moments où ça reste gérable au quotidien.`;
  }
  if (band === "moderate") {
    return `D’après tes réponses, ${label} prend une place notable en ce moment. Cela peut fatiguer, réduire la concentration ou rendre certaines journées plus lourdes.`;
  }
  return `D’après tes réponses, ${label} semble très présent en ce moment. Cela peut peser sur l’école, les relations, le sommeil et l’énergie.`;
}

function dominantFocus(domain: Domain, band: Band): string {
  const label = domainLabel(domain);
  const deLabel = withDeContraction(label);
  if (band === "light") {
    return `Ce test ciblé montre surtout une vigilance autour ${deLabel}. Avec des repères simples, tu peux déjà améliorer les choses.`;
  }
  if (band === "moderate") {
    return `Ce test ciblé montre surtout que ${label} mérite une attention régulière. Tu peux agir progressivement avec de petites habitudes et du soutien.`;
  }
  return `Ce test ciblé montre surtout que ${label} est actuellement au premier plan. À ce niveau, c’est important de ne pas rester seul·e et d’en parler à un adulte de confiance.`;
}

export function generateSpecificTestReport(
  testId: string,
  score: QuestionnaireScore
): SpecificTestNaturalReport {
  // IB note: report generation is 100% deterministic and server-side only.
  const domain = TEST_TO_DOMAIN[testId] ?? "anxiete";
  const band = inferBand(score);

  return {
    introduction: introByBand(band),
    emotionalSummary: emotionalSummary(domain, band),
    dominantFocus: dominantFocus(domain, band),
  };
}
