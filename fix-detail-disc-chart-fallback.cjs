const fs = require("fs");

const file = "app/admin/candidate/[id]/page.tsx";
let text = fs.readFileSync(file, "utf8");

text = text.replace(
`function rowToRecord(row: any): AssessmentRecord {`,
`function getDiscPercentages(row: any) {
  const fromSheet = {
    D: Number(row.pct_D || row.disc_D || 0),
    I: Number(row.pct_I || row.disc_I || 0),
    S: Number(row.pct_S || row.disc_S || 0),
    C: Number(row.pct_C || row.disc_C || 0)
  };

  const total =
    fromSheet.D + fromSheet.I + fromSheet.S + fromSheet.C;

  if (total > 0) return fromSheet;

  const type = String(row.disc_type || row.discType || "C").toUpperCase();

  const fallback = { D: 15, I: 15, S: 15, C: 15 };

  if (type.includes("D")) fallback.D = 55;
  if (type.includes("I")) fallback.I = 55;
  if (type.includes("S")) fallback.S = 55;
  if (type.includes("C")) fallback.C = 55;

  return fallback;
}

function rowToRecord(row: any): AssessmentRecord {`
);

text = text.replace(
`      percentages: {
        D: Number(row.pct_D || row.disc_D || 0),
        I: Number(row.pct_I || row.disc_I || 0),
        S: Number(row.pct_S || row.disc_S || 0),
        C: Number(row.pct_C || row.disc_C || 0)
      },`,
`      percentages: getDiscPercentages(row),`
);

fs.writeFileSync(file, text, "utf8");

console.log("✅ Fixed DISC chart fallback for Google Sheets summary row.");