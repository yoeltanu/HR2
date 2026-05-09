"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { setAdminSessionClient } from "@/lib/utils/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login gagal.");
      }

      setAdminSessionClient();
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-navy-950 to-slate-900 px-4">
      <form
        onSubmit={login}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-premium"
      >
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-100 text-cyan-700">
          <LockKeyhole className="h-7 w-7" />
        </div>

        <h1 className="mt-5 text-3xl font-black text-slate-950">
          Admin Login
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Masukkan password admin dari environment variable.
        </p>

        {error && (
          <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
          placeholder="Password admin"
        />

        <button
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950 disabled:opacity-60"
        >
          {loading ? "Memeriksa..." : "Login"}
        </button>
      </form>
    </main>
  );
}
