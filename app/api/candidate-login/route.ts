import { NextResponse } from "next/server";
import {
  findHr2Candidate,
  isSupabaseConfigured,
  markAssignmentStarted
} from "@/lib/storage/supabaseResults";
import { clientIp, isBlocked, recordFailure } from "@/lib/utils/rateLimit";

const fail = (status: number, message: string, extra: object = {}) =>
  NextResponse.json({ success: false, message, ...extra }, { status });

/** Login kandidat: nama + nomor WhatsApp sesuai form pendaftaran. */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return fail(503, "Koneksi database rekrutmen belum dikonfigurasi.", { configured: false });
  }
  const ip = clientIp(request);
  if (isBlocked(ip)) {
    return fail(429, "Terlalu banyak percobaan. Coba lagi dalam 10 menit.");
  }
  try {
    const { fullName, whatsapp } = (await request.json()) as { fullName?: string; whatsapp?: string };
    if (!fullName?.trim() || !whatsapp?.trim()) return fail(400, "Nama dan nomor WhatsApp wajib diisi.");

    const found = await findHr2Candidate(fullName, whatsapp);
    if (!found) {
      recordFailure(ip);
      return fail(404, "Data tidak ditemukan. Pastikan nama dan nomor WhatsApp sama dengan saat mendaftar.");
    }
    const { candidate, assignment, positionTitle } = found;
    if (!assignment) return fail(403, "Tes psikotes belum ditugaskan untuk Anda. Silakan hubungi HR.");
    if (assignment.deadline_at && new Date(assignment.deadline_at) < new Date()) {
      return fail(403, "Batas waktu pengerjaan sudah lewat. Silakan hubungi HR.");
    }

    await markAssignmentStarted(assignment);
    const level = [1, 2, 3].includes(Number(assignment.config?.level)) ? Number(assignment.config.level) : 1;
    return NextResponse.json({
      success: true,
      assignmentId: assignment.id,
      level,
      candidate: {
        fullName: candidate.full_name,
        whatsapp: candidate.phone_number,
        email: candidate.email,
        positionApplied: positionTitle,
        domicile: candidate.address ?? ""
      }
    });
  } catch (error) {
    console.error("[api/candidate-login]", error instanceof Error ? error.message : error);
    return fail(500, "Terjadi kendala di server. Silakan coba lagi.");
  }
}
