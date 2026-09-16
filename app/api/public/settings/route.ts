import { NextResponse } from "next/server";
import {
  getPublicAssessmentConfig,
  parseAdminConfigValue,
  defaultAdminConfig,
  ASSESSMENT_CONFIG_KEY
} from "@/lib/storage/adminConfig";
import {
  fetchSettingsFromGoogleSheets,
  isGoogleSheetsConfigured
} from "@/lib/storage/googleSheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const headers = {
    "Cache-Control": "no-store, max-age=0"
  };

  if (!isGoogleSheetsConfigured()) {
    return NextResponse.json(
      {
        success: true,
        demo: true,
        ...getPublicAssessmentConfig(defaultAdminConfig)
      },
      { headers }
    );
  }

  try {
    const data = await fetchSettingsFromGoogleSheets();
    const rawConfig = data.settings?.[ASSESSMENT_CONFIG_KEY];
    const config = rawConfig
      ? parseAdminConfigValue(rawConfig)
      : parseAdminConfigValue(defaultAdminConfig);

    return NextResponse.json(
      {
        success: true,
        demo: false,
        ...getPublicAssessmentConfig(config)
      },
      { headers }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil konfigurasi assessment."
      },
      { status: 503, headers }
    );
  }
}
