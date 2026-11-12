# Product Requirements Document (PRD)

**Nama produk:** **ULFALINE**: Belajar Persamaan & Pertidaksamaan Linear Satu Variabel
**Pemilik produk:** Zulfatul Azkiya (2225250104), S1 Pendidikan Matematika
**Versi dokumen:** 1.0, 13 November 2026
**Status:** v1.0 (aplikasi siswa) sudah dibangun. Kelas & dasbor guru (FR-14 s.d. FR-16) dijadwalkan untuk tahap berikutnya.

> Keputusan pemilik proyek (12–13 Nov 2026): aplikasi dibuka di browser dan **dipasang tanpa Play Store/App Store** (PWA); bahasa pemrograman **Python dan JavaScript**; aplikasi juga harus **mengembangkan literasi matematika**.

---

## 1. Latar Belakang

Wawancara dengan siswa kelas IX (S02) menunjukkan bahwa materi PLSV dan PtLSV yang dipelajari di kelas VII/VIII sebagian sudah terlupakan. Siswa sering tertukar antara simbol `<` dan `>`, lupa membalik tanda saat mengalikan atau membagi dengan bilangan negatif, dan kewalahan ketika penjelasan terlalu cepat atau contoh disajikan sekaligus. Rincian lengkap ada di [analisis-kebutuhan.md](analisis-kebutuhan.md).

Pembelajaran di kelas masih berpusat pada guru (K02), sehingga siswa memerlukan media belajar mandiri yang:
- menyajikan materi **bertahap dan sesuai kecepatan siswa**,
- menjelaskan **makna** simbol dan aturan, bukan sekadar menghafal,
- memberi **latihan bertingkat, nilai, dan pembahasan** yang menunjukkan letak kesalahan.

## 2. Pernyataan Masalah

> Siswa SMP mengalami beban kognitif berlebih saat belajar PLSV dan PtLSV karena prasyarat (bilangan negatif, aljabar) lemah, simbol pertidaksamaan belum bermakna, dan penyajian materi terlalu cepat dan padat. Akibatnya siswa sering salah memilih operasi dan lupa membalik tanda pertidaksamaan.

## 3. Tujuan dan Metrik Keberhasilan

| Tujuan | Metrik | Target uji coba |
|---|---|---|
| Meningkatkan pemahaman PLSV & PtLSV | Gain ternormalisasi (N-gain) pretest–posttest | ≥ 0,3 (kategori sedang) |
| Mengurangi kesalahan pembalikan tanda | % soal PtLSV dengan koefisien negatif yang dijawab benar | naik ≥ 25 poin persen |
| Menjaga beban kognitif tetap wajar | Skala beban mental Paas (1–9) setelah sesi | rata-rata ≤ 5 |
| Aplikasi mudah dipakai | System Usability Scale (SUS) | ≥ 68 |
| Aplikasi layak menurut ahli | Validasi ahli materi & ahli media | kategori "layak/sangat layak" (≥ 61%) |

Instrumen dan prosedurnya dijelaskan di [rencana-pengujian-dan-evaluasi.md](rencana-pengujian-dan-evaluasi.md).

## 4. Pengguna (Persona)

### 4.1 Siswa: "Sari", 14 tahun, kelas VIII/IX
- Memakai HP Android kelas menengah ke bawah (RAM 3–4 GB, layar 6"), kuota internet terbatas.
- Cukup paham PLSV, bingung dengan PtLSV, lemah di bilangan negatif.
- Suka tampilan sederhana dan langsung latihan, tetapi butuh contoh.
- **Kebutuhan:** penjelasan pelan dan bertahap, contoh mirip, tahu letak kesalahan, ada nilai.

### 4.2 Guru Matematika: "Bu Rina"
- Mengajar beberapa kelas, waktu terbatas.
- **Kebutuhan:** membuat kelas dan akun siswa dengan mudah, melihat siapa yang sudah/belum belajar, mengetahui kesalahan yang paling sering terjadi di kelas.

## 5. Ruang Lingkup

### 5.1 Termasuk MVP
- Materi: prasyarat (bilangan bulat negatif, bentuk aljabar sederhana), PLSV, simbol pertidaksamaan, PtLSV, pembalikan tanda, soal cerita sederhana.
- Animasi langkah interaktif (timbangan untuk PLSV, garis bilangan untuk PtLSV).
- Latihan langkah demi langkah dengan 3 level, nilai, dan pembahasan.
- Login siswa (kode kelas + nama panggilan + PIN) dan login guru (email).
- Dasbor guru sederhana.
- Web (PWA) dan APK Android.

### 5.2 Tidak Termasuk MVP
- Video, chat, forum, papan peringkat antarsiswa.
- Materi selain PLSV/PtLSV.
- Aplikasi iOS (secara teknis bisa lewat Capacitor, tetapi tidak diuji).
- Mode offline penuh (hanya toleran terhadap koneksi putus, lihat NFR-04).
- Pengenalan tulisan tangan atau input foto.

## 6. User Stories dan Acceptance Criteria

### Siswa
| ID | User story | Acceptance criteria |
|---|---|---|
| US-01 | Sebagai siswa, saya ingin mengecek prasyarat dulu agar tahu bagian mana yang perlu diulang | Kuis 6–8 soal; hasil menampilkan topik lemah dan tautan ke kartu pengingat |
| US-02 | Sebagai siswa, saya ingin materi disajikan satu per satu agar tidak bingung | Setiap layar berisi 1 konsep; tombol "Lanjut" dan "Kembali"; tanpa autoplay |
| US-03 | Sebagai siswa, saya ingin tahu arti simbol `<`, `>`, `≤`, `≥` | Setiap simbol punya cara baca, contoh, dan visual garis bilangan; ada kuis cocokkan simbol |
| US-04 | Sebagai siswa, saya ingin mengerti **kenapa** tanda dibalik | Animasi garis bilangan 5 langkah, dikendalikan siswa; diakhiri pertanyaan cek pemahaman |
| US-05 | Sebagai siswa, saya ingin mengerjakan soal langkah demi langkah | Setiap langkah: pilih operasi lalu isi hasil; kesalahan langsung diberi umpan balik spesifik |
| US-06 | Sebagai siswa, saya ingin petunjuk saat buntu | Petunjuk 3 tingkat: arahan umum → operasi yang tepat → contoh serupa |
| US-07 | Sebagai siswa, saya ingin tahu nilai dan letak kesalahan saya | Setelah sesi: nilai 0–100, daftar soal, dan pembahasan yang menandai langkah salah |
| US-08 | Sebagai siswa, saya ingin latihan dari mudah ke sulit | Level berikutnya terbuka setelah ≥ 80% benar di level sebelumnya (bisa dilewati dengan konfirmasi) |
| US-09 | Sebagai siswa, saya ingin melihat progres belajar saya | Halaman progres: status tiap topik, nilai terbaik, jumlah latihan |

### Guru
| ID | User story | Acceptance criteria |
|---|---|---|
| US-10 | Sebagai guru, saya ingin membuat kelas dan akun siswa | Guru membuat kelas lalu mendapat kode kelas 6 karakter; bisa menambah siswa (nama panggilan) dan membuat PIN |
| US-11 | Sebagai guru, saya ingin melihat progres kelas | Tabel siswa × topik dengan status (belum/proses/kuasai) dan nilai rata-rata |
| US-12 | Sebagai guru, saya ingin tahu kesalahan yang paling sering | Grafik 5 jenis kesalahan teratas di kelas (misalnya "lupa membalik tanda") |

## 7. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas | Sumber wawancara |
|---|---|---|---|
| FR-01 | **Pemanasan Prasyarat**: kuis diagnostik singkat tentang operasi bilangan bulat (terutama negatif) dan bentuk aljabar | Wajib | K01, IL04, IL05 |
| FR-02 | Rekomendasi kartu pengingat prasyarat berdasarkan hasil FR-01 | Wajib | K01, IL04 |
| FR-03 | **Peta Materi** berurutan: Prasyarat → PLSV → Simbol → PtLSV → Pembalikan Tanda → Soal Cerita | Wajib | K03, GL04 |
| FR-04 | **Kartu Materi tersegmentasi**: 1 konsep per layar, teks ≤ ~40 kata, rumus dengan KaTeX | Wajib | EL01, EL03, EL05, DS01, DS05 |
| FR-05 | **Kartu Makna Simbol** `<`, `>`, `≤`, `≥`: cara baca + garis bilangan (bulatan penuh/kosong) + kuis cocokkan | Wajib | IL01, K03, EL03 |
| FR-06 | **Animasi "Kenapa tandanya dibalik?"**: garis bilangan interaktif, membandingkan 2 < 5 dengan −2 > −5 | Wajib | IL03, DS02 |
| FR-07 | **Animasi Langkah (worked example)**: penyelesaian ditampilkan satu langkah per klik, operasi yang dilakukan ditandai warna (signaling), bisa mundur | Wajib | EL01, EL02, EL04, GL03 |
| FR-08 | **Latihan Langkah demi Langkah**: siswa memilih operasi lalu mengisi hasil; tahapan worked → faded → mandiri; petunjuk 3 tingkat; tombol "Lihat contoh serupa" | Wajib | IL02, GL02, GL03 |
| FR-09 | **Pengingat kontekstual & deteksi kesalahan** per langkah (misalnya saat siswa membagi dengan bilangan negatif tanpa membalik tanda, muncul pesan khusus) | Wajib | IL03, IL05 |
| FR-10 | **Generator soal 3 level** (Dasar/Menengah/Tantangan) oleh backend Python; soal baru setiap sesi; level terbuka berdasarkan penguasaan | Wajib | GL01, GL04 |
| FR-11 | **Nilai sesi** (0–100) dan ringkasan jenis kesalahan | Wajib | DS01, DS03, IL05 |
| FR-12 | **Pembahasan per soal**: langkah siswa berdampingan dengan langkah benar; langkah salah ditandai | Wajib | DS03, GL02, GL03 |
| FR-13 | **"Jelaskan dengan katamu"**: setelah soal tertentu, siswa memilih alasan yang tepat untuk sebuah langkah (pilihan ganda) atau mengetik penjelasan singkat (opsional, tidak dinilai otomatis) | Sebaiknya | GL05 |
| FR-14 | **Autentikasi**: siswa masuk dengan kode kelas + nama panggilan + PIN; guru dengan email/kata sandi (Firebase Auth) | Wajib | K02 |
| FR-15 | **Dasbor Guru**: progres siswa × topik, nilai rata-rata, 5 kesalahan terbanyak | Wajib | K02 |
| FR-16 | **Manajemen Kelas**: guru membuat kelas, menambah/menghapus siswa, mengatur ulang PIN | Wajib | K02 |
| FR-17 | **Progres Pribadi Siswa**: status topik, nilai terbaik, riwayat latihan | Sebaiknya | GL01, DS01 |
| FR-18 | **Pengaturan**: ukuran teks, mode "kurangi gerakan" (animasi dimatikan atau diganti transisi sederhana) | Sebaiknya | DS05, EL03 |
| FR-19 | **Misi Literasi Matematika**: masalah kontekstual (konteks AKM: personal, sosial budaya, saintifik) yang dikerjakan lewat 5 tahap: Pahami → Rumuskan model → Selesaikan → Tafsirkan → Cek kewajaran. Setiap tahap dinilai | Wajib | Permintaan pemilik proyek; GL03, DS01 |
| FR-20 | **Pemasangan tanpa toko aplikasi**: PWA yang bisa di-install dari browser dan dipakai offline (bank soal di perangkat) | Wajib | Permintaan pemilik proyek; NFR-04 |

**Status implementasi v1.0:** FR-01 s.d. FR-13 dan FR-17 s.d. FR-20 ✅. FR-14 s.d. FR-16 (akun, dasbor guru, manajemen kelas) ⏳ tahap berikutnya. Di v1.0, siswa cukup mengisi nama panggilan, dan progres disimpan di perangkat.

## 8. Kebutuhan Non-Fungsional

| ID | Kebutuhan |
|---|---|
| NFR-01 **Performa** | Muat awal ≤ 3 detik di 4G pada HP Android kelas bawah; ukuran bundel JS awal ≤ 300 KB (gzip); APK ≤ 15 MB |
| NFR-02 **Kompatibilitas** | Android 8.0 (API 26) ke atas; Chrome/Edge/Firefox versi terbaru; layar 360–1440 px |
| NFR-03 **Aksesibilitas** | Kontras WCAG 2.1 AA; teks dasar ≥ 16 px; target sentuh ≥ 48 dp; menghormati `prefers-reduced-motion` |
| NFR-04 **Toleran koneksi** | Materi dan animasi tersimpan dalam cache (PWA/service worker). Jika backend tidak terjangkau, latihan memakai bank soal cadangan di perangkat dan hasilnya disinkronkan nanti |
| NFR-05 **Privasi** | Data siswa minimal; tidak ada email/nomor HP siswa; lihat [privasi-dan-keamanan.md](privasi-dan-keamanan.md) |
| NFR-06 **Keamanan** | Firestore Security Rules berbasis peran; endpoint Python memverifikasi Firebase ID token |
| NFR-07 **Bahasa** | Bahasa Indonesia baku dan ramah siswa; istilah sesuai buku Kurikulum Merdeka |
| NFR-UX **Beban kognitif** | Aturan wajib di [panduan-ui-ux.md](panduan-ui-ux.md): 1 konsep per layar, ≤ 4 menu utama, tanpa autoplay, animasi hanya untuk konsep inti |
| NFR-08 **Kebenaran matematika** | Semua soal dan kunci diverifikasi SymPy; konten materi divalidasi ahli materi |

## 9. Asumsi

- Siswa memiliki akses HP Android atau komputer dengan internet setidaknya sesekali.
- Guru bersedia membuat kelas dan membagikan kode kelas.
- Layanan gratis (Firebase Spark plan, Render/Cloud Run free tier) cukup untuk skala uji coba (≤ 100 siswa).

## 10. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Temuan hanya dari 1 responden | Fitur kurang representatif | Tambah wawancara dan tes diagnostik sebelum M3 (lihat [roadmap.md](roadmap.md)) |
| Server Python free tier "tidur" (cold start lambat) | Latihan terasa lambat | Bank soal cadangan di frontend; endpoint *warm-up* saat aplikasi dibuka |
| Animasi terlalu berat di HP lama | Lag, menambah beban ekstrinsik | Animasi SVG/CSS ringan, mode "kurangi gerakan" |
| Pengerjaan melebihi waktu semester | Proyek tidak selesai | Prioritaskan FR "Wajib"; FR "Sebaiknya" boleh ditunda |
| Data anak bocor | Masalah etika/hukum | Data minimal, rules ketat, persetujuan guru/orang tua |

## 11. Dokumen Terkait

- [analisis-kebutuhan.md](analisis-kebutuhan.md)
- [desain-instruksional.md](desain-instruksional.md)
- [konten-materi.md](konten-materi.md)
- [user-flow-dan-layar.md](user-flow-dan-layar.md)
- [panduan-ui-ux.md](panduan-ui-ux.md)
- [arsitektur-teknis.md](arsitektur-teknis.md)
- [skema-data-dan-api.md](skema-data-dan-api.md)
- [privasi-dan-keamanan.md](privasi-dan-keamanan.md)
- [roadmap.md](roadmap.md)
- [rencana-pengujian-dan-evaluasi.md](rencana-pengujian-dan-evaluasi.md)
