import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/utils/adminSession";
import {
  fetchCandidatesFromGoogleSheets,
  isGoogleSheetsConfigured
} from "@/lib/storage/googleSheets";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      {
        success: false,
        source: "next-auth-cookie",
        message: "Unauthorized"
      },
      { status: 401 }
    );
  }

  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json({
      success: true,
      source: "demo-mode",
      demo: true,
      candidates: []
    });
  }

  try {
    const data = await fetchCandidatesFromGoogleSheets();

    return NextResponse.json({
      ...data,
      source: "google-sheets"
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        source: "google-sheets-error",
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil kandidat."
      },
      { status: 500 }
    );
  }
}
