"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BarChart3, BookOpen, LogOut, Settings, Users } from "lucide-react";
import { clearAdminSessionClient } from "@/lib/utils/auth";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="no-print min-h-screen w-full border-r border-slate-200 bg-white p-4 md:w-72">
      <div className="mb-8 rounded-2xl bg-navy-950 p-5 text-white">
        <p className="text-sm text-cyanx">HR Suite</p>
        <h2 className="text-lg font-bold">Assessment Admin</h2>
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
