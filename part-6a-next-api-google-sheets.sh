#!/usr/bin/env bash
set -e

echo "Installing Part 6A — Next.js API + Google Sheets Proxy..."

mkdir -p lib/storage app/api/submit app/api/candidates app/api/candidate/[id]

cat > lib/storage/googleSheets.ts <<'EOF'
import type { AssessmentRecord } from "@/types/assessment";

function getConfig() {
  return {
    url: process.env.GOOGLE_SCRIPT_URL || "",
    secret: process.env.GOOGLE_SCRIPT_SECRET || ""
  };
}

export function isGoogleSheetsConfigured(): boolean {
  const config = getConfig();
  return Boolean(config.url && config.secret);
}

async function parseJsonResponse(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `Google Apps Script tidak mengembalikan JSON valid. Response: ${text.slice(
        0,
        300
      )}`
    );
  }
}

export async function submitToGoogleSheets(record: AssessmentRecord) {
  const config = getConfig();

  if (!config.url || !config.secret) {
    return {
      success: false,
      demo: true,
      message: "Google Sheets belum dikonfigurasi."
    };
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      action: "submitAssessment",
      secret: config.secret,
      record
    }),
    cache: "no-store"
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal menyimpan ke Google Sheets.");
  }

  return data;
}

export async function fetchCandidatesFromGoogleSheets() {
  const config = getConfig();

  if (!config.url || !config.secret) {
    return {
      success: true,
      demo: true,
      candidates: []
    };
  }

  const url = `${config.url}?action=getCandidates&secret=${encodeURIComponent(
    config.secret
  )}`;

  const response = await fetch(url, {
    cache: "no-store"
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal mengambil data kandidat.");
  }

  return data;
}

export async function fetchCandidateDetailFromGoogleSheets(id: string) {
  const config = getConfig();

  if (!config.url || !config.secret) {
    return {
      success: true,
      demo: true,
      candidate: null
    };
  }

  const url = `${config.url}?action=getCandidateDetail&candidate_id=${encodeURIComponent(
    id
  )}&secret=${encodeURIComponent(config.secret)}`;

  const response = await fetch(url, {
    cache: "no-store"
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal mengambil detail kandidat.");
  }

  return data;
}

export async function healthCheckGoogleSheets() {
  const config = getConfig();

  if (!config.url || !config.secret) {
    return {
      success: false,
      demo: true,
      message: "Google Sheets belum dikonfigurasi."
    };
  }

  const url = `${config.url}?action=healthCheck&secret=${encodeURIComponent(
    config.secret
  )}`;

  const response = await fetch(url, {
    cache: "no-store"
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Health check gagal.");
  }

  return data;
}
EOF

cat > app/api/submit/route.ts <<'EOF'
import { NextResponse } from "next/server";
import type { AssessmentPayload } from "@/types/assessment";
import { buildAssessmentRecord } from "@/lib/combined/combinedScoring";
import { validateAssessmentPayload } from "@/lib/utils/validation";
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

    if (!isGoogleSheetsConfigured()) {
      return NextResponse.json({
        success: true,
        demo: true,
        message:
          "Demo Mode aktif. GOOGLE_SCRIPT_URL atau GOOGLE_SCRIPT_SECRET belum dikonfigurasi.",
        record
      });
    }

    try {
      const result = await submitToGoogleSheets(record);

      return NextResponse.json({
        success: true,
        demo: false,
        googleSheets: result,
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
EOF

cat > app/api/candidates/route.ts <<'EOF'
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
EOF

cat > "app/api/candidate/[id]/route.ts" <<'EOF'
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/utils/auth";
import { fetchCandidateDetailFromGoogleSheets } from "@/lib/storage/googleSheets";

export async function GET(
  request: NextRequest,
  context: {
    params: {
      id: string;
    };
  }
) {
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
    const data = await fetchCandidateDetailFromGoogleSheets(context.params.id);

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
        candidate: null
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengambil detail kandidat."
      },
      { status: 500 }
    );
  }
}
EOF

cat > app/admin/settings/page.tsx <<'EOF'
import AdminLayout from "@/components/layout/AdminLayout";

export default function SettingsPage() {
  const hasScriptUrl = Boolean(process.env.GOOGLE_SCRIPT_URL);
  const hasSecret = Boolean(process.env.GOOGLE_SCRIPT_SECRET);

  return (
    <AdminLayout>
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-950">Settings</h1>

        <p className="mt-2 text-slate-600">
          Konfigurasi utama dilakukan melalui file <code>.env.local</code> dan
          Google Apps Script.
        </p>

        <div className="mt-6 grid gap-4">
          <Setting
            label="NEXT_PUBLIC_APP_NAME"
            value={process.env.NEXT_PUBLIC_APP_NAME || "HR Assessment Platform"}
          />
          <Setting
            label="NEXT_PUBLIC_DEMO_MODE"
            value={process.env.NEXT_PUBLIC_DEMO_MODE || "true"}
          />
          <Setting
            label="GOOGLE_SCRIPT_URL"
            value={hasScriptUrl ? "Configured" : "Belum dikonfigurasi"}
            ok={hasScriptUrl}
          />
          <Setting
            label="GOOGLE_SCRIPT_SECRET"
            value={hasSecret ? "Configured" : "Belum dikonfigurasi"}
            ok={hasSecret}
          />
          <Setting
            label="Database Mode"
            value={
              hasScriptUrl && hasSecret
                ? "Google Sheets aktif"
                : "Demo Mode localStorage aktif"
            }
            ok={hasScriptUrl && hasSecret}
          />
        </div>

        <div className="mt-8 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Jika Google Sheets belum dikonfigurasi, kandidat tetap bisa submit
          assessment dalam Demo Mode. Data demo hanya tersimpan di browser yang
          sama.
        </div>
      </div>
    </AdminLayout>
  );
}

function Setting({
  label,
  value,
  ok
}: {
  label: string;
  value: string;
  ok?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p
        className={`mt-1 font-semibold ${
          ok === undefined
            ? "text-slate-900"
            : ok
              ? "text-emerald-700"
              : "text-amber-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
EOF

cat >> README.md <<'EOF'

---

## Part 6A — Next.js API + Google Sheets Proxy

Fitur yang ditambahkan:
- `lib/storage/googleSheets.ts`
- `POST /api/submit`
- `GET /api/candidates`
- `GET /api/candidate/[id]`
- Submit assessment ke Google Apps Script jika env sudah dikonfigurasi.
- Fallback Demo Mode jika Google Sheets belum dikonfigurasi.
- Fallback Demo Mode jika Google Sheets error dan `NEXT_PUBLIC_DEMO_MODE=true`.
- Admin route dilindungi cookie `hr_admin_session`.
- Settings page menampilkan status konfigurasi Google Sheets.

Environment variables:

```env
NEXT_PUBLIC_APP_NAME="HR Assessment Platform"
ADMIN_PASSWORD="ganti_password_admin"
GOOGLE_SCRIPT_URL=""
GOOGLE_SCRIPT_SECRET="ganti_secret_key"
NEXT_PUBLIC_DEMO_MODE="true"