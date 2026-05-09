import AdminLayout from "@/components/layout/AdminLayout";

export default function ManualBookPage() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl bg-navy-950 p-8 text-white shadow-premium">
          <p className="text-sm font-bold uppercase tracking-wide text-cyanx">
            Manual Book HR Staff
          </p>
          <h1 className="mt-3 text-4xl font-black">
            Panduan HR Assessment Platform
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-200">
            Modul ini membantu HR memahami konsep, tujuan, alur assessment,
            cara membaca hasil DISC, Cognitive Ability Screening, Combined
            Score, red flags, dan langkah follow-up interview.
          </p>
        </div>

        <ManualSection title="1. Konsep dan Tujuan Website">
          <p>
            HR Assessment Platform adalah website internal untuk membantu HR
            melakukan screening kandidat secara lebih konsisten, cepat, dan
            terdokumentasi.
          </p>
          <InfoGrid
            items={[
              ["Screening lebih konsisten", "Semua kandidat mengikuti alur dan format assessment yang sama."],
              ["Mengurangi subjektivitas", "HR mendapat data DISC, cognitive score, red flags, dan summary."],
              ["Mempercepat seleksi", "Dashboard membantu HR melihat kandidat prioritas dengan cepat."],
              ["Bahan interview", "Sistem menyediakan interview questions otomatis berdasarkan hasil."]
            ]}
          />
        </ManualSection>

        <ManualSection title="2. Komponen Assessment">
          <InfoGrid
            items={[
              ["DISC Personality Test", "Membaca gaya kerja, komunikasi, stabilitas, ketelitian, dan kecenderungan perilaku kerja."],
              ["Cognitive Ability Screening", "Membaca logika, angka, pemahaman instruksi, pola, dan ketelitian kerja."],
              ["Combined Hiring Score", "Menggabungkan DISC Fit dan Cognitive Fit sesuai bobot posisi."],
              ["Red Flags", "Sinyal yang perlu dikonfirmasi saat interview, bukan vonis otomatis."]
            ]}
          />
        </ManualSection>

        <ManualSection title="3. Level Assessment">
          <Table
            headers={["Level", "Target Posisi", "Jumlah Soal", "Durasi"]}
            rows={[
              ["Level 1", "Staff operasional / admin dasar", "25 soal", "20 menit"],
              ["Level 2", "Specialist / admin senior / accounting staff", "35 soal", "30 menit"],
              ["Level 3", "Supervisor / leader / strategic assistant", "45 soal", "40 menit"]
            ]}
          />
        </ManualSection>

        <ManualSection title="4. Peran HR Staff">
          <Checklist
            title="Sebelum assessment"
            items={[
              "Pastikan posisi kandidat benar.",
              "Pilih assessment level yang sesuai.",
              "Pastikan kandidat memahami durasi dan instruksi.",
              "Kirim link assessment yang benar."
            ]}
          />
          <Checklist
            title="Saat assessment"
            items={[
              "Bantu kendala teknis jika ada.",
              "Jangan memberikan jawaban atau petunjuk soal.",
              "Pastikan kandidat mengerjakan secara mandiri."
            ]}
          />
          <Checklist
            title="Setelah assessment"
            items={[
              "Buka dashboard admin.",
              "Baca detail kandidat.",
              "Cek DISC type, cognitive score, combined score, dan red flags.",
              "Gunakan interview questions untuk konfirmasi."
            ]}
          />
        </ManualSection>

        <ManualSection title="5. Cara Membaca DISC">
          <Table
            headers={["Kode", "Nama", "Karakter Umum"]}
            rows={[
              ["D", "Dominance", "Tegas, cepat mengambil keputusan, target-oriented."],
              ["I", "Influence", "Komunikatif, ekspresif, mudah membangun relasi."],
              ["S", "Steadiness", "Stabil, sabar, konsisten, suportif."],
              ["C", "Conscientiousness", "Teliti, sistematis, analitis, patuh SOP."]
            ]}
          />
          <p>
            DISC type bisa satu huruf seperti C atau kombinasi dua huruf seperti
            CS. Kombinasi dua huruf berarti dua dimensi tertinggi cukup dekat.
          </p>
        </ManualSection>

        <ManualSection title="6. Cara Membaca Cognitive Ability Screening">
          <Table
            headers={["Subtest", "Yang Diukur", "Contoh Kegunaan"]}
            rows={[
              ["Logical", "Logika dan pengambilan kesimpulan", "Prioritas masalah operasional."],
              ["Numerical", "Angka, margin, stok, diskon, ROAS", "Accounting, procurement, marketplace."],
              ["Verbal", "Instruksi dan komunikasi tertulis", "CS, HRGA, admin, reporting."],
              ["Pattern", "Pola dan alur proses", "Warehouse, SOP, problem solving."],
              ["Working Accuracy", "Ketelitian data, invoice, SKU, alamat", "Checker, accounting, packing, inventory."]
            ]}
          />
        </ManualSection>

        <ManualSection title="7. Combined Hiring Score">
          <Table
            headers={["Score", "Rekomendasi", "Tindakan HR"]}
            rows={[
              ["85–100", "Prioritas tinggi", "Lanjut interview sebagai kandidat utama."],
              ["75–84", "Layak lanjut", "Lanjut interview dengan konfirmasi area tertentu."],
              ["65–74", "Perlu konfirmasi", "Interview lebih dalam dan gunakan simulasi kerja."],
              ["50–64", "Cadangan", "Simpan sebagai backup."],
              ["<50", "Tidak prioritas", "Tidak disarankan lanjut kecuali ada alasan kuat."]
            ]}
          />
        </ManualSection>

        <ManualSection title="8. Red Flags">
          <Table
            headers={["Red Flag", "Kemungkinan Makna", "Tindakan HR"]}
            rows={[
              ["Waktu terlalu cepat", "Kandidat terburu-buru atau kurang membaca soal.", "Tanyakan cara kandidat mengerjakan."],
              ["Banyak soal kosong", "Kandidat lambat, ragu, atau kesulitan memahami soal.", "Konfirmasi dengan interview dan simulasi."],
              ["Pola jawaban monoton", "Kemungkinan menebak.", "Tanyakan kendala saat mengerjakan."],
              ["Subtest tidak seimbang", "Ada area kemampuan yang lemah.", "Cocokkan dengan kebutuhan posisi."],
              ["Banyak perubahan jawaban", "Kandidat ragu-ragu.", "Tanyakan cara mengambil keputusan."]
            ]}
          />
        </ManualSection>

        <ManualSection title="9. Panduan Interview">
          <Checklist
            title="Pertanyaan umum"
            items={[
              "Ceritakan situasi kerja yang paling menggambarkan cara Anda bekerja.",
              "Bagaimana Anda menghadapi target yang mendadak naik?",
              "Bagaimana Anda memastikan pekerjaan tidak salah?",
              "Apa yang Anda lakukan jika instruksi atasan berbeda dengan kondisi lapangan?",
              "Bagian mana dari tes yang menurut Anda paling sulit?"
            ]}
          />
        </ManualSection>

        <ManualSection title="10. Etika Penggunaan Assessment">
          <Checklist
            title="Prinsip utama"
            items={[
              "Jangan gunakan hasil assessment sebagai satu-satunya dasar keputusan.",
              "Jangan memberi label negatif permanen berdasarkan DISC.",
              "Gunakan red flags untuk konfirmasi, bukan vonis.",
              "Tetap pertimbangkan interview, pengalaman, referensi, dan simulasi kerja.",
              "Jaga kerahasiaan data kandidat."
            ]}
          />
        </ManualSection>
      </div>
    </AdminLayout>
  );
}

function ManualSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-slate-700">{children}</div>
    </section>
  );
}

function InfoGrid({
  items
}: {
  items: [string, string][];
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(([title, text]) => (
        <div key={title} className="rounded-2xl bg-slate-50 p-4">
          <p className="font-bold text-slate-950">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
        </div>
      ))}
    </div>
  );
}

function Table({
  headers,
  rows
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-navy-950 text-white">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-slate-100">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Checklist({
  title,
  items
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl bg-cyan-50 p-4">
      <p className="font-bold text-cyan-900">{title}</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-cyan-950">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
