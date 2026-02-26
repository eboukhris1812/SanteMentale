import { type QuestionnaireDefinition } from "@/features/assessment/engine";
import {
  fascDefinition,
  lsasDefinition,
  pasDefinition,
  pdssSrDefinition,
} from "@/features/assessment/schemas/anxietyExtended";
import { besDefinition, eat26Definition } from "@/features/assessment/schemas/eatingExtended";
import { gad7Definition } from "@/features/assessment/schemas/gad7";
import { miniTocDefinition } from "@/features/assessment/schemas/miniToc";
import { mdqDefinition, radaDefinition, sasdsDefinition } from "@/features/assessment/schemas/moodTraumaExtended";
import { aq10Definition, asrsV11Definition, ygtssDefinition } from "@/features/assessment/schemas/neuroExtended";
import { pcl5Definition } from "@/features/assessment/schemas/pcl5";
import { pcl5ShortDefinition } from "@/features/assessment/schemas/pcl5Short";
import {
  msiBpdDefinition,
  pdq4GroupeADefinition,
  pdq4GroupeBDefinition,
  pdq4GroupeCDefinition,
  sapasDefinition,
} from "@/features/assessment/schemas/personalityExtended";
import { pdq4FullDefinition } from "@/features/assessment/schemas/pdq4Full";
import { phq9Definition } from "@/features/assessment/schemas/phq9";

export const questionnaireRegistry: Record<string, QuestionnaireDefinition> = {
  phq9: phq9Definition,
  gad7: gad7Definition,
  pcl5: pcl5Definition,
  pcl5Short: pcl5ShortDefinition,
  miniToc: miniTocDefinition,
  pdssSr: pdssSrDefinition,
  pas: pasDefinition,
  lsas: lsasDefinition,
  fasc: fascDefinition,
  mdq: mdqDefinition,
  sasds: sasdsDefinition,
  rada: radaDefinition,
  pdq4A: pdq4GroupeADefinition,
  pdq4B: pdq4GroupeBDefinition,
  pdq4C: pdq4GroupeCDefinition,
  sapas: sapasDefinition,
  msiBpd: msiBpdDefinition,
  pdq4Full: pdq4FullDefinition,
  eat26: eat26Definition,
  bes: besDefinition,
  asrsV11: asrsV11Definition,
  aq10: aq10Definition,
  ygtss: ygtssDefinition,
};

export const testSlugToQuestionnaireId: Record<string, string> = {
  phq9: "phq9",
  gad7: "gad7",
  pcl5: "pcl5",
  "pcl5-court": "pcl5Short",
  "mini-toc": "miniToc",
  "pdss-sr": "pdssSr",
  pas: "pas",
  lsas: "lsas",
  fasc: "fasc",
  mdq: "mdq",
  sasds: "sasds",
  rada: "rada",
  "pdq4-groupe-a": "pdq4A",
  "pdq4-groupe-b": "pdq4B",
  "pdq4-groupe-c": "pdq4C",
  sapas: "sapas",
  "msi-bpd": "msiBpd",
  "pdq4-complet": "pdq4Full",
  eat26: "eat26",
  bes: "bes",
  "asrs-v11": "asrsV11",
  aq10: "aq10",
  ygtss: "ygtss",
};

export function getQuestionnaireByTestSlug(slug: string): QuestionnaireDefinition | undefined {
  const questionnaireId = testSlugToQuestionnaireId[slug];
  if (!questionnaireId) {
    return undefined;
  }
  return questionnaireRegistry[questionnaireId];
}
