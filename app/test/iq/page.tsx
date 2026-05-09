"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AssessmentProgress from "@/components/candidate/AssessmentProgress";
import IQQuestionCard from "@/components/iq/IQQuestionCard";
import IQTimer from "@/components/iq/IQTimer";
import { getIQDurationSeconds, getIQQuestionsByLevel } from "@/lib/iq/iqQuestions";
import {
  clearAssessmentDraft,
  getCandidateDraft,
  getJson,
  saveJson,
  storageKeys,
  storeDemoRecord
} from "@/lib/storage/localStorageDemo";
import type { CandidateInfo } from "@/types/candidate";
import type { IQAnswer } from "@/types/iq";
import type { AssessmentPayload } from "@/types/assessment";

export default function IQPage() {
  const router = useRouter();

  const [candidate, setCandidate] = useState<CandidateInfo | null>(null);
  const [started, setStarted] = useState(false);
  const [startedAt, setStartedAt] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(20 * 60);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<IQAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const draft = getCandidateDraft();

    if (!draft) {
      router.replace("/test/start");
      return;
    }

    setCandidate(draft);
    setSecondsLeft(getIQDurationSeconds(draft.assessmentLevel));
    setAnswers(getJson<IQAnswer[]>(storageKeys.IQ_KEY, []));
  }, [router]);

  const level = candidate?.assessmentLevel || 1;

  const questions = useMemo(() => {
    return getIQQuestionsByLevel(level);
  }, [level]);

  const totalDuration = getIQDurationSeconds(level);

  useEffect(() => {
    saveJson(storageKeys.IQ_KEY, answers);
  }, [answers]);

  const submitAssessment = useCallback(
    async (timedOut: boolean) => {
      if (!candidate || submitting) return;

      if (questions.length === 0) {
        alert(
          "Question bank untuk level ini belum dipasang. Gunakan Level 1 dulu atau lanjutkan Part 4B."
        );
        return;
      }

      const blank =
        questions.length -
        answers.filter((answer) => answer.selectedAnswer).length;

      if (!timedOut && blank > 0) {
        const ok = confirm(`Masih ada ${blank} soal kosong. Tetap submit?`);
        if (!ok) return;
      }

      setSubmitting(true);

      const finishedAt = new Date().toISOString();

      const durationSeconds = Math.round(
        (new Date(finishedAt).getTime() -
          new Date(startedAt || finishedAt).getTime()) /
          1000
      );

      const iqMeta = {
        startedAt,
        finishedAt,
        durationSeconds,
        changeCount: answers.reduce(
          (sum, answer) => sum + (answer.changes || 0),
          0
        ),
        timedOut
      };

      saveJson(storageKeys.IQ_META_KEY, iqMeta);

      const payload: AssessmentPayload = {
        candidate,
        discAnswers: getJson(storageKeys.DISC_KEY, []),
        discMeta: getJson(storageKeys.DISC_META_KEY, {
          startedAt: new Date().toISOString(),
          finishedAt: new Date().toISOString(),
          durationSeconds: 0,
          changeCount: 0
        }),
        iqAnswers: questions.map(
          (question) =>
            answers.find((answer) => answer.questionId === question.id) || {
              questionId: question.id
            }
        ),
        iqMeta
      };

      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || data.errors?.join(", ") || "Submit gagal."
          );
        }

        if (data.record) {
          storeDemoRecord(data.record);
        }

        clearAssessmentDraft();
        router.push("/test/completed");
      } catch (error) {
        alert(error instanceof Error ? error.message : "Submit gagal.");
        setSubmitting(false);
      }
    },
    [answers, candidate, questions, router, startedAt, submitting]
  );

  useEffect(() => {
    if (!started || submitting) return;

    if (secondsLeft <= 0) {
      submitAssessment(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft, started, submitAssessment, submitting]);

  function start() {
    const now = new Date().toISOString();
    setStartedAt(now);
    setStarted(true);
  }

  function setAnswer(answer: IQAnswer) {
    setAnswers((current) => {
      const next = current.filter(
        (item) => item.questionId !== answer.questionId
      );

      return [...next, answer].sort((a, b) =>
        a.questionId.localeCompare(b.questionId)
      );
    });
  }

  if (!candidate) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-3xl bg-white p-8 shadow-premium">
            Memuat data kandidat...
          </div>
        </section>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-3xl bg-white p-8 shadow-premium">
            <p className="text-sm font-bold text-cyan-700">
              Cognitive Ability Screening
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Question bank Level {level} belum dipasang
            </h1>
            <p className="mt-4 leading-7 text-slate-600">
              Part 4A memasang Level 1 lengkap. Level 2 dan Level 3 akan
              dipasang di Part 4B. Untuk test sekarang, kembali ke form kandidat
              dan pilih Level 1.
            </p>
            <button
              onClick={() => router.push("/test/start")}
              className="mt-6 rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950"
            >
              Kembali ke Form Kandidat
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-3xl bg-white p-8 shadow-premium">
            <p className="text-sm font-bold text-cyan-700">
              Instruksi Cognitive Ability Screening
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Bagian 2 — Level {level}
            </h1>

            <div className="mt-5 rounded-2xl bg-cyan-50 p-4 text-sm text-cyan-900">
              Kandidat: <strong>{candidate.fullName}</strong> • Posisi:{" "}
              <strong>{candidate.positionApplied}</strong>
            </div>

            <p className="mt-5 leading-7 text-slate-600">
              Anda akan mengerjakan {questions.length} soal dalam{" "}
              {Math.round(totalDuration / 60)} menit. Tes ini bukan IQ klinis
              resmi, melainkan screening kemampuan berpikir kerja untuk
              kebutuhan HR internal.
            </p>

            <ul className="mt-6 list-inside list-disc space-y-2 text-slate-700">
              <li>Boleh melewati soal dan kembali lagi selama waktu masih ada.</li>
              <li>Jawaban kosong akan dihitung 0.</li>
              <li>Saat waktu habis, sistem akan submit otomatis.</li>
              <li>Kerjakan mandiri tanpa bantuan orang lain.</li>
            </ul>

            <button
              onClick={start}
              className="mt-8 w-full rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Mulai IQ Screening
            </button>
          </div>
        </section>
      </main>
    );
  }

  const current = questions[index];

  const currentAnswer = answers.find(
    (answer) => answer.questionId === current.id
  );

  const answered = answers.filter((answer) => answer.selectedAnswer).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-4xl space-y-5 px-4 py-8">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <AssessmentProgress
            current={answered}
            total={questions.length}
            label="Progress Cognitive Ability Screening"
          />

          <IQTimer secondsLeft={secondsLeft} />
        </div>

        <div className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
          Soal {index + 1} dari {questions.length}
        </div>

        <IQQuestionCard
          question={current}
          answer={currentAnswer}
          onAnswer={setAnswer}
        />

        <div className="flex justify-between gap-3">
          <button
            disabled={index === 0}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-700 shadow-sm disabled:opacity-40"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {index < questions.length - 1 && (
              <button
                onClick={() =>
                  setIndex((value) =>
                    Math.min(questions.length - 1, value + 1)
                  )
                }
                className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
              >
                Next
              </button>
            )}

            <button
              disabled={submitting}
              onClick={() => submitAssessment(false)}
              className="rounded-2xl bg-navy-950 px-5 py-3 font-bold text-white disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Final"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Cognitive Ability Screening ini bukan tes IQ klinis resmi. Hasilnya
          perlu dikombinasikan dengan interview, pengalaman, referensi, dan
          simulasi kerja.
        </div>
      </section>
    </main>
  );
}
