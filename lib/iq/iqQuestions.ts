import type { IQQuestion } from "@/types/iq";

export const iqQuestions: IQQuestion[] = [
  {
    id: "L1-001",
    level: 1,
    category: "logical",
    difficulty: "easy",
    question: "Jika semua pesanan COD harus dicek alamatnya, dan pesanan B adalah COD, apa yang harus dilakukan?",
    options: {
      A: "Langsung kirim",
      B: "Cek alamat pesanan B",
      C: "Batalkan pesanan",
      D: "Tunggu customer komplain"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-002",
    level: 1,
    category: "logical",
    difficulty: "easy",
    question: "Jika SOP packing mewajibkan bubble wrap untuk barang pecah belah, maka gelas kaca harus:",
    options: {
      A: "Dikirim tanpa pelindung",
      B: "Dimasukkan bubble wrap",
      C: "Ditunda",
      D: "Diberi diskon"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-003",
    level: 1,
    category: "logical",
    difficulty: "easy",
    question: "Customer meminta retur karena barang salah warna. Data pertama yang harus dicek:",
    options: {
      A: "Nama kurir",
      B: "Foto barang dan invoice",
      C: "Jumlah follower toko",
      D: "Jam makan siang admin"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-004",
    level: 1,
    category: "logical",
    difficulty: "easy",
    question: "Jika stok fisik lebih sedikit dari stok sistem, langkah awal yang tepat:",
    options: {
      A: "Menghapus data",
      B: "Cek ulang dan catat selisih",
      C: "Naikkan harga",
      D: "Abaikan"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-005",
    level: 1,
    category: "logical",
    difficulty: "easy",
    question: "Gudang mengalami keterlambatan picking untuk produk yang paling sering terjual. Perbaikan paling efektif adalah:",
    options: {
      A: "Memindahkan produk fast moving ke area yang lebih dekat dengan packing",
      B: "Menambah jumlah label rak",
      C: "Mengurangi jumlah SKU yang dijual",
      D: "Mengubah warna rak penyimpanan"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L1-006",
    level: 1,
    category: "numerical",
    difficulty: "easy",
    question: "Harga modal Rp50.000 dan dijual Rp65.000. Keuntungan:",
    options: {
      A: "Rp10.000",
      B: "Rp15.000",
      C: "Rp20.000",
      D: "Rp25.000"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-007",
    level: 1,
    category: "numerical",
    difficulty: "easy",
    question: "8 dus × 12 pcs = ?",
    options: {
      A: "84",
      B: "90",
      C: "96",
      D: "108"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L1-008",
    level: 1,
    category: "numerical",
    difficulty: "easy",
    question: "3 produk × Rp25.000 = ?",
    options: {
      A: "Rp50.000",
      B: "Rp65.000",
      C: "Rp75.000",
      D: "Rp85.000"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L1-009",
    level: 1,
    category: "numerical",
    difficulty: "easy",
    question: "Stok awal 120, terjual 35. Sisa:",
    options: {
      A: "75",
      B: "80",
      C: "85",
      D: "95"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L1-010",
    level: 1,
    category: "numerical",
    difficulty: "easy",
    question: "Diskon Rp10.000 dari Rp80.000. Harga akhir:",
    options: {
      A: "Rp60.000",
      B: "Rp70.000",
      C: "Rp75.000",
      D: "Rp90.000"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-011",
    level: 1,
    category: "verbal",
    difficulty: "easy",
    question: "Makna validasi:",
    options: {
      A: "Menghapus",
      B: "Memeriksa kebenaran",
      C: "Mengubah warna",
      D: "Mempercepat iklan"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-012",
    level: 1,
    category: "verbal",
    difficulty: "easy",
    question: "Customer mengeluhkan pesanan belum diterima meskipun status sudah terkirim. Respons terbaik adalah:",
    options: {
      A: "Mohon tunggu karena sistem marketplace kadang terlambat update",
      B: "Kami bantu cek nomor resi dan koordinasi dengan pihak kurir terlebih dahulu",
      C: "Silakan ajukan komplain langsung ke kurir",
      D: "Jika besok belum sampai baru kami bantu proses"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-013",
    level: 1,
    category: "verbal",
    difficulty: "easy",
    question: "Antonim dari teliti:",
    options: {
      A: "Cermat",
      B: "Rapi",
      C: "Ceroboh",
      D: "Akurat"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L1-014",
    level: 1,
    category: "verbal",
    difficulty: "easy",
    question: "Gudang menerima beberapa barang retur dengan kondisi berbeda-beda. Tindakan paling tepat adalah:",
    options: {
      A: "Memasukkan semua barang kembali ke stok",
      B: "Memeriksa kondisi barang dan memisahkan yang masih layak jual",
      C: "Menjual seluruh barang retur dengan diskon",
      D: "Menunda pengecekan sampai seluruh retur terkumpul"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-015",
    level: 1,
    category: "verbal",
    difficulty: "easy",
    question: "Laporan stok yang paling jelas dan dapat ditindaklanjuti adalah:",
    options: {
      A: "Ada kemungkinan stok kurang di gudang",
      B: "Stok sistem tercatat 50 pcs, hasil pengecekan fisik 47 pcs, terdapat selisih 3 pcs",
      C: "Beberapa barang terlihat tidak sesuai jumlahnya",
      D: "Gudang perlu mengecek ulang stok hari ini"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-016",
    level: 1,
    category: "pattern",
    difficulty: "easy",
    question: "2, 4, 6, 8, ...",
    options: {
      A: "9",
      B: "10",
      C: "11",
      D: "12"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-017",
    level: 1,
    category: "pattern",
    difficulty: "easy",
    question: "A1, A2, A3, A4, ...",
    options: {
      A: "A5",
      B: "B1",
      C: "A0",
      D: "C4"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L1-018",
    level: 1,
    category: "pattern",
    difficulty: "easy",
    question: "5, 10, 20, 40, ...",
    options: {
      A: "45",
      B: "60",
      C: "80",
      D: "100"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L1-019",
    level: 1,
    category: "pattern",
    difficulty: "medium",
    question: "Pesanan masuk → Diproses → Dikemas → ...",
    options: {
      A: "Dikirim",
      B: "Dihapus",
      C: "Diabaikan",
      D: "Ditulis ulang"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L1-020",
    level: 1,
    category: "pattern",
    difficulty: "medium",
    question: "BX-01, BX-02, BX-03, ...",
    options: {
      A: "BX-04",
      B: "BX-00",
      C: "BY-01",
      D: "AX-04"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L1-021",
    level: 1,
    category: "workingAccuracy",
    difficulty: "medium",
    question: "Pasangan SKU yang sama persis:",
    options: {
      A: "TR-1208 dan TR-1280",
      B: "MK-771A dan MK-771A",
      C: "AB-908 dan AB-980",
      D: "ZX-111 dan ZX-11I"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-022",
    level: 1,
    category: "workingAccuracy",
    difficulty: "medium",
    question: "Invoice Rp158.500. Input yang benar:",
    options: {
      A: "Rp185.500",
      B: "Rp158.500",
      C: "Rp158.050",
      D: "Rp155.800"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L1-023",
    level: 1,
    category: "workingAccuracy",
    difficulty: "medium",
    question: "Alamat: Jl. Melati No. 18 Blok C. Data yang salah:",
    options: {
      A: "Jl. Melati No. 18 Blok C",
      B: "Jl. Melati No. 18 Blok C",
      C: "Jl. Melati No. 81 Blok C",
      D: "Jl. Melati No. 18 Blok C"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L1-024",
    level: 1,
    category: "workingAccuracy",
    difficulty: "medium",
    question: "Kode yang sama persis:",
    options: {
      A: "JNT8891 dan JNT8891",
      B: "JNT8891 dan JNT8981",
      C: "JNT8891 dan JNT889L",
      D: "JNT8891 dan JNT889I"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L1-025",
    level: 1,
    category: "workingAccuracy",
    difficulty: "medium",
    question: "12 paket, masing-masing 4 pcs. Total:",
    options: {
      A: "36",
      B: "48",
      C: "52",
      D: "60"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-001",
    level: 2,
    category: "logical",
    difficulty: "medium",
    question: "Jika produk margin rendah dipromosikan hanya saat stok menumpuk, dan produk A margin rendah serta stok menumpuk, maka:",
    options: {
      A: "Promosikan produk A",
      B: "Hapus produk A",
      C: "Naikkan ongkir",
      D: "Abaikan stok"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L2-002",
    level: 2,
    category: "logical",
    difficulty: "medium",
    question: "Pesanan prioritas adalah yang sudah dibayar dan harus dikirim hari ini. Pesanan X memenuhi kedua syarat. Status X:",
    options: {
      A: "Prioritas",
      B: "Retur",
      C: "Draft",
      D: "Tidak valid"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L2-003",
    level: 2,
    category: "logical",
    difficulty: "medium",
    question: "Supplier terlambat lebih dari 3 kali harus dievaluasi. Supplier B terlambat 4 kali. Tindakan:",
    options: {
      A: "Evaluasi supplier B",
      B: "Hapus data",
      C: "Tambah budget iklan",
      D: "Abaikan"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L2-004",
    level: 2,
    category: "logical",
    difficulty: "medium",
    question: "Admin menemukan selisih kas dan invoice. Langkah terbaik:",
    options: {
      A: "Posting promo",
      B: "Cek invoice, bukti bayar, dan catat selisih",
      C: "Menyalahkan kurir",
      D: "Mengubah data"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-005",
    level: 2,
    category: "logical",
    difficulty: "medium",
    question: "Biaya iklan naik 30%, tetapi jumlah order dan omzet tetap. Kesimpulan paling logis adalah:",
    options: {
      A: "Target audience iklan kemungkinan kurang tepat",
      B: "Tim gudang bekerja terlalu lambat",
      C: "Produk perlu ditambah variasi warna",
      D: "Customer terlalu banyak bertanya"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L2-006",
    level: 2,
    category: "logical",
    difficulty: "medium",
    question: "Produk retur rusak tidak boleh masuk stok jual. Produk Y rusak, maka:",
    options: {
      A: "Masuk stok jual",
      B: "Dipisahkan dari stok jual",
      C: "Dijual normal",
      D: "Dikirim ke customer lain"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-007",
    level: 2,
    category: "logical",
    difficulty: "medium",
    question: "Satu keputusan memengaruhi stok, cashflow, dan rating toko. Keputusan sebaiknya:",
    options: {
      A: "Dibuat tanpa data",
      B: "Dibahas dengan data lintas fungsi",
      C: "Diserahkan ke customer",
      D: "Ditunda tanpa alasan"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-008",
    level: 2,
    category: "logical",
    difficulty: "medium",
    question: "Semua komplain pengiriman harus memiliki nomor resi. Komplain Z tanpa resi:",
    options: {
      A: "Diproses normal",
      B: "Diminta nomor resi atau bukti pendukung",
      C: "Refund otomatis",
      D: "Dihapus"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-009",
    level: 2,
    category: "numerical",
    difficulty: "medium",
    question: "Harga jual Rp120.000, modal Rp80.000. Margin rupiah:",
    options: {
      A: "Rp30.000",
      B: "Rp40.000",
      C: "Rp50.000",
      D: "Rp60.000"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-010",
    level: 2,
    category: "numerical",
    difficulty: "medium",
    question: "Modal Rp75.000, harga jual Rp100.000. Margin terhadap harga jual:",
    options: {
      A: "20%",
      B: "25%",
      C: "30%",
      D: "35%"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-011",
    level: 2,
    category: "numerical",
    difficulty: "medium",
    question: "Budget iklan Rp500.000 menghasilkan sales Rp2.000.000. ROAS:",
    options: {
      A: "2x",
      B: "3x",
      C: "4x",
      D: "5x"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L2-012",
    level: 2,
    category: "numerical",
    difficulty: "medium",
    question: "Stok awal 300, masuk 80, keluar 125. Stok akhir:",
    options: {
      A: "245",
      B: "255",
      C: "265",
      D: "275"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-013",
    level: 2,
    category: "numerical",
    difficulty: "medium",
    question: "Diskon 15% dari Rp200.000:",
    options: {
      A: "Rp20.000",
      B: "Rp25.000",
      C: "Rp30.000",
      D: "Rp35.000"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L2-014",
    level: 2,
    category: "numerical",
    difficulty: "medium",
    question: "Conversion rate 2% dari 5.000 pengunjung menghasilkan:",
    options: {
      A: "50 order",
      B: "75 order",
      C: "100 order",
      D: "125 order"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L2-015",
    level: 2,
    category: "numerical",
    difficulty: "medium",
    question: "Supplier memberi harga Rp48.000. Target margin minimal Rp12.000. Harga jual minimal:",
    options: {
      A: "Rp54.000",
      B: "Rp58.000",
      C: "Rp60.000",
      D: "Rp64.000"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L2-016",
    level: 2,
    category: "numerical",
    difficulty: "medium",
    question: "Dari 240 pesanan, 12 retur. Persentase retur:",
    options: {
      A: "3%",
      B: "4%",
      C: "5%",
      D: "6%"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L2-017",
    level: 2,
    category: "numerical",
    difficulty: "medium",
    question: "Target 1.200 paket per minggu selama 5 hari kerja. Rata-rata per hari:",
    options: {
      A: "200",
      B: "220",
      C: "240",
      D: "260"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L2-018",
    level: 2,
    category: "numerical",
    difficulty: "medium",
    question: "Harga Rp150.000 naik 10%. Harga baru:",
    options: {
      A: "Rp155.000",
      B: "Rp160.000",
      C: "Rp165.000",
      D: "Rp170.000"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L2-019",
    level: 2,
    category: "verbal",
    difficulty: "medium",
    question: "Laporan yang paling membantu atasan mengambil keputusan adalah:",
    options: {
      A: "Pengiriman mengalami beberapa kendala minggu ini",
      B: "Terdapat 18 pesanan terlambat akibat pickup kurir mundur dari jadwal harian",
      C: "Tim operasional tampak kesulitan mengikuti jadwal pengiriman",
      D: "Customer mulai lebih sering mengeluhkan keterlambatan"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-020",
    level: 2,
    category: "verbal",
    difficulty: "medium",
    question: "Saat melakukan rekonsiliasi pembayaran marketplace, langkah yang paling tepat adalah:",
    options: {
      A: "Membandingkan data transaksi sistem dengan mutasi pembayaran",
      B: "Menghapus transaksi yang belum masuk laporan",
      C: "Menunda pengecekan hingga akhir bulan",
      D: "Menggabungkan seluruh transaksi tanpa verifikasi"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L2-021",
    level: 2,
    category: "verbal",
    difficulty: "medium",
    question: "Customer mengeluhkan barang belum diterima dan meminta refund dengan nada emosional. Langkah awal paling tepat adalah:",
    options: {
      A: "Meminta customer menunggu update dari sistem pengiriman",
      B: "Memeriksa nomor resi dan detail pesanan sebelum menentukan solusi",
      C: "Langsung memberikan refund agar komplain berhenti",
      D: "Mengarahkan customer untuk menghubungi kurir sendiri"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-022",
    level: 2,
    category: "verbal",
    difficulty: "medium",
    question: "Kata prioritas berarti:",
    options: {
      A: "Hal yang didahulukan",
      B: "Hal yang dihapus",
      C: "Hal yang diperlambat",
      D: "Hal yang disembunyikan"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L2-023",
    level: 2,
    category: "verbal",
    difficulty: "medium",
    question: "Instruksi “Update stok hanya setelah barang fisik diterima” berarti:",
    options: {
      A: "Update saat PO dibuat",
      B: "Update setelah barang benar-benar datang",
      C: "Update saat supplier janji",
      D: "Tidak perlu update"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-024",
    level: 2,
    category: "verbal",
    difficulty: "medium",
    question: "Pernyataan paling netral:",
    options: {
      A: "Supplier ini buruk",
      B: "Terdapat 4 keterlambatan dari 10 pengiriman bulan ini",
      C: "Saya tidak suka supplier",
      D: "Supplier harus diganti"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-025",
    level: 2,
    category: "verbal",
    difficulty: "medium",
    question: "Atasan meminta laporan terkait peningkatan retur barang minggu ini. Laporan yang paling tepat adalah:",
    options: {
      A: "Customer terlihat lebih sering komplain dibanding biasanya",
      B: "Jumlah retur meningkat dari 12 menjadi 28 order dalam 7 hari terakhir, mayoritas karena salah ukuran",
      C: "Tim operasional merasa proses retur semakin berat",
      D: "Retur kemungkinan dipengaruhi banyak faktor di marketplace"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-026",
    level: 2,
    category: "pattern",
    difficulty: "medium",
    question: "3, 6, 9, 12, ...",
    options: {
      A: "13",
      B: "14",
      C: "15",
      D: "18"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L2-027",
    level: 2,
    category: "pattern",
    difficulty: "medium",
    question: "2, 5, 11, 23, ...",
    options: {
      A: "35",
      B: "41",
      C: "47",
      D: "49"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L2-028",
    level: 2,
    category: "pattern",
    difficulty: "medium",
    question: "AA-10, AB-20, AC-30, ...",
    options: {
      A: "AD-40",
      B: "BA-40",
      C: "AD-30",
      D: "AC-40"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L2-029",
    level: 2,
    category: "pattern",
    difficulty: "hard",
    question: "100, 90, 75, 55, ...",
    options: {
      A: "30",
      B: "35",
      C: "40",
      D: "45"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L2-030",
    level: 2,
    category: "pattern",
    difficulty: "hard",
    question: "Request → Approval → PO → ...",
    options: {
      A: "Penerimaan barang",
      B: "Packing",
      C: "Retur",
      D: "Live streaming"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L2-031",
    level: 2,
    category: "pattern",
    difficulty: "hard",
    question: "INV-1002, INV-1004, INV-1006, ...",
    options: {
      A: "INV-1007",
      B: "INV-1008",
      C: "INV-1010",
      D: "INV-1005"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-032",
    level: 2,
    category: "workingAccuracy",
    difficulty: "hard",
    question: "Nomor resi yang sama persis:",
    options: {
      A: "JP89210ID dan JP89201ID",
      B: "SPX-7719-A dan SPX-7719-A",
      C: "JNT8881 dan JNT8818",
      D: "ANT-009B dan ANT-00B9"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-033",
    level: 2,
    category: "workingAccuracy",
    difficulty: "hard",
    question: "Data sistem: SKU-MILO-220. Input yang salah:",
    options: {
      A: "SKU-MILO-220",
      B: "SKU-MILO-220",
      C: "SKU-MILO-202",
      D: "SKU-MILO-220"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L2-034",
    level: 2,
    category: "workingAccuracy",
    difficulty: "hard",
    question: "3 pcs × Rp74.500 =",
    options: {
      A: "Rp223.000",
      B: "Rp223.500",
      C: "Rp224.500",
      D: "Rp225.000"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L2-035",
    level: 2,
    category: "workingAccuracy",
    difficulty: "hard",
    question: "Nama customer: Fadli Pratama. Data yang typo:",
    options: {
      A: "Fadli Pratama",
      B: "Fadli Pratama",
      C: "Faldi Pratama",
      D: "Fadli Pratama"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-001",
    level: 3,
    category: "logical",
    difficulty: "medium",
    question: "Jika keterlambatan pengiriman meningkat setelah pergantian jadwal pickup, hipotesis awal yang paling masuk akal adalah:",
    options: {
      A: "Jadwal pickup perlu dievaluasi",
      B: "Semua admin harus diganti",
      C: "Produk harus dihentikan",
      D: "Harga harus dinaikkan"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-002",
    level: 3,
    category: "logical",
    difficulty: "medium",
    question: "Leader melihat error packing tinggi pada shift malam. Data pertama yang perlu dibandingkan:",
    options: {
      A: "Jumlah follower toko",
      B: "Volume order, jumlah staf, dan jenis error per shift",
      C: "Warna seragam",
      D: "Jam buka marketplace"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-003",
    level: 3,
    category: "logical",
    difficulty: "medium",
    question: "Promosi menaikkan order 40%, tetapi komplain naik 70%. Keputusan terbaik:",
    options: {
      A: "Lanjut tanpa perubahan",
      B: "Evaluasi kapasitas operasional dan kualitas",
      C: "Matikan semua produk",
      D: "Abaikan komplain"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-004",
    level: 3,
    category: "logical",
    difficulty: "medium",
    question: "Dua supplier memiliki harga sama. Supplier A tepat waktu 95%, Supplier B 75%. Untuk produk fast moving:",
    options: {
      A: "Supplier A",
      B: "Supplier B",
      C: "Acak",
      D: "Tidak membeli stok"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-005",
    level: 3,
    category: "logical",
    difficulty: "medium",
    question: "KPI utama CS adalah first response time dan resolusi. Laporan harian harus memuat:",
    options: {
      A: "Jumlah chat masuk, waktu respons, dan status selesai",
      B: "Warna chat",
      C: "Jumlah meja",
      D: "Nama pesaing"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-006",
    level: 3,
    category: "logical",
    difficulty: "medium",
    question: "Stok mati mengikat cashflow. Langkah prioritas:",
    options: {
      A: "Analisa umur stok, margin, dan opsi bundling/promo",
      B: "Membeli stok baru lebih banyak",
      C: "Menghapus laporan",
      D: "Menunggu"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-007",
    level: 3,
    category: "logical",
    difficulty: "medium",
    question: "Produktivitas tim turun 15% selama dua minggu terakhir, sementara jumlah staf tetap. Tindakan leader yang paling tepat adalah:",
    options: {
      A: "Menambah jumlah staf untuk mengurangi beban kerja",
      B: "Mengaudit alur kerja dan mengidentifikasi titik bottleneck sebelum menambah manpower",
      C: "Menurunkan target harian sementara",
      D: "Memindahkan staf ke divisi lain"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-008",
    level: 3,
    category: "logical",
    difficulty: "medium",
    question: "Satu SKU sering oversold. Akar masalah paling mungkin:",
    options: {
      A: "Sinkronisasi stok dan update marketplace",
      B: "Logo perusahaan",
      C: "Warna kardus",
      D: "Jam makan siang customer"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-009",
    level: 3,
    category: "logical",
    difficulty: "medium",
    question: "Target sales tercapai tetapi profit turun. Fokus analisa:",
    options: {
      A: "Margin, diskon, biaya iklan, dan biaya operasional",
      B: "Jumlah kursi kantor",
      C: "Warna feed",
      D: "Hari libur nasional"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-010",
    level: 3,
    category: "logical",
    difficulty: "medium",
    question: "Order meningkat mendadak. Keputusan leader terbaik:",
    options: {
      A: "Prioritaskan SLA, alokasi orang, dan monitoring bottleneck",
      B: "Menunda semua order",
      C: "Mengubah SOP tanpa komunikasi",
      D: "Menghapus chat customer"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-011",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "Sales Rp50.000.000, COGS Rp32.000.000. Gross profit:",
    options: {
      A: "Rp16.000.000",
      B: "Rp18.000.000",
      C: "Rp20.000.000",
      D: "Rp22.000.000"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-012",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "Gross profit Rp18.000.000 dari sales Rp50.000.000. Gross margin:",
    options: {
      A: "32%",
      B: "34%",
      C: "36%",
      D: "40%"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-013",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "Biaya iklan Rp4.000.000 menghasilkan sales Rp24.000.000. ROAS:",
    options: {
      A: "4x",
      B: "5x",
      C: "6x",
      D: "8x"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-014",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "Order naik dari 800 ke 1.000. Persentase kenaikan:",
    options: {
      A: "20%",
      B: "25%",
      C: "30%",
      D: "35%"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-015",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "Error packing turun dari 5% ke 3%. Penurunan relatif:",
    options: {
      A: "20%",
      B: "30%",
      C: "40%",
      D: "50%"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-016",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "Tim A memproses 480 paket dengan 6 orang. Produktivitas per orang:",
    options: {
      A: "60",
      B: "70",
      C: "80",
      D: "90"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-017",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "912 dari 960 paket terkirim tepat waktu. SLA:",
    options: {
      A: "93%",
      B: "94%",
      C: "95%",
      D: "96%"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-018",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "Produk A margin 30% dari sales Rp20 juta. Produk B margin 20% dari sales Rp30 juta. Profit lebih besar:",
    options: {
      A: "Produk A",
      B: "Produk B",
      C: "Sama besar",
      D: "Tidak bisa dihitung"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-019",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "Stok 1.200 pcs, rata-rata terjual 80 pcs/hari. Estimasi habis:",
    options: {
      A: "10 hari",
      B: "12 hari",
      C: "15 hari",
      D: "18 hari"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-020",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "2.000 dari 2.500 chat terjawab sesuai target. Persentase:",
    options: {
      A: "75%",
      B: "80%",
      C: "85%",
      D: "90%"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-021",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "Cost per order Rp12.000, target maksimal Rp10.000. Penurunan yang dibutuhkan:",
    options: {
      A: "12,5%",
      B: "16,67%",
      C: "20%",
      D: "25%"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-022",
    level: 3,
    category: "numerical",
    difficulty: "medium",
    question: "Budget Rp15 juta dibagi rasio 2:2:1. Channel ketiga mendapat:",
    options: {
      A: "Rp2 juta",
      B: "Rp3 juta",
      C: "Rp4 juta",
      D: "Rp5 juta"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-023",
    level: 3,
    category: "verbal",
    difficulty: "medium",
    question: "Manager meminta update operasional harian terkait penurunan performa pengiriman. Laporan yang paling efektif adalah:",
    options: {
      A: "Pengiriman mengalami banyak kendala sejak minggu lalu",
      B: "SLA turun dari 97% menjadi 92% dalam 5 hari terakhir akibat backlog pickup sebesar 180 paket dan keterbatasan armada kurir",
      C: "Tim gudang terlihat kewalahan menangani lonjakan order",
      D: "Diperlukan evaluasi besar terhadap seluruh proses operasional"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-024",
    level: 3,
    category: "verbal",
    difficulty: "medium",
    question: "Makna bottleneck:",
    options: {
      A: "Titik hambatan proses",
      B: "Diskon khusus",
      C: "Nama supplier",
      D: "Kode voucher"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-025",
    level: 3,
    category: "verbal",
    difficulty: "hard",
    question: "Saat volume order naik 50%, tim operasional tidak mampu menyelesaikan seluruh pekerjaan dalam SLA. Mana prioritas leader yang paling tepat?",
    options: {
      A: "Fokus pada campaign branding agar traffic tetap naik",
      B: "Memastikan order bernilai tinggi dan pengiriman mendekati SLA diproses lebih dahulu",
      C: "Menunda seluruh order sampai kapasitas normal kembali",
      D: "Mengurangi jumlah customer service agar biaya operasional turun"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-026",
    level: 3,
    category: "verbal",
    difficulty: "hard",
    question: "Feedback yang paling membantu meningkatkan kualitas kerja tim adalah:",
    options: {
      A: "Laporan minggu ini masih kurang rapi, coba lebih teliti lagi",
      B: "Ada beberapa data yang belum lengkap pada laporan kemarin, gunakan checklist sebelum submit agar tidak terlewat",
      C: "Tim harus bekerja lebih cepat supaya tidak tertinggal",
      D: "Kesalahan seperti ini seharusnya tidak terjadi lagi"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-027",
    level: 3,
    category: "verbal",
    difficulty: "hard",
    question: "Makna trade-off:",
    options: {
      A: "Konsekuensi memilih satu opsi dibanding opsi lain",
      B: "Menghapus semua risiko",
      C: "Diskon wajib",
      D: "Menunda keputusan"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-028",
    level: 3,
    category: "verbal",
    difficulty: "hard",
    question: "Kata paling dekat dengan akurat:",
    options: {
      A: "Tepat",
      B: "Cepat",
      C: "Ragu",
      D: "Acak"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-029",
    level: 3,
    category: "verbal",
    difficulty: "hard",
    question: "Setelah campaign baru dijalankan: traffic naik 35%, CPC naik 20%, conversion rate turun dari 3,2% menjadi 2,1%. Kesimpulan paling logis adalah:",
    options: {
      A: "Campaign berhasil karena traffic meningkat",
      B: "Audience campaign kemungkinan kurang relevan sehingga kualitas traffic menurun",
      C: "Budget iklan perlu langsung dilipatgandakan",
      D: "Tim CS perlu meningkatkan respons chat"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-030",
    level: 3,
    category: "verbal",
    difficulty: "hard",
    question: "Makna eskalasi:",
    options: {
      A: "Menaikkan masalah ke pihak yang lebih berwenang",
      B: "Menghapus tiket",
      C: "Membalas seadanya",
      D: "Memberi diskon otomatis"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-031",
    level: 3,
    category: "verbal",
    difficulty: "hard",
    question: "Makna mitigasi risiko:",
    options: {
      A: "Mengurangi kemungkinan dan dampak risiko",
      B: "Menambah kemungkinan dan dampak risiko",
      C: "Menghapus data",
      D: "Menunda keputusan"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-032",
    level: 3,
    category: "verbal",
    difficulty: "hard",
    question: "Dalam evaluasi supplier bulanan ditemukan: keterlambatan pengiriman naik dari 6% menjadi 18%, lead time rata-rata bertambah 2 hari, dan terjadi 4 stockout dalam 1 bulan. Kesimpulan paling objektif adalah:",
    options: {
      A: "Supplier ini buruk.",
      B: "Tingkat keterlambatan supplier mencapai 18% selama tiga bulan terakhir.",
      C: "Saya tidak suka supplier.",
      D: "Supplier harus diganti tanpa analisa."
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-033",
    level: 3,
    category: "pattern",
    difficulty: "hard",
    question: "4, 8, 16, 32, ...",
    options: {
      A: "48",
      B: "56",
      C: "64",
      D: "72"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-034",
    level: 3,
    category: "pattern",
    difficulty: "hard",
    question: "1, 4, 9, 16, 25, ...",
    options: {
      A: "30",
      B: "36",
      C: "40",
      D: "49"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-035",
    level: 3,
    category: "pattern",
    difficulty: "hard",
    question: "2, 6, 12, 20, 30, ...",
    options: {
      A: "38",
      B: "40",
      C: "42",
      D: "44"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-036",
    level: 3,
    category: "pattern",
    difficulty: "hard",
    question: "A-01, C-02, E-03, G-04, ...",
    options: {
      A: "H-05",
      B: "I-05",
      C: "J-05",
      D: "K-06"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-037",
    level: 3,
    category: "pattern",
    difficulty: "hard",
    question: "10, 15, 25, 40, 60, ...",
    options: {
      A: "75",
      B: "80",
      C: "85",
      D: "90"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-038",
    level: 3,
    category: "pattern",
    difficulty: "hard",
    question: "Identifikasi masalah → Kumpulkan data → Analisa akar masalah → ...",
    options: {
      A: "Implementasi solusi dan monitoring",
      B: "Hapus semua data",
      C: "Salahkan individu",
      D: "Tunda tanpa batas"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-039",
    level: 3,
    category: "pattern",
    difficulty: "hard",
    question: "PO-2026-001, PO-2026-002, PO-2026-003, ...",
    options: {
      A: "PO-2025-004",
      B: "PO-2026-004",
      C: "PR-2026-004",
      D: "PO-2026-000"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-040",
    level: 3,
    category: "pattern",
    difficulty: "hard",
    question: "81, 27, 9, 3, ...",
    options: {
      A: "0",
      B: "1",
      C: "2",
      D: "6"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-041",
    level: 3,
    category: "workingAccuracy",
    difficulty: "hard",
    question: "MKT-ROAS-0526. Mana yang berbeda?",
    options: {
      A: "MKT-ROAS-0526",
      B: "MKT-ROAS-0526",
      C: "MKT-RAOS-0526",
      D: "MKT-ROAS-0526"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-042",
    level: 3,
    category: "workingAccuracy",
    difficulty: "hard",
    question: "Rekening 7821-0098-4431. Input benar:",
    options: {
      A: "7821-0098-4431",
      B: "7821-0089-4431",
      C: "7821-0098-4341",
      D: "7821-0980-4431"
    },
    correctAnswer: "A",
    explanation: "Jawaban benar adalah A."
  },
  {
    id: "L3-043",
    level: 3,
    category: "workingAccuracy",
    difficulty: "hard",
    question: "18 pcs × Rp37.500 =",
    options: {
      A: "Rp650.000",
      B: "Rp660.000",
      C: "Rp675.000",
      D: "Rp685.000"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  },
  {
    id: "L3-044",
    level: 3,
    category: "workingAccuracy",
    difficulty: "hard",
    question: "SKU-BNDL-09-XL. Mana yang typo?",
    options: {
      A: "SKU-BNDL-09-XL",
      B: "SKU-BDNL-09-XL",
      C: "SKU-BNDL-09-XL",
      D: "SKU-BNDL-09-XL"
    },
    correctAnswer: "B",
    explanation: "Jawaban benar adalah B."
  },
  {
    id: "L3-045",
    level: 3,
    category: "workingAccuracy",
    difficulty: "hard",
    question: "PO 24 karton × 18 pcs. Total:",
    options: {
      A: "402",
      B: "422",
      C: "432",
      D: "442"
    },
    correctAnswer: "C",
    explanation: "Jawaban benar adalah C."
  }
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
