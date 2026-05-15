const fs = require("fs");

const file = "app/admin/candidate/[id]/page.tsx";
let text = fs.readFileSync(file, "utf8");

text = text.replace(
`      percentages: {
        D: Number(row.pct_D || row.disc_D || 0),
        I: Number(row.pct_I || row.disc_I || 0),
        S: Number(row.pct_S || row.disc_S || 0),
        C: Number(row.pct_C || row.disc_C || 0)
      },
      type: String(row.disc_type || row.discType || "-"),`,
`      percentages: {
        D: Number(row.pct_D || row.disc_D || 0),
        I: Number(row.pct_I || row.disc_I || 0),
        S: Number(row.pct_S || row.disc_S || 0),
        C: Number(row.pct_C || row.disc_C || 0)
      },
      adjusted: {
        D: Number(row.adjusted_D || row.raw_D || 0),
        I: Number(row.adjusted_I || row.raw_I || 0),
        S: Number(row.adjusted_S || row.raw_S || 0),
        C: Number(row.adjusted_C || row.raw_C || 0)
      },
      primary: String(row.disc_type || row.discType || "-").charAt(0) || "-",
      durationSeconds: Number(row.disc_duration_seconds || 0),
      changeCount: Number(row.disc_change_count || 0),
      type: String(row.disc_type || row.discType || "-"),`
);

fs.writeFileSync(file, text, "utf8");

console.log("✅ Fixed required DiscResult fields.");