
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
        String(row.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
        String(row.whatsapp || "").toLowerCase().includes(search.toLowerCase());

      const matchPosition =
        !position ||
        String(row.position_applied || "").toLowerCase().includes(position.toLowerCase());

      const matchDisc = !disc || String(row.disc_type || "").includes(disc);

      const matchRecommendation =
        !recommendation || String(row.final_recommendation || "") === recommendation;

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
