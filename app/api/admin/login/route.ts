
import { NextRequest, NextResponse } from "next/server";
import { createAdminSessionResponse } from "@/lib/utils/adminSessionResponse";
import { hasAdminSecret } from "@/lib/utils/adminSession";
import { clientIp, isBlocked, recordFailure } from "@/lib/utils/rateLimit";
import {
  isGoogleSheetsConfigured,
  loginAdminToGoogleSheets
} from "@/lib/storage/googleSheets";

const NOT_CONFIGURED = { success: false, message: "Login admin belum dikonfigurasi." };
const BLOCKED = { success: false, message: "Terlalu banyak percobaan. Coba lagi dalam 10 menit." };

export async function POST(request: NextRequest) {
  if (!hasAdminSecret()) {
    return NextResponse.json(NOT_CONFIGURED, { status: 503 });
  }

  const key = `admin:${clientIp(request)}`;
  if (isBlocked(key)) {
    return NextResponse.json(BLOCKED, { status: 429 });
  }

  const body = await request.json();
  const username = String(body.username || "admin");
  const password = String(body.password || "");

  if (isGoogleSheetsConfigured()) {
    const result = await loginAdminToGoogleSheets(username, password);

    if (!result.success) {
      recordFailure(key);
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

  const fallbackPassword = process.env.ADMIN_PASSWORD || "";

  if (!fallbackPassword) {
    return NextResponse.json(NOT_CONFIGURED, { status: 503 });
  }

  if (username === "admin" && password === fallbackPassword) {
    return createAdminSessionResponse({
      success: true,
      user: {
        username: "admin",
        role: "superadmin"
      }
    });
  }

  recordFailure(key);
  return NextResponse.json(
    { success: false, message: "Username atau password salah." },
    { status: 401 }
  );
}
