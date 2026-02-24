import {
  type QuestionnaireDefinition,
  type QuestionnaireScore,
} from "@/features/assessment/engine/types";

export function scoreQuestionnaire(
  definition: QuestionnaireDefinition,
  answers: readonly number[]
): QuestionnaireScore {
  const expectedLength = definition.items.length;

  if (answers.length !== expectedLength) {
    throw new Error(
      `Invalid answers length for ${definition.id}: expected ${expectedLength}, got ${answers.length}`
    );
  }

  const { min, max } = definition.scale;

  for (const answer of answers) {
    if (!Number.isFinite(answer) || answer < min || answer > max) {
      throw new Error(
        `Invalid answer value for ${definition.id}: each value must be between ${min} and ${max}`
      );
    }
  }

  // Standard psychometric scoring rule for these tools: summed Likert items.
  const totalScore = answers.reduce((sum, value) => sum + value, 0);
  const maxScore = expectedLength * max;
  const normalizedScore = maxScore > 0 ? totalScore / maxScore : 0;

  return {
    questionnaireId: definition.id,
    version: definition.version,
    totalScore,
    maxScore,
    normalizedScore,
    interpretation: definition.interpretation(totalScore),
  };
}
