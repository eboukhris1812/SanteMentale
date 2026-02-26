import { z } from "zod";

const phq9AnswersSchema = z.array(z.number().int().min(0).max(3)).length(9);
const gad7AnswersSchema = z.array(z.number().int().min(0).max(3)).length(7);
const pcl5ShortAnswersSchema = z.array(z.number().int().min(0).max(4)).length(4);
const miniTocAnswersSchema = z.array(z.number().int().min(0).max(4)).length(4);
const personalityScreenSchema = z.array(z.number().int().min(0).max(3)).length(4);
const eatingScreenSchema = z.array(z.number().int().min(0).max(3)).length(4);
const neurodevScreenSchema = z.array(z.number().int().min(0).max(3)).length(4);

export const bilanPayloadSchema = z.object({
  phq9: phq9AnswersSchema,
  gad7: gad7AnswersSchema,
  pcl5Short: pcl5ShortAnswersSchema,
  miniToc: miniTocAnswersSchema,
  personalityScreen: personalityScreenSchema,
  eatingScreen: eatingScreenSchema,
  neurodevScreen: neurodevScreenSchema,
});

export type BilanPayload = z.infer<typeof bilanPayloadSchema>;
