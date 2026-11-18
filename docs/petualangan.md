# Ekspedisi Pulau Aljabar (Petualangan Harta Karun 3D)

## 1. Konsep

Siswa membantu **Ulfa** (penjelajah berhijab) dan **Lino** (tarsius, hewan khas Sulawesi) menempuh peta kuno menuju harta karun di **Pulau Harta**. Perjalanan melewati **7 pos**. Di setiap pos ada teka-teki PLSV/PtLSV yang harus dipecahkan agar jalan terbuka. Setelah semua pos terlewati, peti harta terbuka dan siswa mendapat **Sertifikat Penjelajah Aljabar** berisi skor literasi matematika.

**Orisinalitas & hak cipta.** Bahan referensi di Google Drive berisi gambar, karakter, dan partitur lagu tema *Dora the Explorer* (milik Nickelodeon). Bahan tersebut **tidak dipakai dan tidak ditiru**. Yang diambil hanya konsep umum (genre): petualangan dengan peta dan rintangan. Karakter, model 3D, gambar, dan musik ULFALINE dibuat sendiri:
- Karakter SVG: `frontend/gambar/ulfa.svg`, `frontend/gambar/lino.svg`
- Model 3D dari bentuk dasar di `frontend/js/petualangan/dunia3d.js`
- Musik & efek suara disintesis di `frontend/js/petualangan/suara.js` (melodi pentatonis orisinal)
- Pustaka 3D: three.js r160 (lisensi MIT), `frontend/vendor/three.module.min.js`

## 2. Keselarasan dengan Pretest–Posttest

Skor petualangan memakai **4 indikator literasi matematika** dari instrumen pretest–posttest (maks 6 per indikator, total 24), dengan kategori: ≥ 21 Sangat Baik, ≥ 16 Baik, ≥ 11 Cukup, < 11 Perlu Berlatih. Konteks dan angka **sengaja berbeda** dari soal tes (diuji `test_petualangan_tidak_menyalin_soal_pretest_posttest`), supaya siswa melatih proses berpikirnya, bukan menghafal jawaban posttest.

| Pos | Tempat | Teka-teki | Setara soal tes no. | Indikator (poin) |
|---|---|---|---|---|
| 1 | Gerbang Batu | Operasi bilangan negatif (3 PG) | Prasyarat | ⭐ 3 |
| 2 | Jembatan Timbangan | Model 5x − 4 = 3x + 10, selesaikan, cek substitusi | Soal 3 (Employing) | E 3 |
| 3 | Sungai Batu Loncat | Pilih semua batu yang memenuhi x ≤ 2; makna ≤ | Makna tanda (IL01) | ⭐ 3 |
| 4 | Gua Cermin | 8 − 3x ≥ 20 → x ≤ −4; alasan tanda dibalik | Soal 3/PtLSV (IL03) | E 3 |
| 5 | Pasar Apung | Variabel, model 2500x ≤ 20000, maksimum 8 sisir, kesimpulan | Soal 2 (Formulating) | F 6 |
| 6 | Bukit Dua Jalan | Anggaran 40.000 − 8.000; bandingkan Toko A (x ≤ 4) dan B (y ≤ 4,4 → 4), pilih B | Soal 1 (Reasoning) | R 6 |
| 7 | Dermaga Rakit | 120 + 40x ≤ 300 → x ≤ 4,5 → 4 peti; cek 280 kg; alasan peti ke-5 | Soal 4 (Interpreting) | I 6 |

Poin diberikan jika jawaban benar pada **percobaan pertama**. Untuk teka-teki langkah, syaratnya tanpa kesalahan langkah dan tanpa petunjuk tingkat 3. Siswa tetap harus menemukan jawaban benar untuk melanjutkan (belajar dari umpan balik). Pos boleh diulang; skor terbaik per indikator yang disimpan.

## 3. Prinsip Beban Kognitif yang Dijaga

- Satu teka-teki per layar, dengan indikator kemajuan titik.
- Narasi ≤ 40 kata per gelembung (diuji), dengan tombol 🔊 **Dengarkan** (narasi suara bahasa Indonesia lewat Web Speech API, jika tersedia di perangkat).
- **Musik hanya di peta.** Saat membaca dan mengerjakan teka-teki tidak ada musik. Musik bisa dimatikan (tombol di peta, atau Akun → Suara).
- Animasi 3D dikendalikan siswa (Ulfa berjalan setelah pos selesai, peti terbuka saat tombol ditekan). Pengaturan **Kurangi gerakan** membuat perpindahan langsung tanpa animasi.
- Jika perangkat tidak mendukung WebGL, peta 3D diganti tombol/daftar pos sehingga petualangan tetap bisa diselesaikan.

## 4. Teknis

- Rute: `#/petualangan` (peta), `#/petualangan/<id-pos>`, `#/petualangan/harta`.
- Data: `frontend/data/petualangan.json` (narasi, teka-teki, skor). Jenis teka-teki: `pilihan`, `langkah` (memakai pengerja langkah demi langkah), `batu`.
- Progres: `localStorage` → `petualangan.pos[id] = {selesai, skor, bintang, kali}` dan `petualangan.titik` (posisi Ulfa di jalan).
- three.js dimuat **hanya** saat peta dibuka (import dinamis), lalu adegan dibuang (`hapus()`) saat siswa pindah halaman. Rendering dibatasi ±40 fps dan berhenti saat tab tersembunyi.
- Uji: `tests/test_konten.py` (kunci, model setara, total skor = 6 per indikator, narasi singkat, tidak menyalin soal tes) dan `e2e/uji_e2e.py` (menempuh 7 pos sampai sertifikat 24/24).
