// Server only. Tidak mengimpor alias "@/..." agar bisa dites langsung dengan Node.
import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE_NAME = "hr_admin_session";
export const ADMIN_UI_COOKIE_NAME = "hr_admin_ui";
export const ADMIN_MAX_AGE_SECONDS = 60 * 60 * 12;

const MAX_AGE_MS = ADMIN_MAX_AGE_SECONDS * 1000;
const MAX_CLOCK_SKEW_MS = 60 * 1000;

function getSecret(): string {
  return (
    (process.env.ADMIN_SESSION_SECRET || "").trim() ||
    (process.env.GOOGLE_SCRIPT_SECRET || "").trim() ||
    (process.env.ADMIN_PASSWORD || "").trim()
  );
}

function sign(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function hasAdminSecret(): boolean {
  return getSecret().length > 0;
}

export function createAdminToken(now: number = Date.now()): string {
  const secret = getSecret();
  if (!secret) throw new Error("Secret admin belum dikonfigurasi.");
  return `${now}.${sign(secret, String(now))}`;
}

export function verifyAdminToken(token: string, now: number = Date.now()): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;

  const parts = token.split(".");
  if (parts.length !== 2 || !/^\d+$/.test(parts[0])) return false;

  const issuedAt = Number(parts[0]);
  if (issuedAt - now > MAX_CLOCK_SKEW_MS) return false;
  if (now - issuedAt > MAX_AGE_MS) return false;

  const expected = Buffer.from(sign(secret, parts[0]));
  const actual = Buffer.from(parts[1]);
  if (expected.length !== actual.length) return false;

  return timingSafeEqual(expected, actual);
}

export function isAdminRequest(request: {
  cookies: { get(name: string): { value: string } | undefined };
}): boolean {
  return verifyAdminToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value ?? "");
}
