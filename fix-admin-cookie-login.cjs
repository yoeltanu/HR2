const fs = require("fs");

fs.writeFileSync(
  "lib/utils/auth.ts",
`import { NextResponse } from "next/server";

export const ADMIN_COOKIE_NAME = "hr_admin_session";
export const ADMIN_STORAGE_KEY = "hr_admin_session";

export function setAdminSessionClient(): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(ADMIN_STORAGE_KEY, "1");
  document.cookie = \`\${ADMIN_COOKIE_NAME}=1; path=/; max-age=\${60 * 60 * 12}; SameSite=Lax\`;
}

export function clearAdminSessionClient(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ADMIN_STORAGE_KEY);
  document.cookie = \`\${ADMIN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax\`;
}

export function isAdminSessionClient(): boolean {
  if (typeof window === "undefined") return false;

  const local = localStorage.getItem(ADMIN_STORAGE_KEY) === "1";
  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .some((item) => item === \`\${ADMIN_COOKIE_NAME}=1\`);

  return local || cookie;
}

export function createAdminSessionResponse(data: unknown) {
  const response = NextResponse.json(data);

  response.cookies.set(ADMIN_COOKIE_NAME, "1", {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
`,
  "utf8"
);

console.log("✅ Fixed admin session cookie.");