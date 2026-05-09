export const ADMIN_LOCAL_KEY = "hr_assessment_admin_session";
export const ADMIN_COOKIE_NAME = "hr_admin_session";

export function setAdminSessionClient(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_LOCAL_KEY, "true");
  }
}

export function clearAdminSessionClient(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_LOCAL_KEY);
    document.cookie = `${ADMIN_COOKIE_NAME}=; Max-Age=0; path=/`;
  }
}

export function hasAdminSessionClient(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_LOCAL_KEY) === "true";
}
