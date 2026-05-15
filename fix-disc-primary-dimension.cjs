const fs = require("fs");

const file = "app/admin/candidate/[id]/page.tsx";
let text = fs.readFileSync(file, "utf8");

text = text.replace(
`function rowToRecord(row: any): AssessmentRecord {`,
`function getDiscPrimary(value: unknown): "D" | "I" | "S" | "C" {
  const first = String(value || "C").charAt(0).toUpperCase();

  if (first === "D" || first === "I" || first === "S" || first === "C") {
    return first;
  }

  return "C";
}

function rowToRecord(row: any): AssessmentRecord {`
);

text = text.replace(
`      primary: String(row.disc_type || row.discType || "-").charAt(0) || "-",`,
`      primary: getDiscPrimary(row.disc_type || row.discType),`
);

fs.writeFileSync(file, text, "utf8");

console.log("✅ Fixed DISC primary dimension type.");