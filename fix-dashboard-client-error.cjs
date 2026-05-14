const fs = require("fs");

let file = "app/admin/dashboard/page.tsx";
let text = fs.readFileSync(file, "utf8");

text = text.replace(
`row.full_name.toLowerCase().includes(search.toLowerCase()) ||
        row.whatsapp.toLowerCase().includes(search.toLowerCase());`,
`String(row.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
        String(row.whatsapp || "").toLowerCase().includes(search.toLowerCase());`
);

text = text.replace(
`row.position_applied.toLowerCase().includes(position.toLowerCase());`,
`String(row.position_applied || "").toLowerCase().includes(position.toLowerCase());`
);

text = text.replace(
`const matchDisc = !disc || row.disc_type.includes(disc);`,
`const matchDisc = !disc || String(row.disc_type || "").includes(disc);`
);

text = text.replace(
`const matchRecommendation =
        !recommendation || row.final_recommendation === recommendation;`,
`const matchRecommendation =
        !recommendation || String(row.final_recommendation || "") === recommendation;`
);

fs.writeFileSync(file, text, "utf8");

file = "components/admin/CandidateTable.tsx";
text = fs.readFileSync(file, "utf8");

text = text.replaceAll(`row.whatsapp}`, `String(row.whatsapp || "-")}`);
text = text.replaceAll(`{row.whatsapp}`, `{String(row.whatsapp || "-")}`);
text = text.replaceAll(`{row.position_applied}`, `{String(row.position_applied || "-")}`);
text = text.replaceAll(`{row.full_name}`, `{String(row.full_name || "-")}`);
text = text.replaceAll(`{row.final_recommendation}`, `{String(row.final_recommendation || "-")}`);

text = text.replace(
`<RedFlagBadge flags={row.red_flags} />`,
`<RedFlagBadge flags={String(row.red_flags || "").split(" | ").filter(Boolean)} />`
);

fs.writeFileSync(file, text, "utf8");

console.log("✅ Fixed dashboard client-side defensive handling.");