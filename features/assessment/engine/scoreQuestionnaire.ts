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

  for (const [index, answer] of answers.entries()) {
    if (!Number.isFinite(answer) || answer < min || answer > max) {
      throw new Error(
        `Invalid answer value for ${definition.id}: each value must be between ${min} and ${max}`
      );
    }

    const itemMax = definition.items[index]?.maxOption;
    if (typeof itemMax === "number" && answer > itemMax) {
      throw new Error(
        `Invalid answer value for ${definition.id}:${definition.items[index]?.id}; max is ${itemMax}`
      );
    }
  }

  let totalScore = 0;
  let maxScore = expectedLength * max;
  let components: Record<string, number> | undefined;

  if (definition.scoringRules.method === "aq10-keyed-binary") {
    // AQ-10 official keyed scoring:
    // - items 1, 7, 8, 10 score 1 for "agree" responses (0 or 1)
    // - items 2, 3, 4, 5, 6, 9 score 1 for "disagree" responses (2 or 3)
    const agreeKeyed = new Set([0, 6, 7, 9]);
    totalScore = answers.reduce((sum, answer, index) => {
      const hasTrait = agreeKeyed.has(index) ? answer <= 1 : answer >= 2;
      return sum + (hasTrait ? 1 : 0);
    }, 0);
    maxScore = expectedLength;
  } else if (definition.scoringRules.method === "mdq-official") {
    // MDQ official screening logic:
    // - Item A (1-13): symptom count >= 7
    // - Item B (14): symptoms occurred during the same period => Yes
    // - Item C (15): functional impact moderate or serious
    if (answers.length !== 15) {
      throw new Error(`Invalid MDQ length: expected 15, got ${answers.length}`);
    }

    const symptomCount = answers.slice(0, 13).reduce((sum, value) => sum + value, 0);
    const cooccurrenceYes = answers[13] === 1;
    const impairmentScore = answers[14];
    const impairmentModerateOrSerious = impairmentScore >= 2;
    const officialPositive =
      symptomCount >= 7 && cooccurrenceYes && impairmentModerateOrSerious;

    // Optional factor-style subscores reported in literature.
    const positiveActivationIndexes = [2, 3, 7, 8]; // items 3,4,8,9
    const negativeActivationIndexes = [0, 1, 5, 6, 11, 12]; // items 1,2,6,7,12,13
    const positiveActivation = positiveActivationIndexes.reduce(
      (sum, index) => sum + (answers[index] ?? 0),
      0
    );
    const negativeActivation = negativeActivationIndexes.reduce(
      (sum, index) => sum + (answers[index] ?? 0),
      0
    );

    totalScore = symptomCount;
    maxScore = 13;
    components = {
      symptomCount,
      symptomCriterionMet: symptomCount >= 7 ? 1 : 0,
      cooccurrenceYes: cooccurrenceYes ? 1 : 0,
      impairmentScore,
      impairmentModerateOrSerious: impairmentModerateOrSerious ? 1 : 0,
      officialPositiveScreen: officialPositive ? 1 : 0,
      positiveActivation,
      negativeActivation,
    };
  } else if (definition.scoringRules.method === "pdss-sr-official") {
    // DSM-5 Severity Measure for Panic Disorder (adult):
    // 10 items rated 0..4 over past 7 days.
    if (answers.length !== 10) {
      throw new Error(`Invalid PDSS-SR length: expected 10, got ${answers.length}`);
    }

    totalScore = answers.reduce((sum, value) => sum + value, 0);
    maxScore = 40;
    const averageScore = totalScore / 10;
    components = {
      averageScore: Number(averageScore.toFixed(2)),
      meanSeverityLevel: Math.round(averageScore), // 0 none -> 4 extreme
    };
  } else if (definition.scoringRules.method === "agoraphobia-severity-10") {
    // DSM-5 Severity Measure for Agoraphobia (adult):
    // 10 items rated 0..4 over past 7 days.
    if (answers.length !== 10) {
      throw new Error(`Invalid Agoraphobia severity length: expected 10, got ${answers.length}`);
    }

    totalScore = answers.reduce((sum, value) => sum + value, 0);
    maxScore = 40;
    const averageScore = totalScore / 10;
    components = {
      averageScore: Number(averageScore.toFixed(2)),
      meanSeverityLevel: Math.round(averageScore),
    };
  } else if (definition.scoringRules.method === "lsas-sr-official") {
    // LSAS-SR standard structure:
    // 24 situations x 2 ratings (fear + avoidance), each 0..3.
    if (answers.length !== 48) {
      throw new Error(`Invalid LSAS-SR length: expected 48, got ${answers.length}`);
    }

    const fearScore = answers.slice(0, 24).reduce((sum, value) => sum + value, 0);
    const avoidanceScore = answers.slice(24, 48).reduce((sum, value) => sum + value, 0);
    totalScore = fearScore + avoidanceScore;
    maxScore = 144;
    components = {
      fearScore,
      avoidanceScore,
      performanceAnxietyScore: answers
        .filter((_, index) => [5, 8, 15, 16, 19].includes(index) || [29, 32, 39, 40, 43].includes(index))
        .reduce((sum, value) => sum + value, 0),
      socialInteractionScore: totalScore - answers
        .filter((_, index) => [5, 8, 15, 16, 19].includes(index) || [29, 32, 39, 40, 43].includes(index))
        .reduce((sum, value) => sum + value, 0),
    };
  } else if (definition.scoringRules.method === "ygtss-global") {
    // YGTSS complete scoring model:
    // - Tic severity (10 items): 5 motor + 5 vocal, each rated 0..5 => 0..50
    // - Impairment (1 item): encoded 0..5 then mapped to 0..50 by x10
    // - Global severity = tic severity + impairment => 0..100
    if (answers.length !== 11) {
      throw new Error(`Invalid YGTSS length: expected 11, got ${answers.length}`);
    }

    const motorTicScore = answers.slice(0, 5).reduce((sum, value) => sum + value, 0);
    const vocalTicScore = answers.slice(5, 10).reduce((sum, value) => sum + value, 0);
    const ticSeverityScore = motorTicScore + vocalTicScore;
    const impairmentScore = answers[10] * 10;

    totalScore = ticSeverityScore + impairmentScore;
    maxScore = 100;
    components = {
      motorTicScore,
      vocalTicScore,
      ticSeverityScore,
      impairmentScore,
    };
  } else if (definition.scoringRules.method === "eat26-official") {
    // EAT-26 official psychometric scoring:
    // response options are coded 0..5 in this order:
    // 0=always, 1=usually, 2=often, 3=sometimes, 4=rarely, 5=never
    // - Items 1..25: always/usually/often => 3/2/1 points, otherwise 0
    // - Item 26 is reverse scored: sometimes/rarely/never => 1/2/3 points
    if (answers.length !== 26) {
      throw new Error(`Invalid EAT-26 length: expected 26, got ${answers.length}`);
    }

    totalScore = answers.reduce((sum, answer, index) => {
      if (index === 25) {
        // reverse-scored item 26
        const reverseMap: Record<number, number> = { 3: 1, 4: 2, 5: 3 };
        return sum + (reverseMap[answer] ?? 0);
      }

      const forwardMap: Record<number, number> = { 0: 3, 1: 2, 2: 1 };
      return sum + (forwardMap[answer] ?? 0);
    }, 0);
    maxScore = 78;
  } else if (definition.scoringRules.method === "bes-official") {
    // BES official weighted scoring (16 items, max 46):
    // Most items are 0..3; items 6 and 16 are 0..2 in the original form.
    if (answers.length !== 16) {
      throw new Error(`Invalid BES length: expected 16, got ${answers.length}`);
    }

    totalScore = answers.reduce((sum, value) => sum + value, 0);
    maxScore = 46;
  } else if (definition.scoringRules.method === "pcl5-official") {
    // PCL-5 official approach:
    // - Total severity score = sum of 20 items (0..80)
    // - Provisional DSM-5 cluster rule using symptom endorsement at >=2:
    //   B: items 1-5 => at least 1
    //   C: items 6-7 => at least 1
    //   D: items 8-14 => at least 2
    //   E: items 15-20 => at least 2
    if (answers.length !== 20) {
      throw new Error(`Invalid PCL-5 length: expected 20, got ${answers.length}`);
    }

    totalScore = answers.reduce((sum, value) => sum + value, 0);
    maxScore = 80;

    const endorsed = answers.map((value) => value >= 2);
    const criterionBCount = endorsed.slice(0, 5).filter(Boolean).length;
    const criterionCCount = endorsed.slice(5, 7).filter(Boolean).length;
    const criterionDCount = endorsed.slice(7, 14).filter(Boolean).length;
    const criterionECount = endorsed.slice(14, 20).filter(Boolean).length;

    const criterionBMet = criterionBCount >= 1;
    const criterionCMet = criterionCCount >= 1;
    const criterionDMet = criterionDCount >= 2;
    const criterionEMet = criterionECount >= 2;

    components = {
      criterionBCount,
      criterionCCount,
      criterionDCount,
      criterionECount,
      criterionBMet: criterionBMet ? 1 : 0,
      criterionCMet: criterionCMet ? 1 : 0,
      criterionDMet: criterionDMet ? 1 : 0,
      criterionEMet: criterionEMet ? 1 : 0,
      provisionalByDsm5: criterionBMet && criterionCMet && criterionDMet && criterionEMet ? 1 : 0,
      provisionalByCutoff31: totalScore >= 31 ? 1 : 0,
      provisionalByCutoff33: totalScore >= 33 ? 1 : 0,
    };
  } else if (definition.scoringRules.method === "rada-dsm5-split") {
    // RADA adaptation to a DSM-5-oriented split:
    // - Keep the 17-item parent-report total score (1..5 each)
    // - Derive two sub-scores for orientation only:
    //   RAD-like (inhibited/withdrawn + emotional responsiveness)
    //   DSED-like (disinhibited social engagement)
    if (answers.length !== 17) {
      throw new Error(`Invalid RADA length: expected 17, got ${answers.length}`);
    }

    totalScore = answers.reduce((sum, value) => sum + value, 0);
    maxScore = 85;

    // Item mapping from current RADA wording (0-based indexes):
    // RAD-like: 1,2,3,4,5,6,7,8,14,15,17
    const radIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 16];
    // DSED-like: 9,10,11,12,13,16
    const dsedIndexes = [8, 9, 10, 11, 12, 15];

    const radSubscore = radIndexes.reduce((sum, index) => sum + (answers[index] ?? 0), 0);
    const dsedSubscore = dsedIndexes.reduce((sum, index) => sum + (answers[index] ?? 0), 0);
    const radMax = radIndexes.length * 5;
    const dsedMax = dsedIndexes.length * 5;
    const radNormalized = radSubscore / radMax;
    const dsedNormalized = dsedSubscore / dsedMax;

    components = {
      radSubscore,
      radMax,
      dsedSubscore,
      dsedMax,
      radNormalized: Number(radNormalized.toFixed(4)),
      dsedNormalized: Number(dsedNormalized.toFixed(4)),
      radSignal: radNormalized >= 0.6 ? 1 : 0,
      dsedSignal: dsedNormalized >= 0.6 ? 1 : 0,
    };
  } else {
    // Standard psychometric scoring rule for these tools: summed Likert items.
    totalScore = answers.reduce((sum, value) => sum + value, 0);
  }

  const normalizedScore = maxScore > 0 ? totalScore / maxScore : 0;

  return {
    questionnaireId: definition.id,
    version: definition.version,
    totalScore,
    maxScore,
    normalizedScore,
    components,
    interpretation: definition.interpretation(totalScore),
  };
}
