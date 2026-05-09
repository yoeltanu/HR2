#!/usr/bin/env bash
set -e

echo "Installing Part 5 — Admin Dashboard + Detail..."

mkdir -p components/admin

cat > components/admin/FitScoreBadge.tsx <<'EOF'
export default function FitScoreBadge({ score }: { score: number }) {
  const safeScore = Number(score || 0);

  const cls =
    safeScore >= 85
      ? "bg-emerald-100 text-emerald-700"
      : safeScore >= 75
        ? "bg-blue-100 text-blue-700"
        : safeScore >= 65
          ? "bg-yellow-100 text-yellow-800"
          : safeScore >= 50
            ? "bg-orange-100 text-orange-700"
            : "bg-red-100 text-red-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${cls}`}>
      {Math.round(safeScore)}
    </span>
  );
}
EOF

cat > components/admin/RedFlagBadge.tsx <<'EOF'
export default function RedFlagBadge({
  flags
}: {
  flags: string[] | string;
}) {
  const list = Array.isArray(flags)
    ? flags
    : String(flags || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

  if (!list.length) {
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
        Aman
      </span>
    );
  }

  return (
    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
      {list.length} flag
    </span>
  );
}
EOF

cat > components/admin/StatCard.tsx <<'EOF'
import type { LucideIcon } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
        </div>

        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
EOF

cat > components/admin/ExportButton.tsx <<'EOF'
"use client";

import { Download } from "lucide-react";
import { downloadCsv, rowsToCsv } from "@/lib/utils/csv";

export default function ExportButton({
  rows,
  filename = "candidates.csv"
}: {
  rows: Record<string, unknown>[];
  filename?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => downloadCsv(filename, rowsToCsv(rows))}
      className="inline-flex items-center gap-2 rounded-2xl bg-navy-950 px-4 py-3 text-sm font-bold text-white hover:bg-navy-800 disabled:opacity-50"
      disabled={!rows.length}
    >
      <Download className="h-4 w-4" />
      Export CSV
    </button>
  );
}
EOF

cat > components/admin/CandidateTable.tsx <<'EOF'
"use client";

import Link from "next/link";
import DiscBadge from "@/components/disc/DiscBadge";
import FitScoreBadge from "./FitScoreBadge";
import RedFlagBadge from "./RedFlagBadge";
import type { AssessmentRecord } from "@/types/assessment";
import type { CandidateSummaryRow } from "@/types/candidate";
import { formatDateTime } from "@/lib/utils/format";

type AnyRow = AssessmentRecord | CandidateSummaryRow;

function normalize(row: AnyRow): CandidateSummaryRow {
  if ("candidate" in row) {
    return {
      candidate_id: row.candidate_id,
      created_at: row.created_at,
      full_name: row.candidate.fullName,
      whatsapp: row.candidate.whatsapp,
      email: row.candidate.email,
      position_applied: row.candidate.positionApplied,
      domicile: row.candidate.domicile,
      age: row.candidate.age,
      education: row.candidate.education,
      last_experience: row.candidate.lastExperience,
      source: row.candidate.source,
      assessment_level: String(row.candidate.assessmentLevel),
      disc_type: row.disc.type,
      disc_fit_score: row.disc.fitScore,
      iq_score: row.iq.percentageScore,
      iq_fit_score: row.iq.fitScore,
      combined_score: row.combined.score,
      combined_category: row.combined.category,
      final_recommendation: row.combined.recommendation,
      red_flags: row.redFlags.join(" | "),
      summary: row.summary
    };
  }

  return row;
}

export function normalizeCandidateRows(rows: AnyRow[]): CandidateSummaryRow[] {
  return rows.map(normalize);
}

export default function CandidateTable({ rows }: { rows: AnyRow[] }) {
  const normalized = normalizeCandidateRows(rows);

  if (!normalized.length) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-bold text-slate-900">
          Belum ada kandidat
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Data akan muncul setelah kandidat menyelesaikan assessment.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Posisi</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">DISC</th>
              <th className="px-4 py-3">DISC Fit</th>
              <th className="px-4 py-3">IQ Score</th>
              <th className="px-4 py-3">IQ Fit</th>
              <th className="px-4 py-3">Combined</th>
              <th className="px-4 py-3">Rekomendasi</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {normalized.map((row) => (
              <tr key={row.candidate_id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-semibold text-slate-950">
                  {row.full_name}
                </td>
                <td className="px-4 py-3">{row.whatsapp}</td>
                <td className="px-4 py-3">{row.position_applied}</td>
                <td className="px-4 py-3">{formatDateTime(row.created_at)}</td>
                <td className="px-4 py-3">
                  <DiscBadge type={row.disc_type || "-"} />
                </td>
                <td className="px-4 py-3">
                  <FitScoreBadge score={Number(row.disc_fit_score || 0)} />
                </td>
                <td className="px-4 py-3">
                  {Math.round(Number(row.iq_score || 0))}%
                </td>
                <td className="px-4 py-3">
                  <FitScoreBadge score={Number(row.iq_fit_score || 0)} />
                </td>
                <td className="px-4 py-3">
                  <FitScoreBadge score={Number(row.combined_score || 0)} />
                </td>
                <td className="px-4 py-3 font-semibold">
                  {row.final_recommendation}
                </td>
                <td className="px-4 py-3">
                  <RedFlagBadge flags={row.red_flags} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    className="rounded-xl bg-cyan-50 px-3 py-2 font-bold text-cyan-700 hover:bg-cyan-100"
                    href={`/admin/candidate/${row.candidate_id}`}
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
EOF

cat > components/admin/CandidateDetail.tsx <<'EOF'
"use client";

import Link from "next/link";
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

export default function CandidateDetail({
  record
}: {
  record: AssessmentRecord;
}) {
  const weakest =
    Object.entries(record.iq.subtests)
      .sort((a, b) => a[1] - b[1])[0]?.[0] || "logical";

  const interviewQuestions = [
    `Ceritakan contoh saat Anda bekerja dalam situasi yang menuntut gaya ${record.disc.type}.`,
    `Untuk posisi ${record.candidate.positionApplied}, bagaimana Anda menjaga kualitas kerja saat target meningkat?`,
    `Subtest terlemah Anda adalah ${categoryLabel(weakest)}. Apa strategi Anda agar area ini tidak menghambat pekerjaan?`,
    "Ceritakan pengalaman saat Anda menemukan kesalahan data dan cara Anda memperbaikinya.",
    "Apa yang Anda lakukan jika instruksi atasan berbeda dengan kondisi lapangan?"
  ];

  function exportCandidate() {
    const csv = rowsToCsv([
      {
        candidate_id: record.candidate_id,
        created_at: record.created_at,
        full_name: record.candidate.fullName,
        whatsapp: record.candidate.whatsapp,
        email: record.candidate.email,
        position_applied: record.candidate.positionApplied,
        disc_type: record.disc.type,
        disc_fit_score: record.disc.fitScore,
        iq_score: record.iq.percentageScore,
        iq_fit_score: record.iq.fitScore,
        combined_score: record.combined.score,
        final_recommendation: record.combined.recommendation,
        red_flags: record.redFlags.join(" | "),
        summary: record.summary
      }
    ]);

    downloadCsv(`${record.candidate.fullName}-assessment.csv`, csv);
  }

  return (
    <div className="print-area space-y-6 rounded-3xl bg-white p-6 shadow-premium">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            Candidate ID: {record.candidate_id}
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">
            {record.candidate.fullName}
          </h1>
          <p className="mt-1 text-slate-600">
            {record.candidate.positionApplied} •{" "}
            {formatDateTime(record.created_at)}
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

      <Section title="A. Data Kandidat">
        <InfoGrid
          items={[
            ["WhatsApp", record.candidate.whatsapp],
            ["Email", record.candidate.email || "-"],
            ["Domisili", record.candidate.domicile || "-"],
            ["Usia", record.candidate.age || "-"],
            ["Pendidikan", record.candidate.education || "-"],
            ["Pengalaman", record.candidate.lastExperience || "-"],
            ["Sumber", record.candidate.source || "-"],
            ["Assessment Level", `Level ${record.candidate.assessmentLevel}`]
          ]}
        />
      </Section>

      <Section title="B. DISC Result">
        <div className="flex flex-wrap items-center gap-3">
          <DiscBadge type={record.disc.type} />
          <FitScoreBadge score={record.disc.fitScore} />
          <RedFlagBadge flags={record.disc.redFlags} />
        </div>

        <DiscResultChart percentages={record.disc.percentages} />

        <InfoGrid
          items={[
            ["D", `${record.disc.percentages.D}%`],
            ["I", `${record.disc.percentages.I}%`],
            ["S", `${record.disc.percentages.S}%`],
            ["C", `${record.disc.percentages.C}%`],
            [
              "DISC Fit",
              `${record.disc.fitScore} — ${record.disc.fitCategory}`
            ],
            ["Rekomendasi DISC", record.disc.recommendation]
          ]}
        />

        <p className="rounded-2xl bg-slate-50 p-4 text-slate-700">
          {record.disc.interpretation.summary}
        </p>

        <TextList
          title="Kekuatan"
          items={record.disc.interpretation.strengths || []}
        />

        <TextList
          title="Risiko"
          items={record.disc.interpretation.risks || []}
        />

        <TextList
          title="Cara Mengelola"
          items={record.disc.interpretation.managementTips || []}
        />
      </Section>

      <Section title="C. Cognitive Ability Screening Result">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Total Score" value={`${record.iq.percentageScore}%`} />
          <Metric
            label="Weighted"
            value={`${record.iq.weightedScore}/${record.iq.maxWeightedScore}`}
          />
          <Metric
            label="Benar/Salah/Kosong"
            value={`${record.iq.correctCount}/${record.iq.wrongCount}/${record.iq.blankCount}`}
          />
          <Metric label="Durasi" value={formatSeconds(record.iq.durationSeconds)} />
        </div>

        <IQResultChart subtests={record.iq.subtests} />
        <IQSubtestBreakdown subtests={record.iq.subtests} />

        <InfoGrid
          items={[
            ["Level", `Level ${record.iq.level}`],
            ["IQ Fit", `${record.iq.fitScore} — ${record.iq.fitCategory}`],
            ["Rekomendasi IQ", record.iq.recommendation],
            ["Summary", record.iq.summary]
          ]}
        />
      </Section>

      <Section title="D. Combined Result">
        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Combined Score" value={record.combined.score} />
          <Metric label="Kategori" value={record.combined.category} />
          <Metric
            label="Bobot"
            value={`DISC ${Math.round(
              record.combined.weights.disc * 100
            )}% / IQ ${Math.round(record.combined.weights.iq * 100)}%`}
          />
        </div>

        <p className="rounded-2xl bg-cyan-50 p-4 font-semibold text-cyan-900">
          Final recommendation: {record.combined.recommendation}
        </p>
      </Section>

      <Section title="E. Interview Questions">
        <TextList title="Pertanyaan otomatis" items={interviewQuestions} />
      </Section>

      <Section title="F. Red Flags">
        {record.redFlags.length ? (
          <TextList title="Perlu konfirmasi" items={record.redFlags} />
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
              {record.discAnswers.map((answer) => {
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
              })}
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
              {record.iqAnswers.map((answer) => {
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
              })}
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
        <div key={label} className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
          <p className="mt-1 font-semibold text-slate-900">{value}</p>
        </div>
      ))}
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

cat > app/admin/dashboard/page.tsx <<'EOF'
"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Brain, Target, Users } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import CandidateTable, {
  normalizeCandidateRows
} from "@/components/admin/CandidateTable";
import StatCard from "@/components/admin/StatCard";
import ExportButton from "@/components/admin/ExportButton";
import { getDemoRecords } from "@/lib/storage/localStorageDemo";
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
          setRows(getDemoRecords());
        } else {
          setRows(data.candidates || []);
        }
      } catch (err) {
        setDemo(true);
        setError(
          err instanceof Error
            ? `${err.message} Data demo localStorage ditampilkan.`
            : "Fallback demo mode."
        );
        setRows(getDemoRecords());
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

      return (
        matchSearch && matchPosition && matchDisc && matchRecommendation
      );
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

cat > "app/admin/candidate/[id]/page.tsx" <<'EOF'
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import CandidateDetail from "@/components/admin/CandidateDetail";
import { getDemoRecordById } from "@/lib/storage/localStorageDemo";
import type { AssessmentRecord } from "@/types/assessment";

export default function CandidateDetailPage({
  params
}: {
  params: { id: string };
}) {
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const response = await fetch(`/api/candidate/${params.id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Gagal mengambil detail.");
        }

        if (data.demo) {
          setRecord(getDemoRecordById(params.id));
        } else {
          setRecord(data.candidate);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? `${err.message} Data demo localStorage ditampilkan.`
            : "Fallback demo detail."
        );
        setRecord(getDemoRecordById(params.id));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  return (
    <AdminLayout>
      {error && (
        <p className="mb-4 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
          Loading detail kandidat...
        </div>
      ) : !record ? (
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-bold text-slate-900">
            Data kandidat tidak ditemukan
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Pastikan kandidat sudah submit assessment di browser yang sama jika
            masih menggunakan Demo Mode.
          </p>
        </div>
      ) : (
        <CandidateDetail record={record} />
      )}
    </AdminLayout>
  );
}
EOF

cat >> README.md <<'EOF'

---

## Part 5 — Admin Dashboard + Candidate Detail

Fitur yang ditambahkan:
- Dashboard kandidat.
- Demo Mode badge.
- Search nama / WhatsApp.
- Filter posisi.
- Filter DISC type.
- Filter rekomendasi akhir.
- Stat cards:
  - Total kandidat
  - Kandidat hari ini
  - Rata-rata DISC fit
  - Rata-rata IQ score
  - Rata-rata combined score
  - Jumlah kandidat prioritas tinggi
- Candidate table.
- Detail kandidat:
  - Data kandidat
  - DISC result
  - DISC chart
  - IQ result
  - IQ subtest chart
  - Combined result
  - Interview questions otomatis
  - Red flags
  - Detail jawaban DISC
  - Detail jawaban IQ
  - Export kandidat CSV
  - Print detail kandidat

Test cepat:
1. Jalankan assessment sampai submit final.
2. Login admin.
3. Buka `/admin/dashboard`.
4. Pastikan data kandidat muncul.
5. Klik Detail.
6. Pastikan chart, score, red flags, dan jawaban detail muncul.
7. Coba Export CSV.
8. Coba Print.
EOF

echo ""
echo "✅ Part 5 selesai."
echo ""
echo "Jalankan:"
echo "npm run dev"