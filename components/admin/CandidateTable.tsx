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
