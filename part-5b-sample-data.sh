#!/usr/bin/env bash
set -e

echo "Installing Part 5B — Sample Dummy Data..."

mkdir -p lib/storage

cat > lib/storage/sampleData.ts <<'EOF'
import type { AssessmentRecord } from "@/types/assessment";

export const sampleAssessmentRecords: AssessmentRecord[] = [
  {
    candidate_id: "CAND-DEMO-001",
    created_at: new Date().toISOString(),
    candidate: {
      fullName: "Andi Pratama",
      whatsapp: "081234560001",
      email: "andi.demo@email.com",
      positionApplied: "Accounting",
      domicile: "Jakarta Barat",
      age: "25",
      education: "S1 Akuntansi",
      lastExperience: "Accounting Staff 2 tahun",
      source: "Jobstreet",
      assessmentLevel: 2,
      consent: true
    },
    disc: {
      raw: { D: 8, I: 2, S: 12, C: 20 },
      adjusted: { D: 10, I: 4, S: 14, C: 22 },
      percentages: { D: 20, I: 8, S: 28, C: 44 },
      type: "CS",
      primary: "C",
      secondary: "S",
      fitScore: 95,
      fitCategory: "Sangat cocok",
      recommendation: "Sangat cocok untuk Accounting. Butuh ketelitian, kepatuhan SOP, angka, dan stabilitas.",
      redFlags: [],
      interpretation: {
        title: "CS — Conscientiousness + Steadiness",
        summary: "Teliti, stabil, patuh prosedur, dan cocok untuk pekerjaan angka serta kontrol administrasi.",
        strengths: ["Teliti", "Sistematis", "Konsisten", "Patuh SOP", "Fokus kualitas"],
        risks: ["Perfeksionis", "Butuh waktu saat mengambil keputusan", "Kurang fleksibel pada perubahan mendadak"],
        suitableRoles: ["Accounting", "Admin checker", "QC", "Inventory control"],
        managementTips: ["Berikan SOP jelas", "Tetapkan deadline", "Beri prioritas kerja yang terukur"]
      },
      durationSeconds: 620,
      changeCount: 5
    },
    iq: {
      level: 2,
      durationSeconds: 1450,
      totalQuestions: 35,
      answeredCount: 35,
      blankCount: 0,
      correctCount: 30,
      wrongCount: 5,
      rawScore: 30,
      weightedScore: 44,
      maxWeightedScore: 52,
      percentageScore: 84.62,
      subtests: {
        logical: 82,
        numerical: 88,
        verbal: 76,
        pattern: 80,
        workingAccuracy: 92
      },
      fitScore: 90,
      fitCategory: "Sangat cocok",
      recommendation: "Sangat cocok untuk Accounting. Minimal total 75.",
      redFlags: [],
      summary: "Kuat. Kandidat memiliki dasar analisa, numerik, dan akurasi yang baik.",
      changeCount: 8,
      timedOut: false
    },
    combined: {
      score: 91.5,
      category: "Prioritas tinggi",
      recommendation: "Prioritas tinggi",
      weights: { disc: 0.3, iq: 0.7 }
    },
    discAnswers: [],
    iqAnswers: [],
    redFlags: [],
    summary: "Andi Pratama melamar Accounting. DISC CS dengan fit 95. Cognitive Ability Screening 84.62% dengan fit 90. Rekomendasi akhir: Prioritas tinggi."
  },
  {
    candidate_id: "CAND-DEMO-002",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    candidate: {
      fullName: "Siti Amelia",
      whatsapp: "081234560002",
      email: "siti.demo@email.com",
      positionApplied: "Customer Service",
      domicile: "Tangerang",
      age: "23",
      education: "D3 Komunikasi",
      lastExperience: "Customer Service Marketplace 1 tahun",
      source: "Referral",
      assessmentLevel: 1,
      consent: true
    },
    disc: {
      raw: { D: 4, I: 18, S: 16, C: 6 },
      adjusted: { D: 6, I: 20, S: 18, C: 8 },
      percentages: { D: 11.54, I: 38.46, S: 34.62, C: 15.38 },
      type: "IS",
      primary: "I",
      secondary: "S",
      fitScore: 95,
      fitCategory: "Sangat cocok",
      recommendation: "Sangat cocok untuk Customer Service. Butuh komunikasi, empati, dan kestabilan menghadapi customer.",
      redFlags: [],
      interpretation: {
        title: "IS — Influence + Steadiness",
        summary: "Komunikatif, ramah, suportif, dan stabil dalam menjaga hubungan kerja.",
        strengths: ["Komunikatif", "Ramah", "Empatik", "Suportif", "Mudah membangun relasi"],
        risks: ["Kurang detail", "Menghindari konflik", "Perlu checklist agar konsisten"],
        suitableRoles: ["Customer Service", "Relationship role", "HR-facing role"],
        managementTips: ["Berikan script komunikasi", "Gunakan template follow-up", "Berikan feedback rutin"]
      },
      durationSeconds: 540,
      changeCount: 4
    },
    iq: {
      level: 1,
      durationSeconds: 980,
      totalQuestions: 25,
      answeredCount: 24,
      blankCount: 1,
      correctCount: 20,
      wrongCount: 4,
      rawScore: 20,
      weightedScore: 27,
      maxWeightedScore: 33,
      percentageScore: 81.82,
      subtests: {
        logical: 78,
        numerical: 72,
        verbal: 90,
        pattern: 76,
        workingAccuracy: 82
      },
      fitScore: 88,
      fitCategory: "Sangat cocok",
      recommendation: "Sangat cocok untuk Customer Service. Minimal total 65.",
      redFlags: [],
      summary: "Kuat. Kandidat memiliki kemampuan verbal dan akurasi kerja yang baik.",
      changeCount: 6,
      timedOut: false
    },
    combined: {
      score: 92.2,
      category: "Prioritas tinggi",
      recommendation: "Prioritas tinggi",
      weights: { disc: 0.6, iq: 0.4 }
    },
    discAnswers: [],
    iqAnswers: [],
    redFlags: [],
    summary: "Siti Amelia melamar Customer Service. DISC IS dengan fit 95. Cognitive Ability Screening 81.82% dengan fit 88. Rekomendasi akhir: Prioritas tinggi."
  },
  {
    candidate_id: "CAND-DEMO-003",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    candidate: {
      fullName: "Budi Santoso",
      whatsapp: "081234560003",
      email: "budi.demo@email.com",
      positionApplied: "Warehouse Leader",
      domicile: "Bekasi",
      age: "29",
      education: "SMA/SMK",
      lastExperience: "Koordinator Gudang 3 tahun",
      source: "Walk-in",
      assessmentLevel: 3,
      consent: true
    },
    disc: {
      raw: { D: 18, I: 4, S: 16, C: 8 },
      adjusted: { D: 20, I: 6, S: 18, C: 10 },
      percentages: { D: 37.04, I: 11.11, S: 33.33, C: 18.52 },
      type: "DS",
      primary: "D",
      secondary: "S",
      fitScore: 95,
      fitCategory: "Sangat cocok",
      recommendation: "Sangat cocok untuk Warehouse Leader. Butuh koordinasi lapangan, stabilitas, dan ketegasan.",
      redFlags: [],
      interpretation: {
        title: "DS — Dominance + Steadiness",
        summary: "Tegas namun stabil. Cocok untuk koordinasi operasional dan leader lapangan.",
        strengths: ["Tegas", "Konsisten", "Berani mengambil keputusan", "Dapat mengarahkan tim"],
        risks: ["Bisa terlalu langsung", "Perlu menjaga komunikasi saat menekan target"],
        suitableRoles: ["Warehouse Leader", "Supervisor Operasional", "Koordinator Lapangan"],
        managementTips: ["Berikan target jelas", "Pantau kualitas komunikasi", "Gunakan KPI harian"]
      },
      durationSeconds: 700,
      changeCount: 9
    },
    iq: {
      level: 3,
      durationSeconds: 2100,
      totalQuestions: 45,
      answeredCount: 42,
      blankCount: 3,
      correctCount: 33,
      wrongCount: 9,
      rawScore: 33,
      weightedScore: 52,
      maxWeightedScore: 70,
      percentageScore: 74.29,
      subtests: {
        logical: 78,
        numerical: 68,
        verbal: 70,
        pattern: 72,
        workingAccuracy: 80
      },
      fitScore: 82,
      fitCategory: "Cocok",
      recommendation: "Cocok untuk Warehouse Leader. Minimal total 70.",
      redFlags: [],
      summary: "Cukup Baik. Kandidat layak lanjut dengan konfirmasi pada numerical reasoning.",
      changeCount: 11,
      timedOut: false
    },
    combined: {
      score: 87.85,
      category: "Prioritas tinggi",
      recommendation: "Prioritas tinggi",
      weights: { disc: 0.45, iq: 0.55 }
    },
    discAnswers: [],
    iqAnswers: [],
    redFlags: [],
    summary: "Budi Santoso melamar Warehouse Leader. DISC DS dengan fit 95. Cognitive Ability Screening 74.29% dengan fit 82. Rekomendasi akhir: Prioritas tinggi."
  },
  {
    candidate_id: "CAND-DEMO-004",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    candidate: {
      fullName: "Rina Kurnia",
      whatsapp: "081234560004",
      email: "rina.demo@email.com",
      positionApplied: "E-commerce Specialist",
      domicile: "Depok",
      age: "26",
      education: "S1 Manajemen",
      lastExperience: "Admin Marketplace 2 tahun",
      source: "LinkedIn",
      assessmentLevel: 2,
      consent: true
    },
    disc: {
      raw: { D: 16, I: 14, S: 5, C: 12 },
      adjusted: { D: 18, I: 16, S: 7, C: 14 },
      percentages: { D: 32.73, I: 29.09, S: 12.73, C: 25.45 },
      type: "DI",
      primary: "D",
      secondary: "I",
      fitScore: 95,
      fitCategory: "Sangat cocok",
      recommendation: "Sangat cocok untuk E-commerce Specialist. Butuh target, analisa, dan koordinasi lintas marketplace.",
      redFlags: [],
      interpretation: {
        title: "DI — Dominance + Influence",
        summary: "Tegas dan persuasif. Cocok untuk peran target tinggi yang membutuhkan komunikasi aktif.",
        strengths: ["Target oriented", "Komunikatif", "Berani mengambil inisiatif", "Cepat bergerak"],
        risks: ["Kurang sabar", "Perlu kontrol detail", "Bisa terlalu optimis"],
        suitableRoles: ["E-commerce Specialist", "Sales", "Campaign PIC"],
        managementTips: ["Gunakan dashboard target", "Tambahkan checklist detail", "Review performa berkala"]
      },
      durationSeconds: 600,
      changeCount: 7
    },
    iq: {
      level: 2,
      durationSeconds: 1680,
      totalQuestions: 35,
      answeredCount: 34,
      blankCount: 1,
      correctCount: 27,
      wrongCount: 7,
      rawScore: 27,
      weightedScore: 39.5,
      maxWeightedScore: 52,
      percentageScore: 75.96,
      subtests: {
        logical: 80,
        numerical: 78,
        verbal: 70,
        pattern: 76,
        workingAccuracy: 72
      },
      fitScore: 84,
      fitCategory: "Cocok",
      recommendation: "Cocok untuk E-commerce Specialist. Minimal total 75.",
      redFlags: [],
      summary: "Cukup Baik. Kandidat layak lanjut dengan konfirmasi pada working accuracy.",
      changeCount: 13,
      timedOut: false
    },
    combined: {
      score: 88.95,
      category: "Prioritas tinggi",
      recommendation: "Prioritas tinggi",
      weights: { disc: 0.45, iq: 0.55 }
    },
    discAnswers: [],
    iqAnswers: [],
    redFlags: [],
    summary: "Rina Kurnia melamar E-commerce Specialist. DISC DI dengan fit 95. Cognitive Ability Screening 75.96% dengan fit 84. Rekomendasi akhir: Prioritas tinggi."
  },
  {
    candidate_id: "CAND-DEMO-005",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    candidate: {
      fullName: "Dewi Lestari",
      whatsapp: "081234560005",
      email: "dewi.demo@email.com",
      positionApplied: "Admin Retur",
      domicile: "Bogor",
      age: "24",
      education: "SMA/SMK",
      lastExperience: "Admin Retur Junior 8 bulan",
      source: "Instagram Jobs",
      assessmentLevel: 1,
      consent: true
    },
    disc: {
      raw: { D: 3, I: 8, S: 18, C: 15 },
      adjusted: { D: 5, I: 10, S: 20, C: 17 },
      percentages: { D: 9.62, I: 19.23, S: 38.46, C: 32.69 },
      type: "SC",
      primary: "S",
      secondary: "C",
      fitScore: 95,
      fitCategory: "Sangat cocok",
      recommendation: "Sangat cocok untuk Admin Retur. Butuh sabar, rapi, teliti, dan konsisten.",
      redFlags: [],
      interpretation: {
        title: "SC — Steadiness + Conscientiousness",
        summary: "Stabil, teliti, dan konsisten. Cocok untuk pekerjaan retur, checker, dan administrasi detail.",
        strengths: ["Sabar", "Teliti", "Konsisten", "Patuh SOP"],
        risks: ["Cenderung lambat saat perubahan mendadak", "Perlu arahan prioritas"],
        suitableRoles: ["Admin Retur", "Admin Checker", "Packing", "Inventory"],
        managementTips: ["Berikan SOP", "Gunakan checklist", "Komunikasikan perubahan lebih awal"]
      },
      durationSeconds: 650,
      changeCount: 5
    },
    iq: {
      level: 1,
      durationSeconds: 1120,
      totalQuestions: 25,
      answeredCount: 23,
      blankCount: 2,
      correctCount: 17,
      wrongCount: 6,
      rawScore: 17,
      weightedScore: 22.5,
      maxWeightedScore: 33,
      percentageScore: 68.18,
      subtests: {
        logical: 65,
        numerical: 60,
        verbal: 72,
        pattern: 64,
        workingAccuracy: 78
      },
      fitScore: 76,
      fitCategory: "Cocok",
      recommendation: "Cocok untuk Admin Retur. Minimal total 65.",
      redFlags: [],
      summary: "Perlu Dikonfirmasi. Kandidat cukup sesuai, perlu validasi pada numerical dan pattern.",
      changeCount: 9,
      timedOut: false
    },
    combined: {
      score: 83.6,
      category: "Layak lanjut",
      recommendation: "Layak lanjut",
      weights: { disc: 0.4, iq: 0.6 }
    },
    discAnswers: [],
    iqAnswers: [],
    redFlags: [],
    summary: "Dewi Lestari melamar Admin Retur. DISC SC dengan fit 95. Cognitive Ability Screening 68.18% dengan fit 76. Rekomendasi akhir: Layak lanjut."
  },
  {
    candidate_id: "CAND-DEMO-006",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    candidate: {
      fullName: "Fajar Nugroho",
      whatsapp: "081234560006",
      email: "fajar.demo@email.com",
      positionApplied: "Procurement",
      domicile: "Jakarta Timur",
      age: "28",
      education: "S1 Teknik Industri",
      lastExperience: "Purchasing Staff 2 tahun",
      source: "Glints",
      assessmentLevel: 3,
      consent: true
    },
    disc: {
      raw: { D: 14, I: 4, S: 8, C: 18 },
      adjusted: { D: 16, I: 6, S: 10, C: 20 },
      percentages: { D: 30.77, I: 11.54, S: 19.23, C: 38.46 },
      type: "CD",
      primary: "C",
      secondary: "D",
      fitScore: 95,
      fitCategory: "Sangat cocok",
      recommendation: "Sangat cocok untuk Procurement. Butuh analisa, negosiasi, dan kontrol angka.",
      redFlags: [],
      interpretation: {
        title: "CD — Conscientiousness + Dominance",
        summary: "Analitis dan tegas. Cocok untuk procurement, kontrol supplier, dan keputusan berbasis data.",
        strengths: ["Analitis", "Teliti", "Tegas", "Kuat pada standar"],
        risks: ["Bisa kaku", "Perlu menjaga komunikasi saat negosiasi"],
        suitableRoles: ["Procurement", "Accounting", "QC", "Inventory Control"],
        managementTips: ["Berikan data pembanding", "Tetapkan SLA supplier", "Review keputusan dengan angka"]
      },
      durationSeconds: 720,
      changeCount: 12
    },
    iq: {
      level: 3,
      durationSeconds: 2380,
      totalQuestions: 45,
      answeredCount: 40,
      blankCount: 5,
      correctCount: 26,
      wrongCount: 14,
      rawScore: 26,
      weightedScore: 39,
      maxWeightedScore: 70,
      percentageScore: 55.71,
      subtests: {
        logical: 62,
        numerical: 58,
        verbal: 54,
        pattern: 48,
        workingAccuracy: 60
      },
      fitScore: 55,
      fitCategory: "Kurang cocok",
      recommendation: "Kurang cocok untuk Procurement. Minimal total 80.",
      redFlags: [
        "Banyak soal tidak dijawab.",
        "Profil kemampuan tidak seimbang."
      ],
      summary: "Kurang Sesuai. Disarankan validasi tambahan sebelum lanjut proses.",
      changeCount: 24,
      timedOut: true
    },
    combined: {
      score: 67,
      category: "Perlu konfirmasi",
      recommendation: "Perlu konfirmasi",
      weights: { disc: 0.3, iq: 0.7 }
    },
    discAnswers: [],
    iqAnswers: [],
    redFlags: [
      "Banyak soal tidak dijawab.",
      "Profil kemampuan tidak seimbang.",
      "Ragu-ragu tinggi, perlu konfirmasi interview."
    ],
    summary: "Fajar Nugroho melamar Procurement. DISC CD dengan fit 95. Cognitive Ability Screening 55.71% dengan fit 55. Rekomendasi akhir: Perlu konfirmasi."
  }
];
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

cat > app/admin/dashboard/page.tsx <<'EOF'
"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Brain, Database, Target, Trash2, Users } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import CandidateTable, {
  normalizeCandidateRows
} from "@/components/admin/CandidateTable";
import StatCard from "@/components/admin/StatCard";
import ExportButton from "@/components/admin/ExportButton";
import {
  clearDemoRecords,
  getDemoRecords,
  seedSampleDemoRecords
} from "@/lib/storage/localStorageDemo";
import type { AssessmentRecord } from "@/types/assessment";
import type { CandidateSummaryRow } from "@/types/candidate";

type Row = AssessmentRecord | CandidateSummaryRow;

export default function DashboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("");
  const [disc, setDisc] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [demo, setDemo] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function loadDemoRowsWithSamples() {
    const existing = getDemoRecords();
    const data = existing.length ? existing : seedSampleDemoRecords();
    setRows(data);
    return data;
  }

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const response = await fetch("/api/candidates");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Gagal load kandidat.");
        }

        if (data.demo) {
          setDemo(true);
          loadDemoRowsWithSamples();
        } else {
          setDemo(false);
          setRows(data.candidates || []);
        }
      } catch (err) {
        setDemo(true);
        setError(
          err instanceof Error
            ? `${err.message} Data demo localStorage ditampilkan.`
            : "Fallback demo mode."
        );
        loadDemoRowsWithSamples();
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const normalized = normalizeCandidateRows(rows);

  const filtered = useMemo(() => {
    return normalized.filter((row) => {
      const matchSearch =
        !search ||
        row.full_name.toLowerCase().includes(search.toLowerCase()) ||
        row.whatsapp.toLowerCase().includes(search.toLowerCase());

      const matchPosition =
        !position ||
        row.position_applied.toLowerCase().includes(position.toLowerCase());

      const matchDisc = !disc || row.disc_type.includes(disc);

      const matchRecommendation =
        !recommendation || row.final_recommendation === recommendation;

      return matchSearch && matchPosition && matchDisc && matchRecommendation;
    });
  }, [normalized, search, position, disc, recommendation]);

  const today = new Date().toISOString().slice(0, 10);

  function avg(key: keyof CandidateSummaryRow) {
    if (!filtered.length) return 0;

    return Math.round(
      filtered.reduce((sum, row) => sum + Number(row[key] || 0), 0) /
        filtered.length
    );
  }

  function loadSamples() {
    const seeded = seedSampleDemoRecords();
    setRows(seeded);
    setDemo(true);
  }

  function clearSamples() {
    const ok = confirm("Hapus semua data demo dari localStorage?");
    if (!ok) return;
    clearDemoRecords();
    setRows([]);
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-slate-950">
            Dashboard Kandidat
          </h1>
          <p className="text-slate-500">
            Monitor hasil DISC + Cognitive Ability Screening.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {demo && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
              Demo Mode
            </span>
          )}

          <button
            type="button"
            onClick={loadSamples}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-bold text-navy-950 hover:bg-cyan-400"
          >
            <Database className="h-4 w-4" />
            Load Sample Data
          </button>

          <button
            type="button"
            onClick={clearSamples}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            Clear Demo Data
          </button>

          <ExportButton
            rows={filtered as unknown as Record<string, unknown>[]}
            filename="hr-assessment-candidates.csv"
          />
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          {error}
        </p>
      )}

      <div className="mb-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total kandidat" value={filtered.length} icon={Users} />
        <StatCard
          title="Kandidat hari ini"
          value={filtered.filter((row) => row.created_at?.startsWith(today)).length}
          icon={Target}
        />
        <StatCard
          title="Rata-rata DISC fit"
          value={avg("disc_fit_score")}
          icon={Award}
        />
        <StatCard
          title="Rata-rata IQ score"
          value={avg("iq_score")}
          icon={Brain}
        />
        <StatCard
          title="Rata-rata combined"
          value={avg("combined_score")}
          icon={Award}
        />
        <StatCard
          title="Prioritas tinggi"
          value={
            filtered.filter(
              (row) => row.final_recommendation === "Prioritas tinggi"
            ).length
          }
          icon={Target}
        />
      </div>

      <div className="mb-6 grid gap-3 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-5">
        <input
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
          placeholder="Search nama / WA"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <input
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
          placeholder="Filter posisi"
          value={position}
          onChange={(event) => setPosition(event.target.value)}
        />

        <select
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
          value={disc}
          onChange={(event) => setDisc(event.target.value)}
        >
          <option value="">Semua DISC</option>
          <option>D</option>
          <option>I</option>
          <option>S</option>
          <option>C</option>
        </select>

        <select
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
          value={recommendation}
          onChange={(event) => setRecommendation(event.target.value)}
        >
          <option value="">Semua rekomendasi</option>
          <option>Prioritas tinggi</option>
          <option>Layak lanjut</option>
          <option>Perlu konfirmasi</option>
          <option>Cadangan</option>
          <option>Tidak prioritas</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setPosition("");
            setDisc("");
            setRecommendation("");
          }}
          className="rounded-2xl bg-slate-100 px-4 py-3 font-bold text-slate-700 hover:bg-slate-200"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading kandidat...
        </div>
      ) : (
        <CandidateTable rows={filtered} />
      )}
    </AdminLayout>
  );
}
EOF

cat >> README.md <<'EOF'

---

## Part 5B — Sample Dummy Database

Fitur yang ditambahkan:
- Sample dummy data untuk Demo Mode.
- 6 kandidat dummy:
  - Accounting
  - Customer Service
  - Warehouse Leader
  - E-commerce Specialist
  - Admin Retur
  - Procurement
- Dashboard otomatis mengisi sample data jika Demo Mode aktif dan data kosong.
- Tombol `Load Sample Data`.
- Tombol `Clear Demo Data`.

Catatan:
- Data dummy disimpan di localStorage browser.
- Jika Google Sheets sudah aktif, dashboard akan memakai data Google Sheets.
- Untuk melihat sample lagi, kosongkan `GOOGLE_SCRIPT_URL` di `.env.local` atau gunakan Demo Mode.
EOF

echo ""
echo "✅ Part 5B selesai."
echo ""
echo "Jalankan:"
echo "npm run dev"