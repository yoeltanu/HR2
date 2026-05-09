import type {
  AssessmentPayload,
  AssessmentRecord,
  CombinedResult
} from "@/types/assessment";
import { scoreDisc } from "@/lib/disc/discScoring";
import { scoreIQ } from "@/lib/iq/iqScoring";
import { createCandidateId } from "@/lib/utils/id";
import { getCombinedCategory, roundScore } from "@/lib/utils/format";

interface WeightProfile {
  disc: number;
  iq: number;
}

function getWeightProfile(position: string): WeightProfile {
  const normalized = position.toLowerCase();

  if (
    normalized.includes("sales") ||
    normalized.includes("customer service") ||
    normalized.includes("cs")
  ) {
    return { disc: 0.6, iq: 0.4 };
  }

  if (
    normalized.includes("accounting") ||
    normalized.includes("procurement")
  ) {
    return { disc: 0.3, iq: 0.7 };
  }

  if (
    normalized.includes("leader") ||
    normalized.includes("supervisor") ||
    normalized.includes("head")
  ) {
    return { disc: 0.45, iq: 0.55 };
  }

  if (normalized.includes("personal assistant")) {
    return { disc: 0.35, iq: 0.65 };
  }

  if (
    normalized.includes("admin") ||
    normalized.includes("checker") ||
    normalized.includes("inventory")
  ) {
    return { disc: 0.4, iq: 0.6 };
  }

  return { disc: 0.45, iq: 0.55 };
}

export function scoreCombined(
  discFitScore: number,
  iqFitScore: number,
  position: string
): CombinedResult {
  const weights = getWeightProfile(position);

  const score = roundScore(
    discFitScore * weights.disc + iqFitScore * weights.iq
  );

  const category = getCombinedCategory(score);

  return {
    score,
    category,
    recommendation: category,
    weights
  };
}

export function buildAssessmentRecord(
  payload: AssessmentPayload
): AssessmentRecord {
  const createdAt = new Date().toISOString();
  const candidateId = createCandidateId();

  const disc = scoreDisc(
    payload.discAnswers,
    payload.candidate.positionApplied,
    {
      durationSeconds: payload.discMeta.durationSeconds,
      changeCount: payload.discMeta.changeCount
    }
  );

  const iqScored = scoreIQ(
    payload.candidate.assessmentLevel,
    payload.iqAnswers,
    payload.candidate.positionApplied,
    {
      durationSeconds: payload.iqMeta.durationSeconds,
      changeCount: payload.iqMeta.changeCount,
      timedOut: payload.iqMeta.timedOut
    }
  );

  const combined = scoreCombined(
    disc.fitScore,
    iqScored.result.fitScore,
    payload.candidate.positionApplied
  );

  const redFlags = [...disc.redFlags, ...iqScored.result.redFlags];

  const summary = [
    `${payload.candidate.fullName} melamar posisi ${payload.candidate.positionApplied}.`,
    `DISC ${disc.type} dengan fit ${disc.fitScore}.`,
    `Cognitive Ability Screening ${iqScored.result.percentageScore}% dengan fit ${iqScored.result.fitScore}.`,
    `Rekomendasi akhir: ${combined.recommendation}.`,
    "Catatan: hasil assessment adalah alat bantu HR dan bukan satu-satunya dasar keputusan hiring."
  ].join(" ");

  return {
    candidate_id: candidateId,
    created_at: createdAt,
    candidate: payload.candidate,
    disc,
    iq: iqScored.result,
    combined,
    discAnswers: payload.discAnswers,
    iqAnswers: iqScored.enrichedAnswers,
    redFlags,
    summary
  };
}
