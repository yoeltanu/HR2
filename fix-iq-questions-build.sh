#!/usr/bin/env bash
set -e

echo "Fixing IQ question bank and build exports..."

mkdir -p lib/iq

if [ -f "lib/iq/iqQuestions.ts" ]; then
  cp "lib/iq/iqQuestions.ts" "lib/iq/iqQuestions.ts.backup.$(date +%Y%m%d%H%M%S)"
fi

if [ -f "lib/iqQuestions.ts" ]; then
  cp "lib/iqQuestions.ts" "lib/iqQuestions.ts.backup.$(date +%Y%m%d%H%M%S)"
fi

cat > lib/iq/iqQuestions.ts <<'EOF'
import type {
  IQCategory,
  IQDifficulty,
  IQOptionKey,
  IQQuestion
} from "@/types/iq";

type QuestionSeed = {
  category: IQCategory;
  difficulty: IQDifficulty;
  question: string;
  options: Record<IQOptionKey, string>;
  correctAnswer: IQOptionKey;
  explanation: string;
};

function makeQuestion(
  id: string,
  level: 1 | 2 | 3,
  seed: QuestionSeed
): IQQuestion {
  return {
    id,
    level,
    category: seed.category,
    difficulty: seed.difficulty,
    question: seed.question,
    options: seed.options,
    correctAnswer: seed.correctAnswer,
    explanation: seed.explanation
  };
}

function buildLevelQuestions(
  level: 1 | 2 | 3,
  seeds: QuestionSeed[]
): IQQuestion[] {
  return seeds.map((seed, index) =>
    makeQuestion(
      `L${level}-${String(index + 1).padStart(3, "0")}`,
      level,
      seed
    )
  );
}

const level1Seeds: QuestionSeed[] = [
  {
    category: "logical",
    difficulty: "easy",
    question: "Jika semua pesanan COD harus dicek alamatnya, dan pesanan B adalah COD, tindakan yang benar adalah?",
    options: { A: "Langsung kirim", B: "Cek alamat pesanan B", C: "Batalkan pesanan", D: "Tunggu customer komplain" },
    correctAnswer: "B",
    explanation: "Karena pesanan B termasuk COD, alamat wajib dicek."
  },
  {
    category: "logical",
    difficulty: "easy",
    question: "Jika SOP packing mewajibkan bubble wrap untuk barang pecah belah, maka gelas kaca harus?",
    options: { A: "Dikirim tanpa pelindung", B: "Dimasukkan bubble wrap", C: "Ditunda satu bulan", D: "Diberi label diskon" },
    correctAnswer: "B",
    explanation: "Gelas kaca adalah barang pecah belah."
  },
  {
    category: "logical",
    difficulty: "easy",
    question: "Customer meminta retur karena barang salah warna. Data yang paling perlu dicek pertama adalah?",
    options: { A: "Nama kurir", B: "Foto barang dan invoice pesanan", C: "Jam makan siang admin", D: "Jumlah follower toko" },
    correctAnswer: "B",
    explanation: "Bukti barang dan invoice diperlukan untuk validasi retur."
  },
  {
    category: "logical",
    difficulty: "medium",
    question: "Jika stok fisik lebih sedikit dari stok sistem, langkah awal paling tepat adalah?",
    options: { A: "Menghapus semua data", B: "Melakukan pengecekan ulang dan mencatat selisih", C: "Menaikkan harga", D: "Mengabaikan data" },
    correctAnswer: "B",
    explanation: "Selisih stok perlu diverifikasi dan dicatat."
  },
  {
    category: "logical",
    difficulty: "medium",
    question: "Barang fast moving sebaiknya diletakkan di area yang?",
    options: { A: "Sulit dijangkau", B: "Mudah dijangkau", C: "Tersembunyi", D: "Tidak berlabel" },
    correctAnswer: "B",
    explanation: "Barang sering terjual harus mudah diambil agar proses cepat."
  },
  {
    category: "numerical",
    difficulty: "easy",
    question: "Harga modal Rp50.000 dan dijual Rp65.000. Berapa keuntungan rupiah?",
    options: { A: "Rp10.000", B: "Rp15.000", C: "Rp20.000", D: "Rp25.000" },
    correctAnswer: "B",
    explanation: "Rp65.000 - Rp50.000 = Rp15.000."
  },
  {
    category: "numerical",
    difficulty: "easy",
    question: "Ada 8 dus, setiap dus berisi 12 pcs. Total barang adalah?",
    options: { A: "84 pcs", B: "90 pcs", C: "96 pcs", D: "108 pcs" },
    correctAnswer: "C",
    explanation: "8 x 12 = 96 pcs."
  },
  {
    category: "numerical",
    difficulty: "easy",
    question: "Customer membeli 3 produk seharga Rp25.000 per produk. Total harga sebelum ongkir adalah?",
    options: { A: "Rp50.000", B: "Rp65.000", C: "Rp75.000", D: "Rp85.000" },
    correctAnswer: "C",
    explanation: "3 x Rp25.000 = Rp75.000."
  },
  {
    category: "numerical",
    difficulty: "easy",
    question: "Stok awal 120 pcs. Terjual 35 pcs. Sisa stok adalah?",
    options: { A: "75 pcs", B: "80 pcs", C: "85 pcs", D: "95 pcs" },
    correctAnswer: "C",
    explanation: "120 - 35 = 85 pcs."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Diskon Rp10.000 dari harga Rp80.000 membuat harga akhir menjadi?",
    options: { A: "Rp60.000", B: "Rp70.000", C: "Rp75.000", D: "Rp90.000" },
    correctAnswer: "B",
    explanation: "Rp80.000 - Rp10.000 = Rp70.000."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Dalam 5 jam, tim packing menyelesaikan 150 paket. Rata-rata per jam adalah?",
    options: { A: "20 paket", B: "25 paket", C: "30 paket", D: "35 paket" },
    correctAnswer: "C",
    explanation: "150 / 5 = 30 paket per jam."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Jika 2 dari 20 paket salah label, persentase salah label adalah?",
    options: { A: "5%", B: "10%", C: "15%", D: "20%" },
    correctAnswer: "B",
    explanation: "2 / 20 x 100% = 10%."
  },
  {
    category: "verbal",
    difficulty: "easy",
    question: "Makna paling dekat dari kata validasi dalam proses retur adalah?",
    options: { A: "Menghapus", B: "Memeriksa kebenaran", C: "Mempercepat iklan", D: "Mengubah warna" },
    correctAnswer: "B",
    explanation: "Validasi berarti memeriksa kebenaran data atau bukti."
  },
  {
    category: "verbal",
    difficulty: "easy",
    question: "Kalimat CS yang paling profesional adalah?",
    options: { A: "Itu bukan urusan kami.", B: "Mohon maaf, kami bantu cek terlebih dahulu.", C: "Customer salah semua.", D: "Tunggu saja tanpa kepastian." },
    correctAnswer: "B",
    explanation: "Kalimat tersebut sopan dan memberi tindak lanjut."
  },
  {
    category: "verbal",
    difficulty: "easy",
    question: "Antonim dari teliti yang paling tepat adalah?",
    options: { A: "Cermat", B: "Rapi", C: "Ceroboh", D: "Akurat" },
    correctAnswer: "C",
    explanation: "Lawan kata teliti adalah ceroboh."
  },
  {
    category: "verbal",
    difficulty: "medium",
    question: "Instruksi: Pisahkan barang retur yang masih layak jual. Artinya barang retur harus?",
    options: { A: "Dicampur semua", B: "Dipilih berdasarkan kondisi", C: "Langsung dibuang", D: "Dijual tanpa cek" },
    correctAnswer: "B",
    explanation: "Kata pisahkan menunjukkan pemilahan berdasarkan kondisi."
  },
  {
    category: "verbal",
    difficulty: "medium",
    question: "Kata yang paling sesuai untuk laporan kerja adalah?",
    options: { A: "Kayaknya stok aneh", B: "Stok sistem 50, stok fisik 47, selisih 3 pcs", C: "Pokoknya kurang", D: "Tidak tahu" },
    correctAnswer: "B",
    explanation: "Laporan kerja harus spesifik dan berbasis data."
  },
  {
    category: "pattern",
    difficulty: "easy",
    question: "Pola angka: 2, 4, 6, 8, ... Angka berikutnya adalah?",
    options: { A: "9", B: "10", C: "11", D: "12" },
    correctAnswer: "B",
    explanation: "Pola bertambah 2."
  },
  {
    category: "pattern",
    difficulty: "easy",
    question: "Pola SKU: A1, A2, A3, A4, ... Berikutnya adalah?",
    options: { A: "A5", B: "B1", C: "A0", D: "C4" },
    correctAnswer: "A",
    explanation: "Angka bertambah satu dengan huruf tetap A."
  },
  {
    category: "pattern",
    difficulty: "medium",
    question: "Pola: 5, 10, 20, 40, ... Berikutnya adalah?",
    options: { A: "45", B: "60", C: "80", D: "100" },
    correctAnswer: "C",
    explanation: "Setiap angka dikali 2."
  },
  {
    category: "pattern",
    difficulty: "medium",
    question: "Urutan status: Pesanan masuk → Diproses → Dikemas → ...",
    options: { A: "Dikirim", B: "Dihapus", C: "Diabaikan", D: "Ditulis ulang" },
    correctAnswer: "A",
    explanation: "Setelah dikemas, paket dikirim."
  },
  {
    category: "pattern",
    difficulty: "medium",
    question: "Pola kode: BX-01, BX-02, BX-03, ...",
    options: { A: "BX-04", B: "BX-00", C: "BY-01", D: "AX-04" },
    correctAnswer: "A",
    explanation: "Nomor urut bertambah satu."
  },
  {
    category: "workingAccuracy",
    difficulty: "easy",
    question: "Manakah pasangan SKU yang sama persis?",
    options: { A: "TR-1208 dan TR-1280", B: "MK-771A dan MK-771A", C: "AB-908 dan AB-980", D: "ZX-111 dan ZX-11I" },
    correctAnswer: "B",
    explanation: "MK-771A sama persis pada kedua sisi."
  },
  {
    category: "workingAccuracy",
    difficulty: "medium",
    question: "Invoice tertulis Rp158.500. Input mana yang benar?",
    options: { A: "Rp185.500", B: "Rp158.500", C: "Rp158.050", D: "Rp155.800" },
    correctAnswer: "B",
    explanation: "Input harus sama dengan invoice."
  },
  {
    category: "workingAccuracy",
    difficulty: "medium",
    question: "Alamat: Jl. Melati No. 18 Blok C. Data mana yang salah?",
    options: { A: "Jl. Melati No. 18 Blok C", B: "Jl. Melati No. 18 Blok C", C: "Jl. Melati No. 81 Blok C", D: "Jl. Melati No. 18 Blok C" },
    correctAnswer: "C",
    explanation: "Nomor 81 berbeda dari nomor 18."
  }
];

const level2Seeds: QuestionSeed[] = [
  {
    category: "logical",
    difficulty: "easy",
    question: "Jika produk margin rendah dipromosikan hanya saat stok menumpuk, produk A margin rendah dan stok menumpuk. Keputusan paling logis?",
    options: { A: "Promosikan produk A", B: "Hapus produk A", C: "Naikkan ongkir semua produk", D: "Abaikan data stok" },
    correctAnswer: "A",
    explanation: "Kondisi margin rendah dan stok menumpuk memenuhi syarat promosi."
  },
  {
    category: "logical",
    difficulty: "medium",
    question: "Pesanan prioritas adalah yang sudah dibayar dan deadline kirim hari ini. Pesanan X memenuhi keduanya. Status X adalah?",
    options: { A: "Prioritas", B: "Tidak valid", C: "Retur", D: "Arsip" },
    correctAnswer: "A",
    explanation: "X memenuhi dua syarat prioritas."
  },
  {
    category: "logical",
    difficulty: "medium",
    question: "Jika supplier terlambat lebih dari 3 kali, perlu evaluasi. Supplier B terlambat 4 kali. Apa yang tepat?",
    options: { A: "Evaluasi supplier B", B: "Naikkan budget iklan", C: "Tutup toko", D: "Abaikan karena hanya data" },
    correctAnswer: "A",
    explanation: "4 kali lebih dari batas 3 kali."
  },
  {
    category: "logical",
    difficulty: "medium",
    question: "Admin menemukan selisih kas dan invoice. Urutan terbaik adalah?",
    options: { A: "Posting promo", B: "Cek invoice, cek bukti bayar, catat selisih", C: "Langsung menyalahkan kurir", D: "Mengubah semua data" },
    correctAnswer: "B",
    explanation: "Pengecekan harus berbasis dokumen dan pencatatan."
  },
  {
    category: "logical",
    difficulty: "hard",
    question: "Jika ROAS turun saat biaya iklan naik dan order tetap, kemungkinan masalah utama adalah?",
    options: { A: "Efisiensi iklan menurun", B: "Stok pasti hilang", C: "Packing terlalu cepat", D: "Nama produk terlalu pendek pasti benar" },
    correctAnswer: "A",
    explanation: "Biaya naik tanpa order bertambah menurunkan efisiensi iklan."
  },
  {
    category: "logical",
    difficulty: "medium",
    question: "Produk retur yang rusak tidak boleh masuk stok jual. Produk Y rusak. Maka Y harus?",
    options: { A: "Masuk stok jual", B: "Dipisahkan dari stok jual", C: "Diberi label best seller", D: "Dikirim ke customer lain" },
    correctAnswer: "B",
    explanation: "Barang rusak tidak boleh dijual sebagai stok normal."
  },
  {
    category: "logical",
    difficulty: "hard",
    question: "Jika satu keputusan memengaruhi stok, cashflow, dan rating toko, keputusan tersebut sebaiknya?",
    options: { A: "Dibuat tanpa data", B: "Dibahas dengan data lintas fungsi", C: "Diserahkan ke customer", D: "Ditunda tanpa alasan" },
    correctAnswer: "B",
    explanation: "Dampak lintas fungsi perlu data lintas fungsi."
  },
  {
    category: "logical",
    difficulty: "medium",
    question: "Jika semua komplain pengiriman harus punya nomor resi, komplain Z tanpa resi harus?",
    options: { A: "Tetap diproses normal", B: "Diminta nomor resi atau data pendukung", C: "Langsung refund tanpa cek", D: "Dihapus" },
    correctAnswer: "B",
    explanation: "Nomor resi atau data pendukung dibutuhkan untuk validasi."
  },
  {
    category: "numerical",
    difficulty: "easy",
    question: "Harga jual Rp120.000, modal Rp80.000. Margin kotor rupiah adalah?",
    options: { A: "Rp30.000", B: "Rp40.000", C: "Rp50.000", D: "Rp60.000" },
    correctAnswer: "B",
    explanation: "Rp120.000 - Rp80.000 = Rp40.000."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Modal Rp75.000, harga jual Rp100.000. Margin terhadap harga jual adalah?",
    options: { A: "20%", B: "25%", C: "30%", D: "35%" },
    correctAnswer: "B",
    explanation: "Keuntungan Rp25.000 / Rp100.000 = 25%."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Budget iklan Rp500.000 menghasilkan sales Rp2.000.000. ROAS adalah?",
    options: { A: "2x", B: "3x", C: "4x", D: "5x" },
    correctAnswer: "C",
    explanation: "ROAS = sales / budget = Rp2.000.000 / Rp500.000 = 4x."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Stok awal 300, masuk 80, keluar 125. Stok akhir adalah?",
    options: { A: "245", B: "255", C: "265", D: "275" },
    correctAnswer: "B",
    explanation: "300 + 80 - 125 = 255."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Diskon 15% dari Rp200.000 adalah?",
    options: { A: "Rp20.000", B: "Rp25.000", C: "Rp30.000", D: "Rp35.000" },
    correctAnswer: "C",
    explanation: "15% x Rp200.000 = Rp30.000."
  },
  {
    category: "numerical",
    difficulty: "hard",
    question: "Jika conversion rate 2% dari 5.000 pengunjung, jumlah order adalah?",
    options: { A: "50", B: "75", C: "100", D: "125" },
    correctAnswer: "C",
    explanation: "2% x 5.000 = 100."
  },
  {
    category: "numerical",
    difficulty: "hard",
    question: "Supplier memberi harga Rp48.000. Target margin rupiah minimal Rp12.000. Harga jual minimal adalah?",
    options: { A: "Rp54.000", B: "Rp58.000", C: "Rp60.000", D: "Rp64.000" },
    correctAnswer: "C",
    explanation: "Rp48.000 + Rp12.000 = Rp60.000."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Dari 240 pesanan, 12 retur. Persentase retur adalah?",
    options: { A: "3%", B: "4%", C: "5%", D: "6%" },
    correctAnswer: "C",
    explanation: "12 / 240 x 100% = 5%."
  },
  {
    category: "numerical",
    difficulty: "hard",
    question: "Target 1.200 paket per minggu. Dalam 5 hari kerja, rata-rata paket per hari adalah?",
    options: { A: "200", B: "220", C: "240", D: "260" },
    correctAnswer: "C",
    explanation: "1.200 / 5 = 240 paket per hari."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Harga Rp150.000 naik 10%. Harga baru adalah?",
    options: { A: "Rp155.000", B: "Rp160.000", C: "Rp165.000", D: "Rp170.000" },
    correctAnswer: "C",
    explanation: "10% dari Rp150.000 adalah Rp15.000, sehingga harga baru Rp165.000."
  },
  {
    category: "verbal",
    difficulty: "easy",
    question: "Kalimat laporan paling tepat untuk atasan adalah?",
    options: { A: "Kayaknya masalahnya banyak.", B: "Ada 18 pesanan terlambat karena pickup kurir mundur dari jadwal.", C: "Pokoknya kurir salah.", D: "Saya lupa detailnya." },
    correctAnswer: "B",
    explanation: "Laporan jelas berisi jumlah dan penyebab."
  },
  {
    category: "verbal",
    difficulty: "medium",
    question: "Makna rekonsiliasi dalam accounting sederhana adalah?",
    options: { A: "Mencocokkan data transaksi", B: "Membuat poster", C: "Mengirim paket", D: "Menghapus toko" },
    correctAnswer: "A",
    explanation: "Rekonsiliasi berarti pencocokan data transaksi atau catatan."
  },
  {
    category: "verbal",
    difficulty: "medium",
    question: "Customer menulis komplain emosional. Respons awal terbaik adalah?",
    options: { A: "Membalas dengan emosi", B: "Mengakui keluhan dan meminta data pesanan", C: "Menghapus chat", D: "Menyuruh beli lagi" },
    correctAnswer: "B",
    explanation: "CS perlu empati dan data untuk tindak lanjut."
  },
  {
    category: "verbal",
    difficulty: "medium",
    question: "Kata prioritas paling dekat dengan?",
    options: { A: "Hal yang didahulukan", B: "Hal yang dihapus", C: "Hal yang disembunyikan", D: "Hal yang diperlambat" },
    correctAnswer: "A",
    explanation: "Prioritas berarti hal yang didahulukan."
  },
  {
    category: "verbal",
    difficulty: "hard",
    question: "Instruksi: Update stok hanya setelah barang fisik diterima. Artinya?",
    options: { A: "Update saat PO dibuat", B: "Update setelah barang benar-benar datang", C: "Update saat supplier janji", D: "Tidak perlu update" },
    correctAnswer: "B",
    explanation: "Stok diperbarui setelah penerimaan fisik."
  },
  {
    category: "verbal",
    difficulty: "medium",
    question: "Pernyataan paling netral dalam evaluasi supplier adalah?",
    options: { A: "Supplier ini pasti buruk.", B: "Terdapat 4 keterlambatan dari 10 pengiriman bulan ini.", C: "Saya tidak suka supplier itu.", D: "Supplier harus diganti tanpa data." },
    correctAnswer: "B",
    explanation: "Pernyataan netral memakai data."
  },
  {
    category: "pattern",
    difficulty: "easy",
    question: "Pola: 3, 6, 9, 12, ...",
    options: { A: "13", B: "14", C: "15", D: "18" },
    correctAnswer: "C",
    explanation: "Pola bertambah 3."
  },
  {
    category: "pattern",
    difficulty: "medium",
    question: "Pola: 2, 5, 11, 23, ...",
    options: { A: "35", B: "41", C: "47", D: "49" },
    correctAnswer: "C",
    explanation: "Pola x2 + 1: 2 → 5 → 11 → 23 → 47."
  },
  {
    category: "pattern",
    difficulty: "medium",
    question: "Kode: AA-10, AB-20, AC-30, ...",
    options: { A: "AD-40", B: "BA-40", C: "AD-30", D: "AC-40" },
    correctAnswer: "A",
    explanation: "Huruf kedua naik dan angka bertambah 10."
  },
  {
    category: "pattern",
    difficulty: "hard",
    question: "Pola: 100, 90, 75, 55, ...",
    options: { A: "30", B: "35", C: "40", D: "45" },
    correctAnswer: "A",
    explanation: "Selisih -10, -15, -20, berikutnya -25. Jadi 55 - 25 = 30."
  },
  {
    category: "pattern",
    difficulty: "medium",
    question: "Urutan proses procurement: Request → Approval → PO → ...",
    options: { A: "Penerimaan barang", B: "Komplain customer", C: "Packing", D: "Live streaming" },
    correctAnswer: "A",
    explanation: "Setelah PO, tahap berikutnya adalah penerimaan barang."
  },
  {
    category: "pattern",
    difficulty: "medium",
    question: "Pola angka invoice: INV-1002, INV-1004, INV-1006, ...",
    options: { A: "INV-1007", B: "INV-1008", C: "INV-1010", D: "INV-1005" },
    correctAnswer: "B",
    explanation: "Nomor bertambah 2."
  },
  {
    category: "pattern",
    difficulty: "hard",
    question: "Pola: Senin 20 paket, Selasa 30, Rabu 45, Kamis 67,5. Jika pola sama, Jumat?",
    options: { A: "80", B: "90", C: "101,25", D: "120" },
    correctAnswer: "C",
    explanation: "Setiap hari dikali 1,5. Maka 67,5 x 1,5 = 101,25."
  },
  {
    category: "workingAccuracy",
    difficulty: "easy",
    question: "Manakah nomor resi yang sama persis?",
    options: { A: "JP89210ID dan JP89201ID", B: "SPX-7719-A dan SPX-7719-A", C: "JNT8881 dan JNT8818", D: "ANT-009B dan ANT-00B9" },
    correctAnswer: "B",
    explanation: "SPX-7719-A sama persis pada kedua sisi."
  },
  {
    category: "workingAccuracy",
    difficulty: "medium",
    question: "Data sistem: SKU-MILO-220. Input mana yang salah?",
    options: { A: "SKU-MILO-220", B: "SKU-MILO-220", C: "SKU-MILO-202", D: "SKU-MILO-220" },
    correctAnswer: "C",
    explanation: "Angka 202 berbeda dari 220."
  },
  {
    category: "workingAccuracy",
    difficulty: "hard",
    question: "Invoice: 3 pcs x Rp74.500 = ?",
    options: { A: "Rp223.000", B: "Rp223.500", C: "Rp224.500", D: "Rp225.000" },
    correctAnswer: "B",
    explanation: "Rp74.500 x 3 = Rp223.500."
  },
  {
    category: "workingAccuracy",
    difficulty: "medium",
    question: "Nama customer: Fadli Pratama. Data mana yang typo?",
    options: { A: "Fadli Pratama", B: "Fadli Pratama", C: "Faldi Pratama", D: "Fadli Pratama" },
    correctAnswer: "C",
    explanation: "Faldi berbeda dari Fadli."
  }
];

const level3Seeds: QuestionSeed[] = [
  {
    category: "logical",
    difficulty: "medium",
    question: "Jika keterlambatan pengiriman meningkat setelah pergantian jadwal pickup, hipotesis awal yang paling masuk akal adalah?",
    options: { A: "Jadwal pickup perlu dievaluasi", B: "Semua admin harus diganti", C: "Produk harus dihentikan", D: "Harga selalu dinaikkan" },
    correctAnswer: "A",
    explanation: "Perubahan jadwal berkorelasi langsung dengan masalah keterlambatan."
  },
  {
    category: "logical",
    difficulty: "medium",
    question: "Leader melihat error packing tinggi pada shift malam. Data pertama yang perlu dibandingkan adalah?",
    options: { A: "Jumlah follower toko", B: "Volume order, jumlah staf, dan jenis error per shift", C: "Warna seragam", D: "Jam buka marketplace" },
    correctAnswer: "B",
    explanation: "Analisa error butuh volume kerja, kapasitas orang, dan jenis kesalahan."
  },
  {
    category: "logical",
    difficulty: "hard",
    question: "Jika promosi menaikkan order 40% tetapi komplain naik 70%, keputusan terbaik adalah?",
    options: { A: "Lanjut tanpa perubahan", B: "Evaluasi kapasitas operasional dan kualitas", C: "Matikan semua produk", D: "Abaikan komplain" },
    correctAnswer: "B",
    explanation: "Komplain naik lebih cepat dari order, sehingga kapasitas dan kualitas perlu dievaluasi."
  },
  {
    category: "logical",
    difficulty: "hard",
    question: "Dua supplier punya harga sama. Supplier A tepat waktu 95%, B tepat waktu 75%. Untuk produk fast moving, pilihan awal?",
    options: { A: "Supplier A", B: "Supplier B", C: "Acak", D: "Tidak membeli stok" },
    correctAnswer: "A",
    explanation: "Produk fast moving membutuhkan reliabilitas suplai tinggi."
  },
  {
    category: "logical",
    difficulty: "medium",
    question: "Jika KPI utama CS adalah first response time dan resolusi, maka laporan harian harus memuat?",
    options: { A: "Jumlah chat masuk, waktu respons, status selesai", B: "Warna chat", C: "Jumlah meja", D: "Nama semua pesaing" },
    correctAnswer: "A",
    explanation: "KPI harus dilaporkan dengan data yang relevan."
  },
  {
    category: "logical",
    difficulty: "hard",
    question: "Jika stok mati mengikat cashflow, langkah prioritas paling rasional adalah?",
    options: { A: "Analisa umur stok, margin, dan opsi bundling/promo", B: "Membeli stok baru lebih banyak", C: "Menghapus laporan", D: "Menunggu tanpa batas waktu" },
    correctAnswer: "A",
    explanation: "Stok mati perlu dianalisa dan dicairkan dengan strategi."
  },
  {
    category: "logical",
    difficulty: "hard",
    question: "Tim meminta tambahan orang, tetapi produktivitas per orang turun. Respons leader yang tepat adalah?",
    options: { A: "Langsung rekrut tanpa analisa", B: "Audit proses, bottleneck, dan standar produktivitas", C: "Menurunkan target tanpa alasan", D: "Mengabaikan tim" },
    correctAnswer: "B",
    explanation: "Produktivitas turun perlu audit proses sebelum menambah orang."
  },
  {
    category: "logical",
    difficulty: "medium",
    question: "Jika satu SKU sering oversold, akar masalah paling mungkin berada pada?",
    options: { A: "Sinkronisasi stok dan update marketplace", B: "Logo perusahaan", C: "Warna kardus", D: "Jam makan siang customer" },
    correctAnswer: "A",
    explanation: "Oversold berkaitan dengan data stok dan sinkronisasi marketplace."
  },
  {
    category: "logical",
    difficulty: "hard",
    question: "Jika target sales tercapai tetapi profit turun, fokus analisa berikutnya adalah?",
    options: { A: "Margin, diskon, biaya iklan, dan biaya operasional", B: "Jumlah kursi kantor", C: "Warna feed", D: "Jumlah hari libur nasional saja" },
    correctAnswer: "A",
    explanation: "Profit dipengaruhi margin dan biaya, bukan hanya sales."
  },
  {
    category: "logical",
    difficulty: "hard",
    question: "Saat order meningkat mendadak, keputusan leader terbaik adalah?",
    options: { A: "Prioritaskan SLA, alokasi orang, dan monitoring bottleneck", B: "Menunda semua order", C: "Mengubah SOP tanpa komunikasi", D: "Menghapus chat customer" },
    correctAnswer: "A",
    explanation: "Lonjakan order perlu prioritas SLA, alokasi sumber daya, dan monitoring hambatan."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Sales Rp50.000.000, COGS Rp32.000.000. Gross profit adalah?",
    options: { A: "Rp16.000.000", B: "Rp18.000.000", C: "Rp20.000.000", D: "Rp22.000.000" },
    correctAnswer: "B",
    explanation: "Rp50.000.000 - Rp32.000.000 = Rp18.000.000."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Gross profit Rp18.000.000 dari sales Rp50.000.000. Gross margin adalah?",
    options: { A: "32%", B: "34%", C: "36%", D: "40%" },
    correctAnswer: "C",
    explanation: "Rp18.000.000 / Rp50.000.000 = 36%."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Biaya iklan Rp4.000.000 menghasilkan sales Rp24.000.000. ROAS adalah?",
    options: { A: "4x", B: "5x", C: "6x", D: "8x" },
    correctAnswer: "C",
    explanation: "ROAS = Rp24.000.000 / Rp4.000.000 = 6x."
  },
  {
    category: "numerical",
    difficulty: "hard",
    question: "Order naik dari 800 ke 1.000. Persentase kenaikan adalah?",
    options: { A: "20%", B: "25%", C: "30%", D: "35%" },
    correctAnswer: "B",
    explanation: "Kenaikan 200 dari basis 800 = 25%."
  },
  {
    category: "numerical",
    difficulty: "hard",
    question: "Error packing turun dari 5% ke 3%. Penurunan relatif adalah?",
    options: { A: "20%", B: "30%", C: "40%", D: "50%" },
    correctAnswer: "C",
    explanation: "Turun 2 poin dari basis 5%, yaitu 2/5 = 40%."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Tim A memproses 480 paket dengan 6 orang. Produktivitas per orang adalah?",
    options: { A: "60", B: "70", C: "80", D: "90" },
    correctAnswer: "C",
    explanation: "480 / 6 = 80 paket per orang."
  },
  {
    category: "numerical",
    difficulty: "hard",
    question: "Jika SLA minimal 95% dan terkirim tepat waktu 912 dari 960 paket, SLA adalah?",
    options: { A: "93%", B: "94%", C: "95%", D: "96%" },
    correctAnswer: "C",
    explanation: "912 / 960 = 95%."
  },
  {
    category: "numerical",
    difficulty: "hard",
    question: "Produk A margin 30%, sales Rp20 juta. Produk B margin 20%, sales Rp30 juta. Profit kotor lebih besar?",
    options: { A: "Produk A", B: "Produk B", C: "Sama", D: "Tidak bisa dihitung" },
    correctAnswer: "C",
    explanation: "A = 6 juta. B = 6 juta."
  },
  {
    category: "numerical",
    difficulty: "hard",
    question: "Stok 1.200 pcs, rata-rata terjual 80 pcs/hari. Estimasi habis dalam?",
    options: { A: "10 hari", B: "12 hari", C: "15 hari", D: "18 hari" },
    correctAnswer: "C",
    explanation: "1.200 / 80 = 15 hari."
  },
  {
    category: "numerical",
    difficulty: "medium",
    question: "Dari 2.500 chat, 2.000 terjawab di bawah target waktu. Persentasenya?",
    options: { A: "75%", B: "80%", C: "85%", D: "90%" },
    correctAnswer: "B",
    explanation: "2.000 / 2.500 = 80%."
  },
  {
    category: "numerical",
    difficulty: "hard",
    question: "Jika cost per order Rp12.000 dan target maksimal Rp10.000, perlu penurunan berapa persen dari kondisi saat ini?",
    options: { A: "12,5%", B: "16,67%", C: "20%", D: "25%" },
    correctAnswer: "B",
    explanation: "Penurunan Rp2.000 dari Rp12.000 = 16,67%."
  },
  {
    category: "numerical",
    difficulty: "hard",
    question: "Budget Rp15 juta dibagi 3 channel dengan rasio 2:2:1. Channel ketiga mendapat?",
    options: { A: "Rp2 juta", B: "Rp3 juta", C: "Rp4 juta", D: "Rp5 juta" },
    correctAnswer: "B",
    explanation: "Total rasio 5. Channel ketiga 1/5 x Rp15 juta = Rp3 juta."
  },
  {
    category: "verbal",
    difficulty: "medium",
    question: "Pernyataan paling tepat untuk laporan manajemen adalah?",
    options: { A: "Semua kacau.", B: "SLA turun dari 97% ke 92% karena backlog pickup meningkat 180 paket.", C: "Tim kurang semangat saja.", D: "Tidak ada data." },
    correctAnswer: "B",
    explanation: "Laporan manajemen harus jelas, terukur, dan menyebut indikasi penyebab."
  },
  {
    category: "verbal",
    difficulty: "medium",
    question: "Makna bottleneck dalam operasional adalah?",
    options: { A: "Titik hambatan proses", B: "Diskon khusus", C: "Nama supplier", D: "Kode voucher" },
    correctAnswer: "A",
    explanation: "Bottleneck adalah titik yang menghambat alur proses."
  },
  {
    category: "verbal",
    difficulty: "hard",
    question: "Instruksi: Prioritaskan keputusan yang berdampak pada cashflow dan SLA. Artinya?",
    options: { A: "Dahulukan isu yang memengaruhi uang dan ketepatan layanan", B: "Dahulukan desain banner", C: "Dahulukan chat santai", D: "Abaikan operasional" },
    correctAnswer: "A",
    explanation: "Cashflow dan SLA adalah dampak bisnis utama."
  },
  {
    category: "verbal",
    difficulty: "medium",
    question: "Kalimat feedback leader yang paling konstruktif adalah?",
    options: { A: "Kamu selalu salah.", B: "Di laporan kemarin ada 3 data kosong, tolong gunakan checklist sebelum submit.", C: "Kerja kamu jelek.", D: "Saya tidak mau bahas data." },
    correctAnswer: "B",
    explanation: "Feedback konstruktif menyebut fakta dan tindakan perbaikan."
  },
  {
    category: "verbal",
    difficulty: "hard",
    question: "Makna trade-off dalam keputusan bisnis adalah?",
    options: { A: "Konsekuensi memilih satu hal dibanding hal lain", B: "Menghapus semua risiko", C: "Diskon wajib", D: "Menunda keputusan selamanya" },
    correctAnswer: "A",
    explanation: "Trade-off berarti ada konsekuensi saat memilih satu opsi dibanding opsi lain."
  },
  {
    category: "verbal",
    difficulty: "medium",
    question: "Kata paling dekat dengan akurat adalah?",
    options: { A: "Tepat", B: "Cepat saja", C: "Ragu", D: "Acak" },
    correctAnswer: "A",
    explanation: "Akurat berarti tepat."
  },
  {
    category: "verbal",
    difficulty: "hard",
    question: "Pernyataan paling objektif untuk evaluasi campaign adalah?",
    options: { A: "Campaign ini terasa bagus.", B: "ROAS campaign turun dari 5,2x ke 3,8x saat CPC naik 25%.", C: "Saya suka desainnya.", D: "Kompetitor pasti curang." },
    correctAnswer: "B",
    explanation: "Evaluasi objektif berbasis metrik dan perubahan angka."
  },
  {
    category: "verbal",
    difficulty: "medium",
    question: "Makna eskalasi dalam layanan pelanggan adalah?",
    options: { A: "Menaikkan masalah ke pihak yang lebih berwenang", B: "Menghapus tiket", C: "Membalas seadanya", D: "Memberi diskon otomatis" },
    correctAnswer: "A",
    explanation: "Eskalasi berarti membawa isu ke level penanganan lebih tinggi."
  },
  {
    category: "pattern",
    difficulty: "medium",
    question: "Pola: 4, 8, 16, 32, ...",
    options: { A: "48", B: "56", C: "64", D: "72" },
    correctAnswer: "C",
    explanation: "Setiap angka dikali 2."
  },
  {
    category: "pattern",
    difficulty: "hard",
    question: "Pola: 1, 4, 9, 16, 25, ...",
    options: { A: "30", B: "36", C: "40", D: "49" },
    correctAnswer: "B",
    explanation: "Pola bilangan kuadrat. Berikutnya 6² = 36."
  },
  {
    category: "pattern",
    difficulty: "hard",
    question: "Pola: 2, 6, 12, 20, 30, ...",
    options: { A: "38", B: "40", C: "42", D: "44" },
    correctAnswer: "C",
    explanation: "Selisih +4, +6, +8, +10, berikutnya +12. Jadi 42."
  },
  {
    category: "pattern",
    difficulty: "medium",
    question: "Kode batch: A-01, C-02, E-03, G-04, ...",
    options: { A: "H-05", B: "I-05", C: "J-05", D: "K-06" },
    correctAnswer: "B",
    explanation: "Huruf meloncat satu dan angka bertambah satu."
  },
  {
    category: "pattern",
    difficulty: "hard",
    question: "Pola sales: 10, 15, 25, 40, 60, ...",
    options: { A: "75", B: "80", C: "85", D: "90" },
    correctAnswer: "C",
    explanation: "Selisih +5, +10, +15, +20, berikutnya +25. Jadi 85."
  },
  {
    category: "pattern",
    difficulty: "hard",
    question: "Urutan problem solving: Identifikasi masalah → Kumpulkan data → Analisa akar masalah → ...",
    options: { A: "Implementasi solusi dan monitoring", B: "Hapus semua data", C: "Salahkan individu", D: "Tunda tanpa batas" },
    correctAnswer: "A",
    explanation: "Setelah analisa, solusi diimplementasikan dan dimonitor."
  },
  {
    category: "pattern",
    difficulty: "medium",
    question: "Pola kode PO: PO-2026-001, PO-2026-002, PO-2026-003, ...",
    options: { A: "PO-2025-004", B: "PO-2026-004", C: "PR-2026-004", D: "PO-2026-000" },
    correctAnswer: "B",
    explanation: "Nomor urut bertambah satu dengan prefix sama."
  },
  {
    category: "pattern",
    difficulty: "hard",
    question: "Pola: 81, 27, 9, 3, ...",
    options: { A: "0", B: "1", C: "2", D: "6" },
    correctAnswer: "B",
    explanation: "Setiap angka dibagi 3."
  },
  {
    category: "workingAccuracy",
    difficulty: "medium",
    question: "Data target: MKT-ROAS-0526. Mana yang berbeda?",
    options: { A: "MKT-ROAS-0526", B: "MKT-ROAS-0526", C: "MKT-RAOS-0526", D: "MKT-ROAS-0526" },
    correctAnswer: "C",
    explanation: "RAOS berbeda urutan huruf dari ROAS."
  },
  {
    category: "workingAccuracy",
    difficulty: "medium",
    question: "Rekening tertulis 7821-0098-4431. Input benar adalah?",
    options: { A: "7821-0098-4431", B: "7821-0089-4431", C: "7821-0098-4341", D: "7821-0980-4431" },
    correctAnswer: "A",
    explanation: "A sama persis dengan data target."
  },
  {
    category: "workingAccuracy",
    difficulty: "hard",
    question: "Invoice: 18 pcs x Rp37.500. Total benar?",
    options: { A: "Rp650.000", B: "Rp660.000", C: "Rp675.000", D: "Rp685.000" },
    correctAnswer: "C",
    explanation: "Rp37.500 x 18 = Rp675.000."
  },
  {
    category: "workingAccuracy",
    difficulty: "hard",
    question: "Data sistem: SKU-BNDL-09-XL. Mana yang typo?",
    options: { A: "SKU-BNDL-09-XL", B: "SKU-BDNL-09-XL", C: "SKU-BNDL-09-XL", D: "SKU-BNDL-09-XL" },
    correctAnswer: "B",
    explanation: "BDNL berbeda dari BNDL."
  },
  {
    category: "workingAccuracy",
    difficulty: "medium",
    question: "Total cash system Rp12.875.000. Input mana yang benar?",
    options: { A: "Rp12.785.000", B: "Rp12.875.000", C: "Rp12.857.000", D: "Rp12.870.500" },
    correctAnswer: "B",
    explanation: "B sama persis dengan data target."
  },
  {
    category: "workingAccuracy",
    difficulty: "hard",
    question: "PO berisi 24 karton, tiap karton 18 pcs. Total pcs adalah?",
    options: { A: "402", B: "422", C: "432", D: "442" },
    correctAnswer: "C",
    explanation: "24 x 18 = 432 pcs."
  },
  {
    category: "workingAccuracy",
    difficulty: "hard",
    question: "Alamat target: Komplek Nusa Indah Blok E7 No. 14. Mana yang salah?",
    options: { A: "Komplek Nusa Indah Blok E7 No. 14", B: "Komplek Nusa Indah Blok E7 No. 14", C: "Komplek Nusa Indah Blok F7 No. 14", D: "Komplek Nusa Indah Blok E7 No. 14" },
    correctAnswer: "C",
    explanation: "Blok F7 berbeda dari E7."
  }
];

const level1Questions = buildLevelQuestions(1, level1Seeds);
const level2Questions = buildLevelQuestions(2, level2Seeds);
const level3Questions = buildLevelQuestions(3, level3Seeds);

export const iqQuestions: IQQuestion[] = [
  ...level1Questions,
  ...level2Questions,
  ...level3Questions
];

export function getIQQuestionsByLevel(level: 1 | 2 | 3): IQQuestion[] {
  return iqQuestions.filter((question) => question.level === level);
}

export function getIQDurationSeconds(level: 1 | 2 | 3): number {
  if (level === 1) return 20 * 60;
  if (level === 2) return 30 * 60;
  return 40 * 60;
}

export function getIQQuestionCountByLevel(level: 1 | 2 | 3): number {
  return getIQQuestionsByLevel(level).length;
}
EOF

cat > lib/iq/iqLevel3Questions.ts <<'EOF'
import type { IQQuestion } from "@/types/iq";

/**
 * Backward compatibility file.
 * Level 3 questions are now exported from lib/iq/iqQuestions.ts.
 */
export const iqLevel3Questions: IQQuestion[] = [];
EOF

cat > lib/iqQuestions.ts <<'EOF'
export {
  iqQuestions,
  getIQQuestionsByLevel,
  getIQDurationSeconds,
  getIQQuestionCountByLevel
} from "./iq/iqQuestions";
EOF

node <<'NODE'
const { readFileSync } = require("fs");

const file = readFileSync("lib/iq/iqQuestions.ts", "utf8");

const counts = {
  L1: (file.match(/level1Seeds/g) || []).length,
};

console.log("✅ Rebuilt lib/iq/iqQuestions.ts");
console.log("✅ Added compatibility export lib/iqQuestions.ts");
NODE

echo ""
echo "Now checking TypeScript build..."
npm run build