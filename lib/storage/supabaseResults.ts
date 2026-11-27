// Server-only. Database rekrutmen (sama dengan ERP & form pendaftaran) lewat PostgREST + service-role key.
// Google Sheets tetap jalan seperti biasa; ini hanya menambah salinan hasil ke tabel ERP.
import type { AssessmentPayload, AssessmentRecord } from "@/types/assessment";
import { normalizePhone, sameName } from "@/lib/utils/phone";

function cfg() {
  return {
    url: (process.env.SUPABASE_URL || "").trim().replace(/\/$/, ""),
    key: (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()
  };
}

export function isSupabaseConfigured(): boolean {
  const c = cfg();
  return Boolean(c.url && c.key);
}

async function rest(path: string, init: RequestInit = {}) {
  const { url, key } = cfg();
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
  const text = await res.text();
  if (!res.ok) {
    let code = "";
    try {
      code = JSON.parse(text).code || "";
    } catch {}
    throw Object.assign(new Error(`Supabase ${res.status}: ${text.slice(0, 200)}`), { code });
  }
  return text ? JSON.parse(text) : null;
}

interface CandidateRow {
  id: string;
  full_name: string | null;
  email: string;
  phone_number: string;
  address: string | null;
  position_id: string;
}

export interface Hr2Assignment {
  id: string;
  candidate_id: string;
  status: "assigned" | "started";
  deadline_at: string | null;
  config: { level?: number };
}

const ACTIVE = "status=in.(assigned,started)";

/** Kesalahan validasi permanen (bukan gangguan jaringan): percobaan ulang tidak akan mengubahnya. */
export class PermanentSyncError extends Error {}

const ASSIGNMENT_ID_RE = /^[0-9a-f-]{36}$/i;

/** Level dan posisi resmi dari penugasan, dipakai untuk menimpa nilai yang dikirim klien. */
export async function getHr2AssignmentContext(
  assignmentId: string
): Promise<{ level: number; positionTitle: string }> {
  if (!ASSIGNMENT_ID_RE.test(assignmentId)) throw new PermanentSyncError("Penugasan tes tidak valid.");

  const [a] = await rest(
    `recruitment_test_assignments?select=id,candidate_id,test_type,config&id=eq.${assignmentId}`
  );
  if (!a || a.test_type !== "hr2") throw new PermanentSyncError("Penugasan tes tidak ditemukan.");

  const level = [1, 2, 3].includes(Number(a.config?.level)) ? Number(a.config.level) : 1;

  const [cand] = await rest(`recruitment_candidates?select=position_id&id=eq.${a.candidate_id}`);
  const pos = cand?.position_id
    ? await rest(`hiring_positions?select=title&id=eq.${cand.position_id}`)
    : null;

  return { level, positionTitle: (pos?.[0]?.title as string) || "" };
}

/** Cocokkan nama + nomor WhatsApp dengan pelamar. Bila ada beberapa baris, pilih yang punya penugasan HR2 aktif. */
export async function findHr2Candidate(fullName: string, whatsapp: string) {
  const phone = normalizePhone(whatsapp);
  if (phone.length < 10) return null;
  const rows: CandidateRow[] = await rest(
    `recruitment_candidates?select=id,full_name,email,phone_number,address,position_id&phone_number=in.(${phone},0${phone.slice(2)},620${phone.slice(2)})`
  );
  const matches = rows.filter((r) => r.full_name && sameName(r.full_name, fullName));
  if (matches.length === 0) return null;

  const ids = matches.map((m) => m.id).join(",");
  const assignments: Hr2Assignment[] = await rest(
    `recruitment_test_assignments?select=id,candidate_id,status,deadline_at,config&candidate_id=in.(${ids})&test_type=eq.hr2&${ACTIVE}&order=created_at.desc`
  );
  const assignment = assignments[0] ?? null;
  const candidate = (assignment && matches.find((m) => m.id === assignment.candidate_id)) || matches[0];
  const pos = await rest(`hiring_positions?select=title&id=eq.${candidate.position_id}`);
  return { candidate, assignment, positionTitle: (pos?.[0]?.title as string) || "" };
}

export async function markAssignmentStarted(assignment: Hr2Assignment) {
  if (assignment.status !== "assigned") return;
  await rest(`recruitment_test_assignments?id=eq.${assignment.id}&status=eq.assigned`, {
    method: "PATCH",
    body: JSON.stringify({ status: "started", started_at: new Date().toISOString() })
  });
}

/**
 * Simpan hasil HR2 ke tabel ERP. Idempoten: penugasan yang sudah punya hasil dianggap berhasil.
 * Identitas di payload dicek ulang terhadap pelamar milik penugasan, karena klien tidak boleh dipercaya.
 */
export async function saveHr2Result(payload: AssessmentPayload, record: AssessmentRecord) {
  const assignmentId = payload.candidate.assignmentId;
  if (!assignmentId || !ASSIGNMENT_ID_RE.test(assignmentId)) throw new PermanentSyncError("Penugasan tes tidak valid.");

  const [a] = await rest(
    `recruitment_test_assignments?select=id,candidate_id,test_type,status&id=eq.${assignmentId}`
  );
  if (!a || a.test_type !== "hr2") throw new PermanentSyncError("Penugasan tes tidak ditemukan.");
  if (a.status === "submitted") return { already: true };
  if (a.status !== "assigned" && a.status !== "started") throw new PermanentSyncError("Penugasan tes sudah tidak aktif.");

  const [cand] = await rest(`recruitment_candidates?select=full_name,phone_number&id=eq.${a.candidate_id}`);
  if (
    !cand ||
    !cand.full_name ||
    !sameName(cand.full_name, payload.candidate.fullName) ||
    normalizePhone(cand.phone_number) !== normalizePhone(payload.candidate.whatsapp)
  ) {
    throw new PermanentSyncError("Identitas tidak cocok dengan penugasan tes.");
  }

  try {
    await rest("recruitment_test_results", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        assignment_id: a.id,
        candidate_id: a.candidate_id,
        test_type: "hr2",
        score: record.combined.score,
        max_score: 100,
        started_at: payload.discMeta.startedAt,
        finished_at: payload.iqMeta.finishedAt,
        source_ref: record.candidate_id,
        details: {
          level: payload.candidate.assessmentLevel,
          combined: record.combined,
          disc: record.disc,
          iq: record.iq,
          redFlags: record.redFlags,
          summary: record.summary,
          discAnswers: record.discAnswers,
          iqAnswers: record.iqAnswers
        }
      })
    });
  } catch (err) {
    if ((err as { code?: string }).code !== "23505") throw err; // sudah ada hasil untuk penugasan ini
  }
  await rest(`recruitment_test_assignments?id=eq.${a.id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "submitted", submitted_at: new Date().toISOString() })
  });
  return { already: false };
}
