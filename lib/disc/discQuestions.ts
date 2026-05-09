import type { DiscQuestion } from "@/types/disc";

const rows = [
  ["Saya suka mengambil keputusan dengan cepat.", "Saya mudah mencairkan suasana dengan orang baru.", "Saya lebih nyaman bekerja dalam suasana stabil.", "Saya sangat memperhatikan detail dan aturan."],
  ["Saya berani mengambil alih saat situasi tidak jelas.", "Saya senang meyakinkan orang lain dengan komunikasi.", "Saya berusaha menjaga keharmonisan tim.", "Saya mengecek ulang pekerjaan agar tidak ada kesalahan."],
  ["Saya terdorong oleh target dan hasil.", "Saya suka bekerja dengan banyak interaksi.", "Saya sabar menghadapi pekerjaan berulang.", "Saya suka bekerja dengan data dan bukti."],
  ["Saya tidak takut menyampaikan pendapat yang berbeda.", "Saya mudah membangun relasi dengan orang lain.", "Saya cenderung menjadi pendengar yang baik.", "Saya lebih percaya keputusan yang berdasarkan analisa."],
  ["Saya suka tantangan dan kompetisi.", "Saya sering memberi semangat kepada orang lain.", "Saya lebih suka perubahan yang bertahap.", "Saya nyaman mengikuti prosedur yang jelas."],
  ["Saya cepat bertindak saat melihat masalah.", "Saya senang menyampaikan ide secara verbal.", "Saya menjaga agar pekerjaan tim berjalan tenang.", "Saya menilai risiko sebelum mengambil tindakan."],
  ["Saya suka memimpin saat ada target penting.", "Saya menikmati presentasi atau menjelaskan sesuatu.", "Saya konsisten menyelesaikan tugas sampai selesai.", "Saya suka membuat sistem kerja yang rapi."],
  ["Saya tidak suka terlalu lama menunggu keputusan.", "Saya nyaman bekerja dengan banyak orang.", "Saya menghindari konflik jika masih bisa dibicarakan baik-baik.", "Saya merasa terganggu jika pekerjaan dilakukan asal-asalan."],
  ["Saya fokus pada hasil akhir.", "Saya mudah menunjukkan antusiasme.", "Saya berusaha membuat orang lain merasa didukung.", "Saya fokus pada kualitas dan ketepatan."],
  ["Saya suka menyelesaikan masalah secara langsung.", "Saya suka memberikan pengaruh positif ke lingkungan.", "Saya dapat diandalkan untuk pekerjaan rutin.", "Saya berhati-hati sebelum menyimpulkan sesuatu."],
  ["Saya berani menekan tim agar target tercapai.", "Saya mudah membuat orang lain tertarik dengan ide saya.", "Saya lebih suka bekerja dalam hubungan tim yang harmonis.", "Saya suka standar kerja yang jelas dan terukur."],
  ["Saya merasa nyaman mengambil risiko terukur.", "Saya senang menjadi pusat komunikasi dalam tim.", "Saya tidak mudah panik saat situasi berubah.", "Saya lebih suka instruksi yang spesifik."],
  ["Saya sering mendorong pekerjaan agar lebih cepat selesai.", "Saya mudah memuji dan mengapresiasi orang lain.", "Saya lebih suka mendukung daripada mendominasi.", "Saya terbiasa membuat catatan atau dokumentasi."],
  ["Saya suka memecahkan masalah sulit.", "Saya nyaman melakukan negosiasi atau persuasi.", "Saya setia pada komitmen dan tanggung jawab.", "Saya memeriksa fakta sebelum bertindak."],
  ["Saya cenderung bicara langsung ke inti masalah.", "Saya suka suasana kerja yang aktif dan hidup.", "Saya sabar menghadapi orang yang berbeda karakter.", "Saya suka pekerjaan yang membutuhkan ketelitian tinggi."],
  ["Saya termotivasi oleh pencapaian besar.", "Saya senang membangun networking.", "Saya menghargai kestabilan dan loyalitas.", "Saya lebih nyaman jika ada SOP yang jelas."],
  ["Saya cepat mengambil keputusan meski data belum sempurna.", "Saya bisa membuat orang lain merasa nyaman.", "Saya menjaga ritme kerja agar tidak kacau.", "Saya tidak suka melewatkan detail kecil."],
  ["Saya suka diberi wewenang untuk menentukan langkah.", "Saya suka memberi ide kreatif secara spontan.", "Saya lebih suka bekerja dengan alur yang tenang.", "Saya suka menganalisis sebab-akibat."],
  ["Saya mudah mengambil posisi sebagai pengarah.", "Saya menikmati pekerjaan yang banyak komunikasi.", "Saya cenderung menghindari keputusan yang terlalu mendadak.", "Saya membutuhkan data sebelum merasa yakin."],
  ["Saya ingin pekerjaan bergerak cepat.", "Saya suka menciptakan suasana positif.", "Saya menjaga hubungan kerja jangka panjang.", "Saya menjaga agar pekerjaan sesuai standar."],
  ["Saya suka mengatasi hambatan secara agresif.", "Saya percaya komunikasi bisa menyelesaikan banyak masalah.", "Saya kuat dalam menjaga konsistensi kerja.", "Saya kuat dalam mengidentifikasi kesalahan."],
  ["Saya suka target yang menantang.", "Saya mudah membangun kedekatan dengan orang lain.", "Saya tidak suka lingkungan kerja yang terlalu banyak konflik.", "Saya suka bekerja dengan checklist."],
  ["Saya nyaman memberi instruksi.", "Saya nyaman berbicara di depan kelompok.", "Saya nyaman membantu orang lain menyelesaikan tugas.", "Saya nyaman mengaudit atau mengecek pekerjaan."],
  ["Saya lebih suka bergerak cepat daripada terlalu banyak diskusi.", "Saya lebih suka berdiskusi dan bertukar ide.", "Saya lebih suka menjaga ritme kerja yang stabil.", "Saya lebih suka memastikan semuanya benar sebelum jalan."]
];

export const discQuestions: DiscQuestion[] = rows.map((row, index) => ({
  id: `DISC-${String(index + 1).padStart(2, "0")}`,
  text: `Soal ${index + 1}`,
  options: [
    { id: "A", text: row[0], code: "D" },
    { id: "B", text: row[1], code: "I" },
    { id: "C", text: row[2], code: "S" },
    { id: "D", text: row[3], code: "C" }
  ]
}));
