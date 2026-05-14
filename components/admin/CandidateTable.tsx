
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
                    {String(row.full_name || "-")}
                  </td>
                  <td className="px-4 py-3">{String(row.whatsapp || "-")}</td>
                  <td className="px-4 py-3">{String(row.position_applied || "-")}</td>
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
                    {String(row.final_recommendation || "-")}
                  </td>
                  <td className="px-4 py-3">
                    <RedFlagBadge flags={String(row.red_flags || "").split(" | ").filter(Boolean)} />
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
