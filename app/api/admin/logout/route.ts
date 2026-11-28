import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_UI_COOKIE_NAME } from "@/lib/utils/adminSession";

export async function POST() {
  const response = NextResponse.json({ success: true });

  for (const name of [ADMIN_COOKIE_NAME, ADMIN_UI_COOKIE_NAME]) {
    response.cookies.set(name, "", { path: "/", maxAge: 0 });
  }

  return response;
}
