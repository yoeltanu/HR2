const fs = require("fs");

const file = "app/admin/settings/page.tsx";

let content = fs.readFileSync(file, "utf8");

if (content.includes("Template Pesan WhatsApp Kandidat")) {
  console.log("Section template WhatsApp sudah ada.");
  process.exit(0);
}

const section = `
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
            value={settings.whatsapp_candidate_message_template || ""}
            onChange={(event) =>
              updateField(
                "whatsapp_candidate_message_template",
                event.target.value
              )
            }
          />

          <p className="mt-3 text-sm text-slate-500">
            Contoh:
            <br />
            Halo {"{nama}"}, terima kasih sudah mengikuti assessment untuk posisi
            {" {posisi}"}. Tim HR akan menghubungi Anda kembali jika sesuai.
          </p>
        </section>
`;

const marker = `
      </div>
    </AdminLayout>
  );
}
`;

if (!content.includes(marker)) {
  console.log("Marker tidak ditemukan. Struktur file berbeda.");
  process.exit(1);
}

content = content.replace(marker, section + marker);

fs.writeFileSync(file, content, "utf8");

console.log("✅ Form template WhatsApp berhasil ditambahkan ke Settings.");