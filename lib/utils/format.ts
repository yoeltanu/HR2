export function roundScore(value: number): number {
  return Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function formatSeconds(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safe / 60);
  const remaining = safe % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export function getScoreCategory(score: number): string {
  if (score >= 85) return "Sangat cocok";
  if (score >= 75) return "Cocok";
  if (score >= 65) return "Cukup, perlu konfirmasi";
  if (score >= 50) return "Kurang cocok";
  return "Tidak direkomendasikan";
}

export function getCombinedCategory(score: number): string {
  if (score >= 85) return "Prioritas tinggi";
  if (score >= 75) return "Layak lanjut";
  if (score >= 65) return "Perlu konfirmasi";
  if (score >= 50) return "Cadangan";
  return "Tidak prioritas";
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    logical: "Logical Reasoning",
    numerical: "Numerical Reasoning",
    verbal: "Verbal Reasoning",
    pattern: "Pattern Reasoning",
    workingAccuracy: "Working Accuracy"
  };

  return labels[category] || category;
}
