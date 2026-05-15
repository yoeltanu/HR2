const fs = require("fs");

const file = "app/admin/candidate/[id]/page.tsx";
let text = fs.readFileSync(file, "utf8");

text = text.replace(
`      interpretation: {
        summary: String(row.summary || row.disc_summary || "Data detail DISC dari Google Sheets belum lengkap."),
        strengths: [],
        risks: [],
        managementTips: []
      }`,
`      interpretation: {
        title: "DISC " + String(row.disc_type || "-"),
        summary: String(row.summary || row.disc_summary || "Data detail DISC dari Google Sheets belum lengkap."),
        strengths: [],
        risks: [],
        managementTips: [],
        suitableRoles: []
      }`
);

fs.writeFileSync(file, text, "utf8");

console.log("✅ Fixed required DiscInterpretation fields.");