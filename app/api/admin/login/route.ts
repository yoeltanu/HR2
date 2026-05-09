import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/utils/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = String(body.password || "");
  const expected = process.env.ADMIN_PASSWORD || "admin123";

  if (!password || password !== expected) {
    return NextResponse.json(
      {
        success: false,
        message: "Password admin salah."
      },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set(ADMIN_COOKIE_NAME, "1", {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
