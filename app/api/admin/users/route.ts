
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/utils/auth";
import {
  addAdminUserToGoogleSheets,
  getAdminUsersFromGoogleSheets,
  isGoogleSheetsConfigured,
  updateAdminUserToGoogleSheets
} from "@/lib/storage/googleSheets";

function requireAdmin(request: NextRequest) {
  return request.cookies.get(ADMIN_COOKIE_NAME)?.value === "1";
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json({
      success: true,
      demo: true,
      users: []
    });
  }

  const data = await getAdminUsersFromGoogleSheets();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json({
      success: false,
      demo: true,
      message: "Google Sheets belum dikonfigurasi."
    }, { status: 400 });
  }

  if (body.action === "add") {
    const data = await addAdminUserToGoogleSheets({
      username: String(body.username || ""),
      password: String(body.password || ""),
      role: String(body.role || "admin")
    });

    return NextResponse.json(data);
  }

  if (body.action === "update") {
    const data = await updateAdminUserToGoogleSheets({
      username: String(body.username || ""),
      password: body.password ? String(body.password) : "",
      active: typeof body.active === "boolean" ? body.active : undefined,
      role: body.role ? String(body.role) : undefined
    });

    return NextResponse.json(data);
  }

  return NextResponse.json(
    { success: false, message: "Action tidak valid." },
    { status: 400 }
  );
}
