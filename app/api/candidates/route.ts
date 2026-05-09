import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/utils/auth";
import { fetchCandidatesFromGoogleSheets } from "@/lib/storage/googleSheets";

export async function GET(request: NextRequest) {
  const isAdmin = request.cookies.get(ADMIN_COOKIE_NAME)?.value === "1";

  if (!isAdmin) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized"
      },
      { status: 401 }
    );
  }

  try {
    const data = await fetchCandidatesFromGoogleSheets();

    return NextResponse.json(data);
  } catch (error) {
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      return NextResponse.json({
        success: true,
        demo: true,
        warning:
          error instanceof Error
            ? error.message
            : "Google Sheets error, fallback demo.",
        candidates: []
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil kandidat."
      },
      { status: 500 }
    );
  }
}
