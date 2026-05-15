const fs = require("fs");

const file = "lib/storage/googleSheets.ts";
let text = fs.readFileSync(file, "utf8");

text = text.replace(
`url: process.env.GOOGLE_SCRIPT_URL || "",
    secret: process.env.GOOGLE_SCRIPT_SECRET || ""`,
`url: (process.env.GOOGLE_SCRIPT_URL || "").trim(),
    secret: (process.env.GOOGLE_SCRIPT_SECRET || "").trim()`
);

fs.writeFileSync(file, text, "utf8");
console.log("✅ GOOGLE_SCRIPT_URL and SECRET now trimmed.");