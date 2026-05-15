const fs = require("fs");
const path = require("path");

const file = "app/api/debug-env/route.ts";
fs.mkdirSync(path.dirname(file), { recursive: true });

fs.writeFileSync(
  file,
`import { NextResponse } from "next/server";

export async function GET() {
  const url = (process.env.GOOGLE_SCRIPT_URL || "").trim();
  const secret = (process.env.GOOGLE_SCRIPT_SECRET || "").trim();

  return NextResponse.json({
    hasGoogleScriptUrl: Boolean(url),
    googleScriptUrlStart: url.slice(0, 45),
    googleScriptUrlEnd: url.slice(-10),
    hasGoogleScriptSecret: Boolean(secret),
    googleScriptSecretLength: secret.length,
    googleScriptSecretStart: secret.slice(0, 3),
    googleScriptSecretEnd: secret.slice(-3)
  });
}
`,
  "utf8"
);

console.log("✅ Created /api/debug-env");