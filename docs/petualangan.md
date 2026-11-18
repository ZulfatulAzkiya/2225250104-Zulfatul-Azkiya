# Ekspedisi Pulau Aljabar (Petualangan Harta Karun, Kartun Bergambar)

## 1. Konsep

Siswa membantu **Ulfa** (penjelajah berhijab) dan **Lino** (tarsius, hewan khas Sulawesi) menempuh peta kuno menuju harta karun di **Pulau Harta**. Perjalanan melewati **7 pos**. Di setiap pos ada teka-teki PLSV/PtLSV yang harus dipecahkan agar jalan terbuka. Setelah semua pos terlewati, peti harta terbuka dan siswa mendapat **Sertifikat Penjelajah Aljabar** berisi skor literasi matematika.

**Orisinalitas & hak cipta.** Bahan referensi di Google Drive berisi gambar, karakter, dan partitur lagu tema *Dora the Explorer* (milik Nickelodeon). Bahan tersebut **tidak dipakai dan tidak ditiru**. Yang diambil hanya konsep umum (genre): petualangan dengan peta dan rintangan. Karakter, model 3D, gambar, dan musik ULFALINE dibuat sendiri:
- Karakter SVG: `frontend/gambar/ulfa.svg`, `frontend/gambar/lino.svg`
- Ilustrasi kartun 2D (SVG) berbadan penuh & adegan: `frontend/js/komponen/ilustrasi.js`
- Peta pulau bergambar beranimasi: `frontend/js/petualangan/peta2d.js`
- Wajah ekspresif (senyum, hore, tanya, semangat): `frontend/js/komponen/tokoh.js`
- Musik & efek suara disintesis di `frontend/js/petualangan/suara.js` (melodi pentatonis orisinal)
- Tidak memakai pustaka atau aset gambar pihak ketiga.

**Gaya visual (v1.3).** Atas permintaan pemilik proyek, tampilan diubah dari 3D low-poly menjadi **kartun 2D bergaris tegas dan penuh warna**, mengikuti nuansa umum kartun petualangan anak: langit cerah, matahari, awan, pohon kelapa, bunga, kupu-kupu, jalan setapak berliku, dan karakter berbadan penuh dengan pose (berjalan, bersorak, menunjuk). Karakter dan desainnya tetap milik ULFALINE sendiri.

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
- Animasi dikendalikan siswa (Ulfa berjalan setelah pos selesai, peti terbuka saat tombol ditekan). Pengaturan **Kurangi gerakan** membuat perpindahan langsung tanpa animasi.
- Peta berupa SVG, sehingga ringan dan tajam di semua HP tanpa WebGL. Pos juga bisa dibuka lewat tombol dan daftar pos.
- Di awal tiap pos ada **peta rute bergambar**, dan Ulfa bertanya "Kita sedang menuju ke mana?". Setiap jawaban mendapat reaksi Lino (hore) atau Ulfa (menyemangati).
- **Lagu Ekspedisi** (melodi & lirik orisinal) diputar hanya jika siswa menekan tombol, dengan lirik karaoke.

## 4. Teknis

- Rute: `#/petualangan` (peta), `#/petualangan/<id-pos>`, `#/petualangan/harta`.
- Data: `frontend/data/petualangan.json` (narasi, teka-teki, skor). Jenis teka-teki: `pilihan`, `langkah` (memakai pengerja langkah demi langkah), `batu`.
- Progres: `localStorage` → `petualangan.pos[id] = {selesai, skor, bintang, kali}` dan `petualangan.titik` (posisi Ulfa di jalan).
- Peta dibuang (`hapus()`) saat siswa pindah halaman, dan musik serta narasi dihentikan.
- Uji: `tests/test_konten.py` (kunci, model setara, total skor = 6 per indikator, narasi singkat, tidak menyalin soal tes) dan `e2e/uji_e2e.py` (menempuh 7 pos sampai sertifikat 24/24).
