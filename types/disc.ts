export type DiscDimension = "D" | "I" | "S" | "C";

export interface DiscOption {
  id: "A" | "B" | "C" | "D";
  text: string;
  code: DiscDimension;
}

export interface DiscQuestion {
  id: string;
  text: string;
  options: DiscOption[];
}

export interface DiscAnswer {
  questionId: string;
  mostOptionId: string;
  leastOptionId: string;
  mostCode?: DiscDimension;
  leastCode?: DiscDimension;
  changes?: number;
}

export interface DiscScores {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface DiscInterpretation {
  title: string;
  summary: string;
  strengths: string[];
  risks: string[];
  suitableRoles: string[];
  managementTips: string[];
}

export interface DiscResult {
  raw: DiscScores;
  adjusted: DiscScores;
  percentages: DiscScores;
  type: string;
  primary: DiscDimension;
  secondary?: DiscDimension;
  fitScore: number;
  fitCategory: string;
  recommendation: string;
  redFlags: string[];
  interpretation: DiscInterpretation;
  durationSeconds: number;
  changeCount: number;
}
