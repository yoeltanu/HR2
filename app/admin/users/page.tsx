
"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";

type AdminUserRow = {
  username: string;
  role: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  function show(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  }

  async function loadUsers() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal memuat admin users.");
      }

      setUsers(data.users || []);
    } catch (error) {
      show(error instanceof Error ? error.message : "Gagal memuat admin users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function addAdmin() {
    if (!username.trim() || !password.trim()) {
      alert("Username dan password wajib diisi.");
      return;
    }

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: "add",
          username,
          password,
          role
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal tambah admin.");
      }

      setUsername("");
      setPassword("");
      setRole("admin");
      show("Admin berhasil ditambahkan.");
      loadUsers();
    } catch (error) {
      show(error instanceof Error ? error.message : "Gagal tambah admin.");
    }
  }

  async function changePassword(username: string) {
    const newPassword = prompt("Masukkan password baru:");
    if (!newPassword) return;

    await updateUser({
      username,
      password: newPassword
    });

    show("Password berhasil diubah.");
  }

  async function toggleActive(user: AdminUserRow) {
    await updateUser({
      username: user.username,
      active: !user.active
    });

    show("Status admin berhasil diperbarui.");
  }

  async function updateUser(payload: {
    username: string;
    password?: string;
    active?: boolean;
    role?: string;
  }) {
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "update",
        ...payload
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Gagal update admin.");
    }

    await loadUsers();
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black text-slate-950">
            Admin Users
          </h1>
          <p className="mt-2 text-slate-600">
            Kelola admin yang bisa login di Vercel melalui Google Sheets.
          </p>

          {message && (
            <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              {message}
            </p>
          )}
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Tambah Admin
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_180px_auto]">
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username"
            />

            <input
              type="password"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
            />

            <select
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>

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

          {loading ? (
            <div className="p-8 text-slate-500">Loading admin users...</div>
          ) : (
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
                    <tr key={user.username} className="border-t border-slate-100">
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
                      <td className="px-4 py-3">{user.created_at || "-"}</td>
                      <td className="px-4 py-3">{user.updated_at || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => changePassword(user.username)}
                            className="rounded-xl bg-cyan-50 px-3 py-2 font-bold text-cyan-700 hover:bg-cyan-100"
                          >
                            Ubah Password
                          </button>

                          <button
                            onClick={() => toggleActive(user)}
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
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
