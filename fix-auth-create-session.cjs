const fs = require("fs");

const file = "lib/utils/auth.ts";
let text = fs.readFileSync(file, "utf8");

if (!text.includes("createAdminSessionResponse")) {
  text += `

import { NextResponse } from "next/server";

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
`;
}

fs.writeFileSync(file, text, "utf8");
console.log("✅ Added createAdminSessionResponse to lib/utils/auth.ts");