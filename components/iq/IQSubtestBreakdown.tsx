import type { IQSubtestScores } from "@/types/iq";
import { categoryLabel } from "@/lib/utils/format";

export default function IQSubtestBreakdown({
  subtests
}: {
  subtests: IQSubtestScores;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {Object.entries(subtests).map(([key, value]) => (
        <div key={key} className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">
            {categoryLabel(key)}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {value}%
          </p>
        </div>
      ))}
    </div>
  );
}
