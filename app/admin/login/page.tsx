
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { setAdminSessionClient } from "@/lib/utils/auth";
import { validateAdminLogin } from "@/lib/storage/adminUsers";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const localUser = validateAdminLogin(username, password);

    if (localUser) {
      setAdminSessionClient();
      localStorage.setItem("gadgetnio_current_admin", JSON.stringify(localUser));
      router.push("/admin/dashboard");
      return;
    }

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login gagal.");
      }

      setAdminSessionClient();
      router.push("/admin/dashboard");
    } catch {
      setError("Username atau password salah.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <form
        onSubmit={login}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-premium"
      >
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400 text-navy-950">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <h1 className="text-center text-3xl font-black text-slate-950">
          Admin Login
        </h1>

        <p className="mt-2 text-center text-sm text-slate-500">
          Gadgetnio HR Suite
        </p>

        {error && (
          <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <label className="mt-6 block">
          <span className="mb-1 block text-sm font-bold text-slate-700">
            Username
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="admin"
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-1 block text-sm font-bold text-slate-700">
            Password
          </span>
          <input
            type="password"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Masukkan password"
          />
        </label>

        <button className="mt-6 w-full rounded-2xl bg-cyan-500 px-5 py-4 font-black text-navy-950 hover:bg-cyan-400">
          Login
        </button>

        
      </form>
    </main>
  );
}
