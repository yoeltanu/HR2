import Link from "next/link";
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

        <nav className="flex items-center gap-4 text-sm text-slate-200">
          <Link href="/test/start" className="hover:text-cyanx">
            Mulai Tes
          </Link>
          <Link href="/admin/login" className="hover:text-cyanx">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
