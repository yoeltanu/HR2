
"use client";

import { DEFAULT_WHATSAPP_TEMPLATE } from "@/lib/utils/whatsapp";

const SETTINGS_KEY = "hr_assessment_admin_settings";

export interface AdminSettings {
  whatsapp_candidate_message_template: string;
}

export const defaultAdminSettings: AdminSettings = {
  whatsapp_candidate_message_template: DEFAULT_WHATSAPP_TEMPLATE
};

export function getDemoAdminSettings(): AdminSettings {
  if (typeof window === "undefined") return defaultAdminSettings;

  const raw = localStorage.getItem(SETTINGS_KEY);

  if (!raw) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultAdminSettings));
    return defaultAdminSettings;
  }

  try {
    return {
      ...defaultAdminSettings,
      ...JSON.parse(raw)
    };
  } catch {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultAdminSettings));
    return defaultAdminSettings;
  }
}

export function saveDemoAdminSettings(settings: AdminSettings): AdminSettings {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  return settings;
}
