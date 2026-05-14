const fs = require("fs");

fs.writeFileSync(
  "components/layout/Navbar.tsx",
`import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <header className="no-print border-b border-white/10 bg-navy-950/90 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyanx text-navy-950">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span>HR Assessment Platform</span>
        </Link>
      </div>
    </header>
  );
}
`,
  "utf8"
);

let page = fs.readFileSync("app/page.tsx", "utf8");

page = page
  .replace(
    /<Link[\s\S]*?href="\\/admin\\/login"[\s\S]*?Login Admin[\s\S]*?<\\/Link>/g,
    ""
  )
  .replace(
    /<Link[\s\S]*?href="\\/admin"[\s\S]*?Login Admin[\s\S]*?<\\/Link>/g,
    ""
  )
  .replace(
    /<Link[\s\S]*?href="\\/admin\\/dashboard"[\s\S]*?Login Admin[\s\S]*?<\\/Link>/g,
    ""
  );

fs.writeFileSync("app/page.tsx", page, "utf8");

console.log("✅ Admin links removed from homepage and navbar.");