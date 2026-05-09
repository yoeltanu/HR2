import type { CandidateInfo } from "./candidate";
import type { DiscAnswer, DiscResult } from "./disc";
import type { IQAnswer, IQResult } from "./iq";

export interface AssessmentPayload {
  candidate: CandidateInfo;
  discAnswers: DiscAnswer[];
  discMeta: {
    startedAt: string;
    finishedAt: string;
    durationSeconds: number;
    changeCount: number;
  };
  iqAnswers: IQAnswer[];
  iqMeta: {
    startedAt: string;
    finishedAt: string;
    durationSeconds: number;
    changeCount: number;
    timedOut: boolean;
  };
}

export interface CombinedResult {
  score: number;
  category: string;
  recommendation: string;
  weights: {
    disc: number;
    iq: number;
  };
}

export interface AssessmentRecord {
  candidate_id: string;
  created_at: string;
  candidate: CandidateInfo;
  disc: DiscResult;
  iq: IQResult;
  combined: CombinedResult;
  discAnswers: DiscAnswer[];
  iqAnswers: IQAnswer[];
  redFlags: string[];
  summary: string;
}
