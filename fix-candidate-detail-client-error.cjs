const fs = require("fs");

fs.writeFileSync(
  "app/admin/candidate/[id]/page.tsx",
`"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import CandidateDetail from "@/components/admin/CandidateDetail";
import {
  getDemoRecordById,
  seedSampleDemoRecords
} from "@/lib/storage/localStorageDemo";
import type { AssessmentRecord } from "@/types/assessment";

function rowToRecord(row: any): AssessmentRecord {
  const candidateId = String(row.candidate_id || row.candidateId || "");

  return {
    candidate_id: candidateId,
    created_at: String(row.created_at || row.createdAt || new Date().toISOString()),
    candidate: {
      fullName: String(row.full_name || row.fullName || row.name || "-"),
      whatsapp: String(row.whatsapp || row.phone || "-"),
      email: String(row.email || "-"),
      positionApplied: String(row.position_applied || row.positionApplied || row.position || "-"),
      domicile: String(row.domicile || "-"),
      age: String(row.age || "-"),
      education: String(row.education || "-"),
      lastExperience: String(row.last_experience || row.lastExperience || "-"),
      source: String(row.source || "-"),
      assessmentLevel: Number(row.assessment_level || row.assessmentLevel || 1) as 1 | 2 | 3,
      consent: true
    },
    disc: {
      raw: {
        D: Number(row.raw_D || 0),
        I: Number(row.raw_I || 0),
        S: Number(row.raw_S || 0),
        C: Number(row.raw_C || 0)
      },
      percentages: {
        D: Number(row.pct_D || row.disc_D || 0),
        I: Number(row.pct_I || row.disc_I || 0),
        S: Number(row.pct_S || row.disc_S || 0),
        C: Number(row.pct_C || row.disc_C || 0)
      },
      type: String(row.disc_type || row.discType || "-"),
      fitScore: Number(row.disc_fit_score || row.discFitScore || 0),
      fitCategory: String(row.disc_fit_category || "-"),
      redFlags: String(row.disc_red_flags || "")
        .split(" | ")
        .filter(Boolean),
      recommendation: String(row.disc_recommendation || "-"),
      interpretation: {
        type: String(row.disc_type || "-"),
        title: String(row.disc_type || "-"),
        summary: String(row.summary || row.disc_summary || "Data detail DISC dari Google Sheets belum lengkap."),
        strengths: [],
        risks: [],
        managementTips: []
      }
    },
    discAnswers: [],
    iq: {
      level: Number(row.assessment_level || row.level || 1) as 1 | 2 | 3,
      durationSeconds: Number(row.duration_seconds || 0),
      totalQuestions: Number(row.total_questions || 0),
      answeredCount: Number(row.answered_count || 0),
      blankCount: Number(row.blank_count || 0),
      correctCount: Number(row.correct_count || 0),
      wrongCount: Number(row.wrong_count || 0),
      rawScore: Number(row.raw_score || 0),
      weightedScore: Number(row.weighted_score || 0),
      maxWeightedScore: Number(row.max_weighted_score || 0),
      percentageScore: Number(row.iq_score || row.percentage_score || 0),
      subtests: {
        logical: Number(row.logical_score || 0),
        numerical: Number(row.numerical_score || 0),
        verbal: Number(row.verbal_score || 0),
        pattern: Number(row.pattern_score || 0),
        workingAccuracy: Number(row.working_accuracy_score || 0)
      },
      fitScore: Number(row.iq_fit_score || 0),
      fitCategory: String(row.iq_fit_category || "-"),
      recommendation: String(row.iq_recommendation || "-"),
      redFlags: String(row.iq_red_flags || "")
        .split(" | ")
        .filter(Boolean),
      summary: String(row.iq_summary || "Data detail cognitive dari Google Sheets belum lengkap."),
      changeCount: 0,
      timedOut: false
    },
    iqAnswers: [],
    combined: {
      score: Number(row.combined_score || 0),
      category: String(row.combined_category || "-"),
      recommendation: String(row.final_recommendation || "-"),
      weights: {
        disc: 0.5,
        iq: 0.5
      }
    },
    redFlags: String(row.red_flags || "")
      .split(" | ")
      .filter(Boolean),
    summary: String(row.summary || "-")
  };
}

export default function CandidateDetailPage({
  params
}: {
  params: {
    id: string;
  };
}) {
  const [record, setRecord] = useState<AssessmentRecord | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const response = await fetch("/api/candidate/" + params.id);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Gagal mengambil detail kandidat.");
        }

        if (data.demo) {
          let demoRecord = getDemoRecordById(params.id);

          if (!demoRecord) {
            seedSampleDemoRecords();
            demoRecord = getDemoRecordById(params.id);
          }

          setRecord(demoRecord);
        } else {
          const candidate = data.candidate;

          if (!candidate) {
            setRecord(null);
          } else if (candidate.candidate && candidate.disc && candidate.iq) {
            setRecord(candidate as AssessmentRecord);
          } else {
            setRecord(rowToRecord(candidate));
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message + " Data demo localStorage ditampilkan."
            : "Fallback demo detail."
        );

        let demoRecord = getDemoRecordById(params.id);

        if (!demoRecord) {
          seedSampleDemoRecords();
          demoRecord = getDemoRecordById(params.id);
        }

        setRecord(demoRecord);
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
            Kandidat mungkin sudah dihapus atau belum tersimpan di database.
          </p>
        </div>
      ) : (
        <CandidateDetail record={record} />
      )}
    </AdminLayout>
  );
}
`,
  "utf8"
);

console.log("✅ Fixed candidate detail page for Google Sheets row summary.");