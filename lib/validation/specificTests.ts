import { z } from "zod";

export const specificTestPayloadSchemas = {
  phq9: z.object({
    answers: z.array(z.number().int().min(0).max(3)).length(9),
  }),
  gad7: z.object({
    answers: z.array(z.number().int().min(0).max(3)).length(7),
  }),
  pcl5Short: z.object({
    answers: z.array(z.number().int().min(0).max(4)).length(4),
  }),
  miniToc: z.object({
    answers: z.array(z.number().int().min(0).max(4)).length(4),
  }),
};

export type SpecificTestId = keyof typeof specificTestPayloadSchemas;
