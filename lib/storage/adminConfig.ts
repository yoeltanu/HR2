"use client";

export interface PositionOption {
  id: string;
  label: string;
  active: boolean;
}

export interface AssessmentLevelOption {
  value: 1 | 2 | 3;
  label: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  active: boolean;
}

export interface HRAdminConfig {
  positions: PositionOption[];
  levels: AssessmentLevelOption[];
  hrWhatsapp: string;
  updatedAt: string;
}

export const ADMIN_CONFIG_KEY = "hr_assessment_admin_config";

export const defaultAdminConfig: HRAdminConfig = {
  positions: [
    { id: "accounting", label: "Accounting", active: true },
    { id: "admin-retur", label: "Admin Retur", active: true },
    { id: "admin-inbound", label: "Admin Inbound", active: true },
    { id: "customer-service", label: "Customer Service", active: true },
    { id: "ecommerce-specialist", label: "E-commerce Specialist", active: true },
    { id: "head-of-sales", label: "Head of Sales", active: true },
    { id: "procurement", label: "Procurement", active: true },
    { id: "warehouse-leader", label: "Warehouse Leader", active: true },
    { id: "packing-staff", label: "Packing Staff", active: true },
    { id: "hrga", label: "HRGA", active: true },
    { id: "personal-assistant", label: "Personal Assistant", active: true },
    { id: "lainnya", label: "Lainnya", active: true }
  ],
  levels: [
    {
      value: 1,
      label: "Level 1: Staff Operasional / Admin Dasar",
      description: "Untuk staff operasional, admin dasar, packing, CS junior, dan role entry-level.",
      durationMinutes: 20,
      totalQuestions: 25,
      active: true
    },
    {
      value: 2,
      label: "Level 2: Specialist / Admin Senior",
      description: "Untuk accounting staff, admin senior, marketplace staff, procurement junior, dan specialist.",
      durationMinutes: 30,
      totalQuestions: 35,
      active: true
    },
    {
      value: 3,
      label: "Level 3: Supervisor / Leader",
      description: "Untuk supervisor, warehouse leader, head of sales, strategic assistant, dan leadership role.",
      durationMinutes: 40,
      totalQuestions: 45,
      active: true
    }
  ],
  hrWhatsapp: "6281234567890",
  updatedAt: new Date().toISOString()
};

export function createIdFromLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `position-${Date.now()}`;
}

export function getAdminConfig(): HRAdminConfig {
  if (typeof window === "undefined") return defaultAdminConfig;

  const raw = localStorage.getItem(ADMIN_CONFIG_KEY);

  if (!raw) {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(defaultAdminConfig));
    return defaultAdminConfig;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<HRAdminConfig>;

    return {
      positions: Array.isArray(parsed.positions) && parsed.positions.length
        ? parsed.positions
        : defaultAdminConfig.positions,
      levels: Array.isArray(parsed.levels) && parsed.levels.length
        ? parsed.levels
        : defaultAdminConfig.levels,
      hrWhatsapp: parsed.hrWhatsapp || defaultAdminConfig.hrWhatsapp,
      updatedAt: parsed.updatedAt || new Date().toISOString()
    };
  } catch {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(defaultAdminConfig));
    return defaultAdminConfig;
  }
}

export function saveAdminConfig(config: HRAdminConfig): HRAdminConfig {
  const next: HRAdminConfig = {
    ...config,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("hr-admin-config-updated"));

  return next;
}

export function resetAdminConfig(): HRAdminConfig {
  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(defaultAdminConfig));
  window.dispatchEvent(new Event("hr-admin-config-updated"));

  return defaultAdminConfig;
}

export function getActivePositions(): PositionOption[] {
  return getAdminConfig().positions.filter((item) => item.active);
}

export function getActiveLevels(): AssessmentLevelOption[] {
  return getAdminConfig().levels.filter((item) => item.active);
}

export function getLevelConfig(level: 1 | 2 | 3): AssessmentLevelOption {
  return (
    getAdminConfig().levels.find((item) => item.value === level) ||
    defaultAdminConfig.levels.find((item) => item.value === level) ||
    defaultAdminConfig.levels[0]
  );
}
