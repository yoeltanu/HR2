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
