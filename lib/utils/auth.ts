// Client-safe. Cookie hr_admin_ui hanya untuk redirect di UI; otorisasi sebenarnya ada di cookie HttpOnly hr_admin_session (server).
const UI_COOKIE_NAME = "hr_admin_ui";
const LEGACY_STORAGE_KEY = "hr_admin_session";

export function clearAdminSessionClient(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {}
  document.cookie = `${UI_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  fetch("/api/admin/logout", { method: "POST", keepalive: true }).catch(() => {});
}

export function isAdminSessionClient(): boolean {
  if (typeof window === "undefined") return false;

  return document.cookie
    .split(";")
    .map((item) => item.trim())
    .some((item) => item === `${UI_COOKIE_NAME}=1`);
}

export function hasAdminSessionClient(): boolean {
  return isAdminSessionClient();
}
