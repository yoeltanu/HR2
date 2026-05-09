"use client";

import Link from "next/link";
import { useState } from "react";
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
import { updateDemoRecordCandidate } from "@/lib/storage/localStorageDemo";

export default function CandidateDetail({
  record
}: {
  record: AssessmentRecord;
}) {
  const [currentRecord, setCurrentRecord] = useState(record);
  const [editingWhatsapp, setEditingWhatsapp] = useState(false);
  const [whatsappDraft, setWhatsappDraft] = useState(record.candidate.whatsapp);
  const [saveMessage, setSaveMessage] = useState("");

  const weakest =
    Object.entries(currentRecord.iq.subtests)
      .sort((a, b) => a[1] - b[1])[0]?.[0] || "logical";

  const interviewQuestions = [
    `Ceritakan contoh saat Anda bekerja dalam situasi yang menuntut gaya ${currentRecord.disc.type}.`,
    `Untuk posisi ${currentRecord.candidate.positionApplied}, bagaimana Anda menjaga kualitas kerja saat target meningkat?`,
    `Subtest terlemah Anda adalah ${categoryLabel(weakest)}. Apa strategi Anda agar area ini tidak menghambat pekerjaan?`,
    "Ceritakan pengalaman saat Anda menemukan kesalahan data dan cara Anda memperbaikinya.",
    "Apa yang Anda lakukan jika instruksi atasan berbeda dengan kondisi lapangan?"
  ];

  function saveWhatsapp() {
    const updated = updateDemoRecordCandidate(currentRecord.candidate_id, {
      whatsapp: whatsappDraft.trim()
    });

    if (updated) {
      setCurrentRecord(updated);
      setSaveMessage("Nomor WhatsApp kandidat berhasil diperbarui di Demo Mode.");
    } else {
      setCurrentRecord({
        ...currentRecord,
        candidate: {
          ...currentRecord.candidate,
          whatsapp: whatsappDraft.trim()
        }
      });
      setSaveMessage("Nomor WhatsApp diperbarui pada tampilan ini.");
    }

    setEditingWhatsapp(false);
    window.setTimeout(() => setSaveMessage(""), 2600);
  }

  function exportCandidate() {
    const csv = rowsToCsv([
      {
        candidate_id: currentRecord.candidate_id,
        created_at: currentRecord.created_at,
        full_name: currentRecord.candidate.fullName,
        whatsapp: currentRecord.candidate.whatsapp,
        email: currentRecord.candidate.email,
        position_applied: currentRecord.candidate.positionApplied,
        disc_type: currentRecord.disc.type,
        disc_fit_score: currentRecord.disc.fitScore,
        iq_score: currentRecord.iq.percentageScore,
        iq_fit_score: currentRecord.iq.fitScore,
        combined_score: currentRecord.combined.score,
        final_recommendation: currentRecord.combined.recommendation,
        red_flags: currentRecord.redFlags.join(" | "),
        summary: currentRecord.summary
      }
    ]);

    downloadCsv(`${currentRecord.candidate.fullName}-assessment.csv`, csv);
  }

  return (
    <div className="print-area space-y-6 rounded-3xl bg-white p-6 shadow-premium">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            Candidate ID: {currentRecord.candidate_id}
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-950">
            {currentRecord.candidate.fullName}
          </h1>
          <p className="mt-1 text-slate-600">
            {currentRecord.candidate.positionApplied} •{" "}
            {formatDateTime(currentRecord.created_at)}
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

      {saveMessage && (
        <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {saveMessage}
        </p>
      )}

      <Section title="A. Data Kandidat">
        <div className="grid gap-3 md:grid-cols-2">
          <InfoItem
            label="WhatsApp"
            value={
              <div className="flex flex-wrap items-center gap-2">
                {editingWhatsapp ? (
                  <>
                    <input
                      className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-500"
                      value={whatsappDraft}
                      onChange={(event) => setWhatsappDraft(event.target.value)}
                    />
                    <button
                      onClick={saveWhatsapp}
                      className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-bold text-navy-950"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setEditingWhatsapp(false);
                        setWhatsappDraft(currentRecord.candidate.whatsapp);
                      }}
                      className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <span>{currentRecord.candidate.whatsapp}</span>
                    <button
                      onClick={() => setEditingWhatsapp(true)}
                      className="no-print rounded-xl bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            }
          />
          <InfoItem label="Email" value={currentRecord.candidate.email || "-"} />
          <InfoItem label="Domisili" value={currentRecord.candidate.domicile || "-"} />
          <InfoItem label="Usia" value={currentRecord.candidate.age || "-"} />
          <InfoItem label="Pendidikan" value={currentRecord.candidate.education || "-"} />
          <InfoItem label="Pengalaman" value={currentRecord.candidate.lastExperience || "-"} />
          <InfoItem label="Sumber" value={currentRecord.candidate.source || "-"} />
          <InfoItem label="Assessment Level" value={`Level ${currentRecord.candidate.assessmentLevel}`} />
        </div>
      </Section>

      <Section title="B. DISC Result">
        <div className="flex flex-wrap items-center gap-3">
          <DiscBadge type={currentRecord.disc.type} />
          <FitScoreBadge score={currentRecord.disc.fitScore} />
          <RedFlagBadge flags={currentRecord.disc.redFlags} />
        </div>

        <DiscResultChart percentages={currentRecord.disc.percentages} />

        <InfoGrid
          items={[
            ["D", `${currentRecord.disc.percentages.D}%`],
            ["I", `${currentRecord.disc.percentages.I}%`],
            ["S", `${currentRecord.disc.percentages.S}%`],
            ["C", `${currentRecord.disc.percentages.C}%`],
            [
              "DISC Fit",
              `${currentRecord.disc.fitScore} — ${currentRecord.disc.fitCategory}`
            ],
            ["Rekomendasi DISC", currentRecord.disc.recommendation]
          ]}
        />

        <p className="rounded-2xl bg-slate-50 p-4 text-slate-700">
          {currentRecord.disc.interpretation.summary}
        </p>

        <TextList
          title="Kekuatan"
          items={currentRecord.disc.interpretation.strengths || []}
        />

        <TextList
          title="Risiko"
          items={currentRecord.disc.interpretation.risks || []}
        />

        <TextList
          title="Cara Mengelola"
          items={currentRecord.disc.interpretation.managementTips || []}
        />
      </Section>

      <Section title="C. Cognitive Ability Screening Result">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Total Score" value={`${currentRecord.iq.percentageScore}%`} />
          <Metric
            label="Weighted"
            value={`${currentRecord.iq.weightedScore}/${currentRecord.iq.maxWeightedScore}`}
          />
          <Metric
            label="Benar/Salah/Kosong"
            value={`${currentRecord.iq.correctCount}/${currentRecord.iq.wrongCount}/${currentRecord.iq.blankCount}`}
          />
          <Metric label="Durasi" value={formatSeconds(currentRecord.iq.durationSeconds)} />
        </div>

        <IQResultChart subtests={currentRecord.iq.subtests} />
        <IQSubtestBreakdown subtests={currentRecord.iq.subtests} />

        <InfoGrid
          items={[
            ["Level", `Level ${currentRecord.iq.level}`],
            ["IQ Fit", `${currentRecord.iq.fitScore} — ${currentRecord.iq.fitCategory}`],
            ["Rekomendasi IQ", currentRecord.iq.recommendation],
            ["Summary", currentRecord.iq.summary]
          ]}
        />
      </Section>

      <Section title="D. Combined Result">
        <div className="grid gap-4 md:grid-cols-3">
          <Metric label="Combined Score" value={currentRecord.combined.score} />
          <Metric label="Kategori" value={currentRecord.combined.category} />
          <Metric
            label="Bobot"
            value={`DISC ${Math.round(
              currentRecord.combined.weights.disc * 100
            )}% / IQ ${Math.round(currentRecord.combined.weights.iq * 100)}%`}
          />
        </div>

        <p className="rounded-2xl bg-cyan-50 p-4 font-semibold text-cyan-900">
          Final recommendation: {currentRecord.combined.recommendation}
        </p>
      </Section>

      <Section title="E. Interview Questions">
        <TextList title="Pertanyaan otomatis" items={interviewQuestions} />
      </Section>

      <Section title="F. Red Flags">
        {currentRecord.redFlags.length ? (
          <TextList title="Perlu konfirmasi" items={currentRecord.redFlags} />
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
              {currentRecord.discAnswers.length ? (
                currentRecord.discAnswers.map((answer) => {
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
                })
              ) : (
                <tr>
                  <td className="p-2 text-slate-500" colSpan={3}>
                    Sample data tidak memiliki jawaban DISC detail.
                  </td>
                </tr>
              )}
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
              {currentRecord.iqAnswers.length ? (
                currentRecord.iqAnswers.map((answer) => {
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
                })
              ) : (
                <tr>
                  <td className="p-2 text-slate-500" colSpan={6}>
                    Sample data tidak memiliki jawaban IQ detail.
                  </td>
                </tr>
              )}
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
        <InfoItem key={label} label={label} value={value} />
      ))}
    </div>
  );
}

function InfoItem({
  label,
  value
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
      <div className="mt-1 font-semibold text-slate-900">{value}</div>
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
