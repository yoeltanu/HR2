const fs = require("fs");
const path = require("path");

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function write(file, content) {
  ensureDir(file);
  fs.writeFileSync(file, content, "utf8");
  console.log("Updated:", file);
}

function patchEnvExample() {
  const file = ".env.example";
  let text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";

  if (text.includes("NEXT_PUBLIC_APP_NAME=")) {
    text = text.replace(
      /NEXT_PUBLIC_APP_NAME=.*/g,
      'NEXT_PUBLIC_APP_NAME="Gadgetnio HR Suite"'
    );
  } else {
    text = `NEXT_PUBLIC_APP_NAME="Gadgetnio HR Suite"\n${text}`;
  }

  fs.writeFileSync(file, text, "utf8");
  console.log("Updated:", file);
}

write(
  "lib/utils/config.ts",
`export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || "Gadgetnio HR Suite";
`
);

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

        <nav className="flex items-center gap-4 text-sm text-slate-200">
          <Link href="/test/start" className="hover:text-cyanx">
            Mulai Tes
          </Link>
        </nav>
      </div>
    </header>
  );
}
`
);

write(
  "components/layout/Sidebar.tsx",
`"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, BookOpen, LogOut, Settings, Users } from "lucide-react";
import { clearAdminSessionClient } from "@/lib/utils/auth";
import { APP_NAME } from "@/lib/utils/config";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="no-print min-h-screen w-full border-r border-slate-200 bg-white p-4 md:w-72">
      <div className="mb-8 rounded-2xl bg-navy-950 p-5 text-white">
        <p className="text-sm text-cyanx">Admin Suite</p>
        <h2 className="text-lg font-bold">{APP_NAME}</h2>
      </div>

      <nav className="space-y-2">
        <Link
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
          href="/admin/dashboard"
        >
          <Users className="h-5 w-5" />
          Dashboard
        </Link>

        <Link
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
          href="/admin/manual-book"
        >
          <BookOpen className="h-5 w-5" />
          Manual Book
        </Link>

        <Link
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
          href="/admin/settings"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>

        <button
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-600 hover:bg-red-50"
          onClick={() => {
            clearAdminSessionClient();
            router.push("/admin/login");
          }}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </nav>

      <div className="mt-8 rounded-2xl bg-cyan-50 p-4 text-sm text-slate-700">
        <BarChart3 className="mb-2 h-5 w-5 text-cyan-700" />
        Hasil assessment adalah alat bantu HR, bukan keputusan final otomatis.
      </div>
    </aside>
  );
}
`
);

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
            HR Tech untuk marketplace, gudang, admin, accounting, sales, dan operasional.
          </div>

          <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-7xl">
            {APP_NAME}
          </h1>

          <p className="mt-5 text-2xl font-semibold text-cyanx">
            DISC Personality Test + Cognitive Ability Screening
          </p>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            Platform assessment internal untuk membantu HR Gadgetnio membaca gaya
            kerja, gaya komunikasi, akurasi, logika kerja, dan potensi kecocokan
            posisi secara lebih cepat dan rapi.
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

write(
  "app/test/completed/page.tsx",
`"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Home } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import type { AssessmentRecord } from "@/types/assessment";
import { getLastRecord } from "@/lib/storage/localStorageDemo";

export default function CompletedPage() {
  const [record, setRecord] = useState<AssessmentRecord | null>(null);

  useEffect(() => {
    setRecord(getLastRecord());
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto max-w-2xl px-4 py-20">
        <div className="rounded-3xl bg-white p-10 text-center shadow-premium">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />

          <h1 className="mt-5 text-3xl font-black text-slate-950">
            Tes Berhasil Dikirim
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            Terima kasih. Jawaban Anda sudah berhasil dikirim ke HR Gadgetnio.
            Silakan menunggu informasi selanjutnya dari tim HR.
          </p>

          {record && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left text-sm text-slate-700">
              <p>
                <strong>Candidate ID:</strong> {record.candidate_id}
              </p>
              <p>
                <strong>Nama:</strong> {record.candidate.fullName}
              </p>
              <p>
                <strong>Posisi:</strong> {record.candidate.positionApplied}
              </p>
            </div>
          )}

          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950"
          >
            <Home className="h-5 w-5" />
            Kembali ke Halaman Utama
          </Link>
        </div>
      </section>
    </main>
  );
}
`
);

if (fs.existsSync("app/admin/login/page.tsx")) {
  let text = fs.readFileSync("app/admin/login/page.tsx", "utf8");
  if (!text.includes('APP_NAME')) {
    text = `import { APP_NAME } from "@/lib/utils/config";\n` + text;
  }
  text = text
    .replaceAll("HR Assessment Platform", "{APP_NAME}")
    .replaceAll("Assessment Admin", "{APP_NAME}")
    .replaceAll("{APP_NAME}", "{APP_NAME}");
  fs.writeFileSync("app/admin/login/page.tsx", text, "utf8");
  console.log("Patched:", "app/admin/login/page.tsx");
}

if (fs.existsSync("app/admin/dashboard/page.tsx")) {
  let text = fs.readFileSync("app/admin/dashboard/page.tsx", "utf8");
  if (!text.includes('APP_NAME')) {
    text = text.replace(
      /("use client";\n)/,
      `$1\nimport { APP_NAME } from "@/lib/utils/config";\n`
    );
  }
  text = text.replaceAll("Dashboard Kandidat", "{APP_NAME} Dashboard");
  text = text.replaceAll("{APP_NAME}", "{APP_NAME}");
  fs.writeFileSync("app/admin/dashboard/page.tsx", text, "utf8");
  console.log("Patched:", "app/admin/dashboard/page.tsx");
}

write(
  "app/layout.tsx",
`import type { Metadata } from "next";
import "./globals.css";
import { APP_NAME } from "@/lib/utils/config";

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "DISC Personality Test dan Cognitive Ability Screening untuk proses HR internal Gadgetnio."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
`
);

patchEnvExample();

console.log("");
console.log("✅ PART 1 selesai.");
console.log("Jalankan: npm run build");