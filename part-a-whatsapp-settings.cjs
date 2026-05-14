const fs = require("fs");
const path = require("path");

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
  console.log("Updated:", file);
}

write("lib/utils/whatsapp.ts", `
export const DEFAULT_WHATSAPP_TEMPLATE =
  "Halo {nama}, terima kasih sudah mengikuti assessment Gadgetnio HR Suite untuk posisi {posisi}. Tim HR kami akan meninjau hasil Anda dan menghubungi kembali jika sesuai dengan kebutuhan posisi. Terima kasih.";

export function normalizeWhatsAppNumber(phone: string): string {
  if (!phone) return "";

  let cleaned = phone.replace(/[^\\d]/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  }

  return cleaned;
}

export function buildWhatsAppMessage(template: string, candidate: any): string {
  const safe = (value: any) =>
    value === undefined || value === null || value === "" ? "-" : String(value);

  return template
    .replaceAll("{nama}", safe(candidate.full_name || candidate.fullName || candidate.name))
    .replaceAll("{posisi}", safe(candidate.position_applied || candidate.positionApplied || candidate.position))
    .replaceAll("{disc_type}", safe(candidate.disc_type || candidate.discType))
    .replaceAll("{iq_score}", safe(candidate.iq_score || candidate.iqScore))
    .replaceAll("{combined_score}", safe(candidate.combined_score || candidate.combinedScore))
    .replaceAll("{tanggal_tes}", safe(candidate.created_at || candidate.createdAt));
}

export function buildWhatsAppUrl(candidate: any, template: string): string {
  const phone = normalizeWhatsAppNumber(candidate.whatsapp || candidate.phone || "");
  const message = buildWhatsAppMessage(template, candidate);

  if (!phone) return "";

  return \`https://wa.me/\${phone}?text=\${encodeURIComponent(message)}\`;
}
`);

write("lib/storage/adminSettings.ts", `
"use client";

import { DEFAULT_WHATSAPP_TEMPLATE } from "@/lib/utils/whatsapp";

const SETTINGS_KEY = "hr_assessment_admin_settings";

export interface AdminSettings {
  whatsapp_candidate_message_template: string;
}

export const defaultAdminSettings: AdminSettings = {
  whatsapp_candidate_message_template: DEFAULT_WHATSAPP_TEMPLATE
};

export function getDemoAdminSettings(): AdminSettings {
  if (typeof window === "undefined") return defaultAdminSettings;

  const raw = localStorage.getItem(SETTINGS_KEY);

  if (!raw) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultAdminSettings));
    return defaultAdminSettings;
  }

  try {
    return {
      ...defaultAdminSettings,
      ...JSON.parse(raw)
    };
  } catch {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultAdminSettings));
    return defaultAdminSettings;
  }
}

export function saveDemoAdminSettings(settings: AdminSettings): AdminSettings {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  return settings;
}
`);

write("app/test/completed/page.tsx", `
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Home } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import type { AssessmentRecord } from "@/types/assessment";
import { getLastRecord } from "@/lib/storage/localStorageDemo";

export default function CompletedPage() {
  const [record, setRecord] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    setRecord(getLastRecord());
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-2xl px-4 py-20">
        <div className="rounded-3xl bg-white p-10 text-center shadow-premium">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />

          <h1 className="mt-5 text-3xl font-black text-slate-950">
            Tes Berhasil Dikirim
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            Terima kasih. Jawaban Anda sudah berhasil dikirim ke HR Gadgetnio.
            Silakan menunggu informasi selanjutnya dari tim HR.
          </p>

          {record && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left text-sm text-slate-700">
              <p><strong>Candidate ID:</strong> {record.candidate_id}</p>
              <p><strong>Nama:</strong> {record.candidate.fullName}</p>
              <p><strong>Posisi:</strong> {record.candidate.positionApplied}</p>
            </div>
          )}

          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950"
          >
            <Home className="h-5 w-5" />
            Kembali ke Halaman Utama
          </Link>
        </div>
      </section>
    </main>
  );
}
`);

write("app/api/settings/route.ts", `
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
`);

const googleSheetsPath = "lib/storage/googleSheets.ts";
if (fs.existsSync(googleSheetsPath)) {
  let text = fs.readFileSync(googleSheetsPath, "utf8");

  if (!text.includes("fetchSettingsFromGoogleSheets")) {
    text += `

export async function fetchSettingsFromGoogleSheets() {
  const config = getConfig();

  if (!config.url || !config.secret) {
    return { success: true, demo: true, settings: {} };
  }

  const url = \`\${config.url}?action=getSettings&secret=\${encodeURIComponent(config.secret)}\`;

  const response = await fetch(url, { cache: "no-store" });
  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal mengambil settings.");
  }

  return data;
}

export async function updateSettingToGoogleSheets(key: string, value: string) {
  const config = getConfig();

  if (!config.url || !config.secret) {
    return { success: true, demo: true, key, value };
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "updateSetting",
      secret: config.secret,
      key,
      value
    }),
    cache: "no-store"
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal menyimpan settings.");
  }

  return data;
}
`;
    fs.writeFileSync(googleSheetsPath, text, "utf8");
    console.log("Patched:", googleSheetsPath);
  } else {
    console.log("Skipped:", googleSheetsPath, "already has settings functions");
  }
}

console.log("");
console.log("✅ Part A selesai.");
console.log("Sekarang jalankan: npm run build");