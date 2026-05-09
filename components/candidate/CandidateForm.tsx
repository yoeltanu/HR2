"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CandidateInfo } from "@/types/candidate";
import {
  clearAssessmentDraft,
  getCandidateDraft,
  saveCandidateDraft
} from "@/lib/storage/localStorageDemo";
import { getActiveLevels, getActivePositions } from "@/lib/storage/adminConfig";
import { validateCandidateInfo } from "@/lib/utils/validation";

const initialForm: CandidateInfo = {
  fullName: "",
  whatsapp: "",
  email: "",
  positionApplied: "",
  domicile: "",
  age: "",
  education: "",
  lastExperience: "",
  source: "",
  assessmentLevel: 1,
  consent: false
};

export default function CandidateForm() {
  const router = useRouter();
  const [form, setForm] = useState<CandidateInfo>(initialForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [customPosition, setCustomPosition] = useState("");
  const [positions, setPositions] = useState(getActivePositions());
  const [levels, setLevels] = useState(getActiveLevels());

  const positionLabels = useMemo(
    () => positions.map((position) => position.label),
    [positions]
  );

  useEffect(() => {
    const existing = getCandidateDraft();

    setPositions(getActivePositions());
    setLevels(getActiveLevels());

    if (existing) {
      const isKnown = positionLabels.includes(existing.positionApplied);

      if (!isKnown && existing.positionApplied) {
        setCustomPosition(existing.positionApplied);
        setForm({
          ...existing,
          positionApplied: "Lainnya"
        });
      } else {
        setForm(existing);
      }
    }
  }, []);

  function update<K extends keyof CandidateInfo>(
    key: K,
    value: CandidateInfo[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  function resetDraft() {
    clearAssessmentDraft();
    setForm(initialForm);
    setCustomPosition("");
    setErrors([]);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();

    const finalForm: CandidateInfo = {
      ...form,
      positionApplied:
        form.positionApplied === "Lainnya"
          ? customPosition.trim()
          : form.positionApplied
    };

    const validation = validateCandidateInfo(finalForm);
    setErrors(validation);

    if (validation.length > 0) return;

    saveCandidateDraft(finalForm);
    router.push("/test/instructions");
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-premium md:p-8"
    >
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-semibold text-cyan-700">
            Data Kandidat
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Isi identitas sebelum mulai assessment
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Pilihan posisi dan level assessment dapat diatur HR melalui Admin
            Settings.
          </p>
        </div>

        <button
          type="button"
          onClick={resetDraft}
          className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
        >
          Reset Draft
        </button>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="mb-2 font-bold">Mohon periksa kembali:</p>
          {errors.map((error) => (
            <p key={error}>• {error}</p>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Nama lengkap*"
          value={form.fullName}
          onChange={(value) => update("fullName", value)}
          placeholder="Contoh: Andi Pratama"
        />

        <Field
          label="Nomor WhatsApp*"
          value={form.whatsapp}
          onChange={(value) => update("whatsapp", value)}
          placeholder="Contoh: 081234567890"
        />

        <Field
          label="Email"
          value={form.email}
          onChange={(value) => update("email", value)}
          placeholder="nama@email.com"
        />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Posisi dilamar*
          </span>

          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
            value={form.positionApplied}
            onChange={(event) => update("positionApplied", event.target.value)}
          >
            <option value="">Pilih posisi</option>
            {positions.map((position) => (
              <option key={position.id} value={position.label}>
                {position.label}
              </option>
            ))}
          </select>
        </label>

        {form.positionApplied === "Lainnya" && (
          <Field
            label="Tulis posisi lainnya*"
            value={customPosition}
            onChange={setCustomPosition}
            placeholder="Contoh: Admin Marketplace"
          />
        )}

        <Field
          label="Domisili"
          value={form.domicile}
          onChange={(value) => update("domicile", value)}
          placeholder="Contoh: Jakarta Barat"
        />

        <Field
          label="Usia"
          value={form.age}
          onChange={(value) => update("age", value)}
          placeholder="Contoh: 24"
        />

        <Field
          label="Pendidikan terakhir"
          value={form.education}
          onChange={(value) => update("education", value)}
          placeholder="Contoh: S1 Akuntansi"
        />

        <Field
          label="Pengalaman kerja terakhir"
          value={form.lastExperience}
          onChange={(value) => update("lastExperience", value)}
          placeholder="Contoh: Admin Online Shop 2 tahun"
        />

        <Field
          label="Sumber kandidat"
          value={form.source}
          onChange={(value) => update("source", value)}
          placeholder="Contoh: Jobstreet, referral, walk-in"
        />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Assessment level*
          </span>

          <select
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
            value={form.assessmentLevel}
            onChange={(event) =>
              update("assessmentLevel", Number(event.target.value) as 1 | 2 | 3)
            }
          >
            {levels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {
              levels.find((level) => level.value === form.assessmentLevel)
                ?.description
            }
          </p>
        </label>
      </div>

      <label className="mt-6 flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => update("consent", event.target.checked)}
          className="mt-1 h-4 w-4"
        />

        <span>
          Saya setuju data digunakan untuk proses assessment HR internal. Saya
          memahami bahwa hasil assessment adalah alat bantu dan bukan satu-satunya
          dasar keputusan rekrutmen.
        </span>
      </label>

      <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        Cognitive Ability Screening pada platform ini bukan tes IQ klinis resmi.
        Soal dibuat original untuk kebutuhan screening internal HR.
      </div>

      <button className="mt-6 w-full rounded-2xl bg-cyan-500 px-6 py-4 font-bold text-navy-950 hover:bg-cyan-400">
        Lanjut ke Instruksi
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = ""
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
