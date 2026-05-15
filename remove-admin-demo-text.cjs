const fs = require("fs");

const file = "app/admin/login/page.tsx";
let text = fs.readFileSync(file, "utf8");

// Hapus paragraf "Default demo: username admin / password admin123"
text = text.replace(
  /<p className="mt-4 text-center text-xs text-slate-400">[\s\S]*?<\/p>/,
  ""
);

fs.writeFileSync(file, text, "utf8");

console.log("✅ Removed demo credential text from admin login page.");