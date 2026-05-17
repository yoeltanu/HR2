"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  createIdFromLabel,
  getAdminConfig,
  resetAdminConfig,
  saveAdminConfig,
  type AssessmentLevelOption,
  type HRAdminConfig,
  type PositionOption
} from "@/lib/storage/adminConfig";
import {
  getDemoAdminSettings,
  saveDemoAdminSettings
} from "@/lib/storage/adminSettings";
import { DEFAULT_WHATSAPP_TEMPLATE } from "@/lib/utils/whatsapp";

export default function SettingsPage() {
  const [config, setConfig] = useState<HRAdminConfig | null>(null);
  const [newPosition, setNewPosition] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState(DEFAULT_WHATSAPP_TEMPLATE);

  useEffect(() => {
    setConfig(getAdminConfig());
    loadWhatsappTemplate();
  }, []);

  async function loadWhatsappTemplate() {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();

      if (data.success && data.settings?.whatsapp_candidate_message_template) {
        setWhatsappTemplate(data.settings.whatsapp_candidate_message_template);
        return;
      }
    } catch {}

    setWhatsappTemplate(
      getDemoAdminSettings().whatsapp_candidate_message_template ||
        DEFAULT_WHATSAPP_TEMPLATE
    );
  }

  function showSaved(message = "Settings berhasil disimpan.") {
    setSavedMessage(message);
    window.setTimeout(() => setSavedMessage(""), 2200);
  }

  function updateConfig(next: HRAdminConfig) {
    setConfig(next);
    saveAdminConfig(next);
    showSaved();
  }

  async function saveWhatsappTemplate() {
    try {
      saveDemoAdminSettings({
        whatsapp_candidate_message_template: whatsappTemplate
      });

      await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          key: "whatsapp_candidate_message_template",
          value: whatsappTemplate
        })
      });

      showSaved("Template WhatsApp berhasil disimpan.");
    } catch {
      showSaved("Template tersimpan di Demo Mode.");
    }
  }

  function addPosition() {
    if (!config) return;

    const label = newPosition.trim();
    if (!label) return;

    const exists = config.positions.some(
      (item) => item.label.toLowerCase() === label.toLowerCase()
    );

    if (exists) {
      alert("Posisi sudah ada.");
      return;
    }

    updateConfig({
      ...config,
      positions: [
        ...config.positions,
        {
          id: createIdFromLabel(label),
          label,
          active: true
        }
      ]
    });

    setNewPosition("");
  }

  function updatePosition(index: number, update: Partial<PositionOption>) {
    if (!config) return;

    updateConfig({
      ...config,
      positions: config.positions.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...update } : item
      )
    });
  }

  function removePosition(index: number) {
    if (!config) return;

    const ok = confirm("Hapus posisi ini dari pilihan kandidat?");
    if (!ok) return;

    updateConfig({
      ...config,
      positions: config.positions.filter((_, itemIndex) => itemIndex !== index)
    });
  }

  function updateLevel(
    value: 1 | 2 | 3,
    update: Partial<AssessmentLevelOption>
  ) {
    if (!config) return;

    updateConfig({
      ...config,
      levels: config.levels.map((level) =>
        level.value === value ? { ...level, ...update } : level
      )
    });
  }

  function handleReset() {
    const ok = confirm("Reset semua settings ke default?");
    if (!ok) return;

    setConfig(resetAdminConfig());
    setWhatsappTemplate(DEFAULT_WHATSAPP_TEMPLATE);
    saveDemoAdminSettings({
      whatsapp_candidate_message_template: DEFAULT_WHATSAPP_TEMPLATE
    });

    showSaved("Settings dikembalikan ke default.");
  }

  if (!config) {
    return (
      <AdminLayout>
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          Memuat settings...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-950">
                Admin Settings
              </h1>
              <p className="mt-2 max-w-3xl text-slate-600">
                HR dapat mengatur pilihan posisi kandidat, label level assessment,
                nomor WhatsApp HR, dan template pesan WhatsApp kandidat.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="rounded-2xl bg-red-50 px-4 py-3 font-bold text-red-700 hover:bg-red-100"
            >
              Reset Default
            </button>
          </div>

          {savedMessage && (
            <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              {savedMessage}
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Catatan: konfigurasi ini berlaku untuk form kandidat pada browser
            yang sama. Untuk produksi multi-admin, konfigurasi sebaiknya
            dipindahkan ke Google Sheets / database.
          </div>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Template Pesan WhatsApp Kandidat
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Placeholder tersedia: {"{nama}"}, {"{posisi}"}, {"{disc_type}"},{" "}
            {"{iq_score}"}, {"{combined_score}"}, {"{tanggal_tes}"}
          </p>

          <textarea
            className="mt-4 min-h-44 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
            value={whatsappTemplate}
            onChange={(event) => setWhatsappTemplate(event.target.value)}
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={saveWhatsappTemplate}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Simpan Template
            </button>

            <button
              onClick={() => setWhatsappTemplate(DEFAULT_WHATSAPP_TEMPLATE)}
              className="rounded-2xl bg-slate-100 px-5 py-3 font-bold text-slate-700 hover:bg-slate-200"
            >
              Reset Template
            </button>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Nomor WhatsApp HR
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Nomor ini dapat ditampilkan sebagai kontak HR internal.
          </p>

          <input
            className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
            value={config.hrWhatsapp}
            onChange={(event) =>
              updateConfig({
                ...config,
                hrWhatsapp: event.target.value
              })
            }
            placeholder="Contoh: 6281234567890"
          />
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Pilihan Posisi Kandidat
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Posisi aktif akan muncul di form kandidat.
          </p>

          <div className="mt-5 flex gap-3">
            <input
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              value={newPosition}
              onChange={(event) => setNewPosition(event.target.value)}
              placeholder="Tambah posisi baru, contoh: Content Creator"
            />
            <button
              onClick={addPosition}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Tambah
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {config.positions.map((position, index) => (
              <div
                key={position.id}
                className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_auto_auto]"
              >
                <input
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                  value={position.label}
                  onChange={(event) =>
                    updatePosition(index, {
                      label: event.target.value
                    })
                  }
                />

                <label className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={position.active}
                    onChange={(event) =>
                      updatePosition(index, {
                        active: event.target.checked
                      })
                    }
                  />
                  Aktif
                </label>

                <button
                  onClick={() => removePosition(index)}
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-100"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Label Level Assessment
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            HR dapat mengubah label dan status aktif level. Nilai level tetap
            1, 2, dan 3 agar scoring tetap aman.
          </p>

          <div className="mt-5 space-y-4">
            {config.levels.map((level) => (
              <div key={level.value} className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-black text-slate-950">
                    Level {level.value}
                  </p>

                  <label className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={level.active}
                      onChange={(event) =>
                        updateLevel(level.value, {
                          active: event.target.checked
                        })
                      }
                    />
                    Aktif
                  </label>
                </div>

                <div className="grid gap-3">
                  <input
                    className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                    value={level.label}
                    onChange={(event) =>
                      updateLevel(level.value, {
                        label: event.target.value
                      })
                    }
                  />

                  <textarea
                    className="min-h-24 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                    value={level.description}
                    onChange={(event) =>
                      updateLevel(level.value, {
                        description: event.target.value
                      })
                    }
                  />

                  <div className="grid gap-3 md:grid-cols-2">
                    <label>
                      <span className="mb-1 block text-xs font-bold uppercase text-slate-500">
                        Durasi menit
                      </span>
                      <input
                        type="number"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                        value={level.durationMinutes}
                        onChange={(event) =>
                          updateLevel(level.value, {
                            durationMinutes: Number(event.target.value)
                          })
                        }
                      />
                    </label>

                    <label>
                      <span className="mb-1 block text-xs font-bold uppercase text-slate-500">
                        Jumlah soal
                      </span>
                      <input
                        type="number"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                        value={level.totalQuestions}
                        onChange={(event) =>
                          updateLevel(level.value, {
                            totalQuestions: Number(event.target.value)
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
