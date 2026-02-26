import type { DominantCategory, ReportSeverityLevel } from "@/features/assessment/engine/types";

type RecommendationPack = {
  selfHelp: string[];
  talk: string;
  pro: string;
};

const RECOMMENDATION_BANK: Record<DominantCategory, RecommendationPack> = {
  depression: {
    selfHelp: [
      "Garde un rythme simple: heure de coucher stable, lumière du matin et une petite activité chaque jour.",
      "Choisis une micro-action par jour (10 minutes max): douche, marche, rangement, message à un proche.",
    ],
    talk: "Partage ton ressenti avec un adulte de confiance qui écoute sans juger.",
    pro: "Si la baisse de moral dure, demander un rendez-vous avec un professionnel peut t'aider à retrouver de l'élan.",
  },
  anxiety: {
    selfHelp: [
      "Teste la respiration 4-6 (inspire 4 secondes, expire 6 secondes) pendant 2 minutes.",
      "Quand une inquiétude arrive, écris-la puis note une action concrète très simple.",
    ],
    talk: "Parle à un adulte de confiance des moments où le stress monte le plus.",
    pro: "Si le stress reste très présent, un professionnel peut t'apprendre des outils qui marchent au quotidien.",
  },
  trauma: {
    selfHelp: [
      "Repère des moments et lieux où tu te sens en sécurité, même brièvement.",
      "Quand un souvenir revient, reviens au présent avec 5 choses que tu vois et 5 sons que tu entends.",
    ],
    talk: "Parle à un adulte de confiance de ce qui te déclenche le plus.",
    pro: "Si les souvenirs envahissent ton quotidien, un professionnel peut t'aider à te sentir plus en sécurité.",
  },
  ocd: {
    selfHelp: [
      "Retarde une vérification de 2 minutes, puis augmente petit à petit.",
      "Quand une pensée tourne en boucle, nomme-la simplement: 'c'est une pensée, pas un ordre'.",
    ],
    talk: "Explique à un adulte de confiance ce qui prend du temps ou de l'énergie dans ta journée.",
    pro: "Si les rituels prennent trop de place, un professionnel peut proposer un plan progressif adapté.",
  },
  personality: {
    selfHelp: [
      "Avant de réagir, prends 30 secondes pour respirer et nommer ton émotion.",
      "Note une situation tendue et une autre façon d'y répondre la prochaine fois.",
    ],
    talk: "Choisis un adulte de confiance avec qui parler quand une relation devient pesante.",
    pro: "Si les tensions reviennent souvent, un professionnel peut t'aider à mieux réguler tes réactions.",
  },
  eating: {
    selfHelp: [
      "Essaie des repas réguliers et évite de rester longtemps sans manger.",
      "Réduis les comparaisons sur les réseaux quand elles te font du mal.",
    ],
    talk: "Parle à un adulte de confiance de ce que tu ressens autour du corps, des repas ou de l'image de toi.",
    pro: "Si la relation à l'alimentation devient difficile à gérer seul, un professionnel peut vraiment t'aider.",
  },
  neurodevelopment: {
    selfHelp: [
      "Découpe les tâches en étapes courtes avec minuteur (10 à 20 minutes).",
      "Prépare un repère visuel simple: check-list, agenda ou post-it de priorité.",
    ],
    talk: "Parle à un adulte de confiance des situations où tu perds le fil ou l'énergie.",
    pro: "Si cela gêne souvent l'école ou la vie quotidienne, un professionnel peut proposer des stratégies personnalisées.",
  },
};

export function buildRecommendations(
  category: DominantCategory,
  severity: ReportSeverityLevel
): string[] {
  // IB note: recommendation order is progressive (auto-aide -> adulte -> pro),
  // and bounded to 4-6 items for readability in adolescents.
  const pack = RECOMMENDATION_BANK[category];
  const core = [...pack.selfHelp, pack.talk]; // 3 items

  if (severity === "minimal") {
    return [
      ...core,
      "Note ce qui t'apaise le plus pour le refaire dans les semaines à venir.",
      "Si ça devient plus lourd, parle-en vite à un adulte de confiance.",
    ];
  }

  if (severity === "mild") {
    return [
      ...core,
      "Si ça persiste, cherche un appui supplémentaire auprès d'un adulte de confiance.",
      pack.pro,
    ];
  }

  if (severity === "moderate") {
    return [
      ...core,
      "Quand la pression monte, fais une pause courte pour respirer et revenir au présent.",
      pack.pro,
    ];
  }

  return [
    ...core,
    "À ce niveau, parle rapidement à un adulte de confiance pour ne pas rester seul·e.",
    pack.pro,
  ];
}
