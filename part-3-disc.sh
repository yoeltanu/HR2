#!/usr/bin/env bash
set -e

echo "Installing Part 3 — DISC Test..."

mkdir -p lib/disc components/disc

cat > lib/disc/discQuestions.ts <<'EOF'
import type { DiscQuestion } from "@/types/disc";

const rows = [
  ["Saya suka mengambil keputusan dengan cepat.", "Saya mudah mencairkan suasana dengan orang baru.", "Saya lebih nyaman bekerja dalam suasana stabil.", "Saya sangat memperhatikan detail dan aturan."],
  ["Saya berani mengambil alih saat situasi tidak jelas.", "Saya senang meyakinkan orang lain dengan komunikasi.", "Saya berusaha menjaga keharmonisan tim.", "Saya mengecek ulang pekerjaan agar tidak ada kesalahan."],
  ["Saya terdorong oleh target dan hasil.", "Saya suka bekerja dengan banyak interaksi.", "Saya sabar menghadapi pekerjaan berulang.", "Saya suka bekerja dengan data dan bukti."],
  ["Saya tidak takut menyampaikan pendapat yang berbeda.", "Saya mudah membangun relasi dengan orang lain.", "Saya cenderung menjadi pendengar yang baik.", "Saya lebih percaya keputusan yang berdasarkan analisa."],
  ["Saya suka tantangan dan kompetisi.", "Saya sering memberi semangat kepada orang lain.", "Saya lebih suka perubahan yang bertahap.", "Saya nyaman mengikuti prosedur yang jelas."],
  ["Saya cepat bertindak saat melihat masalah.", "Saya senang menyampaikan ide secara verbal.", "Saya menjaga agar pekerjaan tim berjalan tenang.", "Saya menilai risiko sebelum mengambil tindakan."],
  ["Saya suka memimpin saat ada target penting.", "Saya menikmati presentasi atau menjelaskan sesuatu.", "Saya konsisten menyelesaikan tugas sampai selesai.", "Saya suka membuat sistem kerja yang rapi."],
  ["Saya tidak suka terlalu lama menunggu keputusan.", "Saya nyaman bekerja dengan banyak orang.", "Saya menghindari konflik jika masih bisa dibicarakan baik-baik.", "Saya merasa terganggu jika pekerjaan dilakukan asal-asalan."],
  ["Saya fokus pada hasil akhir.", "Saya mudah menunjukkan antusiasme.", "Saya berusaha membuat orang lain merasa didukung.", "Saya fokus pada kualitas dan ketepatan."],
  ["Saya suka menyelesaikan masalah secara langsung.", "Saya suka memberikan pengaruh positif ke lingkungan.", "Saya dapat diandalkan untuk pekerjaan rutin.", "Saya berhati-hati sebelum menyimpulkan sesuatu."],
  ["Saya berani menekan tim agar target tercapai.", "Saya mudah membuat orang lain tertarik dengan ide saya.", "Saya lebih suka bekerja dalam hubungan tim yang harmonis.", "Saya suka standar kerja yang jelas dan terukur."],
  ["Saya merasa nyaman mengambil risiko terukur.", "Saya senang menjadi pusat komunikasi dalam tim.", "Saya tidak mudah panik saat situasi berubah.", "Saya lebih suka instruksi yang spesifik."],
  ["Saya sering mendorong pekerjaan agar lebih cepat selesai.", "Saya mudah memuji dan mengapresiasi orang lain.", "Saya lebih suka mendukung daripada mendominasi.", "Saya terbiasa membuat catatan atau dokumentasi."],
  ["Saya suka memecahkan masalah sulit.", "Saya nyaman melakukan negosiasi atau persuasi.", "Saya setia pada komitmen dan tanggung jawab.", "Saya memeriksa fakta sebelum bertindak."],
  ["Saya cenderung bicara langsung ke inti masalah.", "Saya suka suasana kerja yang aktif dan hidup.", "Saya sabar menghadapi orang yang berbeda karakter.", "Saya suka pekerjaan yang membutuhkan ketelitian tinggi."],
  ["Saya termotivasi oleh pencapaian besar.", "Saya senang membangun networking.", "Saya menghargai kestabilan dan loyalitas.", "Saya lebih nyaman jika ada SOP yang jelas."],
  ["Saya cepat mengambil keputusan meski data belum sempurna.", "Saya bisa membuat orang lain merasa nyaman.", "Saya menjaga ritme kerja agar tidak kacau.", "Saya tidak suka melewatkan detail kecil."],
  ["Saya suka diberi wewenang untuk menentukan langkah.", "Saya suka memberi ide kreatif secara spontan.", "Saya lebih suka bekerja dengan alur yang tenang.", "Saya suka menganalisis sebab-akibat."],
  ["Saya mudah mengambil posisi sebagai pengarah.", "Saya menikmati pekerjaan yang banyak komunikasi.", "Saya cenderung menghindari keputusan yang terlalu mendadak.", "Saya membutuhkan data sebelum merasa yakin."],
  ["Saya ingin pekerjaan bergerak cepat.", "Saya suka menciptakan suasana positif.", "Saya menjaga hubungan kerja jangka panjang.", "Saya menjaga agar pekerjaan sesuai standar."],
  ["Saya suka mengatasi hambatan secara agresif.", "Saya percaya komunikasi bisa menyelesaikan banyak masalah.", "Saya kuat dalam menjaga konsistensi kerja.", "Saya kuat dalam mengidentifikasi kesalahan."],
  ["Saya suka target yang menantang.", "Saya mudah membangun kedekatan dengan orang lain.", "Saya tidak suka lingkungan kerja yang terlalu banyak konflik.", "Saya suka bekerja dengan checklist."],
  ["Saya nyaman memberi instruksi.", "Saya nyaman berbicara di depan kelompok.", "Saya nyaman membantu orang lain menyelesaikan tugas.", "Saya nyaman mengaudit atau mengecek pekerjaan."],
  ["Saya lebih suka bergerak cepat daripada terlalu banyak diskusi.", "Saya lebih suka berdiskusi dan bertukar ide.", "Saya lebih suka menjaga ritme kerja yang stabil.", "Saya lebih suka memastikan semuanya benar sebelum jalan."]
];

export const discQuestions: DiscQuestion[] = rows.map((row, index) => ({
  id: `DISC-${String(index + 1).padStart(2, "0")}`,
  text: `Soal ${index + 1}`,
  options: [
    { id: "A", text: row[0], code: "D" },
    { id: "B", text: row[1], code: "I" },
    { id: "C", text: row[2], code: "S" },
    { id: "D", text: row[3], code: "C" }
  ]
}));
EOF

cat > lib/disc/discInterpretations.ts <<'EOF'
import type { DiscInterpretation } from "@/types/disc";

export const baseDiscInterpretations: Record<string, DiscInterpretation> = {
  D: {
    title: "Dominance",
    summary: "Tegas, cepat mengambil keputusan, berorientasi target, dan menyukai tantangan.",
    strengths: [
      "Tegas",
      "Cepat mengambil keputusan",
      "Target oriented",
      "Berani menghadapi tantangan"
    ],
    risks: [
      "Kurang sabar",
      "Bisa terlalu keras",
      "Dapat mengabaikan detail"
    ],
    suitableRoles: [
      "Sales leader",
      "Supervisor operasional",
      "Project PIC",
      "Role target tinggi"
    ],
    managementTips: [
      "Berikan target jelas",
      "Sediakan ruang mengambil keputusan",
      "Imbangi dengan kontrol kualitas"
    ]
  },
  I: {
    title: "Influence",
    summary: "Komunikatif, ekspresif, mudah membangun relasi, dan persuasif.",
    strengths: [
      "Komunikatif",
      "Ekspresif",
      "Mudah membangun relasi",
      "Persuasif"
    ],
    risks: [
      "Kurang detail",
      "Mudah terdistraksi",
      "Terlalu optimis"
    ],
    suitableRoles: [
      "Sales",
      "Customer service",
      "Live host",
      "Relationship role"
    ],
    managementTips: [
      "Berikan ruang komunikasi",
      "Gunakan checklist",
      "Tetapkan target harian yang terukur"
    ]
  },
  S: {
    title: "Steadiness",
    summary: "Stabil, sabar, konsisten, suportif, dan loyal.",
    strengths: [
      "Stabil",
      "Sabar",
      "Konsisten",
      "Suportif",
      "Loyal"
    ],
    risks: [
      "Lambat mengambil keputusan",
      "Menghindari konflik",
      "Kurang suka perubahan mendadak"
    ],
    suitableRoles: [
      "Admin operasional",
      "Admin retur",
      "Customer service",
      "Warehouse support",
      "Packing"
    ],
    managementTips: [
      "Berikan alur kerja stabil",
      "Komunikasikan perubahan lebih awal",
      "Dorong keberanian memberi masukan"
    ]
  },
  C: {
    title: "Conscientiousness",
    summary: "Teliti, sistematis, analitis, patuh SOP, dan fokus pada kualitas.",
    strengths: [
      "Teliti",
      "Sistematis",
      "Analitis",
      "Patuh SOP",
      "Fokus kualitas"
    ],
    risks: [
      "Terlalu lama menganalisis",
      "Perfeksionis",
      "Kurang fleksibel"
    ],
    suitableRoles: [
      "Accounting",
      "Admin checker",
      "Quality control",
      "Procurement analysis",
      "Inventory control"
    ],
    managementTips: [
      "Berikan SOP jelas",
      "Tentukan batas waktu analisis",
      "Beri konteks prioritas bisnis"
    ]
  }
};

export const comboDiscInterpretations: Record<string, string> = {
  DI: "Tegas dan persuasif. Cocok untuk peran target tinggi yang membutuhkan pengaruh komunikasi.",
  DC: "Tegas, analitis, dan kuat dalam standar. Cocok untuk keputusan operasional berbasis data.",
  DS: "Tegas namun stabil. Cocok untuk koordinasi operasional dan leader lapangan.",
  ID: "Komunikatif dan berani mendorong hasil. Cocok untuk sales, host, dan relationship target.",
  IS: "Hangat, suportif, dan mudah menjaga relasi. Cocok untuk CS dan HR-facing role.",
  IC: "Komunikatif namun tetap memperhatikan kualitas. Cocok untuk e-commerce, admin komunikasi, dan reporting sederhana.",
  SD: "Stabil dengan dorongan mengarahkan. Cocok untuk leader support dan koordinator rutin.",
  SI: "Stabil, ramah, dan suportif. Cocok untuk CS, admin support, dan role pelayanan.",
  SC: "Stabil, teliti, dan konsisten. Cocok untuk admin retur, packing, inventory, dan checker.",
  CD: "Analitis dan tegas. Cocok untuk procurement, accounting, QC, dan role kontrol.",
  CI: "Teliti namun tetap komunikatif. Cocok untuk admin marketplace, report, dan koordinasi data.",
  CS: "Teliti, stabil, dan patuh prosedur. Cocok untuk accounting, admin checker, QC, dan inventory."
};

export function getDiscInterpretation(type: string): DiscInterpretation {
  const primary = type[0];
  const secondary = type[1];

  const base = baseDiscInterpretations[primary] || baseDiscInterpretations.C;

  if (!secondary) return base;

  const secondaryBase =
    baseDiscInterpretations[secondary] || baseDiscInterpretations.C;

  return {
    title: `${type} — ${base.title} + ${secondaryBase.title}`,
    summary:
      comboDiscInterpretations[type] ||
      `${base.summary} Dipengaruhi karakter ${secondaryBase.title}.`,
    strengths: Array.from(
      new Set([...base.strengths, ...secondaryBase.strengths])
    ).slice(0, 7),
    risks: Array.from(new Set([...base.risks, ...secondaryBase.risks])).slice(
      0,
      6
    ),
    suitableRoles: Array.from(
      new Set([...base.suitableRoles, ...secondaryBase.suitableRoles])
    ).slice(0, 7),
    managementTips: Array.from(
      new Set([...base.managementTips, ...secondaryBase.managementTips])
    ).slice(0, 6)
  };
}
EOF

cat > lib/disc/discPositionProfiles.ts <<'EOF'
import { getScoreCategory } from "@/lib/utils/format";

export interface DiscPositionProfile {
  position: string;
  idealTypes: string[];
  description: string;
}

export const discPositionProfiles: DiscPositionProfile[] = [
  {
    position: "Accounting",
    idealTypes: ["CS", "CD", "SC", "C", "C/S", "C/D"],
    description: "Butuh ketelitian, kepatuhan SOP, angka, dan stabilitas."
  },
  {
    position: "Admin Retur",
    idealTypes: ["SC", "CS", "S", "S/C"],
    description: "Butuh sabar, rapi, teliti, dan konsisten."
  },
  {
    position: "Admin Inbound",
    idealTypes: ["SC", "DS", "S", "S/C", "D/S"],
    description: "Butuh konsistensi, koordinasi, dan kecepatan operasional."
  },
  {
    position: "Customer Service",
    idealTypes: ["IS", "SI", "I/S", "S/I"],
    description: "Butuh komunikasi, empati, dan kestabilan menghadapi customer."
  },
  {
    position: "E-commerce Specialist",
    idealTypes: ["DI", "DC", "D/I", "D/C"],
    description: "Butuh target, analisa, dan koordinasi lintas marketplace."
  },
  {
    position: "Head of Sales",
    idealTypes: ["DI", "DC", "D/I", "D/C"],
    description: "Butuh target tinggi, komunikasi, dan pengambilan keputusan."
  },
  {
    position: "Procurement",
    idealTypes: ["CD", "DC", "C/D", "D/C"],
    description: "Butuh analisa, negosiasi, dan kontrol angka."
  },
  {
    position: "Warehouse Leader",
    idealTypes: ["DS", "SD", "D/S", "S/D"],
    description: "Butuh koordinasi lapangan, stabilitas, dan ketegasan."
  },
  {
    position: "Packing Staff",
    idealTypes: ["SC", "CS", "S/C", "C/S"],
    description: "Butuh konsistensi, ketelitian, dan kepatuhan prosedur."
  },
  {
    position: "HRGA",
    idealTypes: ["SC", "IS", "S/C", "I/S"],
    description: "Butuh stabilitas, komunikasi, dan administrasi rapi."
  },
  {
    position: "Personal Assistant",
    idealTypes: ["CD", "SC", "C/D", "S/C"],
    description: "Butuh ketelitian, prioritas, follow-up, dan kepercayaan."
  }
];

export function findDiscPositionProfile(position: string): DiscPositionProfile {
  const normalized = position.toLowerCase();

  const exact = discPositionProfiles.find((profile) =>
    normalized.includes(profile.position.toLowerCase())
  );

  if (exact) return exact;

  if (normalized.includes("sales")) {
    return discPositionProfiles.find((item) => item.position === "Head of Sales")!;
  }

  if (normalized.includes("warehouse") || normalized.includes("gudang")) {
    return discPositionProfiles.find((item) => item.position === "Warehouse Leader")!;
  }

  if (normalized.includes("packing")) {
    return discPositionProfiles.find((item) => item.position === "Packing Staff")!;
  }

  if (normalized.includes("cs") || normalized.includes("customer")) {
    return discPositionProfiles.find((item) => item.position === "Customer Service")!;
  }

  if (normalized.includes("marketplace") || normalized.includes("ecommerce")) {
    return discPositionProfiles.find((item) => item.position === "E-commerce Specialist")!;
  }

  return discPositionProfiles[0];
}

export function scoreDiscFit(
  type: string,
  position: string
): {
  score: number;
  category: string;
  recommendation: string;
} {
  const profile = findDiscPositionProfile(position);
  const primary = type[0];
  const secondary = type[1] || "";

  let score = 55;

  if (profile.idealTypes.includes(type)) {
    score = 95;
  } else if (
    profile.idealTypes.some(
      (ideal) => ideal[0] === primary && secondary && ideal.includes(secondary)
    )
  ) {
    score = 88;
  } else if (profile.idealTypes.some((ideal) => ideal[0] === primary)) {
    score = 82;
  } else if (profile.idealTypes.some((ideal) => ideal.includes(primary))) {
    score = 74;
  } else if (
    secondary &&
    profile.idealTypes.some((ideal) => ideal.includes(secondary))
  ) {
    score = 68;
  }

  const category = getScoreCategory(score);

  return {
    score,
    category,
    recommendation: `${category} untuk ${profile.position}. ${profile.description}`
  };
}
EOF

cat > lib/disc/discScoring.ts <<'EOF'
import type {
  DiscAnswer,
  DiscDimension,
  DiscResult,
  DiscScores
} from "@/types/disc";
import { roundScore } from "@/lib/utils/format";
import { discQuestions } from "./discQuestions";
import { getDiscInterpretation } from "./discInterpretations";
import { scoreDiscFit } from "./discPositionProfiles";

const dimensions: DiscDimension[] = ["D", "I", "S", "C"];

export function scoreDisc(
  answers: DiscAnswer[],
  positionApplied: string,
  meta: {
    durationSeconds: number;
    changeCount: number;
  }
): DiscResult {
  const raw: DiscScores = {
    D: 0,
    I: 0,
    S: 0,
    C: 0
  };

  answers.forEach((answer) => {
    const question = discQuestions.find(
      (item) => item.id === answer.questionId
    );

    if (!question) return;

    const most = question.options.find(
      (option) => option.id === answer.mostOptionId
    );

    const least = question.options.find(
      (option) => option.id === answer.leastOptionId
    );

    if (most) raw[most.code] += 2;
    if (least) raw[least.code] -= 1;

    answer.mostCode = most?.code;
    answer.leastCode = least?.code;
  });

  const minScore = Math.min(...dimensions.map((key) => raw[key]));
  const adjustment = Math.abs(minScore) + 1;

  const adjusted: DiscScores = {
    D: raw.D + adjustment,
    I: raw.I + adjustment,
    S: raw.S + adjustment,
    C: raw.C + adjustment
  };

  const totalAdjusted =
    dimensions.reduce((sum, key) => sum + adjusted[key], 0) || 1;

  const percentages: DiscScores = {
    D: roundScore((adjusted.D / totalAdjusted) * 100),
    I: roundScore((adjusted.I / totalAdjusted) * 100),
    S: roundScore((adjusted.S / totalAdjusted) * 100),
    C: roundScore((adjusted.C / totalAdjusted) * 100)
  };

  const ranked = dimensions
    .map((key) => ({
      key,
      value: percentages[key]
    }))
    .sort((a, b) => b.value - a.value);

  const primary = ranked[0].key;
  const secondary = ranked[1].key;

  const type =
    ranked[0].value - ranked[1].value <= 10
      ? `${primary}${secondary}`
      : primary;

  const fit = scoreDiscFit(type, positionApplied);

  const spread = ranked[0].value - ranked[3].value;
  const redFlags: string[] = [];

  if (meta.durationSeconds > 0 && meta.durationSeconds < 180) {
    redFlags.push("Waktu pengerjaan DISC terlalu cepat.");
  }

  if (spread <= 8) {
    redFlags.push("Skor DISC terlalu rata, perlu konfirmasi saat interview.");
  }

  if (spread >= 55) {
    redFlags.push("Skor DISC sangat ekstrem, validasi konteks kerja kandidat.");
  }

  if (meta.changeCount >= 15) {
    redFlags.push("Banyak perubahan jawaban pada DISC.");
  }

  return {
    raw,
    adjusted,
    percentages,
    type,
    primary,
    secondary: type.length > 1 ? secondary : undefined,
    fitScore: fit.score,
    fitCategory: fit.category,
    recommendation: fit.recommendation,
    redFlags,
    interpretation: getDiscInterpretation(type),
    durationSeconds: meta.durationSeconds,
    changeCount: meta.changeCount
  };
}
EOF

cat > components/disc/DiscBadge.tsx <<'EOF'
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
EOF

cat > components/disc/DiscQuestionCard.tsx <<'EOF'
"use client";

import type { DiscAnswer, DiscQuestion } from "@/types/disc";

export default function DiscQuestionCard({
  question,
  answer,
  onChange
}: {
  question: DiscQuestion;
  answer?: DiscAnswer;
  onChange: (answer: DiscAnswer) => void;
}) {
  function update(kind: "mostOptionId" | "leastOptionId", optionId: string) {
    const next: DiscAnswer = {
      questionId: question.id,
      mostOptionId: answer?.mostOptionId || "",
      leastOptionId: answer?.leastOptionId || "",
      changes: (answer?.changes || 0) + 1,
      [kind]: optionId
    };

    onChange(next);
  }

  const sameSelected =
    Boolean(answer?.mostOptionId) &&
    answer?.mostOptionId === answer?.leastOptionId;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-premium">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cyan-700">
            {question.text}
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-950">
            Pilih yang paling dan paling tidak menggambarkan Anda
          </h2>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          Forced Choice
        </span>
      </div>

      <div className="space-y-4">
        {question.options.map((option) => (
          <div
            key={option.id}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <p className="font-medium leading-7 text-slate-900">
              <span className="font-black">{option.id}.</span> {option.text}
            </p>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <button
                type="button"
                onClick={() => update("mostOptionId", option.id)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  answer?.mostOptionId === option.id
                    ? "bg-cyan-500 text-navy-950"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Paling menggambarkan saya
              </button>

              <button
                type="button"
                onClick={() => update("leastOptionId", option.id)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  answer?.leastOptionId === option.id
                    ? "bg-red-500 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Paling tidak menggambarkan saya
              </button>
            </div>
          </div>
        ))}
      </div>

      {sameSelected && (
        <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          Jawaban “paling” dan “paling tidak” tidak boleh sama.
        </p>
      )}
    </div>
  );
}
EOF

cat > components/disc/DiscResultChart.tsx <<'EOF'
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
import type { DiscScores } from "@/types/disc";

export default function DiscResultChart({
  percentages
}: {
  percentages: DiscScores;
}) {
  const data = Object.entries(percentages).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="value" fill="#19d3ff" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
EOF

cat > app/test/disc/page.tsx <<'EOF'
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AssessmentProgress from "@/components/candidate/AssessmentProgress";
import DiscQuestionCard from "@/components/disc/DiscQuestionCard";
import { discQuestions } from "@/lib/disc/discQuestions";
import {
  getCandidateDraft,
  getJson,
  saveJson,
  storageKeys
} from "@/lib/storage/localStorageDemo";
import type { DiscAnswer } from "@/types/disc";

export default function DiscPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<DiscAnswer[]>([]);
  const [startedAt] = useState(new Date().toISOString());
  const [error, setError] = useState("");

  useEffect(() => {
    const candidate = getCandidateDraft();

    if (!candidate) {
      router.replace("/test/start");
      return;
    }

    const saved = getJson<DiscAnswer[]>(storageKeys.DISC_KEY, []);
    setAnswers(saved);
  }, [router]);

  useEffect(() => {
    saveJson(storageKeys.DISC_KEY, answers);
  }, [answers]);

  const current = discQuestions[index];

  const currentAnswer = answers.find(
    (answer) => answer.questionId === current.id
  );

  const completed = useMemo(
    () =>
      answers.filter(
        (answer) =>
          answer.mostOptionId &&
          answer.leastOptionId &&
          answer.mostOptionId !== answer.leastOptionId
      ).length,
    [answers]
  );

  function setAnswer(answer: DiscAnswer) {
    setError("");

    setAnswers((currentAnswers) => {
      const next = currentAnswers.filter(
        (item) => item.questionId !== answer.questionId
      );

      return [...next, answer].sort((a, b) =>
        a.questionId.localeCompare(b.questionId)
      );
    });
  }

  function goNext() {
    const answer = answers.find((item) => item.questionId === current.id);

    if (
      !answer?.mostOptionId ||
      !answer?.leastOptionId ||
      answer.mostOptionId === answer.leastOptionId
    ) {
      setError("Lengkapi jawaban soal ini terlebih dahulu.");
      return;
    }

    setIndex((value) => Math.min(discQuestions.length - 1, value + 1));
  }

  function finishDisc() {
    const invalid = discQuestions.some((question) => {
      const answer = answers.find((item) => item.questionId === question.id);

      return (
        !answer?.mostOptionId ||
        !answer?.leastOptionId ||
        answer.mostOptionId === answer.leastOptionId
      );
    });

    if (invalid) {
      setError(
        "Mohon lengkapi semua jawaban DISC dan pastikan pilihan tidak sama."
      );
      return;
    }

    const finishedAt = new Date().toISOString();

    saveJson(storageKeys.DISC_META_KEY, {
      startedAt,
      finishedAt,
      durationSeconds: Math.round(
        (new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000
      ),
      changeCount: answers.reduce(
        (sum, answer) => sum + (answer.changes || 0),
        0
      )
    });

    router.push("/test/iq");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-4xl space-y-5 px-4 py-8">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <AssessmentProgress
            current={completed}
            total={discQuestions.length}
            label="Progress DISC"
          />

          <div className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-bold text-slate-700 shadow-sm">
            {index + 1} / {discQuestions.length}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <DiscQuestionCard
          question={current}
          answer={currentAnswer}
          onChange={setAnswer}
        />

        <div className="flex justify-between gap-3">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => {
              setError("");
              setIndex((value) => Math.max(0, value - 1));
            }}
            className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-700 shadow-sm disabled:opacity-40"
          >
            Previous
          </button>

          {index < discQuestions.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={finishDisc}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Lanjut IQ Screening
            </button>
          )}
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          DISC membaca preferensi gaya kerja dan komunikasi. Hasilnya bukan
          label permanen dan perlu dikonfirmasi melalui interview.
        </div>
      </section>
    </main>
  );
}
EOF

cat >> README.md <<'EOF'

---

## Part 3 — DISC Test

Fitur yang sudah ditambahkan:
- 24 soal DISC forced choice.
- Kandidat memilih:
  - Paling menggambarkan saya
  - Paling tidak menggambarkan saya
- Validasi agar pilihan paling dan paling tidak tidak sama.
- Jawaban DISC auto-save ke localStorage.
- Meta pengerjaan DISC:
  - startedAt
  - finishedAt
  - durationSeconds
  - changeCount
- DISC scoring module:
  - Raw D/I/S/C
  - Adjusted score
  - Percentage D/I/S/C
  - Primary type
  - Combination type jika dua skor tertinggi selisih <= 10%
  - DISC position fit
  - DISC red flags
  - Interpretasi D/I/S/C dan kombinasi

Test cepat:
1. Buka `/test/start`.
2. Isi kandidat dan lanjut ke instruksi.
3. Klik `Mulai DISC`.
4. Pastikan setiap soal wajib memilih dua jawaban berbeda.
5. Selesaikan 24 soal.
6. Klik `Lanjut IQ Screening`.
7. Pastikan masuk ke `/test/iq`.
EOF

echo ""
echo "✅ Part 3 selesai."
echo ""
echo "Jalankan:"
echo "npm run dev"
echo ""
echo "Cek:"
echo "/test/disc"