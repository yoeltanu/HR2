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
