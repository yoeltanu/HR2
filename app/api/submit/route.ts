import { NextResponse } from "next/server";
import type { AssessmentPayload } from "@/types/assessment";
import { buildAssessmentRecord } from "@/lib/combined/combinedScoring";
import { validateAssessmentPayload } from "@/lib/utils/validation";
import {
  PermanentSyncError,
  getHr2AssignmentContext,
  isSupabaseConfigured,
  saveHr2Result
} from "@/lib/storage/supabaseResults";
import {
  isGoogleSheetsConfigured,
  submitToGoogleSheets
} from "@/lib/storage/googleSheets";

const RETRY_MESSAGE = "Hasil belum tersimpan karena gangguan koneksi. Klik Submit Final sekali lagi.";

export async function POST(request: Request) {
  try {
    let payload: AssessmentPayload;
    try {
      payload = (await request.json()) as AssessmentPayload;
    } catch {
      return NextResponse.json({ success: false, message: "Format data tidak valid." }, { status: 400 });
    }
    const errors = validateAssessmentPayload(payload);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors,
          message: errors.join(" ")
        },
        { status: 400 }
      );
    }

    // Level dan posisi diambil dari penugasan, bukan dari klien.
    const linked = isSupabaseConfigured() && Boolean(payload.candidate.assignmentId);
    if (linked) {
      try {
        const context = await getHr2AssignmentContext(payload.candidate.assignmentId as string);
        if (Number(payload.candidate.assessmentLevel) !== context.level) {
          return NextResponse.json(
            { success: false, message: "Level tes tidak sesuai penugasan. Hubungi HR." },
            { status: 403 }
          );
        }
        if (context.positionTitle) payload.candidate.positionApplied = context.positionTitle;
      } catch (error) {
        if (!(error instanceof PermanentSyncError)) {
          console.error("[api/submit] assignment", error instanceof Error ? error.message : error);
          return NextResponse.json({ success: false, message: RETRY_MESSAGE }, { status: 503 });
        }
      }
    }

    const record = buildAssessmentRecord(payload);

    // Salinan hasil ke database ERP (idempoten). Gagal permanen tidak membatalkan Google Sheets;
    // gangguan sementara dihentikan dulu agar percobaan ulang tidak menduplikasi baris Sheets.
    let supabase: { success: boolean; message?: string } | undefined;
    if (linked) {
      try {
        await saveHr2Result(payload, record);
        supabase = { success: true };
      } catch (error) {
        if (!(error instanceof PermanentSyncError)) {
          console.error("[api/submit] supabase", error instanceof Error ? error.message : error);
          return NextResponse.json({ success: false, message: RETRY_MESSAGE }, { status: 503 });
        }
        console.error("[api/submit] supabase", error.message);
        supabase = { success: false, message: error.message };
      }
    }

    if (!isGoogleSheetsConfigured()) {
      return NextResponse.json({
        success: true,
        demo: true,
        message:
          "Demo Mode aktif. GOOGLE_SCRIPT_URL atau GOOGLE_SCRIPT_SECRET belum dikonfigurasi.",
        supabase,
        record
      });
    }

    try {
      const result = await submitToGoogleSheets(record);

      return NextResponse.json({
        success: true,
        demo: false,
        googleSheets: result,
        supabase,
        record
      });
    } catch (error) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        return NextResponse.json({
          success: true,
          demo: true,
          warning:
            error instanceof Error
              ? error.message
              : "Google Sheets error, fallback ke Demo Mode.",
          supabase,
          record
        });
      }

      // Pesan dari Apps Script (mis. HTML) tidak ditampilkan ke kandidat.
      console.error("[api/submit] sheets", error instanceof Error ? error.message : error);
      return NextResponse.json({ success: false, message: RETRY_MESSAGE }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat submit assessment."
      },
      { status: 500 }
    );
  }
}
