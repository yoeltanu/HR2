"use client";

import { Download } from "lucide-react";
import { downloadCsv, rowsToCsv } from "@/lib/utils/csv";

export default function ExportButton({
  rows,
  filename = "candidates.csv"
}: {
  rows: Record<string, unknown>[];
  filename?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => downloadCsv(filename, rowsToCsv(rows))}
      className="inline-flex items-center gap-2 rounded-2xl bg-navy-950 px-4 py-3 text-sm font-bold text-white hover:bg-navy-800 disabled:opacity-50"
      disabled={!rows.length}
    >
      <Download className="h-4 w-4" />
      Export CSV
    </button>
  );
}
