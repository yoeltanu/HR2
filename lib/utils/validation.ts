import type { AssessmentPayload } from "@/types/assessment";
import type { CandidateInfo } from "@/types/candidate";

export function validateCandidateInfo(data: CandidateInfo): string[] {
  const errors: string[] = [];

  // String(...) agar nilai bukan teks dari klien tidak memunculkan TypeError.
  if (!String(data.fullName ?? "").trim()) errors.push("Nama lengkap wajib diisi.");
  if (!String(data.whatsapp ?? "").trim()) errors.push("Nomor WhatsApp wajib diisi.");
  if (!String(data.positionApplied ?? "").trim()) errors.push("Posisi dilamar wajib diisi.");

  if (![1, 2, 3].includes(Number(data.assessmentLevel))) {
    errors.push("Assessment level wajib dipilih.");
  }

  if (!data.consent) {
    errors.push("Persetujuan data wajib dicentang.");
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
    errors.push("Format email tidak valid.");
  }

  return errors;
}

const DISC_ID_RE = /^DISC-(0[1-9]|1\d|2[0-4])$/;
const UUID_RE = /^[0-9a-f-]{36}$/i;

export function validateAssessmentPayload(payload: AssessmentPayload): string[] {
  if (!payload || typeof payload !== "object" || !payload.candidate || typeof payload.candidate !== "object") {
    return ["Data kandidat wajib diisi."];
  }

  const errors = validateCandidateInfo(payload.candidate);

  // 24 jawaban DISC harus tepat satu per soal DISC-01..DISC-24 (bukan 24 salinan satu soal).
  const discIds = Array.isArray(payload.discAnswers)
    ? payload.discAnswers.map((answer) => answer?.questionId)
    : [];
  const discOk =
    discIds.length === 24 &&
    discIds.every((id) => typeof id === "string" && DISC_ID_RE.test(id)) &&
    new Set(discIds).size === 24;

  if (!discOk) {
    errors.push("Jawaban DISC belum lengkap.");
  }

  if (
    !Array.isArray(payload.iqAnswers) ||
    payload.iqAnswers.length < 1 ||
    !payload.iqAnswers.every((answer) => typeof answer?.questionId === "string")
  ) {
    errors.push("Jawaban Cognitive Ability Screening belum tersedia.");
  }

  if (!payload.discMeta || !payload.iqMeta) {
    errors.push("Metadata pengerjaan tes belum lengkap.");
  }

  const assignmentId = payload.candidate.assignmentId;
  if (assignmentId && !UUID_RE.test(String(assignmentId))) {
    errors.push("Penugasan tes tidak valid.");
  }

  return errors;
}
