const fs = require("fs");

const file = "app/admin/candidate/[id]/page.tsx";
let text = fs.readFileSync(file, "utf8");

text = text.replace(
`      interpretation: {
        type: String(row.disc_type || "-"),
        title: String(row.disc_type || "-"),
        summary: String(row.summary || row.disc_summary || "Data detail DISC dari Google Sheets belum lengkap."),
        strengths: [],
        risks: [],
        managementTips: []
      }`,
`      interpretation: {
        summary: String(row.summary || row.disc_summary || "Data detail DISC dari Google Sheets belum lengkap."),
        strengths: [],
        risks: [],
        managementTips: []
      }`
);

fs.writeFileSync(file, text, "utf8");

console.log("✅ Fixed DiscInterpretation type mismatch.");