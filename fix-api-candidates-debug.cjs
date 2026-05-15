const fs = require("fs");

fs.writeFileSync(
  "app/api/candidates/route.ts",
`import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/utils/auth";
import {
  fetchCandidatesFromGoogleSheets,
  isGoogleSheetsConfigured
} from "@/lib/storage/googleSheets";

export async function GET(request: NextRequest) {
  const cookieValue = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (cookieValue !== "1") {
    return NextResponse.json(
      {
        success: false,
        source: "next-auth-cookie",
        message: "Unauthorized",
        debug: {
          cookieName: ADMIN_COOKIE_NAME,
          cookieValue: cookieValue || null
        }
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
`,
  "utf8"
);

console.log("✅ Patched /api/candidates with debug source.");