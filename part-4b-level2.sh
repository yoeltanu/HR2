#!/usr/bin/env bash
set -e

echo "Installing Part 4B-1 — IQ Level 2 Question Bank..."

python3 <<'PY'
from pathlib import Path

path = Path("lib/iq/iqQuestions.ts")
text = path.read_text()

if "L2-001" in text:
    print("Level 2 questions already installed. Skipping.")
    raise SystemExit

level2 = r''',
  q(
    "L2-001",
    2,
    "logical",
    "easy",
    "Jika produk dengan margin rendah harus dipromosikan hanya saat stok menumpuk, produk A margin rendah dan stok menumpuk. Keputusan yang paling logis?",
    {
      A: "Promosikan produk A",
      B: "Hapus produk A",
      C: "Naikkan ongkir semua produk",
      D: "Abaikan data stok"
    },
    "A",
    "Kondisi margin rendah dan stok menumpuk memenuhi syarat promosi."
  ),
  q(
    "L2-002",
    2,
    "logical",
    "medium",
    "Pesanan prioritas adalah yang sudah dibayar dan deadline kirim hari ini. Pesanan X sudah dibayar dan deadline hari ini. Status X adalah?",
    {
      A: "Prioritas",
      B: "Tidak valid",
      C: "Retur",
      D: "Arsip"
    },
    "A",
    "X memenuhi dua syarat prioritas."
  ),
  q(
    "L2-003",
    2,
    "logical",
    "medium",
    "Jika supplier terlambat lebih dari 3 kali, perlu evaluasi. Supplier B terlambat 4 kali. Apa yang tepat?",
    {
      A: "Evaluasi supplier B",
      B: "Naikkan budget iklan",
      C: "Tutup toko",
      D: "Abaikan karena hanya data"
    },
    "A",
    "4 kali lebih dari batas 3 kali."
  ),
  q(
    "L2-004",
    2,
    "logical",
    "medium",
    "Admin menemukan selisih kas dan invoice. Urutan terbaik adalah?",
    {
      A: "Posting promo",
      B: "Cek invoice, cek bukti bayar, catat selisih",
      C: "Langsung menyalahkan kurir",
      D: "Mengubah semua data"
    },
    "B",
    "Pengecekan harus berbasis dokumen dan pencatatan."
  ),
  q(
    "L2-005",
    2,
    "logical",
    "hard",
    "Jika ROAS turun saat biaya iklan naik dan order tetap, kemungkinan masalah utama adalah?",
    {
      A: "Efisiensi iklan menurun",
      B: "Stok pasti hilang",
      C: "Packing terlalu cepat",
      D: "Nama produk terlalu pendek pasti benar"
    },
    "A",
    "Biaya naik tanpa order bertambah menurunkan efisiensi iklan."
  ),
  q(
    "L2-006",
    2,
    "logical",
    "medium",
    "Produk retur yang rusak tidak boleh masuk stok jual. Produk Y rusak. Maka Y harus?",
    {
      A: "Masuk stok jual",
      B: "Dipisahkan dari stok jual",
      C: "Diberi label best seller",
      D: "Dikirim ke customer lain"
    },
    "B",
    "Barang rusak tidak boleh dijual sebagai stok normal."
  ),
  q(
    "L2-007",
    2,
    "logical",
    "hard",
    "Jika satu keputusan memengaruhi stok, cashflow, dan rating toko, keputusan tersebut sebaiknya?",
    {
      A: "Dibuat tanpa data",
      B: "Dibahas dengan data lintas fungsi",
      C: "Diserahkan ke customer",
      D: "Ditunda tanpa alasan"
    },
    "B",
    "Dampak lintas fungsi perlu data lintas fungsi."
  ),
  q(
    "L2-008",
    2,
    "logical",
    "medium",
    "Jika semua komplain pengiriman harus punya nomor resi, komplain Z tanpa resi harus?",
    {
      A: "Tetap diproses normal",
      B: "Diminta nomor resi atau data pendukung",
      C: "Langsung refund tanpa cek",
      D: "Dihapus"
    },
    "B",
    "Nomor resi atau data pendukung dibutuhkan untuk validasi."
  ),
  q(
    "L2-009",
    2,
    "numerical",
    "easy",
    "Harga jual Rp120.000, modal Rp80.000. Margin kotor rupiah adalah?",
    {
      A: "Rp30.000",
      B: "Rp40.000",
      C: "Rp50.000",
      D: "Rp60.000"
    },
    "B",
    "Rp120.000 - Rp80.000 = Rp40.000."
  ),
  q(
    "L2-010",
    2,
    "numerical",
    "medium",
    "Modal Rp75.000, harga jual Rp100.000. Margin terhadap harga jual adalah?",
    {
      A: "20%",
      B: "25%",
      C: "30%",
      D: "35%"
    },
    "B",
    "Keuntungan Rp25.000 / Rp100.000 = 25%."
  ),
  q(
    "L2-011",
    2,
    "numerical",
    "medium",
    "Budget iklan Rp500.000 menghasilkan sales Rp2.000.000. ROAS adalah?",
    {
      A: "2x",
      B: "3x",
      C: "4x",
      D: "5x"
    },
    "C",
    "ROAS = sales / budget = Rp2.000.000 / Rp500.000 = 4x."
  ),
  q(
    "L2-012",
    2,
    "numerical",
    "medium",
    "Stok awal 300, masuk 80, keluar 125. Stok akhir adalah?",
    {
      A: "245",
      B: "255",
      C: "265",
      D: "275"
    },
    "B",
    "300 + 80 - 125 = 255."
  ),
  q(
    "L2-013",
    2,
    "numerical",
    "medium",
    "Diskon 15% dari Rp200.000 adalah?",
    {
      A: "Rp20.000",
      B: "Rp25.000",
      C: "Rp30.000",
      D: "Rp35.000"
    },
    "C",
    "15% x Rp200.000 = Rp30.000."
  ),
  q(
    "L2-014",
    2,
    "numerical",
    "hard",
    "Jika conversion rate 2% dari 5.000 pengunjung, jumlah order adalah?",
    {
      A: "50",
      B: "75",
      C: "100",
      D: "125"
    },
    "C",
    "2% x 5.000 = 100."
  ),
  q(
    "L2-015",
    2,
    "numerical",
    "hard",
    "Supplier memberi harga Rp48.000. Target margin rupiah minimal Rp12.000. Harga jual minimal adalah?",
    {
      A: "Rp54.000",
      B: "Rp58.000",
      C: "Rp60.000",
      D: "Rp64.000"
    },
    "C",
    "Rp48.000 + Rp12.000 = Rp60.000."
  ),
  q(
    "L2-016",
    2,
    "numerical",
    "medium",
    "Dari 240 pesanan, 12 retur. Persentase retur adalah?",
    {
      A: "3%",
      B: "4%",
      C: "5%",
      D: "6%"
    },
    "C",
    "12 / 240 x 100% = 5%."
  ),
  q(
    "L2-017",
    2,
    "numerical",
    "hard",
    "Target 1.200 paket per minggu. Dalam 5 hari kerja, rata-rata paket per hari adalah?",
    {
      A: "200",
      B: "220",
      C: "240",
      D: "260"
    },
    "C",
    "1.200 / 5 = 240 paket per hari."
  ),
  q(
    "L2-018",
    2,
    "numerical",
    "medium",
    "Harga Rp150.000 naik 10%. Harga baru adalah?",
    {
      A: "Rp155.000",
      B: "Rp160.000",
      C: "Rp165.000",
      D: "Rp170.000"
    },
    "C",
    "10% dari Rp150.000 adalah Rp15.000, sehingga harga baru Rp165.000."
  ),
  q(
    "L2-019",
    2,
    "verbal",
    "easy",
    "Kalimat laporan paling tepat untuk atasan adalah?",
    {
      A: "Kayaknya masalahnya banyak.",
      B: "Ada 18 pesanan terlambat karena pickup kurir mundur dari jadwal.",
      C: "Pokoknya kurir salah.",
      D: "Saya lupa detailnya."
    },
    "B",
    "Laporan jelas berisi jumlah dan penyebab."
  ),
  q(
    "L2-020",
    2,
    "verbal",
    "medium",
    "Makna 'rekonsiliasi' dalam accounting sederhana adalah?",
    {
      A: "Mencocokkan data transaksi",
      B: "Membuat poster",
      C: "Mengirim paket",
      D: "Menghapus toko"
    },
    "A",
    "Rekonsiliasi berarti pencocokan data transaksi atau catatan."
  ),
  q(
    "L2-021",
    2,
    "verbal",
    "medium",
    "Customer menulis komplain emosional. Respons awal terbaik adalah?",
    {
      A: "Membalas dengan emosi",
      B: "Mengakui keluhan dan meminta data pesanan",
      C: "Menghapus chat",
      D: "Menyuruh beli lagi"
    },
    "B",
    "CS perlu empati dan data untuk tindak lanjut."
  ),
  q(
    "L2-022",
    2,
    "verbal",
    "medium",
    "Kata 'prioritas' paling dekat dengan?",
    {
      A: "Hal yang didahulukan",
      B: "Hal yang dihapus",
      C: "Hal yang disembunyikan",
      D: "Hal yang diperlambat"
    },
    "A",
    "Prioritas berarti hal yang didahulukan."
  ),
  q(
    "L2-023",
    2,
    "verbal",
    "hard",
    "Instruksi: 'Update stok hanya setelah barang fisik diterima.' Artinya?",
    {
      A: "Update saat PO dibuat",
      B: "Update setelah barang benar-benar datang",
      C: "Update saat supplier janji",
      D: "Tidak perlu update"
    },
    "B",
    "Stok diperbarui setelah penerimaan fisik."
  ),
  q(
    "L2-024",
    2,
    "verbal",
    "medium",
    "Pernyataan paling netral dalam evaluasi supplier adalah?",
    {
      A: "Supplier ini pasti buruk.",
      B: "Terdapat 4 keterlambatan dari 10 pengiriman bulan ini.",
      C: "Saya tidak suka supplier itu.",
      D: "Supplier harus diganti tanpa data."
    },
    "B",
    "Pernyataan netral memakai data."
  ),
  q(
    "L2-025",
    2,
    "pattern",
    "easy",
    "Pola: 3, 6, 9, 12, ...",
    {
      A: "13",
      B: "14",
      C: "15",
      D: "18"
    },
    "C",
    "Pola bertambah 3."
  ),
  q(
    "L2-026",
    2,
    "pattern",
    "medium",
    "Pola: 2, 5, 11, 23, ...",
    {
      A: "35",
      B: "41",
      C: "47",
      D: "49"
    },
    "C",
    "Pola x2 + 1: 2 → 5 → 11 → 23 → 47."
  ),
  q(
    "L2-027",
    2,
    "pattern",
    "medium",
    "Kode: AA-10, AB-20, AC-30, ...",
    {
      A: "AD-40",
      B: "BA-40",
      C: "AD-30",
      D: "AC-40"
    },
    "A",
    "Huruf kedua naik dan angka bertambah 10."
  ),
  q(
    "L2-028",
    2,
    "pattern",
    "hard",
    "Pola: 100, 90, 75, 55, ...",
    {
      A: "30",
      B: "35",
      C: "40",
      D: "45"
    },
    "A",
    "Selisih -10, -15, -20, berikutnya -25. Jadi 55 - 25 = 30."
  ),
  q(
    "L2-029",
    2,
    "pattern",
    "medium",
    "Urutan proses procurement: Request → Approval → PO → ...",
    {
      A: "Penerimaan barang",
      B: "Komplain customer",
      C: "Packing",
      D: "Live streaming"
    },
    "A",
    "Setelah PO, tahap berikutnya adalah penerimaan barang."
  ),
  q(
    "L2-030",
    2,
    "pattern",
    "medium",
    "Pola angka invoice: INV-1002, INV-1004, INV-1006, ...",
    {
      A: "INV-1007",
      B: "INV-1008",
      C: "INV-1010",
      D: "INV-1005"
    },
    "B",
    "Nomor bertambah 2."
  ),
  q(
    "L2-031",
    2,
    "pattern",
    "hard",
    "Pola: Senin 20 paket, Selasa 30, Rabu 45, Kamis 67,5. Jika pola sama, Jumat?",
    {
      A: "80",
      B: "90",
      C: "101,25",
      D: "120"
    },
    "C",
    "Setiap hari dikali 1,5. Maka 67,5 x 1,5 = 101,25."
  ),
  q(
    "L2-032",
    2,
    "workingAccuracy",
    "easy",
    "Manakah nomor resi yang sama persis?",
    {
      A: "JP89210ID dan JP89201ID",
      B: "SPX-7719-A dan SPX-7719-A",
      C: "JNT8881 dan JNT8818",
      D: "ANT-009B dan ANT-00B9"
    },
    "B",
    "SPX-7719-A sama persis pada kedua sisi."
  ),
  q(
    "L2-033",
    2,
    "workingAccuracy",
    "medium",
    "Data sistem: SKU-MILO-220. Input mana yang salah?",
    {
      A: "SKU-MILO-220",
      B: "SKU-MILO-220",
      C: "SKU-MILO-202",
      D: "SKU-MILO-220"
    },
    "C",
    "Angka 202 berbeda dari 220."
  ),
  q(
    "L2-034",
    2,
    "workingAccuracy",
    "hard",
    "Invoice: 3 pcs x Rp74.500 = ?",
    {
      A: "Rp223.000",
      B: "Rp223.500",
      C: "Rp224.500",
      D: "Rp225.000"
    },
    "B",
    "Rp74.500 x 3 = Rp223.500."
  ),
  q(
    "L2-035",
    2,
    "workingAccuracy",
    "medium",
    "Nama customer: Fadli Pratama. Data mana yang typo?",
    {
      A: "Fadli Pratama",
      B: "Fadli Pratama",
      C: "Faldi Pratama",
      D: "Fadli Pratama"
    },
    "C",
    "Faldi berbeda dari Fadli."
  )
'''

needle = "\n];\n\nexport function getIQQuestionsByLevel"
if needle not in text:
    raise SystemExit("Cannot find iqQuestions array ending. Please check lib/iq/iqQuestions.ts")

text = text.replace(needle, level2 + "\n];\n\nexport function getIQQuestionsByLevel")
path.write_text(text)
print("Level 2 questions installed.")
PY

cat >> README.md <<'EOF'

---

## Part 4B-1 — IQ Level 2 Question Bank

Fitur yang ditambahkan:
- Level 2 lengkap 35 soal.
- Distribusi:
  - Logical Reasoning: 8 soal
  - Numerical Reasoning: 10 soal
  - Verbal Reasoning: 6 soal
  - Pattern Reasoning: 7 soal
  - Working Accuracy: 4 soal
- Konteks:
  - accounting staff
  - e-commerce staff
  - admin senior
  - procurement junior
  - margin
  - diskon
  - ROAS sederhana
  - stok
  - prioritas kerja

Test cepat:
1. Buka `/test/start`.
2. Pilih Assessment Level 2.
3. Selesaikan DISC.
4. Masuk IQ.
5. Pastikan jumlah soal IQ adalah 35.
6. Submit final.
EOF

echo ""
echo "✅ Part 4B-1 selesai."
echo ""
echo "Jalankan:"
echo "npm run dev"
echo ""
echo "Test Level 2:"
echo "/test/start -> pilih Level 2"