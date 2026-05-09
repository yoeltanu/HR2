import Link from "next/link";
import { ArrowRight, Brain, UsersRound } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Disclaimer from "@/components/ui/Disclaimer";

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
            HR Assessment Platform
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

            <Link
              href="/admin/login"
              className="rounded-2xl border border-white/20 px-6 py-4 font-bold text-white hover:bg-white/10"
            >
              Login Admin
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
