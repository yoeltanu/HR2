const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Fixed " + filePath);
}

writeFile(
  "types/iq.ts",
`export type IQCategory =
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
`
);

const filesToPatch = [
  "lib/iq/iqQuestions.ts",
  "lib/iq/iqScoring.ts",
  "lib/utils/format.ts",
  "lib/iq/iqPositionThresholds.ts",
  "lib/storage/sampleData.ts",
  "components/admin/CandidateDetail.tsx",
  "components/iq/IQQuestionCard.tsx"
];

for (const file of filesToPatch) {
  if (!fs.existsSync(file)) continue;

  let text = fs.readFileSync(file, "utf8");

  text = text
    .replaceAll('"logic"', '"logical"')
    .replaceAll("'logic'", "'logical'")
    .replaceAll("logic:", "logical:")
    .replaceAll(".logic", ".logical");

  fs.writeFileSync(file, text, "utf8");
  console.log("Normalized " + file);
}

console.log("");
console.log("IQ category type fixed.");
