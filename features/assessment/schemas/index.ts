import { type QuestionnaireDefinition } from "@/features/assessment/engine";
import { gad7Definition } from "@/features/assessment/schemas/gad7";
import { miniTocDefinition } from "@/features/assessment/schemas/miniToc";
import { pcl5ShortDefinition } from "@/features/assessment/schemas/pcl5Short";
import { phq9Definition } from "@/features/assessment/schemas/phq9";

export const questionnaireRegistry: Record<
  QuestionnaireDefinition["id"],
  QuestionnaireDefinition
> = {
  phq9: phq9Definition,
  gad7: gad7Definition,
  pcl5Short: pcl5ShortDefinition,
  miniToc: miniTocDefinition,
};
