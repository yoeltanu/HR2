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
