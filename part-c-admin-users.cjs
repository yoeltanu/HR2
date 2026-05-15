const fs = require("fs");
const path = require("path");

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
  console.log("Updated:", file);
}

write("lib/storage/adminUsers.ts", `
"use client";

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: "superadmin" | "admin";
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

const ADMIN_USERS_KEY = "gadgetnio_admin_users";

export const defaultAdminUsers: AdminUser[] = [
  {
    id: "admin-default",
    username: "admin",
    password: "admin123",
    role: "superadmin",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function getAdminUsers(): AdminUser[] {
  if (typeof window === "undefined") return defaultAdminUsers;

  const raw = localStorage.getItem(ADMIN_USERS_KEY);

  if (!raw) {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(defaultAdminUsers));
    return defaultAdminUsers;
  }

  try {
    const users = JSON.parse(raw) as AdminUser[];
    return Array.isArray(users) && users.length ? users : defaultAdminUsers;
  } catch {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(defaultAdminUsers));
    return defaultAdminUsers;
  }
}

export function saveAdminUsers(users: AdminUser[]): AdminUser[] {
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  return users;
}

export function validateAdminLogin(username: string, password: string): AdminUser | null {
  const users = getAdminUsers();

  return (
    users.find(
      (user) =>
        user.active &&
        user.username.toLowerCase() === username.trim().toLowerCase() &&
        user.password === password
    ) || null
  );
}
`);

write("app/admin/login/page.tsx", `
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

        <p className="mt-4 text-center text-xs text-slate-400">
          Default demo: username admin / password admin123
        </p>
      </form>
    </main>
  );
}
`);

write("app/admin/users/page.tsx", `
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  getAdminUsers,
  saveAdminUsers,
  type AdminUser
} from "@/lib/storage/adminUsers";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUsers(getAdminUsers());
  }, []);

  function show(messageText: string) {
    setMessage(messageText);
    window.setTimeout(() => setMessage(""), 2500);
  }

  function persist(next: AdminUser[]) {
    setUsers(next);
    saveAdminUsers(next);
  }

  function addAdmin() {
    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
      alert("Username dan password wajib diisi.");
      return;
    }

    const exists = users.some(
      (user) => user.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (exists) {
      alert("Username sudah ada.");
      return;
    }

    const now = new Date().toISOString();

    persist([
      ...users,
      {
        id: "admin-" + Date.now(),
        username: cleanUsername,
        password,
        role: "admin",
        active: true,
        createdAt: now,
        updatedAt: now
      }
    ]);

    setUsername("");
    setPassword("");
    show("Admin baru berhasil ditambahkan.");
  }

  function updatePassword(id: string) {
    const newPassword = prompt("Masukkan password baru:");

    if (!newPassword) return;

    persist(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              password: newPassword,
              updatedAt: new Date().toISOString()
            }
          : user
      )
    );

    show("Password admin berhasil diubah.");
  }

  function toggleActive(id: string) {
    persist(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              active: !user.active,
              updatedAt: new Date().toISOString()
            }
          : user
      )
    );

    show("Status admin berhasil diperbarui.");
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">
            Admin Users
          </h1>
          <p className="mt-2 text-slate-600">
            Tambah admin baru, create password, ubah password, dan nonaktifkan
            akses admin.
          </p>

          {message && (
            <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              {message}
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Catatan: versi ini menyimpan admin user di localStorage untuk Demo
            Mode. Untuk production multi-device, data admin perlu dipindahkan ke
            Google Sheets atau database.
          </div>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Tambah Admin
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username admin baru"
            />

            <input
              type="password"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password awal"
            />

            <button
              onClick={addAdmin}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Tambah
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-2xl font-black text-slate-950">
              Daftar Admin
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-bold text-slate-950">
                      {user.username}
                    </td>
                    <td className="px-4 py-3">{user.role}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          user.active
                            ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                            : "rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700"
                        }
                      >
                        {user.active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{user.createdAt.slice(0, 10)}</td>
                    <td className="px-4 py-3">{user.updatedAt.slice(0, 10)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updatePassword(user.id)}
                          className="rounded-xl bg-cyan-50 px-3 py-2 font-bold text-cyan-700 hover:bg-cyan-100"
                        >
                          Ubah Password
                        </button>

                        <button
                          onClick={() => toggleActive(user.id)}
                          className="rounded-xl bg-slate-100 px-3 py-2 font-bold text-slate-700 hover:bg-slate-200"
                        >
                          {user.active ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
`);

let sidebar = fs.readFileSync("components/layout/Sidebar.tsx", "utf8");

if (!sidebar.includes('href="/admin/users"')) {
  sidebar = sidebar.replace(
    `href="/admin/settings"`,
    `href="/admin/users"`
  );

  sidebar = sidebar.replace(
    `Settings
        </Link>`,
    `Admin Users
        </Link>

        <Link
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-700 hover:bg-slate-100"
          href="/admin/settings"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>`
  );

  fs.writeFileSync("components/layout/Sidebar.tsx", sidebar, "utf8");
  console.log("Patched: components/layout/Sidebar.tsx");
}

console.log("");
console.log("✅ Part C Admin Users selesai.");
console.log("Jalankan: npm run build");