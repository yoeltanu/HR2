"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, TimerReset } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import type { CandidateInfo } from "@/types/candidate";
import { getCandidateDraft } from "@/lib/storage/localStorageDemo";

export default function InstructionsPage() {
  const [candidate, setCandidate] = useState<CandidateInfo | null>(null);

  useEffect(() => {
    setCandidate(getCandidateDraft());
  }, []);

  const level = candidate?.assessmentLevel || 1;
  const iqTotal = level === 1 ? 25 : level === 2 ? 35 : 45;
  const iqDuration = level === 1 ? 20 : level === 2 ? 30 : 40;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-premium">
          <p className="text-sm font-bold text-cyan-700">
            Instruksi Assessment
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            DISC + Cognitive Ability Screening
          </h1>

          {candidate ? (
            <div className="mt-5 rounded-2xl bg-cyan-50 p-4 text-sm text-cyan-900">
              Kandidat: <strong>{candidate.fullName}</strong> • Posisi:{" "}
              <strong>{candidate.positionApplied}</strong> • Level:{" "}
              <strong>{candidate.assessmentLevel}</strong>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              Data kandidat belum ditemukan. Silakan isi form kandidat terlebih
              dahulu.
            </div>
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <InfoCard
              icon={<ClipboardList className="h-6 w-6" />}
              title="Bagian 1: DISC"
              description="24 soal forced choice. Pilih satu pernyataan yang paling menggambarkan Anda dan satu yang paling tidak menggambarkan Anda."
            />

            <InfoCard
              icon={<TimerReset className="h-6 w-6" />}
              title="Bagian 2: Cognitive Ability Screening"
              description={`Level ${level}: ${iqTotal} soal dalam ${iqDuration} menit. Jawaban kosong diperbolehkan tetapi bernilai 0.`}
            />
          </div>

          <div className="mt-8 space-y-3">
            {[
              "Jawab sesuai kebiasaan kerja Anda, bukan versi ideal.",
              "Tidak ada jawaban benar/salah pada DISC.",
              "Pada DISC, pilihan paling dan paling tidak tidak boleh sama.",
              "Pada Cognitive Ability Screening, sistem akan auto-submit saat waktu habis.",
              "Hasil tes adalah alat bantu HR dan perlu dikombinasikan dengan interview."
            ].map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-slate-700"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/test/start"
              className="inline-flex flex-1 justify-center rounded-2xl bg-slate-100 px-6 py-4 font-bold text-slate-700 hover:bg-slate-200"
            >
              Kembali Edit Data
            </Link>

            <Link
              href={candidate ? "/test/disc" : "/test/start"}
              className="inline-flex flex-1 justify-center rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Mulai DISC
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-100 text-cyan-700">
        {icon}
      </div>

      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}
