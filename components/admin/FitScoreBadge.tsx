export default function FitScoreBadge({ score }: { score: number }) {
  const safeScore = Number(score || 0);

  const cls =
    safeScore >= 85
      ? "bg-emerald-100 text-emerald-700"
      : safeScore >= 75
        ? "bg-blue-100 text-blue-700"
        : safeScore >= 65
          ? "bg-yellow-100 text-yellow-800"
          : safeScore >= 50
            ? "bg-orange-100 text-orange-700"
            : "bg-red-100 text-red-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${cls}`}>
      {Math.round(safeScore)}
    </span>
  );
}
