const fs = require("fs");

const file = "app/admin/settings/page.tsx";
let text = fs.readFileSync(file, "utf8");

if (text.includes("Daftar Admin")) {
  console.log("Admin Users sudah ada di settings.");
  process.exit(0);
}

text = text.replace(
`import { DEFAULT_WHATSAPP_TEMPLATE } from "@/lib/utils/whatsapp";`,
`import { DEFAULT_WHATSAPP_TEMPLATE } from "@/lib/utils/whatsapp";

type AdminUserRow = {
  username: string;
  role: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};`
);

text = text.replace(
`  const [whatsappTemplate, setWhatsappTemplate] = useState(
    DEFAULT_WHATSAPP_TEMPLATE
  );`,
`  const [whatsappTemplate, setWhatsappTemplate] = useState(
    DEFAULT_WHATSAPP_TEMPLATE
  );
  const [adminUsers, setAdminUsers] = useState<AdminUserRow[]>([]);
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("admin");
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);`
);

text = text.replace(
`  useEffect(() => {
    setConfig(getAdminConfig());
    loadWhatsappTemplate();
  }, []);`,
`  useEffect(() => {
    setConfig(getAdminConfig());
    loadWhatsappTemplate();
    loadAdminUsers();
  }, []);`
);

text = text.replace(
`  function handleReset() {
    const ok = confirm("Reset semua settings ke default?");
    if (!ok) return;

    const nextConfig = resetAdminConfig();

    setConfig(nextConfig);
    setWhatsappTemplate(DEFAULT_WHATSAPP_TEMPLATE);
    saveDemoAdminSettings({
      whatsapp_candidate_message_template: DEFAULT_WHATSAPP_TEMPLATE
    });

    showSaved("Settings dikembalikan ke default.");
  }`,
`  function handleReset() {
    const ok = confirm("Reset semua settings ke default?");
    if (!ok) return;

    const nextConfig = resetAdminConfig();

    setConfig(nextConfig);
    setWhatsappTemplate(DEFAULT_WHATSAPP_TEMPLATE);
    saveDemoAdminSettings({
      whatsapp_candidate_message_template: DEFAULT_WHATSAPP_TEMPLATE
    });

    showSaved("Settings dikembalikan ke default.");
  }

  async function loadAdminUsers() {
    setAdminUsersLoading(true);

    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (data.success) {
        setAdminUsers(data.users || []);
      }
    } catch {
      setAdminUsers([]);
    } finally {
      setAdminUsersLoading(false);
    }
  }

  async function addAdminUser() {
    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
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
          username: newAdminUsername,
          password: newAdminPassword,
          role: newAdminRole
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal menambahkan admin.");
      }

      setNewAdminUsername("");
      setNewAdminPassword("");
      setNewAdminRole("admin");
      await loadAdminUsers();
      showSaved("Admin baru berhasil ditambahkan.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menambahkan admin.");
    }
  }

  async function updateAdminUser(payload: {
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

    await loadAdminUsers();
  }

  async function changeAdminPassword(username: string) {
    const password = prompt("Masukkan password baru untuk " + username + ":");
    if (!password) return;

    try {
      await updateAdminUser({ username, password });
      showSaved("Password admin berhasil diubah.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal ubah password.");
    }
  }

  async function toggleAdminActive(user: AdminUserRow) {
    try {
      await updateAdminUser({
        username: user.username,
        active: !user.active
      });

      showSaved("Status admin berhasil diperbarui.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal update status admin.");
    }
  }`
);

text = text.replace(
`        </section>
      </div>
    </AdminLayout>
  );
}`,
`        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Admin Users
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Tambah admin, buat password, ubah password, dan aktif/nonaktifkan akses admin.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_180px_auto]">
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              value={newAdminUsername}
              onChange={(event) => setNewAdminUsername(event.target.value)}
              placeholder="Username admin"
            />

            <input
              type="password"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              value={newAdminPassword}
              onChange={(event) => setNewAdminPassword(event.target.value)}
              placeholder="Password"
            />

            <select
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              value={newAdminRole}
              onChange={(event) => setNewAdminRole(event.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>

            <button
              onClick={addAdminUser}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Tambah
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
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
                {adminUsersLoading ? (
                  <tr>
                    <td className="px-4 py-4 text-slate-500" colSpan={6}>
                      Loading admin users...
                    </td>
                  </tr>
                ) : adminUsers.length === 0 ? (
                  <tr>
                    <td className="px-4 py-4 text-slate-500" colSpan={6}>
                      Belum ada admin user.
                    </td>
                  </tr>
                ) : (
                  adminUsers.map((user) => (
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
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => changeAdminPassword(user.username)}
                            className="rounded-xl bg-cyan-50 px-3 py-2 font-bold text-cyan-700 hover:bg-cyan-100"
                          >
                            Ubah Password
                          </button>

                          <button
                            onClick={() => toggleAdminActive(user)}
                            className="rounded-xl bg-slate-100 px-3 py-2 font-bold text-slate-700 hover:bg-slate-200"
                          >
                            {user.active ? "Nonaktifkan" : "Aktifkan"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}`
);

fs.writeFileSync(file, text, "utf8");

console.log("✅ Admin Users ditambahkan tanpa menghapus WhatsApp, divisi/posisi, dan level test.");