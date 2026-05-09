import type { IQSubtestScores } from "@/types/iq";
import { getScoreCategory } from "@/lib/utils/format";

export interface IQThreshold {
  total: number;
  logical?: number;
  numerical?: number;
  verbal?: number;
  pattern?: number;
  workingAccuracy?: number;
}

export const iqPositionThresholds: Record<string, IQThreshold> = {
  Accounting: {
    total: 75,
    numerical: 80,
    workingAccuracy: 80,
    logical: 70
  },
  "Admin Retur": {
    total: 65,
    workingAccuracy: 75,
    verbal: 65,
    logical: 60
  },
  "Admin Inbound": {
    total: 65,
    workingAccuracy: 75,
    numerical: 65
  },
  "Customer Service": {
    total: 65,
    verbal: 75,
    logical: 60,
    workingAccuracy: 65
  },
  "E-commerce Specialist": {
    total: 75,
    numerical: 75,
    logical: 75,
    pattern: 70
  },
  "Head of Sales": {
    total: 80,
    logical: 80,
    numerical: 75,
    verbal: 75
  },
  Procurement: {
    total: 80,
    numerical: 80,
    logical: 80,
    workingAccuracy: 75
  },
  "Warehouse Leader": {
    total: 70,
    logical: 70,
    workingAccuracy: 70,
    verbal: 65
  },
  "Packing Staff": {
    total: 60,
    workingAccuracy: 75,
    pattern: 60
  },
  HRGA: {
    total: 70,
    verbal: 75,
    logical: 70,
    workingAccuracy: 70
  },
  "Personal Assistant": {
    total: 80,
    logical: 80,
    verbal: 75,
    workingAccuracy: 80,
    numerical: 70
  }
};

export function findIQPositionName(position: string): string {
  const normalized = position.toLowerCase();

  const exact = Object.keys(iqPositionThresholds).find((key) =>
    normalized.includes(key.toLowerCase())
  );

  if (exact) return exact;
  if (normalized.includes("sales")) return "Head of Sales";
  if (normalized.includes("warehouse") || normalized.includes("gudang")) return "Warehouse Leader";
  if (normalized.includes("packing")) return "Packing Staff";
  if (normalized.includes("cs") || normalized.includes("customer")) return "Customer Service";
  if (
    normalized.includes("ecommerce") ||
    normalized.includes("e-commerce") ||
    normalized.includes("marketplace")
  ) {
    return "E-commerce Specialist";
  }

  return "Accounting";
}

export function scoreIQFit(
  totalScore: number,
  subtests: IQSubtestScores,
  position: string
): {
  score: number;
  category: string;
  recommendation: string;
} {
  const positionName = findIQPositionName(position);
  const threshold = iqPositionThresholds[positionName];

  let fit = 100;
  const penalties: number[] = [];

  if (totalScore < threshold.total) {
    penalties.push((threshold.total - totalScore) * 1.2);
  }

  (["logical", "numerical", "verbal", "pattern", "workingAccuracy"] as const)
    .forEach((key) => {
      const min = threshold[key];

      if (min && subtests[key] < min) {
        penalties.push((min - subtests[key]) * 1.1);
      }
    });

  fit -= penalties.reduce((sum, value) => sum + value, 0);
  fit = Math.max(35, Math.min(100, Math.round(fit)));

  return {
    score: fit,
    category: getScoreCategory(fit),
    recommendation: `${getScoreCategory(fit)} untuk ${positionName}. Minimal total ${threshold.total}.`
  };
}
