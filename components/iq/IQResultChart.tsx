"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { IQSubtestScores } from "@/types/iq";
import { categoryLabel } from "@/lib/utils/format";

export default function IQResultChart({
  subtests
}: {
  subtests: IQSubtestScores;
}) {
  const data = Object.entries(subtests).map(([name, value]) => ({
    name: categoryLabel(name),
    value
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={0} angle={-12} height={55} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="value" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
