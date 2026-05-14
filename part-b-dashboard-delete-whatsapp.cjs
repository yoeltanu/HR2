const fs = require("fs");
const path = require("path");

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
  console.log("Updated:", file);
}

const localStorageFile = "lib/storage/localStorageDemo.ts";
if (fs.existsSync(localStorageFile)) {
  let text = fs.readFileSync(localStorageFile, "utf8");

  if (!text.includes("deleteDemoCandidates")) {
    text += `

export function deleteDemoCandidates(candidateIds: string[]): AssessmentRecord[] {
  const ids = new Set(candidateIds);
  const records = getDemoRecords();
  const next = records.filter((record) => !ids.has(record.candidate_id));

  localStorage.setItem(RECORDS_KEY, JSON.stringify(next));

  const last = getLastRecord();
  if (last && ids.has(last.candidate_id)) {
    localStorage.removeItem(LAST_RECORD_KEY);
  }

  return next;
}
`;
    fs.writeFileSync(localStorageFile, text, "utf8");
    console.log("Patched:", localStorageFile);
  }
}

write("app/api/candidates/delete/route.ts", `
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/utils/auth";
import {
  deleteCandidatesFromGoogleSheets,
  isGoogleSheetsConfigured
} from "@/lib/storage/googleSheets";

export async function DELETE(request: NextRequest) {
  const isAdmin = request.cookies.get(ADMIN_COOKIE_NAME)?.value === "1";

  if (!isAdmin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const candidateIds = Array.isArray(body.candidateIds)
      ? body.candidateIds.filter(Boolean)
      : [];

    if (!candidateIds.length) {
      return NextResponse.json(
        { success: false, message: "candidateIds wajib diisi." },
        { status: 400 }
      );
    }

    if (!isGoogleSheetsConfigured()) {
      return NextResponse.json({
        success: true,
        demo: true,
        deletedCount: candidateIds.length
      });
    }

    const result = await deleteCandidatesFromGoogleSheets(candidateIds, "admin");

    return NextResponse.json({
      success: true,
      demo: false,
      deletedCount: result.deletedCount || candidateIds.length
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menghapus kandidat."
      },
      { status: 500 }
    );
  }
}
`);

const googleSheetsFile = "lib/storage/googleSheets.ts";
if (fs.existsSync(googleSheetsFile)) {
  let text = fs.readFileSync(googleSheetsFile, "utf8");

  if (!text.includes("deleteCandidatesFromGoogleSheets")) {
    text += `

export async function deleteCandidatesFromGoogleSheets(
  candidateIds: string[],
  deletedBy = "admin"
) {
  const config = getConfig();

  if (!config.url || !config.secret) {
    return { success: true, demo: true, deletedCount: candidateIds.length };
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "deleteCandidates",
      secret: config.secret,
      candidateIds,
      deletedBy
    }),
    cache: "no-store"
  });

  const data = await parseJsonResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal menghapus kandidat.");
  }

  return data;
}
`;
    fs.writeFileSync(googleSheetsFile, text, "utf8");
    console.log("Patched:", googleSheetsFile);
  }
}

write("components/admin/CandidateTable.tsx", `
"use client";

import Link from "next/link";
import DiscBadge from "@/components/disc/DiscBadge";
import FitScoreBadge from "./FitScoreBadge";
import RedFlagBadge from "./RedFlagBadge";
import type { AssessmentRecord } from "@/types/assessment";
import type { CandidateSummaryRow } from "@/types/candidate";
import { formatDateTime } from "@/lib/utils/format";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";

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
    } as CandidateSummaryRow;
  }

  return row;
}

export function normalizeCandidateRows(rows: AnyRow[]): CandidateSummaryRow[] {
  return rows
    .map(normalize)
    .filter((row: any) => String(row.is_deleted || "").toUpperCase() !== "TRUE");
}

export default function CandidateTable({
  rows,
  selectedIds,
  onSelectedIdsChange,
  whatsappTemplate
}: {
  rows: AnyRow[];
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  whatsappTemplate?: string;
}) {
  const normalized = normalizeCandidateRows(rows);
  const checkedIds = selectedIds || [];
  const allIds = normalized.map((row) => row.candidate_id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => checkedIds.includes(id));

  function toggleOne(id: string) {
    if (!onSelectedIdsChange) return;

    if (checkedIds.includes(id)) {
      onSelectedIdsChange(checkedIds.filter((item) => item !== id));
    } else {
      onSelectedIdsChange([...checkedIds, id]);
    }
  }

  function toggleAll() {
    if (!onSelectedIdsChange) return;

    if (allSelected) {
      onSelectedIdsChange(checkedIds.filter((id) => !allIds.includes(id)));
    } else {
      onSelectedIdsChange(Array.from(new Set([...checkedIds, ...allIds])));
    }
  }

  if (!normalized.length) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-bold text-slate-900">Belum ada kandidat</p>
        <p className="mt-1 text-sm text-slate-500">
          Data akan muncul setelah kandidat menyelesaikan assessment.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
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
            {normalized.map((row) => {
              const waUrl = whatsappTemplate
                ? buildWhatsAppUrl(row, whatsappTemplate)
                : "";

              return (
                <tr key={row.candidate_id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={checkedIds.includes(row.candidate_id)}
                      onChange={() => toggleOne(row.candidate_id)}
                    />
                  </td>
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
                    <div className="flex gap-2">
                      <Link
                        className="rounded-xl bg-cyan-50 px-3 py-2 font-bold text-cyan-700 hover:bg-cyan-100"
                        href={"/admin/candidate/" + row.candidate_id}
                      >
                        Detail
                      </Link>

                      <button
                        type="button"
                        disabled={!waUrl}
                        onClick={() => window.open(waUrl, "_blank")}
                        className="rounded-xl bg-emerald-50 px-3 py-2 font-bold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

write("app/admin/dashboard/page.tsx", `
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
  deleteDemoCandidates,
  getDemoRecords,
  seedSampleDemoRecords
} from "@/lib/storage/localStorageDemo";
import { getDemoAdminSettings } from "@/lib/storage/adminSettings";
import { DEFAULT_WHATSAPP_TEMPLATE } from "@/lib/utils/whatsapp";
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
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    DEFAULT_WHATSAPP_TEMPLATE
  );

  function loadDemoRowsWithSamples() {
    const existing = getDemoRecords();
    const data = existing.length ? existing : seedSampleDemoRecords();
    setRows(data);
    return data;
  }

  async function loadWhatsappTemplate() {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();

      if (
        data.success &&
        data.settings?.whatsapp_candidate_message_template
      ) {
        setWhatsappTemplate(data.settings.whatsapp_candidate_message_template);
        return;
      }
    } catch {}

    setWhatsappTemplate(
      getDemoAdminSettings().whatsapp_candidate_message_template ||
        DEFAULT_WHATSAPP_TEMPLATE
    );
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      await loadWhatsappTemplate();

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
            ? err.message + " Data demo localStorage ditampilkan."
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
    setSelectedIds([]);
  }

  function clearSamples() {
    const ok = confirm("Hapus semua data demo dari localStorage?");
    if (!ok) return;
    clearDemoRecords();
    setRows([]);
    setSelectedIds([]);
  }

  async function deleteSelected() {
    if (!selectedIds.length) return;

    const ok = confirm(
      "Yakin ingin menghapus " +
        selectedIds.length +
        " kandidat terpilih? Data akan disembunyikan dari dashboard."
    );

    if (!ok) return;

    try {
      const response = await fetch("/api/candidates/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          candidateIds: selectedIds
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal menghapus kandidat.");
      }

      if (data.demo || demo) {
        deleteDemoCandidates(selectedIds);
      }

      setRows((current) =>
        current.filter((row: any) => {
          const id = row.candidate_id;
          return !selectedIds.includes(id);
        })
      );

      setSelectedIds([]);
      setToast("Kandidat terpilih berhasil dihapus dari dashboard.");
      window.setTimeout(() => setToast(""), 2500);
    } catch {
      setToast("Gagal menghapus kandidat. Silakan coba lagi.");
      window.setTimeout(() => setToast(""), 2500);
    }
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

          {selectedIds.length > 0 && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-700">
              {selectedIds.length} kandidat dipilih
            </span>
          )}

          <button
            type="button"
            onClick={deleteSelected}
            disabled={!selectedIds.length}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" />
            Hapus Terpilih
          </button>

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

      {toast && (
        <p className="mb-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {toast}
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
        <CandidateTable
          rows={filtered}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
          whatsappTemplate={whatsappTemplate}
        />
      )}
    </AdminLayout>
  );
}
`);

console.log("");
console.log("✅ Part B selesai.");
console.log("Sekarang jalankan: npm run build");