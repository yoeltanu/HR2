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

export interface PublicAssessmentConfig {
  positions: PositionOption[];
  levels: AssessmentLevelOption[];
  updatedAt: string;
}

export const ADMIN_CONFIG_KEY = "hr_assessment_admin_config";
export const ASSESSMENT_CONFIG_KEY = "assessment_config_v1";

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
      description:
        "Untuk staff operasional, admin dasar, packing, CS junior, dan role entry-level.",
      durationMinutes: 20,
      totalQuestions: 25,
      active: true
    },
    {
      value: 2,
      label: "Level 2: Specialist / Admin Senior",
      description:
        "Untuk accounting staff, admin senior, marketplace staff, procurement junior, dan specialist.",
      durationMinutes: 30,
      totalQuestions: 35,
      active: true
    },
    {
      value: 3,
      label: "Level 3: Supervisor / Leader",
      description:
        "Untuk supervisor, warehouse leader, head of sales, strategic assistant, dan leadership role.",
      durationMinutes: 40,
      totalQuestions: 45,
      active: true
    }
  ],
  hrWhatsapp: "6281234567890",
  updatedAt: ""
};

export function createIdFromLabel(label: string): string {
  return (
    label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || `position-${Date.now()}`
  );
}

function toPositiveInteger(value: unknown, fallback: number): number {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return fallback;
  return Math.max(1, Math.round(number));
}

function normalizePosition(value: unknown, index: number): PositionOption | null {
  if (!value || typeof value !== "object") return null;

  const item = value as Partial<PositionOption>;
  const label = String(item.label || "").trim();
  if (!label) return null;

  return {
    id: String(item.id || "").trim() || createIdFromLabel(label) || `position-${index}`,
    label,
    active: typeof item.active === "boolean" ? item.active : true
  };
}

function normalizeLevel(value: unknown): AssessmentLevelOption | null {
  if (!value || typeof value !== "object") return null;

  const item = value as Partial<AssessmentLevelOption>;
  const numericValue = Number(item.value);
  if (![1, 2, 3].includes(numericValue)) return null;

  const levelValue = numericValue as 1 | 2 | 3;
  const fallback = defaultAdminConfig.levels.find(
    (level) => level.value === levelValue
  )!;

  return {
    value: levelValue,
    label: String(item.label || fallback.label).trim() || fallback.label,
    description:
      String(item.description || fallback.description).trim() || fallback.description,
    durationMinutes: toPositiveInteger(
      item.durationMinutes,
      fallback.durationMinutes
    ),
    totalQuestions: toPositiveInteger(item.totalQuestions, fallback.totalQuestions),
    active: typeof item.active === "boolean" ? item.active : fallback.active
  };
}

export function cloneAdminConfig(config: HRAdminConfig): HRAdminConfig {
  return {
    positions: config.positions.map((position) => ({ ...position })),
    levels: config.levels.map((level) => ({ ...level })),
    hrWhatsapp: config.hrWhatsapp,
    updatedAt: config.updatedAt
  };
}

export function parseAdminConfigValue(value: unknown): HRAdminConfig {
  let parsed = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return cloneAdminConfig(defaultAdminConfig);
    }
  }

  if (!parsed || typeof parsed !== "object") {
    return cloneAdminConfig(defaultAdminConfig);
  }

  const source = parsed as Partial<HRAdminConfig>;

  const positions = Array.isArray(source.positions)
    ? source.positions
        .map((position, index) => normalizePosition(position, index))
        .filter((position): position is PositionOption => Boolean(position))
    : defaultAdminConfig.positions.map((position) => ({ ...position }));

  const levels = Array.isArray(source.levels)
    ? source.levels
        .map(normalizeLevel)
        .filter((level): level is AssessmentLevelOption => Boolean(level))
        .sort((a, b) => a.value - b.value)
    : defaultAdminConfig.levels.map((level) => ({ ...level }));

  return {
    positions,
    levels: levels.length
      ? levels
      : defaultAdminConfig.levels.map((level) => ({ ...level })),
    hrWhatsapp:
      String(source.hrWhatsapp || defaultAdminConfig.hrWhatsapp).trim() ||
      defaultAdminConfig.hrWhatsapp,
    updatedAt: String(source.updatedAt || "")
  };
}

export function serializeAdminConfig(config: HRAdminConfig): string {
  return JSON.stringify(parseAdminConfigValue(config));
}

export function getPublicAssessmentConfig(
  config: HRAdminConfig
): PublicAssessmentConfig {
  return {
    positions: config.positions
      .filter((position) => position.active)
      .map((position) => ({ ...position })),
    levels: config.levels
      .filter((level) => level.active)
      .map((level) => ({ ...level })),
    updatedAt: config.updatedAt
  };
}

export function getDefaultLevelConfig(
  level: 1 | 2 | 3
): AssessmentLevelOption {
  return (
    defaultAdminConfig.levels.find((item) => item.value === level) ||
    defaultAdminConfig.levels[0]
  );
}

export function getAdminConfig(): HRAdminConfig {
  if (typeof window === "undefined") return cloneAdminConfig(defaultAdminConfig);

  const raw = localStorage.getItem(ADMIN_CONFIG_KEY);

  if (!raw) {
    const fallback = cloneAdminConfig(defaultAdminConfig);
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(fallback));
    return fallback;
  }

  const parsed = parseAdminConfigValue(raw);
  localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(parsed));
  return parsed;
}

export function saveAdminConfig(config: HRAdminConfig): HRAdminConfig {
  const next = parseAdminConfigValue({
    ...config,
    updatedAt: config.updatedAt || new Date().toISOString()
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("hr-admin-config-updated"));
  }

  return next;
}

export function resetAdminConfig(): HRAdminConfig {
  const next = cloneAdminConfig(defaultAdminConfig);
  next.updatedAt = new Date().toISOString();

  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("hr-admin-config-updated"));
  }

  return next;
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
    getDefaultLevelConfig(level)
  );
}
