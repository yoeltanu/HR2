export function getIQCategory(score: number): string {
  if (score >= 90) return "Sangat Kuat";
  if (score >= 80) return "Kuat";
  if (score >= 70) return "Cukup Baik";
  if (score >= 60) return "Perlu Dikonfirmasi";
  return "Kurang Sesuai";
}

export function getIQSummary(score: number): string {
  const category = getIQCategory(score);

  if (score >= 90) {
    return `${category}. Kandidat menunjukkan kemampuan berpikir kerja yang sangat baik untuk screening HR internal.`;
  }

  if (score >= 80) {
    return `${category}. Kandidat memiliki dasar analisa dan akurasi yang baik.`;
  }

  if (score >= 70) {
    return `${category}. Kandidat cukup layak, perlu dikonfirmasi dengan interview dan simulasi kerja.`;
  }

  if (score >= 60) {
    return `${category}. Perlu konfirmasi lebih lanjut pada area subtest yang lemah.`;
  }

  return `${category}. Disarankan melakukan validasi tambahan sebelum lanjut proses.`;
}
