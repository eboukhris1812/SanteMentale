import type {
  DominantCategory,
  IntensityBand,
  NaturalReport,
  ReportSeverityLevel,
} from "@/features/assessment/engine/types";

type ReportSections = Pick<
  NaturalReport,
  "introduction" | "emotionalSummary" | "dominantFocus" | "psychoeducation" | "encouragement"
>;

type TemplateKey = `${DominantCategory}:${ReportSeverityLevel}`;

// IB note: keeping template data in a dedicated module makes wording auditable,
// deterministic, and easy to update without touching scoring logic.
const TEMPLATE_OVERRIDES: Partial<Record<TemplateKey, ReportSections>> = {
  // Référence directe fournie par l'utilisateur: anxiété dominante, niveau modéré.
  "anxiety:moderate": {
    introduction:
      "Merci d’avoir pris le temps de répondre à toutes les questions. Ce n’est pas toujours facile de réfléchir à ce qu’on ressent, et le simple fait de le faire montre que tu prends ton bien-être au sérieux.",
    emotionalSummary:
      "D’après tes réponses, on voit que tu traverses en ce moment une période où ton esprit semble souvent en alerte. Tu peux avoir tendance à beaucoup réfléchir, à anticiper ce qui pourrait mal se passer ou à ressentir une tension intérieure difficile à relâcher. Par moments, cela peut aussi se ressentir dans ton corps : fatigue, difficultés à t’endormir, ventre noué ou cœur qui bat plus vite. Cela ne veut pas dire que quelque chose ne va “pas bien” chez toi. Cela montre simplement que ton niveau de stress est plus élevé que d’habitude.",
    dominantFocus:
      "L’anxiété semble être ce qui prend le plus de place pour toi actuellement. Quand elle devient plus présente, elle peut donner l’impression que tout est urgent ou important. On peut avoir du mal à profiter du moment présent parce que le cerveau pense déjà à la prochaine inquiétude. À un niveau modéré, cela peut être fatigant, mais c’est aussi quelque chose sur lequel on peut agir progressivement avec de petites habitudes et du soutien.",
    psychoeducation:
      "À l’adolescence, le cerveau évolue beaucoup. Il devient plus sensible aux relations sociales, au regard des autres et aux attentes scolaires. Cela peut amplifier les inquiétudes. Beaucoup de jeunes traversent des périodes similaires, surtout lors de changements ou de pression importante. L’anxiété n’est pas une faiblesse : c’est un système d’alarme interne qui parfois se déclenche un peu trop souvent.",
    encouragement:
      "Ce que tu ressens aujourd’hui ne définit pas qui tu es. Les émotions évoluent, surtout à ton âge. Tu as déjà fait un premier pas important en faisant ce bilan. Avec du soutien et des petits ajustements, les choses peuvent s’améliorer.",
  },
  // Référence directe fournie par l'utilisateur: symptômes dépressifs dominants, niveau élevé.
  "depression:high": {
    introduction:
      "Merci d’avoir complété ce bilan avec sincérité. Prendre un moment pour réfléchir à ce que tu ressens demande du courage, surtout quand ce n’est pas facile.",
    emotionalSummary:
      "Tes réponses montrent qu’en ce moment, tu sembles porter une charge émotionnelle importante. Tu peux te sentir plus fatigué·e que d’habitude, moins motivé·e ou avoir l’impression que certaines choses qui te plaisaient avant t’intéressent moins. Il peut aussi y avoir des moments de tristesse plus intenses, un manque d’énergie ou une impression que tout demande beaucoup d’effort. Cela ne veut pas dire que tu es “faible” ou que tu fais quelque chose de mal. Cela indique simplement que tu traverses une période difficile.",
    dominantFocus:
      "Les signes liés à l’humeur semblent être les plus présents pour toi actuellement. Quand ces sensations deviennent plus fortes ou durent plusieurs semaines, elles peuvent vraiment peser sur le quotidien : école, relations, confiance en soi. À un niveau élevé, il est important de ne pas rester seul·e avec ça. Ce genre de période peut s’améliorer, surtout quand on est accompagné·e.",
    psychoeducation:
      "L’adolescence est une période de grands changements : hormonaux, scolaires, sociaux. Le cerveau est encore en construction, ce qui rend les émotions plus intenses et parfois plus instables. Quand on accumule fatigue, pression ou déceptions, l’humeur peut baisser progressivement. Ce type de ressenti est plus fréquent qu’on ne le pense, et il existe des solutions.",
    encouragement:
      "Même si ça ne se voit pas toujours, les périodes difficiles peuvent évoluer. Tu n’es pas seul·e dans ce que tu traverses. Demander de l’aide n’est pas un échec, c’est une façon intelligente de prendre soin de toi.",
  },
};

const INTRO_BY_BAND: Record<IntensityBand, string> = {
  light:
    "Merci d’avoir répondu au bilan. Le fait de prendre ce temps pour toi est déjà une démarche positive.",
  moderate:
    "Merci d’avoir pris ce moment pour faire le bilan. Observer ce que tu ressens est une vraie force.",
  high:
    "Bravo d’avoir fait ce bilan avec honnêteté. Quand c’est intense, poser des mots est déjà un pas important.",
};

const EMOTIONAL_BY_BAND: Record<IntensityBand, string> = {
  light:
    "En ce moment, tu sembles surtout traverser des hauts et des bas modérés. Certains jours peuvent être plus lourds, mais tu gardes des moments de respiration.",
  moderate:
    "En ce moment, tes émotions semblent prendre plus de place dans ta journée. Cela peut toucher l’énergie, la concentration, le sommeil ou la motivation.",
  high:
    "En ce moment, ce que tu ressens paraît vraiment pesant et régulier. Cela peut impacter plusieurs domaines du quotidien, comme l’école, les relations et le repos.",
};

const DOMINANT_BY_CATEGORY: Record<
  DominantCategory,
  Record<ReportSeverityLevel, string>
> = {
  depression: {
    minimal:
      "L’humeur semble être la zone la plus sensible en ce moment, mais de façon légère. Tu peux te sentir un peu ralenti·e par moments.",
    mild:
      "L’humeur semble être la zone la plus sensible en ce moment. Tu peux ressentir moins d’élan ou plus de fatigue que d’habitude.",
    moderate:
      "L’humeur semble être la zone la plus sensible en ce moment. Cela peut donner une impression de lourdeur qui revient souvent dans la semaine.",
    high:
      "L’humeur semble être la zone la plus sensible en ce moment. À ce niveau, c’est important de ne pas rester seul·e et d’en parler rapidement à un adulte de confiance.",
  },
  anxiety: {
    minimal:
      "Le stress semble être la zone la plus sensible en ce moment, avec une intensité légère.",
    mild:
      "Le stress semble être la zone la plus sensible en ce moment. Les inquiétudes peuvent revenir plus vite et fatiguer.",
    moderate:
      "Le stress semble être la zone la plus sensible en ce moment. Ton esprit peut rester en mode alerte plus longtemps que d’habitude.",
    high:
      "Le stress semble être la zone la plus sensible en ce moment. À ce niveau, demander du soutien à un adulte de confiance peut vraiment aider.",
  },
  trauma: {
    minimal:
      "L’impact de souvenirs difficiles semble être la zone la plus sensible en ce moment, de façon légère.",
    mild:
      "L’impact de souvenirs difficiles semble être la zone la plus sensible en ce moment. Certains rappels peuvent te bousculer plus vite.",
    moderate:
      "L’impact de souvenirs difficiles semble être la zone la plus sensible en ce moment. Cela peut rendre certaines situations plus dures à vivre.",
    high:
      "L’impact de souvenirs difficiles semble être la zone la plus sensible en ce moment. Tu mérites d’être entouré·e et soutenu·e rapidement.",
  },
  ocd: {
    minimal:
      "Les pensées qui tournent en boucle semblent être la zone la plus sensible en ce moment, mais de façon légère.",
    mild:
      "Les pensées qui tournent en boucle semblent être la zone la plus sensible en ce moment. Elles peuvent prendre de la place dans ta tête.",
    moderate:
      "Les pensées qui tournent en boucle semblent être la zone la plus sensible en ce moment. Cela peut fatiguer et rendre certaines tâches plus longues.",
    high:
      "Les pensées qui tournent en boucle semblent être la zone la plus sensible en ce moment. En parler avec un adulte de confiance peut te soulager.",
  },
  personality: {
    minimal:
      "La relation à toi-même et aux autres semble être la zone la plus sensible en ce moment, mais de manière légère.",
    mild:
      "La relation à toi-même et aux autres semble être la zone la plus sensible en ce moment, avec des réactions parfois plus intenses.",
    moderate:
      "La relation à toi-même et aux autres semble être la zone la plus sensible en ce moment. Certaines tensions peuvent revenir régulièrement.",
    high:
      "La relation à toi-même et aux autres semble être la zone la plus sensible en ce moment. Un adulte de confiance peut t’aider à poser des repères.",
  },
  eating: {
    minimal:
      "Le rapport à l’alimentation semble être la zone la plus sensible en ce moment, mais de façon légère.",
    mild:
      "Le rapport à l’alimentation semble être la zone la plus sensible en ce moment. Certaines pensées sur le corps peuvent prendre plus de place.",
    moderate:
      "Le rapport à l’alimentation semble être la zone la plus sensible en ce moment. Cela peut peser sur les repas, l’image de soi et l’énergie.",
    high:
      "Le rapport à l’alimentation semble être la zone la plus sensible en ce moment. À ce niveau, c’est important d’en parler vite à un adulte de confiance.",
  },
  neurodevelopment: {
    minimal:
      "L’attention et l’organisation semblent être la zone la plus sensible en ce moment, avec une intensité légère.",
    mild:
      "L’attention et l’organisation semblent être la zone la plus sensible en ce moment. Certaines tâches peuvent demander plus d’effort.",
    moderate:
      "L’attention et l’organisation semblent être la zone la plus sensible en ce moment. Le quotidien peut paraître plus chargé à gérer.",
    high:
      "L’attention et l’organisation semblent être la zone la plus sensible en ce moment. Un accompagnement peut t’aider à retrouver des repères concrets.",
  },
};

const PSYCHOEDUCATION_BY_BAND: Record<IntensityBand, string> = {
  light:
    "À l’adolescence, le cerveau est encore en évolution, donc les émotions peuvent varier rapidement. C’est fréquent et compréhensible.",
  moderate:
    "À l’adolescence, les changements scolaires, sociaux et personnels peuvent amplifier ce que tu ressens. Ce n’est pas une faiblesse, c’est un signal à écouter.",
  high:
    "À l’adolescence, les émotions peuvent devenir très intenses quand la pression s’accumule. Ce que tu ressens est réel et mérite d’être pris au sérieux, sans dramatiser.",
};

const ENCOURAGEMENT_BY_BAND: Record<IntensityBand, string> = {
  light:
    "Tu as déjà commencé quelque chose d’important : mieux comprendre ce que tu vis.",
  moderate:
    "Tu peux avancer pas à pas. Avec de petits ajustements et du soutien, ça peut aller mieux.",
  high:
    "Tu n’es pas seul·e. Avec un accompagnement adapté, cette période peut évoluer dans le bon sens.",
};

export function getTemplateSections(
  category: DominantCategory,
  severity: ReportSeverityLevel,
  globalBand: IntensityBand
): ReportSections {
  const override = TEMPLATE_OVERRIDES[`${category}:${severity}`];
  if (override) {
    return override;
  }

  return {
    introduction: INTRO_BY_BAND[globalBand],
    emotionalSummary: EMOTIONAL_BY_BAND[globalBand],
    dominantFocus: DOMINANT_BY_CATEGORY[category][severity],
    psychoeducation: PSYCHOEDUCATION_BY_BAND[globalBand],
    encouragement: ENCOURAGEMENT_BY_BAND[globalBand],
  };
}
