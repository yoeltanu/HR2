import type { LucideIcon } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
        </div>

        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-50 text-cyan-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
