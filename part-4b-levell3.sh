#!/usr/bin/env bash
set -e

echo "Installing Part 4B-2 — IQ Level 3 Question Bank..."

mkdir -p lib/iq

cat > lib/iq/iqLevel3Questions.ts <<'EOF'
import type { IQQuestion } from "@/types/iq";

export const iqLevel3Questions: IQQuestion[] = [
  { id:"L3-001", level:3, category:"logical", difficulty:"medium", question:"Jika keterlambatan pengiriman meningkat setelah pergantian jadwal pickup, hipotesis awal yang paling masuk akal adalah?", options:{A:"Jadwal pickup perlu dievaluasi",B:"Semua admin harus diganti",C:"Produk harus dihentikan",D:"Harga harus selalu dinaikkan"}, correctAnswer:"A", explanation:"Perubahan jadwal berkorelasi langsung dengan masalah keterlambatan." },
  { id:"L3-002", level:3, category:"logical", difficulty:"medium", question:"Leader melihat error packing tinggi pada shift malam. Data pertama yang perlu dibandingkan adalah?", options:{A:"Jumlah follower toko",B:"Volume order, jumlah staf, dan jenis error per shift",C:"Warna seragam",D:"Jam buka marketplace"}, correctAnswer:"B", explanation:"Analisa error butuh volume kerja, kapasitas orang, dan jenis kesalahan." },
  { id:"L3-003", level:3, category:"logical", difficulty:"hard", question:"Jika promosi menaikkan order 40% tetapi komplain naik 70%, keputusan terbaik adalah?", options:{A:"Lanjut tanpa perubahan",B:"Evaluasi kapasitas operasional dan kualitas sebelum promosi berikutnya",C:"Matikan semua produk",D:"Abaikan komplain"}, correctAnswer:"B", explanation:"Komplain naik lebih cepat dari order, sehingga kapasitas dan kualitas perlu dievaluasi." },
  { id:"L3-004", level:3, category:"logical", difficulty:"hard", question:"Dua supplier punya harga sama. Supplier A tepat waktu 95%, B tepat waktu 75%. Untuk produk fast moving, pilihan awal?", options:{A:"Supplier A",B:"Supplier B",C:"Acak",D:"Tidak membeli stok"}, correctAnswer:"A", explanation:"Produk fast moving membutuhkan reliabilitas suplai tinggi." },
  { id:"L3-005", level:3, category:"logical", difficulty:"medium", question:"Jika KPI utama CS adalah first response time dan resolusi, maka laporan harian harus memuat?", options:{A:"Jumlah chat masuk, waktu respons, status selesai",B:"Warna chat",C:"Jumlah meja",D:"Nama semua pesaing"}, correctAnswer:"A", explanation:"KPI harus dilaporkan dengan data yang relevan." },
  { id:"L3-006", level:3, category:"logical", difficulty:"hard", question:"Jika stok mati mengikat cashflow, langkah prioritas paling rasional adalah?", options:{A:"Analisa umur stok, margin, dan opsi bundling/promo",B:"Membeli stok baru lebih banyak",C:"Menghapus laporan",D:"Menunggu tanpa batas waktu"}, correctAnswer:"A", explanation:"Stok mati perlu dianalisa dan dicairkan dengan strategi." },
  { id:"L3-007", level:3, category:"logical", difficulty:"hard", question:"Tim meminta tambahan orang, tetapi produktivitas per orang turun. Respons leader yang tepat adalah?", options:{A:"Langsung rekrut tanpa analisa",B:"Audit proses, bottleneck, dan standar produktivitas",C:"Menurunkan target tanpa alasan",D:"Mengabaikan tim"}, correctAnswer:"B", explanation:"Produktivitas turun perlu audit proses sebelum menambah orang." },
  { id:"L3-008", level:3, category:"logical", difficulty:"medium", question:"Jika satu SKU sering oversold, akar masalah paling mungkin berada pada?", options:{A:"Sinkronisasi stok dan update marketplace",B:"Logo perusahaan",C:"Warna kardus",D:"Jam makan siang customer"}, correctAnswer:"A", explanation:"Oversold berkaitan dengan data stok dan sinkronisasi marketplace." },
  { id:"L3-009", level:3, category:"logical", difficulty:"hard", question:"Jika target sales tercapai tetapi profit turun, fokus analisa berikutnya adalah?", options:{A:"Margin, diskon, biaya iklan, dan biaya operasional",B:"Jumlah kursi kantor",C:"Warna feed",D:"Jumlah hari libur nasional saja"}, correctAnswer:"A", explanation:"Profit dipengaruhi margin dan biaya, bukan hanya sales." },
  { id:"L3-010", level:3, category:"logical", difficulty:"hard", question:"Saat order meningkat mendadak, keputusan leader terbaik adalah?", options:{A:"Prioritaskan SLA, alokasi orang, dan monitoring bottleneck",B:"Menunda semua order",C:"Mengubah SOP tanpa komunikasi",D:"Menghapus chat customer"}, correctAnswer:"A", explanation:"Lonjakan order perlu prioritas SLA, alokasi sumber daya, dan monitoring hambatan." },

  { id:"L3-011", level:3, category:"numerical", difficulty:"medium", question:"Sales Rp50.000.000, COGS Rp32.000.000. Gross profit adalah?", options:{A:"Rp16.000.000",B:"Rp18.000.000",C:"Rp20.000.000",D:"Rp22.000.000"}, correctAnswer:"B", explanation:"Rp50.000.000 - Rp32.000.000 = Rp18.000.000." },
  { id:"L3-012", level:3, category:"numerical", difficulty:"medium", question:"Gross profit Rp18.000.000 dari sales Rp50.000.000. Gross margin adalah?", options:{A:"32%",B:"34%",C:"36%",D:"40%"}, correctAnswer:"C", explanation:"Rp18.000.000 / Rp50.000.000 = 36%." },
  { id:"L3-013", level:3, category:"numerical", difficulty:"medium", question:"Biaya iklan Rp4.000.000 menghasilkan sales Rp24.000.000. ROAS adalah?", options:{A:"4x",B:"5x",C:"6x",D:"8x"}, correctAnswer:"C", explanation:"ROAS = Rp24.000.000 / Rp4.000.000 = 6x." },
  { id:"L3-014", level:3, category:"numerical", difficulty:"hard", question:"Order naik dari 800 ke 1.000. Persentase kenaikan adalah?", options:{A:"20%",B:"25%",C:"30%",D:"35%"}, correctAnswer:"B", explanation:"Kenaikan 200 dari basis 800 = 25%." },
  { id:"L3-015", level:3, category:"numerical", difficulty:"hard", question:"Error packing turun dari 5% ke 3%. Penurunan relatif adalah?", options:{A:"20%",B:"30%",C:"40%",D:"50%"}, correctAnswer:"C", explanation:"Turun 2 poin dari basis 5%, yaitu 2/5 = 40%." },
  { id:"L3-016", level:3, category:"numerical", difficulty:"medium", question:"Tim A memproses 480 paket dengan 6 orang. Produktivitas per orang adalah?", options:{A:"60",B:"70",C:"80",D:"90"}, correctAnswer:"C", explanation:"480 / 6 = 80 paket per orang." },
  { id:"L3-017", level:3, category:"numerical", difficulty:"hard", question:"Jika SLA minimal 95% dan terkirim tepat waktu 912 dari 960 paket, SLA adalah?", options:{A:"93%",B:"94%",C:"95%",D:"96%"}, correctAnswer:"C", explanation:"912 / 960 = 95%." },
  { id:"L3-018", level:3, category:"numerical", difficulty:"hard", question:"Produk A margin 30%, sales Rp20 juta. Produk B margin 20%, sales Rp30 juta. Profit kotor lebih besar?", options:{A:"Produk A",B:"Produk B",C:"Sama",D:"Tidak bisa dihitung"}, correctAnswer:"C", explanation:"A = 30% x 20 juta = 6 juta. B = 20% x 30 juta = 6 juta." },
  { id:"L3-019", level:3, category:"numerical", difficulty:"hard", question:"Stok 1.200 pcs, rata-rata terjual 80 pcs/hari. Estimasi habis dalam?", options:{A:"10 hari",B:"12 hari",C:"15 hari",D:"18 hari"}, correctAnswer:"C", explanation:"1.200 / 80 = 15 hari." },
  { id:"L3-020", level:3, category:"numerical", difficulty:"medium", question:"Dari 2.500 chat, 2.000 terjawab di bawah target waktu. Persentasenya?", options:{A:"75%",B:"80%",C:"85%",D:"90%"}, correctAnswer:"B", explanation:"2.000 / 2.500 = 80%." },
  { id:"L3-021", level:3, category:"numerical", difficulty:"hard", question:"Jika cost per order Rp12.000 dan target maksimal Rp10.000, perlu penurunan berapa persen dari kondisi saat ini?", options:{A:"12,5%",B:"16,67%",C:"20%",D:"25%"}, correctAnswer:"B", explanation:"Penurunan Rp2.000 dari Rp12.000 = 16,67%." },
  { id:"L3-022", level:3, category:"numerical", difficulty:"hard", question:"Budget Rp15 juta dibagi 3 channel dengan rasio 2:2:1. Channel ketiga mendapat?", options:{A:"Rp2 juta",B:"Rp3 juta",C:"Rp4 juta",D:"Rp5 juta"}, correctAnswer:"B", explanation:"Total rasio 5. Channel ketiga 1/5 x Rp15 juta = Rp3 juta." },

  { id:"L3-023", level:3, category:"verbal", difficulty:"medium", question:"Pernyataan paling tepat untuk laporan manajemen adalah?", options:{A:"Semua kacau.",B:"SLA turun dari 97% ke 92% karena backlog pickup meningkat 180 paket.",C:"Tim kurang semangat saja.",D:"Tidak ada data."}, correctAnswer:"B", explanation:"Laporan manajemen harus jelas, terukur, dan menyebut indikasi penyebab." },
  { id:"L3-024", level:3, category:"verbal", difficulty:"medium", question:"Makna 'bottleneck' dalam operasional adalah?", options:{A:"Titik hambatan proses",B:"Diskon khusus",C:"Nama supplier",D:"Kode voucher"}, correctAnswer:"A", explanation:"Bottleneck adalah titik yang menghambat alur proses." },
  { id:"L3-025", level:3, category:"verbal", difficulty:"hard", question:"Instruksi: 'Prioritaskan keputusan yang berdampak pada cashflow dan SLA.' Artinya?", options:{A:"Dahulukan isu yang memengaruhi uang dan ketepatan layanan",B:"Dahulukan desain banner",C:"Dahulukan chat santai",D:"Abaikan operasional"}, correctAnswer:"A", explanation:"Cashflow dan SLA adalah dampak bisnis utama." },
  { id:"L3-026", level:3, category:"verbal", difficulty:"medium", question:"Kalimat feedback leader yang paling konstruktif adalah?", options:{A:"Kamu selalu salah.",B:"Di laporan kemarin ada 3 data kosong, tolong gunakan checklist sebelum submit.",C:"Kerja kamu jelek.",D:"Saya tidak mau bahas data."}, correctAnswer:"B", explanation:"Feedback konstruktif menyebut fakta dan tindakan perbaikan." },
  { id:"L3-027", level:3, category:"verbal", difficulty:"hard", question:"Makna 'trade-off' dalam keputusan bisnis adalah?", options:{A:"Konsekuensi memilih satu hal dibanding hal lain",B:"Menghapus semua risiko",C:"Diskon wajib",D:"Menunda keputusan selamanya"}, correctAnswer:"A", explanation:"Trade-off berarti ada konsekuensi saat memilih satu opsi dibanding opsi lain." },
  { id:"L3-028", level:3, category:"verbal", difficulty:"medium", question:"Kata paling dekat dengan 'akurat' adalah?", options:{A:"Tepat",B:"Cepat saja",C:"Ragu",D:"Acak"}, correctAnswer:"A", explanation:"Akurat berarti tepat." },
  { id:"L3-029", level:3, category:"verbal", difficulty:"hard", question:"Pernyataan paling objektif untuk evaluasi campaign adalah?", options:{A:"Campaign ini terasa bagus.",B:"ROAS campaign turun dari 5,2x ke 3,8x saat CPC naik 25%.",C:"Saya suka desainnya.",D:"Kompetitor pasti curang."}, correctAnswer:"B", explanation:"Evaluasi objektif berbasis metrik dan perubahan angka." },
  { id:"L3-030", level:3, category:"verbal", difficulty:"medium", question:"Makna 'eskalasi' dalam layanan pelanggan adalah?", options:{A:"Menaikkan masalah ke pihak yang lebih berwenang",B:"Menghapus tiket",C:"Membalas seadanya",D:"Memberi diskon otomatis"}, correctAnswer:"A", explanation:"Eskalasi berarti membawa isu ke level penanganan lebih tinggi." },

  { id:"L3-031", level:3, category:"pattern", difficulty:"medium", question:"Pola: 4, 8, 16, 32, ...", options:{A:"48",B:"56",C:"64",D:"72"}, correctAnswer:"C", explanation:"Setiap angka dikali 2." },
  { id:"L3-032", level:3, category:"pattern", difficulty:"hard", question:"Pola: 1, 4, 9, 16, 25, ...", options:{A:"30",B:"36",C:"40",D:"49"}, correctAnswer:"B", explanation:"Pola bilangan kuadrat: 1², 2², 3², 4², 5², berikutnya 6² = 36." },
  { id:"L3-033", level:3, category:"pattern", difficulty:"hard", question:"Pola: 2, 6, 12, 20, 30, ...", options:{A:"38",B:"40",C:"42",D:"44"}, correctAnswer:"C", explanation:"Selisih +4, +6, +8, +10, berikutnya +12. Jadi 42." },
  { id:"L3-034", level:3, category:"pattern", difficulty:"medium", question:"Kode batch: A-01, C-02, E-03, G-04, ...", options:{A:"H-05",B:"I-05",C:"J-05",D:"K-06"}, correctAnswer:"B", explanation:"Huruf meloncat satu dan angka bertambah satu." },
  { id:"L3-035", level:3, category:"pattern", difficulty:"hard", question:"Pola sales: 10, 15, 25, 40, 60, ...", options:{A:"75",B:"80",C:"85",D:"90"}, correctAnswer:"C", explanation:"Selisih +5, +10, +15, +20, berikutnya +25. Jadi 85." },
  { id:"L3-036", level:3, category:"pattern", difficulty:"hard", question:"Urutan problem solving: Identifikasi masalah → Kumpulkan data → Analisa akar masalah → ...", options:{A:"Implementasi solusi dan monitoring",B:"Hapus semua data",C:"Salahkan individu",D:"Tunda tanpa batas"}, correctAnswer:"A", explanation:"Setelah analisa, solusi diimplementasikan dan dimonitor." },
  { id:"L3-037", level:3, category:"pattern", difficulty:"medium", question:"Pola kode PO: PO-2026-001, PO-2026-002, PO-2026-003, ...", options:{A:"PO-2025-004",B:"PO-2026-004",C:"PR-2026-004",D:"PO-2026-000"}, correctAnswer:"B", explanation:"Nomor urut bertambah satu dengan prefix sama." },
  { id:"L3-038", level:3, category:"pattern", difficulty:"hard", question:"Pola: 81, 27, 9, 3, ...", options:{A:"0",B:"1",C:"2",D:"6"}, correctAnswer:"B", explanation:"Setiap angka dibagi 3." },

  { id:"L3-039", level:3, category:"workingAccuracy", difficulty:"medium", question:"Data target: MKT-ROAS-0526. Mana yang berbeda?", options:{A:"MKT-ROAS-0526",B:"MKT-ROAS-0526",C:"MKT-RAOS-0526",D:"MKT-ROAS-0526"}, correctAnswer:"C", explanation:"RAOS berbeda urutan huruf dari ROAS." },
  { id:"L3-040", level:3, category:"workingAccuracy", difficulty:"medium", question:"Rekening tertulis 7821-0098-4431. Input benar adalah?", options:{A:"7821-0098-4431",B:"7821-0089-4431",C:"7821-0098-4341",D:"7821-0980-4431"}, correctAnswer:"A", explanation:"A sama persis dengan data target." },
  { id:"L3-041", level:3, category:"workingAccuracy", difficulty:"hard", question:"Invoice: 18 pcs x Rp37.500. Total benar?", options:{A:"Rp650.000",B:"Rp660.000",C:"Rp675.000",D:"Rp685.000"}, correctAnswer:"C", explanation:"Rp37.500 x 18 = Rp675.000." },
  { id:"L3-042", level:3, category:"workingAccuracy", difficulty:"hard", question:"Data sistem: SKU-BNDL-09-XL. Mana yang typo?", options:{A:"SKU-BNDL-09-XL",B:"SKU-BDNL-09-XL",C:"SKU-BNDL-09-XL",D:"SKU-BNDL-09-XL"}, correctAnswer:"B", explanation:"BDNL berbeda dari BNDL." },
  { id:"L3-043", level:3, category:"workingAccuracy", difficulty:"medium", question:"Total cash system Rp12.875.000. Input mana yang benar?", options:{A:"Rp12.785.000",B:"Rp12.875.000",C:"Rp12.857.000",D:"Rp12.870.500"}, correctAnswer:"B", explanation:"B sama persis dengan data target." },
  { id:"L3-044", level:3, category:"workingAccuracy", difficulty:"hard", question:"PO berisi 24 karton, tiap karton 18 pcs. Total pcs adalah?", options:{A:"402",B:"422",C:"432",D:"442"}, correctAnswer:"C", explanation:"24 x 18 = 432 pcs." },
  { id:"L3-045", level:3, category:"workingAccuracy", difficulty:"hard", question:"Alamat target: Komplek Nusa Indah Blok E7 No. 14. Mana yang salah?", options:{A:"Komplek Nusa Indah Blok E7 No. 14",B:"Komplek Nusa Indah Blok E7 No. 14",C:"Komplek Nusa Indah Blok F7 No. 14",D:"Komplek Nusa Indah Blok E7 No. 14"}, correctAnswer:"C", explanation:"Blok F7 berbeda dari E7." }
];
EOF

node <<'NODE'
const fs = require("fs");

const file = "lib/iq/iqQuestions.ts";
let text = fs.readFileSync(file, "utf8");

if (!text.includes('import { iqLevel3Questions } from "./iqLevel3Questions";')) {
  text = text.replace(
    'import type { IQCategory, IQDifficulty, IQOptionKey, IQQuestion } from "@/types/iq";',
    'import type { IQCategory, IQDifficulty, IQOptionKey, IQQuestion } from "@/types/iq";\nimport { iqLevel3Questions } from "./iqLevel3Questions";'
  );
}

if (!text.includes("...iqLevel3Questions")) {
  const needle = "\n];\n\nexport function getIQQuestionsByLevel";
  if (!text.includes(needle)) {
    throw new Error("Cannot find iqQuestions array ending.");
  }

  text = text.replace(
    needle,
    ",\n  ...iqLevel3Questions\n];\n\nexport function getIQQuestionsByLevel"
  );
}

fs.writeFileSync(file, text);
NODE

cat >> README.md <<'EOF'

---

## Part 4B-2 — IQ Level 3 Question Bank

Fitur yang ditambahkan:
- Level 3 lengkap 45 soal.
- Distribusi:
  - Logical Reasoning: 10 soal
  - Numerical Reasoning: 12 soal
  - Verbal Reasoning: 8 soal
  - Pattern Reasoning: 8 soal
  - Working Accuracy: 7 soal
- Konteks:
  - supervisor
  - leader
  - strategic assistant
  - head division
  - problem solving
  - prioritas kerja
  - data reasoning
  - keputusan bisnis
  - analisa sederhana

Test cepat:
1. Buka `/test/start`.
2. Pilih Assessment Level 3.
3. Selesaikan DISC.
4. Masuk IQ.
5. Pastikan jumlah soal IQ adalah 45.
6. Submit final.
EOF

echo ""
echo "✅ Part 4B-2 selesai."
echo ""
echo "Jalankan:"
echo "npm run dev"
echo ""
echo "Test Level 3:"
echo "/test/start -> pilih Level 3"