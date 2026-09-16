import type { AssessmentPayload } from "@/types/assessment";
import type { CandidateInfo } from "@/types/candidate";

export function validateCandidateInfo(data: CandidateInfo): string[] {
  const errors: string[] = [];

  if (!data.fullName?.trim()) errors.push("Nama lengkap wajib diisi.");
  if (!data.whatsapp?.trim()) errors.push("Nomor WhatsApp wajib diisi.");
  if (!data.positionApplied?.trim()) errors.push("Posisi dilamar wajib diisi.");

  if (![1, 2, 3].includes(Number(data.assessmentLevel))) {
    errors.push("Assessment level wajib dipilih.");
  }

  if (data.assessmentConfigSnapshot) {
    const snapshot = data.assessmentConfigSnapshot;

    if (snapshot.level !== data.assessmentLevel) {
      errors.push("Snapshot assessment level tidak sesuai dengan pilihan kandidat.");
    }

    if (snapshot.durationMinutes <= 0) {
      errors.push("Durasi assessment tidak valid.");
    }

    if (snapshot.totalQuestions <= 0) {
      errors.push("Jumlah soal assessment tidak valid.");
    }
  }

  if (!data.consent) {
    errors.push("Persetujuan data wajib dicentang.");
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Format email tidak valid.");
  }

  return errors;
}

export function validateAssessmentPayload(payload: AssessmentPayload): string[] {
  const errors = validateCandidateInfo(payload.candidate);

  if (!Array.isArray(payload.discAnswers) || payload.discAnswers.length !== 24) {
    errors.push("Jawaban DISC belum lengkap.");
  }

  if (!Array.isArray(payload.iqAnswers) || payload.iqAnswers.length < 1) {
    errors.push("Jawaban Cognitive Ability Screening belum tersedia.");
  }

  const snapshot = payload.candidate.assessmentConfigSnapshot;

  if (
    snapshot &&
    Array.isArray(payload.iqAnswers) &&
    payload.iqAnswers.length !== snapshot.totalQuestions
  ) {
    errors.push(
      `Jumlah soal assessment tidak sesuai snapshot (${snapshot.totalQuestions} soal).`
    );
  }

  return errors;
}
