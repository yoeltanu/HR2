"use client";

import { Clock } from "lucide-react";
import { formatSeconds } from "@/lib/utils/format";

export default function IQTimer({
  secondsLeft
}: {
  secondsLeft: number;
}) {
  const danger = secondsLeft <= 120;

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl px-4 py-3 font-bold ${
        danger
          ? "bg-red-100 text-red-700"
          : "bg-navy-950 text-white"
      }`}
    >
      <Clock className="h-5 w-5" />
      {formatSeconds(secondsLeft)}
    </div>
  );
}
