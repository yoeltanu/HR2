export default function AssessmentProgress({
  current,
  total,
  label
}: {
  current: number;
  total: number;
  label: string;
}) {
  const percentage = total ? Math.round((current / total) * 100) : 0;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">
          {current}/{total}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
