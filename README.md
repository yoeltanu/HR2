# HR Assessment Platform — DISC + Cognitive Ability Screening

Website full-stack untuk membantu HR perusahaan melakukan screening kandidat secara lebih cepat, rapi, dan otomatis.

Platform ini cocok untuk perusahaan:

- Toko online
- Marketplace operation
- Gudang
- Accounting
- Sales
- Customer service
- Procurement
- Admin operasional
- HRGA
- Personal assistant

Assessment terdiri dari:

1. **DISC Personality Test**  
   Untuk membaca gaya kerja, gaya komunikasi, kecenderungan perilaku kerja, dan kecocokan karakter dengan posisi.

2. **Cognitive Ability Screening**  
   Screening kemampuan berpikir kerja berbasis soal original. Ini **bukan tes IQ klinis resmi** dan tidak memakai alat psikometri resmi seperti IST, WAIS, Raven, atau alat berhak cipta lain.

3. **Combined Hiring Score**  
   Gabungan DISC Fit Score dan Cognitive Ability Fit Score berdasarkan bobot posisi.

> Disclaimer etis: hasil assessment adalah alat bantu HR dan bukan satu-satunya dasar keputusan rekrutmen. Keputusan hiring tetap perlu mempertimbangkan interview, pengalaman kerja, referensi, simulasi kerja, dan kebutuhan organisasi.

---

## 1. Fitur Utama

### Candidate Flow

- Landing page profesional.
- Form identitas kandidat.
- Validasi field wajib.
- Persetujuan penggunaan data.
- Instruksi assessment.
- DISC test 24 soal forced choice.
- Cognitive Ability Screening Level 1, 2, dan 3.
- Timer IQ.
- Auto-save jawaban ke localStorage.
- Auto-submit IQ saat waktu habis.
- Halaman selesai.

### Admin Flow

- Login admin sederhana.
- Dashboard kandidat.
- Search kandidat.
- Filter posisi.
- Filter DISC type.
- Filter rekomendasi akhir.
- Stat cards.
- Detail kandidat.
- DISC chart.
- IQ chart.
- Combined result.
- Red flags.
- Interview questions otomatis.
- Jawaban detail DISC dan IQ.
- Export CSV.
- Print hasil kandidat.

### Storage

- Google Sheets via Google Apps Script.
- Fallback Demo Mode memakai localStorage.
- Sample dummy database untuk dashboard demo.

---

## 2. Tech Stack

Frontend:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Recharts
- Lucide React

Backend:

- Next.js API Routes
- Google Apps Script endpoint
- Google Sheets sebagai database awal

Authentication:

- Admin password dari environment variable
- Session admin sederhana memakai localStorage + cookie sederhana

Deployment:

- Vercel
- Google Sheets + Apps Script

---

## 3. Struktur Folder

```text
/app
  /page.tsx
  /test
    /start/page.tsx
    /instructions/page.tsx
    /disc/page.tsx
    /iq/page.tsx
    /completed/page.tsx
  /admin
    /login/page.tsx
    /dashboard/page.tsx
    /candidate/[id]/page.tsx
    /settings/page.tsx
  /api
    /admin/login/route.ts
    /submit/route.ts
    /candidates/route.ts
    /candidate/[id]/route.ts

/components
  /layout
    Navbar.tsx
    AdminLayout.tsx
    Sidebar.tsx
  /candidate
    CandidateForm.tsx
    AssessmentProgress.tsx
  /disc
    DiscQuestionCard.tsx
    DiscResultChart.tsx
    DiscBadge.tsx
  /iq
    IQQuestionCard.tsx
    IQTimer.tsx
    IQResultChart.tsx
    IQSubtestBreakdown.tsx
  /admin
    CandidateTable.tsx
    CandidateDetail.tsx
    StatCard.tsx
    RedFlagBadge.tsx
    FitScoreBadge.tsx
    ExportButton.tsx

/lib
  /disc
    discQuestions.ts
    discScoring.ts
    discInterpretations.ts
    discPositionProfiles.ts
  /iq
    iqQuestions.ts
    iqLevel3Questions.ts
    iqScoring.ts
    iqInterpretations.ts
    iqPositionThresholds.ts
  /combined
    combinedScoring.ts
  /storage
    googleSheets.ts
    localStorageDemo.ts
    sampleData.ts
  /utils
    csv.ts
    validation.ts
    format.ts
    id.ts
    auth.ts

/types
  candidate.ts
  disc.ts
  iq.ts
  assessment.ts

/google-apps-script
  Code.gs

/public
  logo-placeholder.svg

---

## Part 8 — Admin Manual Book + Configurable Settings

Fitur yang ditambahkan:
- Menu `Manual Book` di sidebar admin.
- Halaman `/admin/manual-book`.
- Admin Settings dapat mengatur:
  - pilihan posisi kandidat,
  - label level assessment,
  - status aktif level,
  - nomor WhatsApp HR.
- Form kandidat membaca posisi dan level dari Admin Settings.
- Detail kandidat dapat edit nomor WhatsApp kandidat untuk Demo Mode localStorage.

Catatan:
- Konfigurasi Admin Settings saat ini disimpan di localStorage browser admin.
- Untuk produksi multi-admin, konfigurasi sebaiknya dipindahkan ke Google Sheets atau database.
- Nilai level tetap 1, 2, dan 3 agar scoring tetap aman.
