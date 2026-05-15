
import { NextRequest, NextResponse } from "next/server";
import { createAdminSessionResponse } from "@/lib/utils/auth";
import {
  isGoogleSheetsConfigured,
  loginAdminToGoogleSheets
} from "@/lib/storage/googleSheets";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const username = String(body.username || "admin");
  const password = String(body.password || "");

  if (isGoogleSheetsConfigured()) {
    const result = await loginAdminToGoogleSheets(username, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || "Login gagal." },
        { status: 401 }
      );
    }

    return createAdminSessionResponse({
      success: true,
      user: result.user
    });
  }

  const fallbackPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (username === "admin" && password === fallbackPassword) {
    return createAdminSessionResponse({
      success: true,
      user: {
        username: "admin",
        role: "superadmin"
      }
    });
  }

  return NextResponse.json(
    { success: false, message: "Username atau password salah." },
    { status: 401 }
  );
}
