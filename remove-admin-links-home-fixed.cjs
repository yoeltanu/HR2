const fs = require("fs");
const path = require("path");

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
  console.log("Updated:", file);
}

// Navbar tanpa link kanan atas
write(
  "components/layout/Navbar.tsx",
`import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { APP_NAME } from "@/lib/utils/config";

export default function Navbar() {
  return (
    <header className="no-print border-b border-white/10 bg-navy-950/90 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyanx text-navy-950">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span>{APP_NAME}</span>
        </Link>
      </div>
    </header>
  );
}
`
);

// Landing page tanpa tombol Login Admin
write(
  "app/page.tsx",
`import Link from "next/link";
import { ArrowRight, Brain, UsersRound } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/ui/Disclaimer";
import { APP_NAME } from "@/lib/utils/config";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 text-white">
      <Navbar />

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-cyan-300/30 bg-white/10 px-4 py-2 text-sm text-cyan-100">
            HR Tech SaaS for marketplace, warehouse, admin, accounting, sales
          </div>

          <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-7xl">
            {APP_NAME}
          </h1>

          <p className="mt-5 text-2xl font-semibold text-cyanx">
            DISC Personality Test + Cognitive Ability Screening
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            Platform assessment internal untuk membantu HR membaca gaya kerja,
            gaya komunikasi, akurasi, logika kerja, dan potensi kecocokan posisi
            secara lebih cepat dan rapi.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/test/start"
              className="inline-flex items-center gap-2 rounded-2xl bg-cyan-400 px-6 py-4 font-bold text-navy-950 hover:bg-cyan-300"
            >
              Mulai Tes
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 text-slate-950 shadow-premium">
          <div className="grid gap-4">
            <Feature
              icon={<UsersRound />}
              title="DISC Work Style"
              text="Membaca dominance, influence, steadiness, dan conscientiousness."
            />

            <Feature
              icon={<Brain />}
              title="Cognitive Screening"
              text="Soal original berbasis konteks kerja online shop, marketplace, gudang, accounting, CS, procurement, dan sales."
            />
          </div>

          <div className="mt-6">
            <Disclaimer />
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-100 text-cyan-700">
        {icon}
      </div>

      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}
`
);

console.log("");
console.log("✅ Admin links removed successfully.");
console.log("Run: npm run build");