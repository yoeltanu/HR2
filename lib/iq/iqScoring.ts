import type {
  IQAnswer,
  IQCategory,
  IQDifficulty,
  IQQuestion,
  IQResult,
  IQSubtestScores
} from "@/types/iq";
import { roundScore } from "@/lib/utils/format";
import { getIQQuestionsByLevel } from "./iqQuestions";
import { getIQSummary } from "./iqInterpretations";
import { scoreIQFit } from "./iqPositionThresholds";

const weights: Record<IQDifficulty, number> = {
  easy: 1,
  medium: 1.5,
  hard: 2
};

const categories: IQCategory[] = [
  "logical",
  "numerical",
  "verbal",
  "pattern",
  "workingAccuracy"
];

export function scoreIQ(
  level: 1 | 2 | 3,
  answers: IQAnswer[],
  positionApplied: string,
  meta: {
    durationSeconds: number;
    changeCount: number;
    timedOut: boolean;
  }
): {
  result: IQResult;
  enrichedAnswers: IQAnswer[];
} {
  const questions = getIQQuestionsByLevel(level);

  const answerMap = new Map(
    answers.map((answer) => [answer.questionId, answer])
  );

  let correctCount = 0;
  let weightedScore = 0;
  let maxWeightedScore = 0;

  const subtestWeighted: Record<IQCategory, number> = {
    logical: 0,
    numerical: 0,
    verbal: 0,
    pattern: 0,
    workingAccuracy: 0
  };

  const subtestMax: Record<IQCategory, number> = {
    logical: 0,
    numerical: 0,
    verbal: 0,
    pattern: 0,
    workingAccuracy: 0
  };

  const enrichedAnswers = questions.map((question) => {
    const current = answerMap.get(question.id);
    const selectedAnswer = current?.selectedAnswer;
    const isCorrect = selectedAnswer === question.correctAnswer;
    const score = isCorrect ? weights[question.difficulty] : 0;

    if (isCorrect) correctCount += 1;

    weightedScore += score;
    maxWeightedScore += weights[question.difficulty];

    subtestWeighted[question.category] += score;
    subtestMax[question.category] += weights[question.difficulty];

    return {
      questionId: question.id,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      difficulty: question.difficulty,
      category: question.category,
      score,
      changes: current?.changes || 0
    };
  });

  const answeredCount = enrichedAnswers.filter((answer) =>
    Boolean(answer.selectedAnswer)
  ).length;

  const blankCount = questions.length - answeredCount;
  const wrongCount = answeredCount - correctCount;

  const percentageScore = roundScore(
    (weightedScore / (maxWeightedScore || 1)) * 100
  );

  const subtests = categories.reduce((acc, category) => {
    acc[category] = roundScore(
      (subtestWeighted[category] / (subtestMax[category] || 1)) * 100
    );

    return acc;
  }, {} as IQSubtestScores);

  const fit = scoreIQFit(percentageScore, subtests, positionApplied);

  const totalDurationSeconds =
    level === 1 ? 20 * 60 : level === 2 ? 30 * 60 : 40 * 60;

  const redFlags = buildIQRedFlags({
    questions,
    answers: enrichedAnswers,
    percentageScore,
    subtests,
    durationSeconds: meta.durationSeconds,
    totalDurationSeconds,
    changeCount: meta.changeCount,
    timedOut: meta.timedOut
  });

  return {
    enrichedAnswers,
    result: {
      level,
      durationSeconds: meta.durationSeconds,
      totalQuestions: questions.length,
      answeredCount,
      blankCount,
      correctCount,
      wrongCount,
      rawScore: correctCount,
      weightedScore: roundScore(weightedScore),
      maxWeightedScore: roundScore(maxWeightedScore),
      percentageScore,
      subtests,
      fitScore: fit.score,
      fitCategory: fit.category,
      recommendation: fit.recommendation,
      redFlags,
      summary: getIQSummary(percentageScore),
      changeCount: meta.changeCount,
      timedOut: meta.timedOut
    }
  };
}

function buildIQRedFlags(input: {
  questions: IQQuestion[];
  answers: IQAnswer[];
  percentageScore: number;
  subtests: IQSubtestScores;
  durationSeconds: number;
  totalDurationSeconds: number;
  changeCount: number;
  timedOut: boolean;
}): string[] {
  const flags: string[] = [];

  if (input.questions.length === 0) {
    flags.push("Question bank belum tersedia untuk level ini.");
    return flags;
  }

  const blankRate =
    input.answers.filter((answer) => !answer.selectedAnswer).length /
    input.questions.length;

  const answerCounts = input.answers.reduce<Record<string, number>>(
    (acc, answer) => {
      if (answer.selectedAnswer) {
        acc[answer.selectedAnswer] = (acc[answer.selectedAnswer] || 0) + 1;
      }

      return acc;
    },
    {}
  );

  const mostCommon = Math.max(0, ...Object.values(answerCounts));
  const monotonousRate = mostCommon / input.questions.length;

  if (
    input.durationSeconds < input.totalDurationSeconds * 0.35 &&
    input.percentageScore >= 80
  ) {
    flags.push(
      "Kemungkinan pernah melihat soal atau menjawab terlalu cepat. Perlu konfirmasi."
    );
  }

  if (input.timedOut && blankRate > 0.2) {
    flags.push("Kecepatan kerja perlu dikonfirmasi.");
  }

  if (blankRate > 0.2) {
    flags.push("Banyak soal tidak dijawab.");
  }

  if (monotonousRate > 0.6) {
    flags.push("Pola jawaban monoton, kemungkinan menebak.");
  }

  if (Math.min(...Object.values(input.subtests)) < 50) {
    flags.push("Profil kemampuan tidak seimbang.");
  }

  if (input.changeCount > 20) {
    flags.push("Ragu-ragu tinggi, perlu konfirmasi interview.");
  }

  return flags;
}
