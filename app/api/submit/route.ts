import { NextResponse } from "next/server";
import type { AssessmentPayload } from "@/types/assessment";
import { buildAssessmentRecord } from "@/lib/combined/combinedScoring";
import { validateAssessmentPayload } from "@/lib/utils/validation";
import { isSupabaseConfigured, saveHr2Result } from "@/lib/storage/supabaseResults";
import {
  isGoogleSheetsConfigured,
  submitToGoogleSheets
} from "@/lib/storage/googleSheets";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AssessmentPayload;
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

    const record = buildAssessmentRecord(payload);

    // Salinan hasil ke database ERP (idempoten). Gagal di sini tidak membatalkan penyimpanan ke Google Sheets.
    let supabase: { success: boolean; message?: string } | undefined;
    if (isSupabaseConfigured() && payload.candidate.assignmentId) {
      try {
        await saveHr2Result(payload, record);
        supabase = { success: true };
      } catch (error) {
        console.error("[api/submit] supabase", error instanceof Error ? error.message : error);
        supabase = {
          success: false,
          message: error instanceof Error ? error.message : "Gagal menyimpan ke database ERP."
        };
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

      throw error;
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
