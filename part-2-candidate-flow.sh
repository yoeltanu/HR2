#!/usr/bin/env bash
set -e

echo "Installing Part 2 — Candidate Flow..."

mkdir -p components/candidate lib/storage

cat > lib/storage/localStorageDemo.ts <<'EOF'
"use client";

import type { AssessmentPayload, AssessmentRecord } from "@/types/assessment";
import type { CandidateInfo } from "@/types/candidate";

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
    "buildAndStoreDemoRecord akan aktif setelah Part 6, saat combined scoring dan API submit sudah dipasang."
  );
}
EOF

cat > components/candidate/AssessmentProgress.tsx <<'EOF'
export default function AssessmentProgress({
  current,
  total,
  label
}: {
  current: number;
  total: number;
  label: string;
}) {
  const percentage = total ? Math.round((current / total) * 100) : 0;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">
          {current}/{total}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
EOF

cat > components/candidate/CandidateForm.tsx <<'EOF'
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { CandidateInfo } from "@/types/candidate";
import {
  clearAssessmentDraft,
  getCandidateDraft,
  saveCandidateDraft
} from "@/lib/storage/localStorageDemo";
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

const positionOptions = [
  "Accounting",
  "Admin Retur",
  "Admin Inbound",
  "Customer Service",
  "E-commerce Specialist",
  "Head of Sales",
  "Procurement",
  "Warehouse Leader",
  "Packing Staff",
  "HRGA",
  "Personal Assistant",
  "Lainnya"
];

export default function CandidateForm() {
  const router = useRouter();
  const [form, setForm] = useState<CandidateInfo>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [customPosition, setCustomPosition] = useState("");

  useEffect(() => {
    const existing = getCandidateDraft();

    if (existing) {
      setForm(existing);

      const isKnown = positionOptions.includes(existing.positionApplied);
      if (!isKnown && existing.positionApplied) {
        setCustomPosition(existing.positionApplied);
        setForm((current) => ({
          ...current,
          positionApplied: "Lainnya"
        }));
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
            Data ini disimpan sementara di browser sampai kandidat menyelesaikan
            DISC dan Cognitive Ability Screening.
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
            {positionOptions.map((position) => (
              <option key={position} value={position}>
                {position}
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
            <option value={1}>
              Level 1: Staff Operasional / Admin Dasar
            </option>
            <option value={2}>
              Level 2: Specialist / Admin Senior
            </option>
            <option value={3}>
              Level 3: Supervisor / Leader
            </option>
          </select>
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

cat > app/test/start/page.tsx <<'EOF'
import Navbar from "@/components/layout/Navbar";
import CandidateForm from "@/components/candidate/CandidateForm";

export default function StartPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="px-4 py-10">
        <CandidateForm />
      </section>
    </main>
  );
}
EOF

cat > app/test/instructions/page.tsx <<'EOF'
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, TimerReset } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import type { CandidateInfo } from "@/types/candidate";
import { getCandidateDraft } from "@/lib/storage/localStorageDemo";

export default function InstructionsPage() {
  const [candidate, setCandidate] = useState<CandidateInfo | null>(null);

  useEffect(() => {
    setCandidate(getCandidateDraft());
  }, []);

  const level = candidate?.assessmentLevel || 1;
  const iqTotal = level === 1 ? 25 : level === 2 ? 35 : 45;
  const iqDuration = level === 1 ? 20 : level === 2 ? 30 : 40;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-premium">
          <p className="text-sm font-bold text-cyan-700">
            Instruksi Assessment
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            DISC + Cognitive Ability Screening
          </h1>

          {candidate ? (
            <div className="mt-5 rounded-2xl bg-cyan-50 p-4 text-sm text-cyan-900">
              Kandidat: <strong>{candidate.fullName}</strong> • Posisi:{" "}
              <strong>{candidate.positionApplied}</strong> • Level:{" "}
              <strong>{candidate.assessmentLevel}</strong>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              Data kandidat belum ditemukan. Silakan isi form kandidat terlebih
              dahulu.
            </div>
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <InfoCard
              icon={<ClipboardList className="h-6 w-6" />}
              title="Bagian 1: DISC"
              description="24 soal forced choice. Pilih satu pernyataan yang paling menggambarkan Anda dan satu yang paling tidak menggambarkan Anda."
            />

            <InfoCard
              icon={<TimerReset className="h-6 w-6" />}
              title="Bagian 2: Cognitive Ability Screening"
              description={`Level ${level}: ${iqTotal} soal dalam ${iqDuration} menit. Jawaban kosong diperbolehkan tetapi bernilai 0.`}
            />
          </div>

          <div className="mt-8 space-y-3">
            {[
              "Jawab sesuai kebiasaan kerja Anda, bukan versi ideal.",
              "Tidak ada jawaban benar/salah pada DISC.",
              "Pada DISC, pilihan paling dan paling tidak tidak boleh sama.",
              "Pada Cognitive Ability Screening, sistem akan auto-submit saat waktu habis.",
              "Hasil tes adalah alat bantu HR dan perlu dikombinasikan dengan interview."
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/test/start"
              className="inline-flex flex-1 justify-center rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-700 hover:bg-slate-200"
            >
              Kembali Edit Data
            </Link>

            <Link
              href={candidate ? "/test/disc" : "/test/start"}
              className="inline-flex flex-1 justify-center rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Mulai DISC
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-100 text-cyan-700">
        {icon}
      </div>

      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
EOF

cat > app/test/completed/page.tsx <<'EOF'
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Home, LayoutDashboard } from "lucide-react";
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
            Assessment selesai
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            Terima kasih. Hasil Anda telah dikirim ke HR. Hasil assessment akan
            digunakan sebagai alat bantu dan bukan satu-satunya dasar keputusan
            rekrutmen.
          </p>

          {record && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left text-sm text-slate-700">
              <p>
                <strong>Candidate ID:</strong> {record.candidate_id}
              </p>
              <p>
                <strong>Nama:</strong> {record.candidate.fullName}
              </p>
              <p>
                <strong>Posisi:</strong> {record.candidate.positionApplied}
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950"
            >
              <Home className="h-5 w-5" />
              Home
            </Link>

            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-navy-950 px-6 py-4 font-bold text-white"
            >
              <LayoutDashboard className="h-5 w-5" />
              Admin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
EOF

cat >> README.md <<'EOF'

---

## Part 2 — Candidate Flow

Fitur yang sudah ditambahkan:
- Form kandidat lengkap.
- Validasi field wajib.
- Pilihan assessment level.
- Persetujuan penggunaan data.
- Draft kandidat tersimpan di localStorage.
- Reset draft.
- Halaman instruksi dinamis berdasarkan level.
- Halaman completed dapat menampilkan last record setelah submit aktif di Part 6.

Test cepat:
1. Buka `/test/start`.
2. Coba submit tanpa mengisi field wajib.
3. Isi data kandidat.
4. Klik `Lanjut ke Instruksi`.
5. Pastikan halaman `/test/instructions` menampilkan nama, posisi, dan level.
EOF

echo ""
echo "✅ Part 2 selesai."
echo ""
echo "Jalankan:"
echo "npm run dev"
echo ""
echo "Cek:"
echo "/test/start"
echo "/test/instructions"