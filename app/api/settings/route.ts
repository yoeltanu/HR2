
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/utils/auth";
import {
  fetchSettingsFromGoogleSheets,
  updateSettingToGoogleSheets,
  isGoogleSheetsConfigured
} from "@/lib/storage/googleSheets";
import { DEFAULT_WHATSAPP_TEMPLATE } from "@/lib/utils/whatsapp";

export async function GET(request: NextRequest) {
  const isAdmin = request.cookies.get(ADMIN_COOKIE_NAME)?.value === "1";

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json({
      success: true,
      demo: true,
      settings: {
        whatsapp_candidate_message_template: DEFAULT_WHATSAPP_TEMPLATE
      }
    });
  }

  try {
    const data = await fetchSettingsFromGoogleSheets();

    return NextResponse.json({
      success: true,
      demo: false,
      settings: {
        whatsapp_candidate_message_template:
          data.settings?.whatsapp_candidate_message_template ||
          DEFAULT_WHATSAPP_TEMPLATE,
        ...data.settings
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Gagal mengambil settings."
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const isAdmin = request.cookies.get(ADMIN_COOKIE_NAME)?.value === "1";

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const key = String(body.key || "");
    const value = String(body.value || "");

    if (!key) {
      return NextResponse.json(
        { success: false, message: "Key wajib diisi." },
        { status: 400 }
      );
    }

    if (!isGoogleSheetsConfigured()) {
      return NextResponse.json({
        success: true,
        demo: true,
        key,
        value
      });
    }

    await updateSettingToGoogleSheets(key, value);

    return NextResponse.json({
      success: true,
      demo: false,
      key,
      value
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Gagal menyimpan settings."
      },
      { status: 500 }
    );
  }
}
