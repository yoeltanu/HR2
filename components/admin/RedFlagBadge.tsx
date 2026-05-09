export default function RedFlagBadge({
  flags
}: {
  flags: string[] | string;
}) {
  const list = Array.isArray(flags)
    ? flags
    : String(flags || "")
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

  if (!list.length) {
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
        Aman
      </span>
    );
  }

  return (
    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
      {list.length} flag
    </span>
  );
}
