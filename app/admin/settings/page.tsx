"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  ASSESSMENT_CONFIG_KEY,
  createIdFromLabel,
  defaultAdminConfig,
  getAdminConfig,
  parseAdminConfigValue,
  saveAdminConfig,
  serializeAdminConfig,
  type AssessmentLevelOption,
  type HRAdminConfig,
  type PositionOption
} from "@/lib/storage/adminConfig";
import {
  getDemoAdminSettings,
  saveDemoAdminSettings
} from "@/lib/storage/adminSettings";
import { getIQQuestionCountByLevel } from "@/lib/iq/iqQuestions";
import { hasDiscPositionProfile } from "@/lib/disc/discPositionProfiles";
import { hasIQPositionProfile } from "@/lib/iq/iqPositionThresholds";
import { DEFAULT_WHATSAPP_TEMPLATE } from "@/lib/utils/whatsapp";

export default function SettingsPage() {
  const [config, setConfig] = useState<HRAdminConfig | null>(null);
  const [newPosition, setNewPosition] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [migrationNotice, setMigrationNotice] = useState("");
  const [dirty, setDirty] = useState(false);
  const [savingAssessment, setSavingAssessment] = useState(false);
  const [whatsappTemplate, setWhatsappTemplate] = useState(
    DEFAULT_WHATSAPP_TEMPLATE
  );

  useEffect(() => {
    loadAssessmentConfig();
    loadWhatsappTemplate();
  }, []);

  async function loadAssessmentConfig() {
    try {
      const response = await fetch("/api/settings", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal mengambil settings global.");
      }

      const rawConfig = data.settings?.[ASSESSMENT_CONFIG_KEY];

      if (rawConfig) {
        const next = parseAdminConfigValue(rawConfig);
        setConfig(next);
        saveAdminConfig(next);
        setDirty(false);
        setMigrationNotice("");
      } else {
        const localConfig = getAdminConfig();
        setConfig(localConfig);
        setDirty(true);
        setMigrationNotice(
          "Konfigurasi global belum pernah dipublish. Konfigurasi lokal browser ini dimuat sebagai migrasi awal. Klik Simpan Settings Global agar kandidat di semua device memakai konfigurasi yang sama."
        );
      }

      setLoadError("");
    } catch (error) {
      setConfig(getAdminConfig());
      setDirty(true);
      setLoadError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil settings global."
      );
    }
  }

  async function loadWhatsappTemplate() {
    try {
      const response = await fetch("/api/settings", { cache: "no-store" });
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
    window.setTimeout(() => setSavedMessage(""), 3000);
  }

  function updateConfig(next: HRAdminConfig) {
    setConfig(next);
    setDirty(true);
    setSavedMessage("");
  }

  async function saveAssessmentConfig() {
    if (!config || savingAssessment) return;

    setSavingAssessment(true);

    try {
      const next = parseAdminConfigValue({
        ...config,
        updatedAt: new Date().toISOString()
      });

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          key: ASSESSMENT_CONFIG_KEY,
          value: serializeAdminConfig(next)
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal menyimpan settings global.");
      }

      saveAdminConfig(next);
      setConfig(next);
      setDirty(false);
      setLoadError("");
      setMigrationNotice("");
      showSaved("Settings assessment berhasil dipublish ke semua kandidat.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan settings global."
      );
    } finally {
      setSavingAssessment(false);
    }
  }

  async function saveWhatsappTemplate() {
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          key: "whatsapp_candidate_message_template",
          value: whatsappTemplate
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal menyimpan template WhatsApp.");
      }

      saveDemoAdminSettings({
        whatsapp_candidate_message_template: whatsappTemplate
      });
      showSaved("Template WhatsApp berhasil disimpan.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan template WhatsApp."
      );
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
      alert("Divisi / posisi sudah ada.");
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

    const ok = confirm("Hapus divisi / posisi ini dari pilihan kandidat?");
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

  function handleResetAssessment() {
    const ok = confirm(
      "Muat konfigurasi assessment default? Perubahan belum dipublish sampai Anda menekan Simpan Settings Global."
    );
    if (!ok) return;

    updateConfig(
      parseAdminConfigValue({
        ...defaultAdminConfig,
        updatedAt: config?.updatedAt || ""
      })
    );
    showSaved("Default dimuat. Klik Simpan Settings Global untuk publish.");
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

  const activePositionCount = config.positions.filter(
    (position) => position.active
  ).length;
  const activeLevelCount = config.levels.filter((level) => level.active).length;

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
                Kelola template WhatsApp, nomor HR, divisi / posisi kandidat,
                dan level assessment.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleResetAssessment}
                className="rounded-2xl bg-red-50 px-4 py-3 font-bold text-red-700 hover:bg-red-100"
              >
                Reset Assessment Default
              </button>

              <button
                onClick={saveAssessmentConfig}
                disabled={!dirty || savingAssessment}
                className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingAssessment ? "Menyimpan..." : "Simpan Settings Global"}
              </button>
            </div>
          </div>

          {dirty && (
            <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">
              Ada perubahan yang belum dipublish. Kandidat masih memakai settings
              global terakhir sampai tombol Simpan Settings Global ditekan.
            </p>
          )}

          {migrationNotice && (
            <p className="mt-4 rounded-2xl bg-cyan-50 p-4 text-sm leading-6 text-cyan-900">
              {migrationNotice}
            </p>
          )}

          {loadError && (
            <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Gagal memuat settings global: {loadError}. Konfigurasi lokal browser
              ditampilkan sementara. Jangan anggap perubahan tersimpan sebelum
              proses save global berhasil.
            </p>
          )}

          {savedMessage && (
            <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              {savedMessage}
            </p>
          )}
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
          <p className="mt-2 text-xs text-slate-500">
            Nomor ini ikut dipublish melalui tombol Simpan Settings Global.
          </p>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Konfigurasi Divisi / Posisi Kandidat
          </h2>

          {activePositionCount === 0 && (
            <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              Tidak ada posisi aktif. Kandidat tidak akan dapat memulai assessment
              setelah konfigurasi ini dipublish.
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <input
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
              value={newPosition}
              onChange={(event) => setNewPosition(event.target.value)}
              placeholder="Tambah divisi / posisi"
            />

            <button
              onClick={addPosition}
              className="rounded-2xl bg-cyan-500 px-5 py-3 font-bold text-navy-950 hover:bg-cyan-400"
            >
              Tambah
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {config.positions.map((position, index) => {
              const hasScoringProfile =
                position.label === "Lainnya" ||
                (hasDiscPositionProfile(position.label) &&
                  hasIQPositionProfile(position.label));

              return (
                <div
                  key={position.id}
                  className="rounded-2xl bg-slate-50 p-4"
                >
                  <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
                    <input
                      className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                      value={position.label}
                      onChange={(event) =>
                        updatePosition(index, { label: event.target.value })
                      }
                    />

                    <label className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={position.active}
                        onChange={(event) =>
                          updatePosition(index, { active: event.target.checked })
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

                  {!hasScoringProfile && (
                    <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
                      Posisi ini belum memiliki scoring profile khusus. Jika tetap
                      digunakan, hasil kandidat akan diberi warning bahwa scoring
                      memakai fallback Accounting.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            Konfigurasi Level Test
          </h2>

          {activeLevelCount === 0 && (
            <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              Tidak ada assessment level aktif. Kandidat tidak akan dapat memulai
              assessment setelah konfigurasi ini dipublish.
            </p>
          )}

          <div className="mt-5 space-y-4">
            {config.levels.map((level) => {
              const availableQuestions = getIQQuestionCountByLevel(level.value);
              const exceedsQuestionBank =
                level.totalQuestions > availableQuestions;

              return (
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
                          min={1}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                          value={level.durationMinutes}
                          onChange={(event) =>
                            updateLevel(level.value, {
                              durationMinutes: Math.max(
                                1,
                                Number(event.target.value) || 1
                              )
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
                          min={1}
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
                          value={level.totalQuestions}
                          onChange={(event) =>
                            updateLevel(level.value, {
                              totalQuestions: Math.max(
                                1,
                                Number(event.target.value) || 1
                              )
                            })
                          }
                        />
                      </label>
                    </div>

                    <p className="text-xs text-slate-500">
                      Question bank tersedia: {availableQuestions} soal.
                    </p>

                    {exceedsQuestionBank && (
                      <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
                        Jumlah soal yang diminta ({level.totalQuestions}) melebihi
                        question bank ({availableQuestions}). Kandidat akan
                        menerima maksimal {availableQuestions} soal sampai bank
                        soal ditambah.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
