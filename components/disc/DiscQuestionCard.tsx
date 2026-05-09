"use client";

import type { DiscAnswer, DiscQuestion } from "@/types/disc";

export default function DiscQuestionCard({
  question,
  answer,
  onChange
}: {
  question: DiscQuestion;
  answer?: DiscAnswer;
  onChange: (answer: DiscAnswer) => void;
}) {
  function update(kind: "mostOptionId" | "leastOptionId", optionId: string) {
    const next: DiscAnswer = {
      questionId: question.id,
      mostOptionId: answer?.mostOptionId || "",
      leastOptionId: answer?.leastOptionId || "",
      changes: (answer?.changes || 0) + 1,
      [kind]: optionId
    };

    onChange(next);
  }

  const sameSelected =
    Boolean(answer?.mostOptionId) &&
    answer?.mostOptionId === answer?.leastOptionId;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-premium">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-700">
            {question.text}
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-950">
            Pilih yang paling dan paling tidak menggambarkan Anda
          </h2>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          Forced Choice
        </span>
      </div>

      <div className="space-y-4">
        {question.options.map((option) => (
          <div
            key={option.id}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <p className="font-medium leading-7 text-slate-900">
              <span className="font-black">{option.id}.</span> {option.text}
            </p>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <button
                type="button"
                onClick={() => update("mostOptionId", option.id)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  answer?.mostOptionId === option.id
                    ? "bg-cyan-500 text-navy-950"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Paling menggambarkan saya
              </button>

              <button
                type="button"
                onClick={() => update("leastOptionId", option.id)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  answer?.leastOptionId === option.id
                    ? "bg-red-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Paling tidak menggambarkan saya
              </button>
            </div>
          </div>
        ))}
      </div>

      {sameSelected && (
        <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          Jawaban “paling” dan “paling tidak” tidak boleh sama.
        </p>
      )}
    </div>
  );
}
