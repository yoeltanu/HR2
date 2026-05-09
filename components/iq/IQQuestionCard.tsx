"use client";

import type { IQAnswer, IQQuestion, IQOptionKey } from "@/types/iq";
import { categoryLabel } from "@/lib/utils/format";

export default function IQQuestionCard({
  question,
  answer,
  onAnswer
}: {
  question: IQQuestion;
  answer?: IQAnswer;
  onAnswer: (value: IQAnswer) => void;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-premium">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold uppercase text-cyan-700">
          {categoryLabel(question.category)}
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
          {question.difficulty}
        </span>
      </div>

      <h2 className="text-xl font-bold leading-8 text-slate-950">
        {question.question}
      </h2>

      <div className="mt-6 grid gap-3">
        {Object.entries(question.options).map(([key, text]) => (
          <button
            type="button"
            key={key}
            onClick={() =>
              onAnswer({
                questionId: question.id,
                selectedAnswer: key as IQOptionKey,
                changes: (answer?.changes || 0) + 1
              })
            }
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              answer?.selectedAnswer === key
                ? "border-cyan-500 bg-cyan-50 text-cyan-900"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <span className="font-black">{key}.</span> {text}
          </button>
        ))}
      </div>
    </div>
  );
}
