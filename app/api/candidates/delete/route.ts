
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/utils/adminSession";
import {
  deleteCandidatesFromGoogleSheets,
  isGoogleSheetsConfigured
} from "@/lib/storage/googleSheets";

export async function DELETE(request: NextRequest) {
  const isAdmin = isAdminRequest(request);

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const candidateIds = Array.isArray(body.candidateIds)
      ? body.candidateIds.filter(Boolean)
      : [];

    if (!candidateIds.length) {
      return NextResponse.json(
        { success: false, message: "candidateIds wajib diisi." },
        { status: 400 }
      );
    }

    if (!isGoogleSheetsConfigured()) {
      return NextResponse.json({
        success: true,
        demo: true,
        deletedCount: candidateIds.length
      });
    }

    const result = await deleteCandidatesFromGoogleSheets(candidateIds, "admin");

    return NextResponse.json({
      success: true,
      demo: false,
      deletedCount: result.deletedCount || candidateIds.length
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menghapus kandidat."
      },
      { status: 500 }
    );
  }
}
