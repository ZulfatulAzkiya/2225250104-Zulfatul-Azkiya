# Rencana Pengujian dan Evaluasi

Pengujian dibagi menjadi dua bagian: **teknis** (apakah aplikasi berjalan benar) dan **pedagogis** (apakah aplikasi membantu belajar dengan beban kognitif yang wajar).

## A0. Pengujian Otomatis yang Sudah Ada (v1.0)

| Berkas | Isi |
|---|---|
| `backend/tests/test_aljabar.py` | Parser, input berbahaya/rusak ditolak, himpunan penyelesaian, format bilangan |
| `backend/tests/test_pemeriksa.py` | Setiap kode kesalahan, operasi yang sah/tidak, petunjuk, 9 contoh soal dokumen |
| `backend/tests/test_generator.py` | 240 soal dicek silang dengan **SymPy**; ≥ 50% PtLSV menengah perlu balik tanda |
| `backend/tests/test_konten.py` | Model & kunci 8 misi literasi, kuis prasyarat, bank 360 soal |
| `backend/tests/test_frontend.py` | Sintaks semua file JS (V8), daftar cache offline, manifest PWA, tanpa `innerHTML` |
| `backend/tests/test_paritas_js.py` | `mesin.js` vs Python pada > 500 kasus: hasil harus identik |
| `backend/tests/test_api.py` | Endpoint, validasi input, penyajian aplikasi web |
| `backend/e2e/uji_e2e.py` | Chrome: masuk → kuis → timbangan → cermin → latihan (sengaja lupa balik tanda → nilai 80) → petunjuk → misi literasi → tema gelap → **offline** → desktop tanpa scroll horizontal → **siap dipasang** |

Status 13 Nov 2026: 158 tes pytest lulus; E2E lulus.

## A. Pengujian Teknis (rencana awal)

### A1. Unit test backend (pytest), prioritas tertinggi
| Area | Contoh kasus uji |
|---|---|
| Generator | Setiap soal yang dibangkitkan memiliki solusi bulat dalam rentang; `needsFlip` benar; tidak ada pembagian dengan 0 |
| Pemeriksa langkah | `-2x>4`, `div:-2` → `x<-2` diterima; `x>-2` ditolak dengan `E_TANDA_TIDAK_DIBALIK` |
| Bentuk setara | `8>2x` setara dengan `2x<8` (diterima); `x=4` setara dengan `4=x` |
| Klasifikasi kesalahan | Satu kasus uji untuk **setiap** kode `E_*` di [konten-materi.md](konten-materi.md) §5 |
| Parser | Input berbahaya (`__import__`, string panjang) ditolak dengan `INVALID_EXPR` |
| Auth | PIN salah 5× → `423`; token tanpa role guru → `403` di `/guru/*` |

Target cakupan `services/` ≥ 90%.

### A2. Test frontend (Vitest + React Testing Library)
- Komponen `StepNav`: tidak ada autoplay; Lanjut/Kembali bekerja.
- `GarisBilangan`: bulatan kosong/penuh dan arah arsiran sesuai relasi.
- Pemeriksa versi cadangan (offline) menghasilkan keputusan yang sama dengan backend untuk seluruh bank soal cadangan (*snapshot test*).

### A3. Firestore Security Rules (Firebase Emulator)
- Siswa A tidak bisa membaca `progress` siswa B.
- Guru X tidak bisa membaca kelas guru Y.
- Klien tidak bisa menulis `attempts` atau mengubah `bestScore`.

### A4. End-to-end (Playwright)
1. Guru membuat kelas, lalu menambah siswa.
2. Siswa login, mengerjakan prasyarat, membuka materi, latihan (dengan 1 kesalahan pembalikan tanda), lalu melihat pembahasan.
3. Guru melihat kesalahan tersebut di dasbor.

### A5. Uji perangkat dan performa
- HP Android nyata: minimal 1 HP kelas bawah (RAM ≤ 3 GB, Android 8–10) dan 1 HP kelas menengah.
- Lighthouse (mobile): Performance ≥ 80, Accessibility ≥ 90, PWA installable.
- Uji koneksi lambat/terputus (Chrome DevTools "Slow 3G" / mode pesawat): latihan tetap jalan dengan bank cadangan.

## B. Evaluasi Pedagogis

Model pengembangan yang disarankan: **ADDIE** atau **4D (Thiagarajan)**. Dokumen ini mencakup tahap *Develop* dan *Implement/Evaluate*. Wawancara yang sudah dilakukan termasuk tahap *Analysis/Define*.

### B1. Validasi ahli
| Validator | Aspek | Instrumen |
|---|---|---|
| Ahli materi (dosen/guru matematika) | Kebenaran konsep, kesesuaian CP/TP, urutan materi, kualitas soal & pembahasan | Angket skala Likert 1–4 |
| Ahli media (dosen TI/media pembelajaran) | Tampilan, navigasi, keterbacaan, prinsip CLT, kinerja | Angket skala Likert 1–4 |

Kriteria kelayakan: persentase skor ≥ 61% = layak; ≥ 81% = sangat layak (sesuaikan dengan acuan yang dipakai di program studi).

### B2. Uji coba
| Tahap | Subjek | Tujuan |
|---|---|---|
| Uji perorangan | 3 siswa (kemampuan tinggi/sedang/rendah) | Menemukan masalah keterbacaan & navigasi (*think-aloud*) |
| Uji kelompok kecil | 6–10 siswa | Kepraktisan & beban kognitif |
| Uji lapangan | 1 kelas | Keefektifan |

### B3. Instrumen
| Instrumen | Mengukur | Waktu |
|---|---|---|
| **Skala beban mental Paas** (1 butir, 1–9) | Beban kognitif keseluruhan | Setelah setiap topik |
| **Kuesioner Leppink dkk. (2013)**, 10 butir, skala 0–10, diadaptasi ke Bahasa Indonesia | Beban intrinsik, ekstrinsik, dan germane secara terpisah | Setelah uji coba |
| **System Usability Scale (SUS)**, 10 butir, versi bahasa sederhana untuk siswa | Kegunaan | Akhir uji coba |
| **Angket respons siswa** | Kemenarikan, kemudahan, kebermanfaatan | Akhir uji coba |
| **Pretest–posttest** (10–15 soal, termasuk ≥ 4 soal pembalikan tanda) | Hasil belajar; dianalisis dengan N-gain | Sebelum & sesudah |
| **Log aplikasi** (`attempts.errorCounts`) | Perubahan frekuensi tiap jenis kesalahan | Otomatis |
| **Wawancara lanjutan** (pedoman sama dengan wawancara awal, kode K/IL/EL/GL/DS) | Membandingkan pengalaman sebelum dan sesudah memakai aplikasi | Akhir uji coba |

### B4. Kriteria keberhasilan
Mengacu ke [PRD.md](PRD.md) §3: N-gain ≥ 0,3; rata-rata Paas ≤ 5; SUS ≥ 68; validasi ahli "layak"; kesalahan `E_TANDA_TIDAK_DIBALIK` menurun dari sesi awal ke sesi akhir.

### B5. Siklus revisi
Temuan dari setiap tahap dicatat di tabel `Masalah → Bukti → Revisi → Status`, lalu ditelusuri balik ke FR terkait di PRD.
