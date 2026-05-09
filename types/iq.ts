export type IQCategory =
  | "logical"
  | "numerical"
  | "verbal"
  | "pattern"
  | "workingAccuracy";

export type IQDifficulty = "easy" | "medium" | "hard";
export type IQOptionKey = "A" | "B" | "C" | "D";

export interface IQQuestion {
  id: string;
  level: 1 | 2 | 3;
  category: IQCategory;
  difficulty: IQDifficulty;
  question: string;
  options: Record<IQOptionKey, string>;
  correctAnswer: IQOptionKey;
  explanation: string;
}

export interface IQAnswer {
  questionId: string;
  selectedAnswer?: IQOptionKey;
  correctAnswer?: IQOptionKey;
  isCorrect?: boolean;
  difficulty?: IQDifficulty;
  category?: IQCategory;
  score?: number;
  changes?: number;
}

export interface IQSubtestScores {
  logical: number;
  numerical: number;
  verbal: number;
  pattern: number;
  workingAccuracy: number;
}

export interface IQResult {
  level: 1 | 2 | 3;
  durationSeconds: number;
  totalQuestions: number;
  answeredCount: number;
  blankCount: number;
  correctCount: number;
  wrongCount: number;
  rawScore: number;
  weightedScore: number;
  maxWeightedScore: number;
  percentageScore: number;
  subtests: IQSubtestScores;
  fitScore: number;
  fitCategory: string;
  recommendation: string;
  redFlags: string[];
  summary: string;
  changeCount: number;
  timedOut: boolean;
}
