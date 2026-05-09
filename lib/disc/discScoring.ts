import type {
  DiscAnswer,
  DiscDimension,
  DiscResult,
  DiscScores
} from "@/types/disc";
import { roundScore } from "@/lib/utils/format";
import { discQuestions } from "./discQuestions";
import { getDiscInterpretation } from "./discInterpretations";
import { scoreDiscFit } from "./discPositionProfiles";

const dimensions: DiscDimension[] = ["D", "I", "S", "C"];

export function scoreDisc(
  answers: DiscAnswer[],
  positionApplied: string,
  meta: {
    durationSeconds: number;
    changeCount: number;
  }
): DiscResult {
  const raw: DiscScores = {
    D: 0,
    I: 0,
    S: 0,
    C: 0
  };

  answers.forEach((answer) => {
    const question = discQuestions.find(
      (item) => item.id === answer.questionId
    );

    if (!question) return;

    const most = question.options.find(
      (option) => option.id === answer.mostOptionId
    );

    const least = question.options.find(
      (option) => option.id === answer.leastOptionId
    );

    if (most) raw[most.code] += 2;
    if (least) raw[least.code] -= 1;

    answer.mostCode = most?.code;
    answer.leastCode = least?.code;
  });

  const minScore = Math.min(...dimensions.map((key) => raw[key]));
  const adjustment = Math.abs(minScore) + 1;

  const adjusted: DiscScores = {
    D: raw.D + adjustment,
    I: raw.I + adjustment,
    S: raw.S + adjustment,
    C: raw.C + adjustment
  };

  const totalAdjusted =
    dimensions.reduce((sum, key) => sum + adjusted[key], 0) || 1;

  const percentages: DiscScores = {
    D: roundScore((adjusted.D / totalAdjusted) * 100),
    I: roundScore((adjusted.I / totalAdjusted) * 100),
    S: roundScore((adjusted.S / totalAdjusted) * 100),
    C: roundScore((adjusted.C / totalAdjusted) * 100)
  };

  const ranked = dimensions
    .map((key) => ({
      key,
      value: percentages[key]
    }))
    .sort((a, b) => b.value - a.value);

  const primary = ranked[0].key;
  const secondary = ranked[1].key;

  const type =
    ranked[0].value - ranked[1].value <= 10
      ? `${primary}${secondary}`
      : primary;

  const fit = scoreDiscFit(type, positionApplied);

  const spread = ranked[0].value - ranked[3].value;
  const redFlags: string[] = [];

  if (meta.durationSeconds > 0 && meta.durationSeconds < 180) {
    redFlags.push("Waktu pengerjaan DISC terlalu cepat.");
  }

  if (spread <= 8) {
    redFlags.push("Skor DISC terlalu rata, perlu konfirmasi saat interview.");
  }

  if (spread >= 55) {
    redFlags.push("Skor DISC sangat ekstrem, validasi konteks kerja kandidat.");
  }

  if (meta.changeCount >= 15) {
    redFlags.push("Banyak perubahan jawaban pada DISC.");
  }

  return {
    raw,
    adjusted,
    percentages,
    type,
    primary,
    secondary: type.length > 1 ? secondary : undefined,
    fitScore: fit.score,
    fitCategory: fit.category,
    recommendation: fit.recommendation,
    redFlags,
    interpretation: getDiscInterpretation(type),
    durationSeconds: meta.durationSeconds,
    changeCount: meta.changeCount
  };
}
