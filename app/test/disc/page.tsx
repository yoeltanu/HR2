"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AssessmentProgress from "@/components/candidate/AssessmentProgress";
import DiscQuestionCard from "@/components/disc/DiscQuestionCard";
import { discQuestions } from "@/lib/disc/discQuestions";
import {
  getCandidateDraft,
  getJson,
  saveJson,
  storageKeys
} from "@/lib/storage/localStorageDemo";
import type { DiscAnswer } from "@/types/disc";

export default function DiscPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<DiscAnswer[]>([]);
  const [startedAt] = useState(new Date().toISOString());
  const [error, setError] = useState("");

  useEffect(() => {
    const candidate = getCandidateDraft();

    if (!candidate) {
      router.replace("/test/start");
      return;
    }

    const saved = getJson<DiscAnswer[]>(storageKeys.DISC_KEY, []);
    setAnswers(saved);
  }, [router]);

  useEffect(() => {
    saveJson(storageKeys.DISC_KEY, answers);
  }, [answers]);

  const current = discQuestions[index];

  const currentAnswer = answers.find(
    (answer) => answer.questionId === current.id
  );

  const completed = useMemo(
    () =>
      answers.filter(
        (answer) =>
          answer.mostOptionId &&
          answer.leastOptionId &&
          answer.mostOptionId !== answer.leastOptionId
      ).length,
    [answers]
  );

  function setAnswer(answer: DiscAnswer) {
    setError("");

    setAnswers((currentAnswers) => {
      const next = currentAnswers.filter(
        (item) => item.questionId !== answer.questionId
      );

      return [...next, answer].sort((a, b) =>
        a.questionId.localeCompare(b.questionId)
      );
    });
  }

  function goNext() {
    const answer = answers.find((item) => item.questionId === current.id);

    if (
      !answer?.mostOptionId ||
      !answer?.leastOptionId ||
      answer.mostOptionId === answer.leastOptionId
    ) {
      setError("Lengkapi jawaban soal ini terlebih dahulu.");
      return;
    }

    setIndex((value) => Math.min(discQuestions.length - 1, value + 1));
  }

  function finishDisc() {
    const invalid = discQuestions.some((question) => {
      const answer = answers.find((item) => item.questionId === question.id);

      return (
        !answer?.mostOptionId ||
        !answer?.leastOptionId ||
        answer.mostOptionId === answer.leastOptionId
      );
    });

    if (invalid) {
      setError(
        "Mohon lengkapi semua jawaban DISC dan pastikan pilihan tidak sama."
      );
      return;
    }

    const finishedAt = new Date().toISOString();

    saveJson(storageKeys.DISC_META_KEY, {
      startedAt,
      finishedAt,
      durationSeconds: Math.round(
        (new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000
      ),
      changeCount: answers.reduce(
        (sum, answer) => sum + (answer.changes || 0),
        0
      )
    });

    router.push("/test/iq");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-4xl space-y-5 px-4 py-8">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <AssessmentProgress
            current={completed}
            total={discQuestions.length}
            label="Progress DISC"
          />

          <div className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-bold text-slate-700 shadow-sm">
            {index + 1} / {discQuestions.length}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <DiscQuestionCard
          question={current}
          answer={currentAnswer}
          onChange={setAnswer}
        />

        <div className="flex justify-between gap-3">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => {
              setError("");
              setIndex((value) => Math.max(0, value - 1));
            }}
            className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-700 shadow-sm disabled:opacity-40"
          >
            Previous
          </button>

          {index < discQuestions.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={finishDisc}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Lanjut IQ Screening
            </button>
          )}
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          DISC membaca preferensi gaya kerja dan komunikasi. Hasilnya bukan
          label permanen dan perlu dikonfirmasi melalui interview.
        </div>
      </section>
    </main>
  );
}
