export default function DiscBadge({ type }: { type: string }) {
  const primary = type?.[0] || "C";

  const color =
    primary === "D"
      ? "bg-orange-100 text-orange-700"
      : primary === "I"
        ? "bg-yellow-100 text-yellow-800"
        : primary === "S"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-blue-100 text-blue-700";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${color}`}>
      {type || "-"}
    </span>
  );
}
