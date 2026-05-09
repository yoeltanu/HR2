"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import CandidateDetail from "@/components/admin/CandidateDetail";
import { getDemoRecordById, seedSampleDemoRecords } from "@/lib/storage/localStorageDemo";
import type { AssessmentRecord } from "@/types/assessment";

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
        const response = await fetch(`/api/candidate/${params.id}`);
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
          setRecord(data.candidate);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? `${err.message} Data demo localStorage ditampilkan.`
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
            Klik Load Sample Data di dashboard, lalu buka detail kandidat lagi.
          </p>
        </div>
      ) : (
        <CandidateDetail record={record} />
      )}
    </AdminLayout>
  );
}
