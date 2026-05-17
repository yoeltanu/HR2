const fs = require("fs");

const file = "app/admin/settings/page.tsx";
let text = fs.readFileSync(file, "utf8");

// Hapus seluruh section "Admin Users"
text = text.replace(
  /\n\s*<section className="rounded-3xl bg-white p-6 shadow-sm">\s*<h2 className="text-2xl font-black text-slate-950">\s*Admin Users[\s\S]*?<\/section>\s*(?=\s*<\/div>\s*<\/AdminLayout>)/,
  "\n"
);

// Hapus type AdminUserRow jika ada
text = text.replace(
  /\ntype AdminUserRow = \{[\s\S]*?\};\n/,
  "\n"
);

// Hapus state Admin Users
text = text.replace(
  /\n\s*const \[adminUsers,[\s\S]*?const \[adminUsersLoading, setAdminUsersLoading\] = useState\(false\);/,
  ""
);

// Hapus pemanggilan loadAdminUsers() di useEffect
text = text.replace(/\n\s*loadAdminUsers\(\);/, "");

// Hapus semua function terkait Admin Users
const functions = [
  "loadAdminUsers",
  "addAdminUser",
  "updateAdminUser",
  "changeAdminPassword",
  "toggleAdminActive"
];

for (const fn of functions) {
  const regex = new RegExp(
    `\\n\\s*async function ${fn}\\([\\s\\S]*?\\n\\s*}`,
    "g"
  );
  text = text.replace(regex, "");
}

fs.writeFileSync(file, text, "utf8");

console.log("✅ Admin Users section removed from /admin/settings.");
console.log("ℹ️ Menu Admin Users di sidebar tetap tidak terpengaruh.");