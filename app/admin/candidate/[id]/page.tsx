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
