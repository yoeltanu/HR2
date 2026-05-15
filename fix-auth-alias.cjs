const fs = require("fs");

const file = "lib/utils/auth.ts";
let text = fs.readFileSync(file, "utf8");

if (!text.includes("hasAdminSessionClient")) {
  text += `

export function hasAdminSessionClient(): boolean {
  return isAdminSessionClient();
}
`;
}

fs.writeFileSync(file, text, "utf8");

console.log("✅ Added hasAdminSessionClient alias.");