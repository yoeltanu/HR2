#!/usr/bin/env bash
set -e

echo "Installing Part 8 — Admin Manual Book + Configurable Settings..."

mkdir -p app/admin/manual-book
mkdir -p lib/storage
mkdir -p components/admin

cat > lib/storage/adminConfig.ts <<'EOF'
"use client";

export interface PositionOption {
  id: string;
  label: string;
  active: boolean;
}

export interface AssessmentLevelOption {
  value: 1 | 2 | 3;
  label: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  active: boolean;
}

export interface HRAdminConfig {
  positions: PositionOption[];
  levels: AssessmentLevelOption[];
  hrWhatsapp: string;
  updatedAt: string;
}

export const ADMIN_CONFIG_KEY = "hr_assessment_admin_config";

export const defaultAdminConfig: HRAdminConfig = {
  positions: [
    { id: "accounting", label: "Accounting", active: true },
    { id: "admin-retur", label: "Admin Retur", active: true },
    { id: "admin-inbound", label: "Admin Inbound", active: true },
    { id: "customer-service", label: "Customer Service", active: true },
    { id: "ecommerce-specialist", label: "E-commerce Specialist", active: true },
    { id: "head-of-sales", label: "Head of Sales", active: true },
    { id: "procurement", label: "Procurement", active: true },
    { id: "warehouse-leader", label: "Warehouse Leader", active: true },
    { id: "packing-staff", label: "Packing Staff", active: true },
    { id: "hrga", label: "HRGA", active: true },
    { id: "personal-assistant", label: "Personal Assistant", active: true },
    { id: "lainnya", label: "Lainnya", active: true }
  ],
  levels: [
    {
      value: 1,
      label: "Level 1: Staff Operasional / Admin Dasar",
      description: "Untuk staff operasional, admin dasar, packing, CS junior, dan role entry-level.",
      durationMinutes: 20,
      totalQuestions: 25,
      active: true
    },
    {
      value: 2,
      label: "Level 2: Specialist / Admin Senior",
      description: "Untuk accounting staff, admin senior, marketplace staff, procurement junior, dan specialist.",
      durationMinutes: 30,
      totalQuestions: 35,
      active: true
    },
    {
      value: 3,
      label: "Level 3: Supervisor / Leader",
      description: "Untuk supervisor, warehouse leader, head of sales, strategic assistant, dan leadership role.",
      durationMinutes: 40,
      totalQuestions: 45,
      active: true
    }
  ],
  hrWhatsapp: "6281234567890",
  updatedAt: new Date().toISOString()
};

export function createIdFromLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `position-${Date.now()}`;
}

export function getAdminConfig(): HRAdminConfig {
  if (typeof window === "undefined") return defaultAdminConfig;

  const raw = localStorage.getItem(ADMIN_CONFIG_KEY);

  if (!raw) {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(defaultAdminConfig));
    return defaultAdminConfig;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<HRAdminConfig>;

    return {
      positions: Array.isArray(parsed.positions) && parsed.positions.length
        ? parsed.positions
        : defaultAdminConfig.positions,
      levels: Array.isArray(parsed.levels) && parsed.levels.length
        ? parsed.levels
        : defaultAdminConfig.levels,
      hrWhatsapp: parsed.hrWhatsapp || defaultAdminConfig.hrWhatsapp,
      updatedAt: parsed.updatedAt || new Date().toISOString()
    };
  } catch {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(defaultAdminConfig));
    return defaultAdminConfig;
  }
}

export function saveAdminConfig(config: HRAdminConfig): HRAdminConfig {
  const next: HRAdminConfig = {
    ...config,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("hr-admin-config-updated"));

  return next;
}

export function resetAdminConfig(): HRAdminConfig {
  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(defaultAdminConfig));
  window.dispatchEvent(new Event("hr-admin-config-updated"));

  return defaultAdminConfig;
}

export function getActivePositions(): PositionOption[] {
  return getAdminConfig().positions.filter((item) => item.active);
}

export function getActiveLevels(): AssessmentLevelOption[] {
  return getAdminConfig().levels.filter((item) => item.active);
}

export function getLevelConfig(level: 1 | 2 | 3): AssessmentLevelOption {
  return (
    getAdminConfig().levels.find((item) => item.value === level) ||
    defaultAdminConfig.levels.find((item) => item.value === level) ||
    defaultAdminConfig.levels[0]
  );
}
EOF

cat > lib/storage/localStorageDemo.ts <<'EOF'
"use client";

import type { AssessmentPayload, AssessmentRecord } from "@/types/assessment";
import type { CandidateInfo } from "@/types/candidate";
import { sampleAssessmentRecords } from "./sampleData";

const DRAFT_KEY = "hr_assessment_candidate_draft";
const DISC_KEY = "hr_assessment_disc_answers";
const DISC_META_KEY = "hr_assessment_disc_meta";
const IQ_KEY = "hr_assessment_iq_answers";
const IQ_META_KEY = "hr_assessment_iq_meta";
const RECORDS_KEY = "hr_assessment_demo_records";
const LAST_RECORD_KEY = "hr_assessment_last_record";

export const storageKeys = {
  DRAFT_KEY,
  DISC_KEY,
  DISC_META_KEY,
  IQ_KEY,
  IQ_META_KEY,
  RECORDS_KEY,
  LAST_RECORD_KEY
};

export function saveCandidateDraft(data: CandidateInfo): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

export function getCandidateDraft(): CandidateInfo | null {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CandidateInfo;
  } catch {
    return null;
  }
}

export function saveJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getDemoRecords(): AssessmentRecord[] {
  return getJson<AssessmentRecord[]>(RECORDS_KEY, []);
}

export function getDemoRecordById(id: string): AssessmentRecord | null {
  return getDemoRecords().find((record) => record.candidate_id === id) || null;
}

export function storeDemoRecord(record: AssessmentRecord): void {
  const records = getDemoRecords();
  const exists = records.some((item) => item.candidate_id === record.candidate_id);

  if (!exists) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify([record, ...records]));
  }

  localStorage.setItem(LAST_RECORD_KEY, JSON.stringify(record));
}

export function updateDemoRecordCandidate(
  candidateId: string,
  updates: Partial<CandidateInfo>
): AssessmentRecord | null {
  const records = getDemoRecords();
  let updatedRecord: AssessmentRecord | null = null;

  const next = records.map((record) => {
    if (record.candidate_id !== candidateId) return record;

    updatedRecord = {
      ...record,
      candidate: {
        ...record.candidate,
        ...updates
      },
      summary: buildUpdatedSummary(record, updates)
    };

    return updatedRecord;
  });

  localStorage.setItem(RECORDS_KEY, JSON.stringify(next));

  const last = getLastRecord();
  if (last?.candidate_id === candidateId && updatedRecord) {
    localStorage.setItem(LAST_RECORD_KEY, JSON.stringify(updatedRecord));
  }

  return updatedRecord;
}

function buildUpdatedSummary(
  record: AssessmentRecord,
  updates: Partial<CandidateInfo>
): string {
  const candidate = {
    ...record.candidate,
    ...updates
  };

  return [
    `${candidate.fullName} melamar posisi ${candidate.positionApplied}.`,
    `DISC ${record.disc.type} dengan fit ${record.disc.fitScore}.`,
    `Cognitive Ability Screening ${record.iq.percentageScore}% dengan fit ${record.iq.fitScore}.`,
    `Rekomendasi akhir: ${record.combined.recommendation}.`,
    "Catatan: hasil assessment adalah alat bantu HR dan bukan satu-satunya dasar keputusan hiring."
  ].join(" ");
}

export function seedSampleDemoRecords(): AssessmentRecord[] {
  const existing = getDemoRecords();
  const merged = [...existing];

  sampleAssessmentRecords.forEach((sample) => {
    const exists = merged.some((item) => item.candidate_id === sample.candidate_id);
    if (!exists) merged.push(sample);
  });

  localStorage.setItem(RECORDS_KEY, JSON.stringify(merged));
  return merged;
}

export function resetDemoRecordsWithSamples(): AssessmentRecord[] {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(sampleAssessmentRecords));
  return sampleAssessmentRecords;
}

export function clearDemoRecords(): void {
  localStorage.removeItem(RECORDS_KEY);
  localStorage.removeItem(LAST_RECORD_KEY);
}

export function getLastRecord(): AssessmentRecord | null {
  return getJson<AssessmentRecord | null>(LAST_RECORD_KEY, null);
}

export function clearAssessmentDraft(): void {
  [
    DRAFT_KEY,
    DISC_KEY,
    DISC_META_KEY,
    IQ_KEY,
    IQ_META_KEY
  ].forEach((key) => localStorage.removeItem(key));
}

export function buildAndStoreDemoRecord(_payload: AssessmentPayload): AssessmentRecord {
  throw new Error(
    "buildAndStoreDemoRecord tidak dipakai. Submit record dibuat melalui /api/submit lalu disimpan memakai storeDemoRecord()."
  );
}
EOF

cat > components/layout/Sidebar.tsx <<'EOF'
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, BookOpen, LogOut, Settings, Users } from "lucide-react";
import { clearAdminSessionClient } from "@/lib/utils/auth";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="no-print min-h-screen w-full border-r border-slate-200 bg-white p-4 md:w-72">
      <div className="mb-8 rounded-2xl bg-navy-950 p-5 text-white">
        <p className="text-sm text-cyanx">HR Suite</p>
        <h2 className="text-lg font-bold">Assessment Admin</h2>
      </div>

      <nav className="space-y-2">
        <Link
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
          href="/admin/dashboard"
        >
          <Users className="h-5 w-5" />
          Dashboard
        </Link>

        <Link
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
          href="/admin/manual-book"
        >
          <BookOpen className="h-5 w-5" />
          Manual Book
        </Link>

        <Link
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
          href="/admin/settings"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>

        <button
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-600 hover:bg-red-50"
          onClick={() => {
            clearAdminSessionClient();
            router.push("/admin/login");
          }}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </nav>

      <div className="mt-8 rounded-2xl bg-cyan-50 p-4 text-sm text-slate-700">
        <BarChart3 className="mb-2 h-5 w-5 text-cyan-700" />
        Hasil assessment adalah alat bantu HR, bukan keputusan final otomatis.
      </div>
    </aside>
  );
}
EOF

cat > app/admin/manual-book/page.tsx <<'EOF'
import AdminLayout from "@/components/layout/AdminLayout";

export default function ManualBookPage() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-navy-950 p-8 text-white shadow-premium">
          <p className="text-sm font-bold uppercase tracking-wide text-cyanx">
            Manual Book HR Staff
          </p>
          <h1 className="mt-3 text-4xl font-black">
            Panduan HR Assessment Platform
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-200">
            Modul ini membantu HR memahami konsep, tujuan, alur assessment,
            cara membaca hasil DISC, Cognitive Ability Screening, Combined
            Score, red flags, dan langkah follow-up interview.
          </p>
        </div>

        <ManualSection title="1. Konsep dan Tujuan Website">
          <p>
            HR Assessment Platform adalah website internal untuk membantu HR
            melakukan screening kandidat secara lebih konsisten, cepat, dan
            terdokumentasi.
          </p>
          <InfoGrid
            items={[
              ["Screening lebih konsisten", "Semua kandidat mengikuti alur dan format assessment yang sama."],
              ["Mengurangi subjektivitas", "HR mendapat data DISC, cognitive score, red flags, dan summary."],
              ["Mempercepat seleksi", "Dashboard membantu HR melihat kandidat prioritas dengan cepat."],
              ["Bahan interview", "Sistem menyediakan interview questions otomatis berdasarkan hasil."]
            ]}
          />
        </ManualSection>

        <ManualSection title="2. Komponen Assessment">
          <InfoGrid
            items={[
              ["DISC Personality Test", "Membaca gaya kerja, komunikasi, stabilitas, ketelitian, dan kecenderungan perilaku kerja."],
              ["Cognitive Ability Screening", "Membaca logika, angka, pemahaman instruksi, pola, dan ketelitian kerja."],
              ["Combined Hiring Score", "Menggabungkan DISC Fit dan Cognitive Fit sesuai bobot posisi."],
              ["Red Flags", "Sinyal yang perlu dikonfirmasi saat interview, bukan vonis otomatis."]
            ]}
          />
        </ManualSection>

        <ManualSection title="3. Level Assessment">
          <Table
            headers={["Level", "Target Posisi", "Jumlah Soal", "Durasi"]}
            rows={[
              ["Level 1", "Staff operasional / admin dasar", "25 soal", "20 menit"],
              ["Level 2", "Specialist / admin senior / accounting staff", "35 soal", "30 menit"],
              ["Level 3", "Supervisor / leader / strategic assistant", "45 soal", "40 menit"]
            ]}
          />
        </ManualSection>

        <ManualSection title="4. Peran HR Staff">
          <Checklist
            title="Sebelum assessment"
            items={[
              "Pastikan posisi kandidat benar.",
              "Pilih assessment level yang sesuai.",
              "Pastikan kandidat memahami durasi dan instruksi.",
              "Kirim link assessment yang benar."
            ]}
          />
          <Checklist
            title="Saat assessment"
            items={[
              "Bantu kendala teknis jika ada.",
              "Jangan memberikan jawaban atau petunjuk soal.",
              "Pastikan kandidat mengerjakan secara mandiri."
            ]}
          />
          <Checklist
            title="Setelah assessment"
            items={[
              "Buka dashboard admin.",
              "Baca detail kandidat.",
              "Cek DISC type, cognitive score, combined score, dan red flags.",
              "Gunakan interview questions untuk konfirmasi."
            ]}
          />
        </ManualSection>

        <ManualSection title="5. Cara Membaca DISC">
          <Table
            headers={["Kode", "Nama", "Karakter Umum"]}
            rows={[
              ["D", "Dominance", "Tegas, cepat mengambil keputusan, target-oriented."],
              ["I", "Influence", "Komunikatif, ekspresif, mudah membangun relasi."],
              ["S", "Steadiness", "Stabil, sabar, konsisten, suportif."],
              ["C", "Conscientiousness", "Teliti, sistematis, analitis, patuh SOP."]
            ]}
          />
          <p>
            DISC type bisa satu huruf seperti C atau kombinasi dua huruf seperti
            CS. Kombinasi dua huruf berarti dua dimensi tertinggi cukup dekat.
          </p>
        </ManualSection>

        <ManualSection title="6. Cara Membaca Cognitive Ability Screening">
          <Table
            headers={["Subtest", "Yang Diukur", "Contoh Kegunaan"]}
            rows={[
              ["Logical", "Logika dan pengambilan kesimpulan", "Prioritas masalah operasional."],
              ["Numerical", "Angka, margin, stok, diskon, ROAS", "Accounting, procurement, marketplace."],
              ["Verbal", "Instruksi dan komunikasi tertulis", "CS, HRGA, admin, reporting."],
              ["Pattern", "Pola dan alur proses", "Warehouse, SOP, problem solving."],
              ["Working Accuracy", "Ketelitian data, invoice, SKU, alamat", "Checker, accounting, packing, inventory."]
            ]}
          />
        </ManualSection>

        <ManualSection title="7. Combined Hiring Score">
          <Table
            headers={["Score", "Rekomendasi", "Tindakan HR"]}
            rows={[
              ["85–100", "Prioritas tinggi", "Lanjut interview sebagai kandidat utama."],
              ["75–84", "Layak lanjut", "Lanjut interview dengan konfirmasi area tertentu."],
              ["65–74", "Perlu konfirmasi", "Interview lebih dalam dan gunakan simulasi kerja."],
              ["50–64", "Cadangan", "Simpan sebagai backup."],
              ["<50", "Tidak prioritas", "Tidak disarankan lanjut kecuali ada alasan kuat."]
            ]}
          />
        </ManualSection>

        <ManualSection title="8. Red Flags">
          <Table
            headers={["Red Flag", "Kemungkinan Makna", "Tindakan HR"]}
            rows={[
              ["Waktu terlalu cepat", "Kandidat terburu-buru atau kurang membaca soal.", "Tanyakan cara kandidat mengerjakan."],
              ["Banyak soal kosong", "Kandidat lambat, ragu, atau kesulitan memahami soal.", "Konfirmasi dengan interview dan simulasi."],
              ["Pola jawaban monoton", "Kemungkinan menebak.", "Tanyakan kendala saat mengerjakan."],
              ["Subtest tidak seimbang", "Ada area kemampuan yang lemah.", "Cocokkan dengan kebutuhan posisi."],
              ["Banyak perubahan jawaban", "Kandidat ragu-ragu.", "Tanyakan cara mengambil keputusan."]
            ]}
          />
        </ManualSection>

        <ManualSection title="9. Panduan Interview">
          <Checklist
            title="Pertanyaan umum"
            items={[
              "Ceritakan situasi kerja yang paling menggambarkan cara Anda bekerja.",
              "Bagaimana Anda menghadapi target yang mendadak naik?",
              "Bagaimana Anda memastikan pekerjaan tidak salah?",
              "Apa yang Anda lakukan jika instruksi atasan berbeda dengan kondisi lapangan?",
              "Bagian mana dari tes yang menurut Anda paling sulit?"
            ]}
          />
        </ManualSection>

        <ManualSection title="10. Etika Penggunaan Assessment">
          <Checklist
            title="Prinsip utama"
            items={[
              "Jangan gunakan hasil assessment sebagai satu-satunya dasar keputusan.",
              "Jangan memberi label negatif permanen berdasarkan DISC.",
              "Gunakan red flags untuk konfirmasi, bukan vonis.",
              "Tetap pertimbangkan interview, pengalaman, referensi, dan simulasi kerja.",
              "Jaga kerahasiaan data kandidat."
            ]}
          />
        </ManualSection>
      </div>
    </AdminLayout>
  );
}

function ManualSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-slate-700">{children}</div>
    </section>
  );
}

function InfoGrid({
  items
}: {
  items: [string, string][];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(([title, text]) => (
        <div key={title} className="rounded-2xl bg-slate-50 p-4">
          <p className="font-bold text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
        </div>
      ))}
    </div>
  );
}

function Table({
  headers,
  rows
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-navy-950 text-white">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-slate-100">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Checklist({
  title,
  items
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-cyan-50 p-4">
      <p className="font-bold text-cyan-900">{title}</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-cyan-950">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
EOF

cat > app/admin/settings/page.tsx <<'EOF'
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  createIdFromLabel,
  getAdminConfig,
  resetAdminConfig,
  saveAdminConfig,
  type AssessmentLevelOption,
  type HRAdminConfig,
  type PositionOption
} from "@/lib/storage/adminConfig";

export default function SettingsPage() {
  const [config, setConfig] = useState<HRAdminConfig | null>(null);
  const [newPosition, setNewPosition] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    setConfig(getAdminConfig());
  }, []);

  function updateConfig(next: HRAdminConfig) {
    setConfig(next);
    saveAdminConfig(next);
    setSavedMessage("Settings berhasil disimpan.");
    window.setTimeout(() => setSavedMessage(""), 2200);
  }

  function addPosition() {
    if (!config) return;

    const label = newPosition.trim();
    if (!label) return;

    const exists = config.positions.some(
      (item) => item.label.toLowerCase() === label.toLowerCase()
    );

    if (exists) {
      alert("Posisi sudah ada.");
      return;
    }

    const next: HRAdminConfig = {
      ...config,
      positions: [
        ...config.positions,
        {
          id: createIdFromLabel(label),
          label,
          active: true
        }
      ]
    };

    setNewPosition("");
    updateConfig(next);
  }

  function updatePosition(index: number, update: Partial<PositionOption>) {
    if (!config) return;

    const next = {
      ...config,
      positions: config.positions.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...update } : item
      )
    };

    updateConfig(next);
  }

  function removePosition(index: number) {
    if (!config) return;

    const ok = confirm("Hapus posisi ini dari pilihan kandidat?");
    if (!ok) return;

    const next = {
      ...config,
      positions: config.positions.filter((_, itemIndex) => itemIndex !== index)
    };

    updateConfig(next);
  }

  function updateLevel(
    value: 1 | 2 | 3,
    update: Partial<AssessmentLevelOption>
  ) {
    if (!config) return;

    const next = {
      ...config,
      levels: config.levels.map((level) =>
        level.value === value ? { ...level, ...update } : level
      )
    };

    updateConfig(next);
  }

  function handleReset() {
    const ok = confirm("Reset semua settings ke default?");
    if (!ok) return;

    setConfig(resetAdminConfig());
    setSavedMessage("Settings dikembalikan ke default.");
    window.setTimeout(() => setSavedMessage(""), 2200);
  }

  if (!config) {
    return (
      <AdminLayout>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          Memuat settings...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-950">
                Admin Settings
              </h1>
              <p className="mt-2 max-w-3xl text-slate-600">
                HR dapat mengatur pilihan posisi kandidat, label level assessment,
                dan nomor WhatsApp HR. Setting ini disimpan di browser admin
                untuk Demo Mode.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="rounded-2xl bg-red-50 px-4 py-3 font-bold text-red-700 hover:bg-red-100"
            >
              Reset Default
            </button>
          </div>

          {savedMessage && (
            <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              {savedMessage}
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Catatan: konfigurasi ini berlaku untuk form kandidat pada browser
            yang sama. Untuk produksi multi-admin, konfigurasi sebaiknya
            dipindahkan ke Google Sheets / database.
          </div>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Nomor WhatsApp HR
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Nomor ini dapat ditampilkan sebagai kontak HR internal.
          </p>

          <input
            className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
            value={config.hrWhatsapp}
            onChange={(event) =>
              updateConfig({
                ...config,
                hrWhatsapp: event.target.value
              })
            }
            placeholder="Contoh: 6281234567890"
          />
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Pilihan Posisi Kandidat
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Posisi aktif akan muncul di form kandidat.
          </p>

          <div className="mt-5 flex gap-3">
            <input
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              value={newPosition}
              onChange={(event) => setNewPosition(event.target.value)}
              placeholder="Tambah posisi baru, contoh: Content Creator"
            />
            <button
              onClick={addPosition}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Tambah
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {config.positions.map((position, index) => (
              <div
                key={position.id}
                className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto]"
              >
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                  value={position.label}
                  onChange={(event) =>
                    updatePosition(index, {
                      label: event.target.value
                    })
                  }
                />

                <label className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={position.active}
                    onChange={(event) =>
                      updatePosition(index, {
                        active: event.target.checked
                      })
                    }
                  />
                  Aktif
                </label>

                <button
                  onClick={() => removePosition(index)}
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-100"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Label Level Assessment
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            HR dapat mengubah label dan status aktif level. Nilai level tetap
            1, 2, dan 3 agar scoring tetap aman.
          </p>

          <div className="mt-5 space-y-4">
            {config.levels.map((level) => (
              <div key={level.value} className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-black text-slate-950">
                    Level {level.value}
                  </p>

                  <label className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={level.active}
                      onChange={(event) =>
                        updateLevel(level.value, {
                          active: event.target.checked
                        })
                      }
                    />
                    Aktif
                  </label>
                </div>

                <div className="grid gap-3">
                  <input
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                    value={level.label}
                    onChange={(event) =>
                      updateLevel(level.value, {
                        label: event.target.value
                      })
                    }
                  />

                  <textarea
                    className="min-h-24 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                    value={level.description}
                    onChange={(event) =>
                      updateLevel(level.value, {
                        description: event.target.value
                      })
                    }
                  />

                  <div className="grid gap-3 md:grid-cols-2">
                    <label>
                      <span className="mb-1 block text-xs font-bold uppercase text-slate-500">
                        Durasi menit
                      </span>
                      <input
                        type="number"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                        value={level.durationMinutes}
                        onChange={(event) =>
                          updateLevel(level.value, {
                            durationMinutes: Number(event.target.value)
                          })
                        }
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-xs font-bold uppercase text-slate-500">
                        Jumlah soal
                      </span>
                      <input
                        type="number"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                        value={level.totalQuestions}
                        onChange={(event) =>
                          updateLevel(level.value, {
                            totalQuestions: Number(event.target.value)
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
EOF

cat > components/candidate/CandidateForm.tsx <<'EOF'
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CandidateInfo } from "@/types/candidate";
import {
  clearAssessmentDraft,
  getCandidateDraft,
  saveCandidateDraft
} from "@/lib/storage/localStorageDemo";
import { getActiveLevels, getActivePositions } from "@/lib/storage/adminConfig";
import { validateCandidateInfo } from "@/lib/utils/validation";

const initialForm: CandidateInfo = {
  fullName: "",
  whatsapp: "",
  email: "",
  positionApplied: "",
  domicile: "",
  age: "",
  education: "",
  lastExperience: "",
  source: "",
  assessmentLevel: 1,
  consent: false
};

export default function CandidateForm() {
  const router = useRouter();
  const [form, setForm] = useState<CandidateInfo>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [customPosition, setCustomPosition] = useState("");
  const [positions, setPositions] = useState(getActivePositions());
  const [levels, setLevels] = useState(getActiveLevels());

  const positionLabels = useMemo(
    () => positions.map((position) => position.label),
    [positions]
  );

  useEffect(() => {
    const existing = getCandidateDraft();

    setPositions(getActivePositions());
    setLevels(getActiveLevels());

    if (existing) {
      const isKnown = positionLabels.includes(existing.positionApplied);

      if (!isKnown && existing.positionApplied) {
        setCustomPosition(existing.positionApplied);
        setForm({
          ...existing,
          positionApplied: "Lainnya"
        });
      } else {
        setForm(existing);
      }
    }
  }, []);

  function update<K extends keyof CandidateInfo>(
    key: K,
    value: CandidateInfo[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  function resetDraft() {
    clearAssessmentDraft();
    setForm(initialForm);
    setCustomPosition("");
    setErrors([]);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();

    const finalForm: CandidateInfo = {
      ...form,
      positionApplied:
        form.positionApplied === "Lainnya"
          ? customPosition.trim()
          : form.positionApplied
    };

    const validation = validateCandidateInfo(finalForm);
    setErrors(validation);

    if (validation.length > 0) return;

    saveCandidateDraft(finalForm);
    router.push("/test/instructions");
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-premium md:p-8"
    >
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-semibold text-cyan-700">
            Data Kandidat
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Isi identitas sebelum mulai assessment
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Pilihan posisi dan level assessment dapat diatur HR melalui Admin
            Settings.
          </p>
        </div>

        <button
          type="button"
          onClick={resetDraft}
          className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
        >
          Reset Draft
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="mb-2 font-bold">Mohon periksa kembali:</p>
          {errors.map((error) => (
            <p key={error}>• {error}</p>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Nama lengkap*"
          value={form.fullName}
          onChange={(value) => update("fullName", value)}
          placeholder="Contoh: Andi Pratama"
        />

        <Field
          label="Nomor WhatsApp*"
          value={form.whatsapp}
          onChange={(value) => update("whatsapp", value)}
          placeholder="Contoh: 081234567890"
        />

        <Field
          label="Email"
          value={form.email}
          onChange={(value) => update("email", value)}
          placeholder="nama@email.com"
        />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Posisi dilamar*
          </span>

          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
            value={form.positionApplied}
            onChange={(event) => update("positionApplied", event.target.value)}
          >
            <option value="">Pilih posisi</option>
            {positions.map((position) => (
              <option key={position.id} value={position.label}>
                {position.label}
              </option>
            ))}
          </select>
        </label>

        {form.positionApplied === "Lainnya" && (
          <Field
            label="Tulis posisi lainnya*"
            value={customPosition}
            onChange={setCustomPosition}
            placeholder="Contoh: Admin Marketplace"
          />
        )}

        <Field
          label="Domisili"
          value={form.domicile}
          onChange={(value) => update("domicile", value)}
          placeholder="Contoh: Jakarta Barat"
        />

        <Field
          label="Usia"
          value={form.age}
          onChange={(value) => update("age", value)}
          placeholder="Contoh: 24"
        />

        <Field
          label="Pendidikan terakhir"
          value={form.education}
          onChange={(value) => update("education", value)}
          placeholder="Contoh: S1 Akuntansi"
        />

        <Field
          label="Pengalaman kerja terakhir"
          value={form.lastExperience}
          onChange={(value) => update("lastExperience", value)}
          placeholder="Contoh: Admin Online Shop 2 tahun"
        />

        <Field
          label="Sumber kandidat"
          value={form.source}
          onChange={(value) => update("source", value)}
          placeholder="Contoh: Jobstreet, referral, walk-in"
        />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Assessment level*
          </span>

          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
            value={form.assessmentLevel}
            onChange={(event) =>
              update("assessmentLevel", Number(event.target.value) as 1 | 2 | 3)
            }
          >
            {levels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {
              levels.find((level) => level.value === form.assessmentLevel)
                ?.description
            }
          </p>
        </label>
      </div>

      <label className="mt-6 flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => update("consent", event.target.checked)}
          className="mt-1 h-4 w-4"
        />

        <span>
          Saya setuju data digunakan untuk proses assessment HR internal. Saya
          memahami bahwa hasil assessment adalah alat bantu dan bukan satu-satunya
          dasar keputusan rekrutmen.
        </span>
      </label>

      <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Cognitive Ability Screening pada platform ini bukan tes IQ klinis resmi.
        Soal dibuat original untuk kebutuhan screening internal HR.
      </div>

      <button className="mt-6 w-full rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950 hover:bg-cyan-400">
        Lanjut ke Instruksi
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = ""
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
EOF

cat > components/admin/CandidateDetail.tsx <<'EOF'
"use client";

import Link from "next/link";
import { useState } from "react";
import type { AssessmentRecord } from "@/types/assessment";
import DiscBadge from "@/components/disc/DiscBadge";
import DiscResultChart from "@/components/disc/DiscResultChart";
import IQResultChart from "@/components/iq/IQResultChart";
import IQSubtestBreakdown from "@/components/iq/IQSubtestBreakdown";
import FitScoreBadge from "./FitScoreBadge";
import RedFlagBadge from "./RedFlagBadge";
import { discQuestions } from "@/lib/disc/discQuestions";
import { iqQuestions } from "@/lib/iq/iqQuestions";
import {
  categoryLabel,
  formatDateTime,
  formatSeconds
} from "@/lib/utils/format";
import { downloadCsv, rowsToCsv } from "@/lib/utils/csv";
import { updateDemoRecordCandidate } from "@/lib/storage/localStorageDemo";

export default function CandidateDetail({
  record
}: {
  record: AssessmentRecord;
}) {
  const [currentRecord, setCurrentRecord] = useState(record);
  const [editingWhatsapp, setEditingWhatsapp] = useState(false);
  const [whatsappDraft, setWhatsappDraft] = useState(record.candidate.whatsapp);
  const [saveMessage, setSaveMessage] = useState("");

  const weakest =
    Object.entries(currentRecord.iq.subtests)
      .sort((a, b) => a[1] - b[1])[0]?.[0] || "logical";

  const interviewQuestions = [
    `Ceritakan contoh saat Anda bekerja dalam situasi yang menuntut gaya ${currentRecord.disc.type}.`,
    `Untuk posisi ${currentRecord.candidate.positionApplied}, bagaimana Anda menjaga kualitas kerja saat target meningkat?`,
    `Subtest terlemah Anda adalah ${categoryLabel(weakest)}. Apa strategi Anda agar area ini tidak menghambat pekerjaan?`,
    "Ceritakan pengalaman saat Anda menemukan kesalahan data dan cara Anda memperbaikinya.",
    "Apa yang Anda lakukan jika instruksi atasan berbeda dengan kondisi lapangan?"
  ];

  function saveWhatsapp() {
    const updated = updateDemoRecordCandidate(currentRecord.candidate_id, {
      whatsapp: whatsappDraft.trim()
    });

    if (updated) {
      setCurrentRecord(updated);
      setSaveMessage("Nomor WhatsApp kandidat berhasil diperbarui di Demo Mode.");
    } else {
      setCurrentRecord({
        ...currentRecord,
        candidate: {
          ...currentRecord.candidate,
          whatsapp: whatsappDraft.trim()
        }
      });
      setSaveMessage("Nomor WhatsApp diperbarui pada tampilan ini.");
    }

    setEditingWhatsapp(false);
    window.setTimeout(() => setSaveMessage(""), 2600);
  }

  function exportCandidate() {
    const csv = rowsToCsv([
      {
        candidate_id: currentRecord.candidate_id,
        created_at: currentRecord.created_at,
        full_name: currentRecord.candidate.fullName,
        whatsapp: currentRecord.candidate.whatsapp,
        email: currentRecord.candidate.email,
        position_applied: currentRecord.candidate.positionApplied,
        disc_type: currentRecord.disc.type,
        disc_fit_score: currentRecord.disc.fitScore,
        iq_score: currentRecord.iq.percentageScore,
        iq_fit_score: currentRecord.iq.fitScore,
        combined_score: currentRecord.combined.score,
        final_recommendation: currentRecord.combined.recommendation,
        red_flags: currentRecord.redFlags.join(" | "),
        summary: currentRecord.summary
      }
    ]);

    downloadCsv(`${currentRecord.candidate.fullName}-assessment.csv`, csv);
  }

  return (
    <div className="print-area space-y-6 rounded-3xl bg-white p-6 shadow-premium">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            Candidate ID: {currentRecord.candidate_id}
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">
            {currentRecord.candidate.fullName}
          </h1>
          <p className="mt-1 text-slate-600">
            {currentRecord.candidate.positionApplied} •{" "}
            {formatDateTime(currentRecord.created_at)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 no-print">
          <Link
            href="/admin/dashboard"
            className="rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-700"
          >
            Kembali
          </Link>

          <button
            onClick={exportCandidate}
            className="rounded-2xl bg-navy-950 px-4 py-3 font-bold text-white"
          >
            Export CSV
          </button>

          <button
            onClick={() => window.print()}
            className="rounded-2xl bg-cyan-500 px-4 py-3 font-bold text-navy-950"
          >
            Print
          </button>
        </div>
      </div>

      {saveMessage && (
        <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {saveMessage}
        </p>
      )}

      <Section title="A. Data Kandidat">
        <div className="grid gap-3 md:grid-cols-2">
          <InfoItem
            label="WhatsApp"
            value={
              <div className="flex flex-wrap items-center gap-2">
                {editingWhatsapp ? (
                  <>
                    <input
                      className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-500"
                      value={whatsappDraft}
                      onChange={(event) => setWhatsappDraft(event.target.value)}
                    />
                    <button
                      onClick={saveWhatsapp}
                      className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-bold text-navy-950"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setEditingWhatsapp(false);
                        setWhatsappDraft(currentRecord.candidate.whatsapp);
                      }}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <span>{currentRecord.candidate.whatsapp}</span>
                    <button
                      onClick={() => setEditingWhatsapp(true)}
                      className="no-print rounded-xl bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            }
          />
          <InfoItem label="Email" value={currentRecord.candidate.email || "-"} />
          <InfoItem label="Domisili" value={currentRecord.candidate.domicile || "-"} />
          <InfoItem label="Usia" value={currentRecord.candidate.age || "-"} />
          <InfoItem label="Pendidikan" value={currentRecord.candidate.education || "-"} />
          <InfoItem label="Pengalaman" value={currentRecord.candidate.lastExperience || "-"} />
          <InfoItem label="Sumber" value={currentRecord.candidate.source || "-"} />
          <InfoItem label="Assessment Level" value={`Level ${currentRecord.candidate.assessmentLevel}`} />
        </div>
      </Section>

      <Section title="B. DISC Result">
        <div className="flex flex-wrap items-center gap-3">
          <DiscBadge type={currentRecord.disc.type} />
          <FitScoreBadge score={currentRecord.disc.fitScore} />
          <RedFlagBadge flags={currentRecord.disc.redFlags} />
        </div>

        <DiscResultChart percentages={currentRecord.disc.percentages} />

        <InfoGrid
          items={[
            ["D", `${currentRecord.disc.percentages.D}%`],
            ["I", `${currentRecord.disc.percentages.I}%`],
            ["S", `${currentRecord.disc.percentages.S}%`],
            ["C", `${currentRecord.disc.percentages.C}%`],
            [
              "DISC Fit",
              `${currentRecord.disc.fitScore} — ${currentRecord.disc.fitCategory}`
            ],
            ["Rekomendasi DISC", currentRecord.disc.recommendation]
          ]}
        />

        <p className="rounded-2xl bg-slate-50 p-4 text-slate-700">
          {currentRecord.disc.interpretation.summary}
        </p>

        <TextList
          title="Kekuatan"
          items={currentRecord.disc.interpretation.strengths || []}
        />

        <TextList
          title="Risiko"
          items={currentRecord.disc.interpretation.risks || []}
        />

        <TextList
          title="Cara Mengelola"
          items={currentRecord.disc.interpretation.managementTips || []}
        />
      </Section>

      <Section title="C. Cognitive Ability Screening Result">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Total Score" value={`${currentRecord.iq.percentageScore}%`} />
          <Metric
            label="Weighted"
            value={`${currentRecord.iq.weightedScore}/${currentRecord.iq.maxWeightedScore}`}
          />
          <Metric
            label="Benar/Salah/Kosong"
            value={`${currentRecord.iq.correctCount}/${currentRecord.iq.wrongCount}/${currentRecord.iq.blankCount}`}
          />
          <Metric label="Durasi" value={formatSeconds(currentRecord.iq.durationSeconds)} />
        </div>

        <IQResultChart subtests={currentRecord.iq.subtests} />
        <IQSubtestBreakdown subtests={currentRecord.iq.subtests} />

        <InfoGrid
          items={[
            ["Level", `Level ${currentRecord.iq.level}`],
            ["IQ Fit", `${currentRecord.iq.fitScore} — ${currentRecord.iq.fitCategory}`],
            ["Rekomendasi IQ", currentRecord.iq.recommendation],
            ["Summary", currentRecord.iq.summary]
          ]}
        />
      </Section>

      <Section title="D. Combined Result">
        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Combined Score" value={currentRecord.combined.score} />
          <Metric label="Kategori" value={currentRecord.combined.category} />
          <Metric
            label="Bobot"
            value={`DISC ${Math.round(
              currentRecord.combined.weights.disc * 100
            )}% / IQ ${Math.round(currentRecord.combined.weights.iq * 100)}%`}
          />
        </div>

        <p className="rounded-2xl bg-cyan-50 p-4 font-semibold text-cyan-900">
          Final recommendation: {currentRecord.combined.recommendation}
        </p>
      </Section>

      <Section title="E. Interview Questions">
        <TextList title="Pertanyaan otomatis" items={interviewQuestions} />
      </Section>

      <Section title="F. Red Flags">
        {currentRecord.redFlags.length ? (
          <TextList title="Perlu konfirmasi" items={currentRecord.redFlags} />
        ) : (
          <p className="rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-700">
            Tidak ada red flag utama.
          </p>
        )}
      </Section>

      <Section title="G. Jawaban Detail">
        <h3 className="mb-3 font-bold">DISC Answers</h3>

        <div className="overflow-x-auto">
          <table className="mb-6 w-full min-w-[700px] text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-2 text-left">Soal</th>
                <th className="p-2 text-left">Most</th>
                <th className="p-2 text-left">Least</th>
              </tr>
            </thead>

            <tbody>
              {currentRecord.discAnswers.length ? (
                currentRecord.discAnswers.map((answer) => {
                  const question = discQuestions.find(
                    (item) => item.id === answer.questionId
                  );

                  return (
                    <tr key={answer.questionId} className="border-t">
                      <td className="p-2">{answer.questionId}</td>
                      <td className="p-2">
                        {answer.mostOptionId} —{" "}
                        {
                          question?.options.find(
                            (option) => option.id === answer.mostOptionId
                          )?.text
                        }
                      </td>
                      <td className="p-2">
                        {answer.leastOptionId} —{" "}
                        {
                          question?.options.find(
                            (option) => option.id === answer.leastOptionId
                          )?.text
                        }
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="p-2 text-slate-500" colSpan={3}>
                    Sample data tidak memiliki jawaban DISC detail.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h3 className="mb-3 font-bold">IQ Answers</h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Kategori</th>
                <th className="p-2 text-left">Jawaban</th>
                <th className="p-2 text-left">Correct</th>
                <th className="p-2 text-left">Hasil</th>
                <th className="p-2 text-left">Explanation</th>
              </tr>
            </thead>

            <tbody>
              {currentRecord.iqAnswers.length ? (
                currentRecord.iqAnswers.map((answer) => {
                  const question = iqQuestions.find(
                    (item) => item.id === answer.questionId
                  );

                  return (
                    <tr key={answer.questionId} className="border-t">
                      <td className="p-2">{answer.questionId}</td>
                      <td className="p-2">
                        {categoryLabel(answer.category || question?.category || "")}
                      </td>
                      <td className="p-2">{answer.selectedAnswer || "-"}</td>
                      <td className="p-2">
                        {answer.correctAnswer || question?.correctAnswer || "-"}
                      </td>
                      <td
                        className={`p-2 font-bold ${
                          answer.isCorrect ? "text-emerald-700" : "text-red-600"
                        }`}
                      >
                        {answer.isCorrect ? "Benar" : "Salah/Kosong"}
                      </td>
                      <td className="p-2">{question?.explanation || "-"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="p-2 text-slate-500" colSpan={6}>
                    Sample data tidak memiliki jawaban IQ detail.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      <p className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Disclaimer: Cognitive Ability Screening ini bukan tes IQ klinis resmi.
        Hasil assessment digunakan sebagai alat bantu HR dan harus dikombinasikan
        dengan interview, referensi, pengalaman, dan simulasi kerja.
      </p>
    </div>
  );
}

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-t border-slate-100 pt-6">
      <h2 className="text-xl font-black text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(([label, value]) => (
        <InfoItem key={label} label={label} value={value} />
      ))}
    </div>
  );
}

function InfoItem({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <div className="mt-1 font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function Metric({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function TextList({
  title,
  items
}: {
  title: string;
  items: string[];
}) {
  if (!items.length) return null;

  return (
    <div>
      <p className="mb-2 font-bold">{title}</p>
      <ul className="list-inside list-disc space-y-1 text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
EOF

cat >> README.md <<'EOF'

---

## Part 8 — Admin Manual Book + Configurable Settings

Fitur yang ditambahkan:
- Menu `Manual Book` di sidebar admin.
- Halaman `/admin/manual-book`.
- Admin Settings dapat mengatur:
  - pilihan posisi kandidat,
  - label level assessment,
  - status aktif level,
  - nomor WhatsApp HR.
- Form kandidat membaca posisi dan level dari Admin Settings.
- Detail kandidat dapat edit nomor WhatsApp kandidat untuk Demo Mode localStorage.

Catatan:
- Konfigurasi Admin Settings saat ini disimpan di localStorage browser admin.
- Untuk produksi multi-admin, konfigurasi sebaiknya dipindahkan ke Google Sheets atau database.
- Nilai level tetap 1, 2, dan 3 agar scoring tetap aman.
EOF

echo ""
echo "✅ Part 8 selesai."
echo ""
echo "Jalankan:"
echo "npm run dev"