#!/usr/bin/env bash
set -e

echo "Installing Part 4A — IQ Core + Level 1..."

mkdir -p lib/iq lib/combined components/iq

cat > lib/iq/iqQuestions.ts <<'EOF'
import type { IQCategory, IQDifficulty, IQOptionKey, IQQuestion } from "@/types/iq";

function q(
  id: string,
  level: 1 | 2 | 3,
  category: IQCategory,
  difficulty: IQDifficulty,
  question: string,
  options: Record<IQOptionKey, string>,
  correctAnswer: IQOptionKey,
  explanation: string
): IQQuestion {
  return {
    id,
    level,
    category,
    difficulty,
    question,
    options,
    correctAnswer,
    explanation
  };
}

export const iqQuestions: IQQuestion[] = [
  q(
    "L1-001",
    1,
    "logical",
    "easy",
    "Jika semua pesanan COD harus dicek alamatnya, dan pesanan B adalah COD, tindakan yang benar adalah?",
    {
      A: "Langsung kirim",
      B: "Cek alamat pesanan B",
      C: "Batalkan pesanan",
      D: "Tunggu customer komplain"
    },
    "B",
    "Karena pesanan B termasuk COD, alamat wajib dicek."
  ),
  q(
    "L1-002",
    1,
    "logical",
    "easy",
    "Rak A berisi barang fast moving. SKU X sering terjual. Tempat paling tepat untuk SKU X adalah?",
    {
      A: "Rak A",
      B: "Rak arsip",
      C: "Rak rusak",
      D: "Gudang paling belakang"
    },
    "A",
    "Barang sering terjual sebaiknya mudah dijangkau."
  ),
  q(
    "L1-003",
    1,
    "logical",
    "easy",
    "Customer meminta retur karena barang salah warna. Data yang paling perlu dicek pertama adalah?",
    {
      A: "Nama kurir",
      B: "Foto barang dan invoice pesanan",
      C: "Jam makan siang admin",
      D: "Jumlah follower toko"
    },
    "B",
    "Bukti barang dan invoice diperlukan untuk validasi retur."
  ),
  q(
    "L1-004",
    1,
    "logical",
    "easy",
    "Jika SOP packing mewajibkan bubble wrap untuk barang pecah belah, maka gelas kaca harus?",
    {
      A: "Dikirim tanpa pelindung",
      B: "Dimasukkan bubble wrap",
      C: "Ditunda satu bulan",
      D: "Diberi label diskon"
    },
    "B",
    "Gelas kaca adalah barang pecah belah."
  ),
  q(
    "L1-005",
    1,
    "logical",
    "medium",
    "Jika stok fisik lebih sedikit dari stok sistem, langkah awal yang paling tepat adalah?",
    {
      A: "Menghapus semua data",
      B: "Melakukan pengecekan ulang dan mencatat selisih",
      C: "Menaikkan harga",
      D: "Mengabaikan karena biasa terjadi"
    },
    "B",
    "Selisih stok perlu diverifikasi dan dicatat."
  ),
  q(
    "L1-006",
    1,
    "numerical",
    "easy",
    "Harga modal produk Rp50.000 dan dijual Rp65.000. Berapa selisih keuntungannya?",
    {
      A: "Rp10.000",
      B: "Rp15.000",
      C: "Rp20.000",
      D: "Rp25.000"
    },
    "B",
    "Rp65.000 - Rp50.000 = Rp15.000."
  ),
  q(
    "L1-007",
    1,
    "numerical",
    "easy",
    "Ada 8 dus, setiap dus berisi 12 pcs. Total barang adalah?",
    {
      A: "84 pcs",
      B: "90 pcs",
      C: "96 pcs",
      D: "108 pcs"
    },
    "C",
    "8 x 12 = 96 pcs."
  ),
  q(
    "L1-008",
    1,
    "numerical",
    "easy",
    "Customer membeli 3 produk seharga Rp25.000 per produk. Total harga sebelum ongkir adalah?",
    {
      A: "Rp50.000",
      B: "Rp65.000",
      C: "Rp75.000",
      D: "Rp85.000"
    },
    "C",
    "3 x Rp25.000 = Rp75.000."
  ),
  q(
    "L1-009",
    1,
    "numerical",
    "easy",
    "Stok awal 120 pcs. Terjual 35 pcs. Sisa stok adalah?",
    {
      A: "75 pcs",
      B: "80 pcs",
      C: "85 pcs",
      D: "95 pcs"
    },
    "C",
    "120 - 35 = 85 pcs."
  ),
  q(
    "L1-010",
    1,
    "numerical",
    "medium",
    "Diskon Rp10.000 dari harga Rp80.000 membuat harga akhir menjadi?",
    {
      A: "Rp60.000",
      B: "Rp70.000",
      C: "Rp75.000",
      D: "Rp90.000"
    },
    "B",
    "Rp80.000 - Rp10.000 = Rp70.000."
  ),
  q(
    "L1-011",
    1,
    "numerical",
    "medium",
    "Dalam 5 jam, tim packing menyelesaikan 150 paket. Rata-rata per jam adalah?",
    {
      A: "20 paket",
      B: "25 paket",
      C: "30 paket",
      D: "35 paket"
    },
    "C",
    "150 / 5 = 30 paket per jam."
  ),
  q(
    "L1-012",
    1,
    "numerical",
    "medium",
    "Jika 2 dari 20 paket salah label, persentase salah label adalah?",
    {
      A: "5%",
      B: "10%",
      C: "15%",
      D: "20%"
    },
    "B",
    "2 / 20 x 100% = 10%."
  ),
  q(
    "L1-013",
    1,
    "verbal",
    "easy",
    "Makna paling dekat dari kata 'validasi' dalam proses retur adalah?",
    {
      A: "Menghapus",
      B: "Memeriksa kebenaran",
      C: "Mempercepat iklan",
      D: "Mengubah warna"
    },
    "B",
    "Validasi berarti memeriksa kebenaran data atau bukti."
  ),
  q(
    "L1-014",
    1,
    "verbal",
    "easy",
    "Kalimat CS yang paling profesional adalah?",
    {
      A: "Itu bukan urusan kami.",
      B: "Mohon maaf, kami bantu cek terlebih dahulu.",
      C: "Customer salah semua.",
      D: "Tunggu saja tanpa kepastian."
    },
    "B",
    "Kalimat tersebut sopan dan memberi tindak lanjut."
  ),
  q(
    "L1-015",
    1,
    "verbal",
    "easy",
    "Antonim dari 'teliti' yang paling tepat adalah?",
    {
      A: "Cermat",
      B: "Rapi",
      C: "Ceroboh",
      D: "Akurat"
    },
    "C",
    "Lawan kata teliti adalah ceroboh."
  ),
  q(
    "L1-016",
    1,
    "verbal",
    "medium",
    "Instruksi: 'Pisahkan barang retur yang masih layak jual.' Artinya barang retur harus?",
    {
      A: "Dicampur semua",
      B: "Dipilih berdasarkan kondisi",
      C: "Langsung dibuang",
      D: "Dijual tanpa cek"
    },
    "B",
    "Kata pisahkan menunjukkan pemilahan berdasarkan kondisi."
  ),
  q(
    "L1-017",
    1,
    "verbal",
    "medium",
    "Kata yang paling sesuai untuk laporan kerja adalah?",
    {
      A: "Kayaknya stok aneh",
      B: "Stok sistem 50, stok fisik 47, selisih 3 pcs",
      C: "Pokoknya kurang",
      D: "Tidak tahu"
    },
    "B",
    "Laporan kerja harus spesifik dan berbasis data."
  ),
  q(
    "L1-018",
    1,
    "pattern",
    "easy",
    "Pola angka: 2, 4, 6, 8, ... Angka berikutnya adalah?",
    {
      A: "9",
      B: "10",
      C: "11",
      D: "12"
    },
    "B",
    "Pola bertambah 2."
  ),
  q(
    "L1-019",
    1,
    "pattern",
    "easy",
    "Pola SKU: A1, A2, A3, A4, ... Berikutnya adalah?",
    {
      A: "A5",
      B: "B1",
      C: "A0",
      D: "C4"
    },
    "A",
    "Angka bertambah satu dengan huruf tetap A."
  ),
  q(
    "L1-020",
    1,
    "pattern",
    "medium",
    "Pola: 5, 10, 20, 40, ... Berikutnya adalah?",
    {
      A: "45",
      B: "60",
      C: "80",
      D: "100"
    },
    "C",
    "Setiap angka dikali 2."
  ),
  q(
    "L1-021",
    1,
    "pattern",
    "medium",
    "Urutan status: Pesanan masuk → Diproses → Dikemas → ...",
    {
      A: "Dikirim",
      B: "Dihapus",
      C: "Diabaikan",
      D: "Ditulis ulang"
    },
    "A",
    "Setelah dikemas, paket dikirim."
  ),
  q(
    "L1-022",
    1,
    "pattern",
    "medium",
    "Pola kode: BX-01, BX-02, BX-03, ...",
    {
      A: "BX-04",
      B: "BX-00",
      C: "BY-01",
      D: "AX-04"
    },
    "A",
    "Nomor urut bertambah satu."
  ),
  q(
    "L1-023",
    1,
    "workingAccuracy",
    "easy",
    "Manakah pasangan SKU yang sama persis?",
    {
      A: "TR-1208 dan TR-1280",
      B: "MK-771A dan MK-771A",
      C: "AB-908 dan AB-980",
      D: "ZX-111 dan ZX-11I"
    },
    "B",
    "MK-771A sama persis pada kedua sisi."
  ),
  q(
    "L1-024",
    1,
    "workingAccuracy",
    "medium",
    "Invoice tertulis Rp158.500. Input mana yang benar?",
    {
      A: "Rp185.500",
      B: "Rp158.500",
      C: "Rp158.050",
      D: "Rp155.800"
    },
    "B",
    "Input harus sama dengan invoice."
  ),
  q(
    "L1-025",
    1,
    "workingAccuracy",
    "medium",
    "Alamat: Jl. Melati No. 18 Blok C. Data mana yang salah?",
    {
      A: "Jl. Melati No. 18 Blok C",
      B: "Jl. Melati No. 18 Blok C",
      C: "Jl. Melati No. 81 Blok C",
      D: "Jl. Melati No. 18 Blok C"
    },
    "C",
    "Nomor 81 berbeda dari nomor 18."
  )
];

export function getIQQuestionsByLevel(level: 1 | 2 | 3): IQQuestion[] {
  return iqQuestions.filter((question) => question.level === level);
}

export function getIQDurationSeconds(level: 1 | 2 | 3): number {
  if (level === 1) return 20 * 60;
  if (level === 2) return 30 * 60;
  return 40 * 60;
}
EOF

cat > lib/iq/iqInterpretations.ts <<'EOF'
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
EOF

cat > lib/iq/iqPositionThresholds.ts <<'EOF'
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
EOF

cat > lib/iq/iqScoring.ts <<'EOF'
import type {
  IQAnswer,
  IQCategory,
  IQDifficulty,
  IQQuestion,
  IQResult,
  IQSubtestScores
} from "@/types/iq";
import { roundScore } from "@/lib/utils/format";
import { getIQQuestionsByLevel } from "./iqQuestions";
import { getIQSummary } from "./iqInterpretations";
import { scoreIQFit } from "./iqPositionThresholds";

const weights: Record<IQDifficulty, number> = {
  easy: 1,
  medium: 1.5,
  hard: 2
};

const categories: IQCategory[] = [
  "logical",
  "numerical",
  "verbal",
  "pattern",
  "workingAccuracy"
];

export function scoreIQ(
  level: 1 | 2 | 3,
  answers: IQAnswer[],
  positionApplied: string,
  meta: {
    durationSeconds: number;
    changeCount: number;
    timedOut: boolean;
  }
): {
  result: IQResult;
  enrichedAnswers: IQAnswer[];
} {
  const questions = getIQQuestionsByLevel(level);

  const answerMap = new Map(
    answers.map((answer) => [answer.questionId, answer])
  );

  let correctCount = 0;
  let weightedScore = 0;
  let maxWeightedScore = 0;

  const subtestWeighted: Record<IQCategory, number> = {
    logical: 0,
    numerical: 0,
    verbal: 0,
    pattern: 0,
    workingAccuracy: 0
  };

  const subtestMax: Record<IQCategory, number> = {
    logical: 0,
    numerical: 0,
    verbal: 0,
    pattern: 0,
    workingAccuracy: 0
  };

  const enrichedAnswers = questions.map((question) => {
    const current = answerMap.get(question.id);
    const selectedAnswer = current?.selectedAnswer;
    const isCorrect = selectedAnswer === question.correctAnswer;
    const score = isCorrect ? weights[question.difficulty] : 0;

    if (isCorrect) correctCount += 1;

    weightedScore += score;
    maxWeightedScore += weights[question.difficulty];

    subtestWeighted[question.category] += score;
    subtestMax[question.category] += weights[question.difficulty];

    return {
      questionId: question.id,
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      difficulty: question.difficulty,
      category: question.category,
      score,
      changes: current?.changes || 0
    };
  });

  const answeredCount = enrichedAnswers.filter((answer) =>
    Boolean(answer.selectedAnswer)
  ).length;

  const blankCount = questions.length - answeredCount;
  const wrongCount = answeredCount - correctCount;

  const percentageScore = roundScore(
    (weightedScore / (maxWeightedScore || 1)) * 100
  );

  const subtests = categories.reduce((acc, category) => {
    acc[category] = roundScore(
      (subtestWeighted[category] / (subtestMax[category] || 1)) * 100
    );

    return acc;
  }, {} as IQSubtestScores);

  const fit = scoreIQFit(percentageScore, subtests, positionApplied);

  const totalDurationSeconds =
    level === 1 ? 20 * 60 : level === 2 ? 30 * 60 : 40 * 60;

  const redFlags = buildIQRedFlags({
    questions,
    answers: enrichedAnswers,
    percentageScore,
    subtests,
    durationSeconds: meta.durationSeconds,
    totalDurationSeconds,
    changeCount: meta.changeCount,
    timedOut: meta.timedOut
  });

  return {
    enrichedAnswers,
    result: {
      level,
      durationSeconds: meta.durationSeconds,
      totalQuestions: questions.length,
      answeredCount,
      blankCount,
      correctCount,
      wrongCount,
      rawScore: correctCount,
      weightedScore: roundScore(weightedScore),
      maxWeightedScore: roundScore(maxWeightedScore),
      percentageScore,
      subtests,
      fitScore: fit.score,
      fitCategory: fit.category,
      recommendation: fit.recommendation,
      redFlags,
      summary: getIQSummary(percentageScore),
      changeCount: meta.changeCount,
      timedOut: meta.timedOut
    }
  };
}

function buildIQRedFlags(input: {
  questions: IQQuestion[];
  answers: IQAnswer[];
  percentageScore: number;
  subtests: IQSubtestScores;
  durationSeconds: number;
  totalDurationSeconds: number;
  changeCount: number;
  timedOut: boolean;
}): string[] {
  const flags: string[] = [];

  if (input.questions.length === 0) {
    flags.push("Question bank belum tersedia untuk level ini.");
    return flags;
  }

  const blankRate =
    input.answers.filter((answer) => !answer.selectedAnswer).length /
    input.questions.length;

  const answerCounts = input.answers.reduce<Record<string, number>>(
    (acc, answer) => {
      if (answer.selectedAnswer) {
        acc[answer.selectedAnswer] = (acc[answer.selectedAnswer] || 0) + 1;
      }

      return acc;
    },
    {}
  );

  const mostCommon = Math.max(0, ...Object.values(answerCounts));
  const monotonousRate = mostCommon / input.questions.length;

  if (
    input.durationSeconds < input.totalDurationSeconds * 0.35 &&
    input.percentageScore >= 80
  ) {
    flags.push(
      "Kemungkinan pernah melihat soal atau menjawab terlalu cepat. Perlu konfirmasi."
    );
  }

  if (input.timedOut && blankRate > 0.2) {
    flags.push("Kecepatan kerja perlu dikonfirmasi.");
  }

  if (blankRate > 0.2) {
    flags.push("Banyak soal tidak dijawab.");
  }

  if (monotonousRate > 0.6) {
    flags.push("Pola jawaban monoton, kemungkinan menebak.");
  }

  if (Math.min(...Object.values(input.subtests)) < 50) {
    flags.push("Profil kemampuan tidak seimbang.");
  }

  if (input.changeCount > 20) {
    flags.push("Ragu-ragu tinggi, perlu konfirmasi interview.");
  }

  return flags;
}
EOF

cat > lib/combined/combinedScoring.ts <<'EOF'
import type {
  AssessmentPayload,
  AssessmentRecord,
  CombinedResult
} from "@/types/assessment";
import { scoreDisc } from "@/lib/disc/discScoring";
import { scoreIQ } from "@/lib/iq/iqScoring";
import { createCandidateId } from "@/lib/utils/id";
import { getCombinedCategory, roundScore } from "@/lib/utils/format";

interface WeightProfile {
  disc: number;
  iq: number;
}

function getWeightProfile(position: string): WeightProfile {
  const normalized = position.toLowerCase();

  if (
    normalized.includes("sales") ||
    normalized.includes("customer service") ||
    normalized.includes("cs")
  ) {
    return { disc: 0.6, iq: 0.4 };
  }

  if (
    normalized.includes("accounting") ||
    normalized.includes("procurement")
  ) {
    return { disc: 0.3, iq: 0.7 };
  }

  if (
    normalized.includes("leader") ||
    normalized.includes("supervisor") ||
    normalized.includes("head")
  ) {
    return { disc: 0.45, iq: 0.55 };
  }

  if (normalized.includes("personal assistant")) {
    return { disc: 0.35, iq: 0.65 };
  }

  if (
    normalized.includes("admin") ||
    normalized.includes("checker") ||
    normalized.includes("inventory")
  ) {
    return { disc: 0.4, iq: 0.6 };
  }

  return { disc: 0.45, iq: 0.55 };
}

export function scoreCombined(
  discFitScore: number,
  iqFitScore: number,
  position: string
): CombinedResult {
  const weights = getWeightProfile(position);

  const score = roundScore(
    discFitScore * weights.disc + iqFitScore * weights.iq
  );

  const category = getCombinedCategory(score);

  return {
    score,
    category,
    recommendation: category,
    weights
  };
}

export function buildAssessmentRecord(
  payload: AssessmentPayload
): AssessmentRecord {
  const createdAt = new Date().toISOString();
  const candidateId = createCandidateId();

  const disc = scoreDisc(
    payload.discAnswers,
    payload.candidate.positionApplied,
    {
      durationSeconds: payload.discMeta.durationSeconds,
      changeCount: payload.discMeta.changeCount
    }
  );

  const iqScored = scoreIQ(
    payload.candidate.assessmentLevel,
    payload.iqAnswers,
    payload.candidate.positionApplied,
    {
      durationSeconds: payload.iqMeta.durationSeconds,
      changeCount: payload.iqMeta.changeCount,
      timedOut: payload.iqMeta.timedOut
    }
  );

  const combined = scoreCombined(
    disc.fitScore,
    iqScored.result.fitScore,
    payload.candidate.positionApplied
  );

  const redFlags = [...disc.redFlags, ...iqScored.result.redFlags];

  const summary = [
    `${payload.candidate.fullName} melamar posisi ${payload.candidate.positionApplied}.`,
    `DISC ${disc.type} dengan fit ${disc.fitScore}.`,
    `Cognitive Ability Screening ${iqScored.result.percentageScore}% dengan fit ${iqScored.result.fitScore}.`,
    `Rekomendasi akhir: ${combined.recommendation}.`,
    "Catatan: hasil assessment adalah alat bantu HR dan bukan satu-satunya dasar keputusan hiring."
  ].join(" ");

  return {
    candidate_id: candidateId,
    created_at: createdAt,
    candidate: payload.candidate,
    disc,
    iq: iqScored.result,
    combined,
    discAnswers: payload.discAnswers,
    iqAnswers: iqScored.enrichedAnswers,
    redFlags,
    summary
  };
}
EOF

cat > components/iq/IQTimer.tsx <<'EOF'
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
EOF

cat > components/iq/IQQuestionCard.tsx <<'EOF'
"use client";

import type { IQAnswer, IQQuestion, IQOptionKey } from "@/types/iq";
import { categoryLabel } from "@/lib/utils/format";

export default function IQQuestionCard({
  question,
  answer,
  onAnswer
}: {
  question: IQQuestion;
  answer?: IQAnswer;
  onAnswer: (value: IQAnswer) => void;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-premium">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold uppercase text-cyan-700">
          {categoryLabel(question.category)}
        </span>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
          {question.difficulty}
        </span>
      </div>

      <h2 className="text-xl font-bold leading-8 text-slate-950">
        {question.question}
      </h2>

      <div className="mt-6 grid gap-3">
        {Object.entries(question.options).map(([key, text]) => (
          <button
            type="button"
            key={key}
            onClick={() =>
              onAnswer({
                questionId: question.id,
                selectedAnswer: key as IQOptionKey,
                changes: (answer?.changes || 0) + 1
              })
            }
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              answer?.selectedAnswer === key
                ? "border-cyan-500 bg-cyan-50 text-cyan-900"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <span className="font-black">{key}.</span> {text}
          </button>
        ))}
      </div>
    </div>
  );
}
EOF

cat > components/iq/IQResultChart.tsx <<'EOF'
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
EOF

cat > components/iq/IQSubtestBreakdown.tsx <<'EOF'
import type { IQSubtestScores } from "@/types/iq";
import { categoryLabel } from "@/lib/utils/format";

export default function IQSubtestBreakdown({
  subtests
}: {
  subtests: IQSubtestScores;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {Object.entries(subtests).map(([key, value]) => (
        <div key={key} className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">
            {categoryLabel(key)}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-950">
            {value}%
          </p>
        </div>
      ))}
    </div>
  );
}
EOF

cat > app/api/submit/route.ts <<'EOF'
import { NextResponse } from "next/server";
import type { AssessmentPayload } from "@/types/assessment";
import { buildAssessmentRecord } from "@/lib/combined/combinedScoring";
import { validateAssessmentPayload } from "@/lib/utils/validation";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AssessmentPayload;
    const errors = validateAssessmentPayload(payload);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          errors,
          message: errors.join(" ")
        },
        { status: 400 }
      );
    }

    const record = buildAssessmentRecord(payload);

    return NextResponse.json({
      success: true,
      demo: true,
      message:
        "Demo Mode aktif. Data dikembalikan ke browser untuk disimpan di localStorage.",
      record
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat submit assessment."
      },
      { status: 500 }
    );
  }
}
EOF

cat > app/test/iq/page.tsx <<'EOF'
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AssessmentProgress from "@/components/candidate/AssessmentProgress";
import IQQuestionCard from "@/components/iq/IQQuestionCard";
import IQTimer from "@/components/iq/IQTimer";
import { getIQDurationSeconds, getIQQuestionsByLevel } from "@/lib/iq/iqQuestions";
import {
  clearAssessmentDraft,
  getCandidateDraft,
  getJson,
  saveJson,
  storageKeys,
  storeDemoRecord
} from "@/lib/storage/localStorageDemo";
import type { CandidateInfo } from "@/types/candidate";
import type { IQAnswer } from "@/types/iq";
import type { AssessmentPayload } from "@/types/assessment";

export default function IQPage() {
  const router = useRouter();

  const [candidate, setCandidate] = useState<CandidateInfo | null>(null);
  const [started, setStarted] = useState(false);
  const [startedAt, setStartedAt] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(20 * 60);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<IQAnswer[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const draft = getCandidateDraft();

    if (!draft) {
      router.replace("/test/start");
      return;
    }

    setCandidate(draft);
    setSecondsLeft(getIQDurationSeconds(draft.assessmentLevel));
    setAnswers(getJson<IQAnswer[]>(storageKeys.IQ_KEY, []));
  }, [router]);

  const level = candidate?.assessmentLevel || 1;

  const questions = useMemo(() => {
    return getIQQuestionsByLevel(level);
  }, [level]);

  const totalDuration = getIQDurationSeconds(level);

  useEffect(() => {
    saveJson(storageKeys.IQ_KEY, answers);
  }, [answers]);

  const submitAssessment = useCallback(
    async (timedOut: boolean) => {
      if (!candidate || submitting) return;

      if (questions.length === 0) {
        alert(
          "Question bank untuk level ini belum dipasang. Gunakan Level 1 dulu atau lanjutkan Part 4B."
        );
        return;
      }

      const blank =
        questions.length -
        answers.filter((answer) => answer.selectedAnswer).length;

      if (!timedOut && blank > 0) {
        const ok = confirm(`Masih ada ${blank} soal kosong. Tetap submit?`);
        if (!ok) return;
      }

      setSubmitting(true);

      const finishedAt = new Date().toISOString();

      const durationSeconds = Math.round(
        (new Date(finishedAt).getTime() -
          new Date(startedAt || finishedAt).getTime()) /
          1000
      );

      const iqMeta = {
        startedAt,
        finishedAt,
        durationSeconds,
        changeCount: answers.reduce(
          (sum, answer) => sum + (answer.changes || 0),
          0
        ),
        timedOut
      };

      saveJson(storageKeys.IQ_META_KEY, iqMeta);

      const payload: AssessmentPayload = {
        candidate,
        discAnswers: getJson(storageKeys.DISC_KEY, []),
        discMeta: getJson(storageKeys.DISC_META_KEY, {
          startedAt: new Date().toISOString(),
          finishedAt: new Date().toISOString(),
          durationSeconds: 0,
          changeCount: 0
        }),
        iqAnswers: questions.map(
          (question) =>
            answers.find((answer) => answer.questionId === question.id) || {
              questionId: question.id
            }
        ),
        iqMeta
      };

      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || data.errors?.join(", ") || "Submit gagal."
          );
        }

        if (data.record) {
          storeDemoRecord(data.record);
        }

        clearAssessmentDraft();
        router.push("/test/completed");
      } catch (error) {
        alert(error instanceof Error ? error.message : "Submit gagal.");
        setSubmitting(false);
      }
    },
    [answers, candidate, questions, router, startedAt, submitting]
  );

  useEffect(() => {
    if (!started || submitting) return;

    if (secondsLeft <= 0) {
      submitAssessment(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft, started, submitAssessment, submitting]);

  function start() {
    const now = new Date().toISOString();
    setStartedAt(now);
    setStarted(true);
  }

  function setAnswer(answer: IQAnswer) {
    setAnswers((current) => {
      const next = current.filter(
        (item) => item.questionId !== answer.questionId
      );

      return [...next, answer].sort((a, b) =>
        a.questionId.localeCompare(b.questionId)
      );
    });
  }

  if (!candidate) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-3xl bg-white p-8 shadow-premium">
            Memuat data kandidat...
          </div>
        </section>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-3xl bg-white p-8 shadow-premium">
            <p className="text-sm font-bold text-cyan-700">
              Cognitive Ability Screening
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Question bank Level {level} belum dipasang
            </h1>
            <p className="mt-4 leading-7 text-slate-600">
              Part 4A memasang Level 1 lengkap. Level 2 dan Level 3 akan
              dipasang di Part 4B. Untuk test sekarang, kembali ke form kandidat
              dan pilih Level 1.
            </p>
            <button
              onClick={() => router.push("/test/start")}
              className="mt-6 rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950"
            >
              Kembali ke Form Kandidat
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />

        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-3xl bg-white p-8 shadow-premium">
            <p className="text-sm font-bold text-cyan-700">
              Instruksi Cognitive Ability Screening
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-950">
              Bagian 2 — Level {level}
            </h1>

            <div className="mt-5 rounded-2xl bg-cyan-50 p-4 text-sm text-cyan-900">
              Kandidat: <strong>{candidate.fullName}</strong> • Posisi:{" "}
              <strong>{candidate.positionApplied}</strong>
            </div>

            <p className="mt-5 leading-7 text-slate-600">
              Anda akan mengerjakan {questions.length} soal dalam{" "}
              {Math.round(totalDuration / 60)} menit. Tes ini bukan IQ klinis
              resmi, melainkan screening kemampuan berpikir kerja untuk
              kebutuhan HR internal.
            </p>

            <ul className="mt-6 list-inside list-disc space-y-2 text-slate-700">
              <li>Boleh melewati soal dan kembali lagi selama waktu masih ada.</li>
              <li>Jawaban kosong akan dihitung 0.</li>
              <li>Saat waktu habis, sistem akan submit otomatis.</li>
              <li>Kerjakan mandiri tanpa bantuan orang lain.</li>
            </ul>

            <button
              onClick={start}
              className="mt-8 w-full rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Mulai IQ Screening
            </button>
          </div>
        </section>
      </main>
    );
  }

  const current = questions[index];

  const currentAnswer = answers.find(
    (answer) => answer.questionId === current.id
  );

  const answered = answers.filter((answer) => answer.selectedAnswer).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-4xl space-y-5 px-4 py-8">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <AssessmentProgress
            current={answered}
            total={questions.length}
            label="Progress Cognitive Ability Screening"
          />

          <IQTimer secondsLeft={secondsLeft} />
        </div>

        <div className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
          Soal {index + 1} dari {questions.length}
        </div>

        <IQQuestionCard
          question={current}
          answer={currentAnswer}
          onAnswer={setAnswer}
        />

        <div className="flex justify-between gap-3">
          <button
            disabled={index === 0}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-700 shadow-sm disabled:opacity-40"
          >
            Previous
          </button>

          <div className="flex gap-3">
            {index < questions.length - 1 && (
              <button
                onClick={() =>
                  setIndex((value) =>
                    Math.min(questions.length - 1, value + 1)
                  )
                }
                className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
              >
                Next
              </button>
            )}

            <button
              disabled={submitting}
              onClick={() => submitAssessment(false)}
              className="rounded-2xl bg-navy-950 px-5 py-3 font-bold text-white disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Final"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Cognitive Ability Screening ini bukan tes IQ klinis resmi. Hasilnya
          perlu dikombinasikan dengan interview, pengalaman, referensi, dan
          simulasi kerja.
        </div>
      </section>
    </main>
  );
}
EOF

cat >> README.md <<'EOF'

---

## Part 4A — IQ Core + Level 1

Fitur yang sudah ditambahkan:
- Cognitive Ability Screening UI.
- Countdown timer.
- Previous / Next.
- Jawaban auto-save ke localStorage.
- Warning jika masih ada jawaban kosong saat submit.
- Auto-submit saat waktu habis.
- Level 1 question bank lengkap 25 soal.
- IQ scoring:
  - raw score
  - weighted score
  - max weighted score
  - percentage score
  - subtest score
  - fit score posisi
  - red flags
- Combined scoring:
  - DISC fit x bobot DISC
  - IQ fit x bobot IQ
- `/api/submit` demo-ready.
- Hasil assessment disimpan ke localStorage browser.

Catatan:
- Part 4A baru memasang Level 1 lengkap.
- Level 2 dan Level 3 akan dipasang di Part 4B.

Test cepat:
1. Buka `/test/start`.
2. Pilih Assessment Level 1.
3. Isi data kandidat.
4. Kerjakan DISC.
5. Lanjut ke IQ.
6. Klik Mulai IQ Screening.
7. Jawab beberapa atau semua soal.
8. Submit final.
9. Harus masuk ke `/test/completed`.
EOF

echo ""
echo "✅ Part 4A selesai."
echo ""
echo "Jalankan:"
echo "npm run dev"
echo ""
echo "Test:"
echo "Pilih Assessment Level 1 dulu untuk test IQ."