"use client";

import type { AssessmentPayload, AssessmentRecord } from "@/types/assessment";
import type { CandidateInfo } from "@/types/candidate";
import { sampleAssessmentRecords } from "./sampleData";

const DRAFT_KEY = "hr_assessment_candidate_draft";
const DISC_KEY = "hr_assessment_disc_answers";
const DISC_META_KEY = "hr_assessment_disc_meta";
const IQ_KEY = "hr_assessment_iq_answers";
const IQ_META_KEY = "hr_assessment_iq_meta";
const RECORDS_KEY = "hr_assessment_demo_records";
const LAST_RECORD_KEY = "hr_assessment_last_record";

export const storageKeys = {
  DRAFT_KEY,
  DISC_KEY,
  DISC_META_KEY,
  IQ_KEY,
  IQ_META_KEY,
  RECORDS_KEY,
  LAST_RECORD_KEY
};

export function saveCandidateDraft(data: CandidateInfo): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

export function getCandidateDraft(): CandidateInfo | null {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CandidateInfo;
  } catch {
    return null;
  }
}

export function saveJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getDemoRecords(): AssessmentRecord[] {
  return getJson<AssessmentRecord[]>(RECORDS_KEY, []);
}

export function getDemoRecordById(id: string): AssessmentRecord | null {
  return getDemoRecords().find((record) => record.candidate_id === id) || null;
}

export function storeDemoRecord(record: AssessmentRecord): void {
  const records = getDemoRecords();
  const exists = records.some((item) => item.candidate_id === record.candidate_id);

  if (!exists) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify([record, ...records]));
  }

  localStorage.setItem(LAST_RECORD_KEY, JSON.stringify(record));
}

export function updateDemoRecordCandidate(
  candidateId: string,
  updates: Partial<CandidateInfo>
): AssessmentRecord | null {
  const records = getDemoRecords();
  let updatedRecord: AssessmentRecord | null = null;

  const next = records.map((record) => {
    if (record.candidate_id !== candidateId) return record;

    updatedRecord = {
      ...record,
      candidate: {
        ...record.candidate,
        ...updates
      },
      summary: buildUpdatedSummary(record, updates)
    };

    return updatedRecord;
  });

  localStorage.setItem(RECORDS_KEY, JSON.stringify(next));

  const last = getLastRecord();
  if (last?.candidate_id === candidateId && updatedRecord) {
    localStorage.setItem(LAST_RECORD_KEY, JSON.stringify(updatedRecord));
  }

  return updatedRecord;
}

function buildUpdatedSummary(
  record: AssessmentRecord,
  updates: Partial<CandidateInfo>
): string {
  const candidate = {
    ...record.candidate,
    ...updates
  };

  return [
    `${candidate.fullName} melamar posisi ${candidate.positionApplied}.`,
    `DISC ${record.disc.type} dengan fit ${record.disc.fitScore}.`,
    `Cognitive Ability Screening ${record.iq.percentageScore}% dengan fit ${record.iq.fitScore}.`,
    `Rekomendasi akhir: ${record.combined.recommendation}.`,
    "Catatan: hasil assessment adalah alat bantu HR dan bukan satu-satunya dasar keputusan hiring."
  ].join(" ");
}

export function seedSampleDemoRecords(): AssessmentRecord[] {
  const existing = getDemoRecords();
  const merged = [...existing];

  sampleAssessmentRecords.forEach((sample) => {
    const exists = merged.some((item) => item.candidate_id === sample.candidate_id);
    if (!exists) merged.push(sample);
  });

  localStorage.setItem(RECORDS_KEY, JSON.stringify(merged));
  return merged;
}

export function resetDemoRecordsWithSamples(): AssessmentRecord[] {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(sampleAssessmentRecords));
  return sampleAssessmentRecords;
}

export function clearDemoRecords(): void {
  localStorage.removeItem(RECORDS_KEY);
  localStorage.removeItem(LAST_RECORD_KEY);
}

export function getLastRecord(): AssessmentRecord | null {
  return getJson<AssessmentRecord | null>(LAST_RECORD_KEY, null);
}

export function clearAssessmentDraft(): void {
  [
    DRAFT_KEY,
    DISC_KEY,
    DISC_META_KEY,
    IQ_KEY,
    IQ_META_KEY
  ].forEach((key) => localStorage.removeItem(key));
}

export function buildAndStoreDemoRecord(_payload: AssessmentPayload): AssessmentRecord {
  throw new Error(
    "buildAndStoreDemoRecord tidak dipakai. Submit record dibuat melalui /api/submit lalu disimpan memakai storeDemoRecord()."
  );
}
