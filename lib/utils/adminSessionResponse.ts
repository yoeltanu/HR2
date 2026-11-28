// Server only: menerbitkan cookie sesi admin setelah login berhasil.
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_MAX_AGE_SECONDS,
  ADMIN_UI_COOKIE_NAME,
  createAdminToken
} from "@/lib/utils/adminSession";

export function createAdminSessionResponse(data: unknown) {
  const response = NextResponse.json(data);
  const secure = process.env.NODE_ENV === "production";

  response.cookies.set(ADMIN_COOKIE_NAME, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_MAX_AGE_SECONDS,
    secure
  });

  // Hanya penanda untuk redirect UI; tidak memberi akses apa pun.
  response.cookies.set(ADMIN_UI_COOKIE_NAME, "1", {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_MAX_AGE_SECONDS,
    secure
  });

  return response;
}
