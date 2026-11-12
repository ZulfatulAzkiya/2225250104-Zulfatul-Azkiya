# Analisis Kebutuhan Berbasis Wawancara Cognitive Load

> Dokumen ini adalah **sumber penelusuran (traceability)** dari data wawancara ke fitur aplikasi.
> Setiap kebutuhan fungsional (FR) di [PRD.md](PRD.md) harus merujuk minimal satu kode di sini.

## 1. Identitas Wawancara

| Aspek | Keterangan |
|---|---|
| Kode siswa | S02 |
| Kelas | IX SMP |
| Tanggal | 8 November 2026 |
| Pewawancara | Zulfatul Azkiya |
| Materi | PLSV dan PtLSV |
| Durasi | 6–7 menit, direkam dengan persetujuan siswa dan guru matematika |
| Artefak pemicu | LKS Modul Pengayaan Matematika SMP Kelas VIII (Kurikulum Merdeka) |

**Catatan konsistensi data:** identitas wawancara menyebut materi dipelajari di **kelas VII**. Namun kutipan K01 menyebut "waktu kelas 8" dan artefak yang dipakai adalah LKS kelas VIII. Perbedaan ini perlu dikonfirmasi ke guru. Untuk perencanaan, aplikasi menargetkan **Fase D (kelas VII–IX)** agar dapat dipakai untuk pembelajaran awal maupun remedial/pengayaan.

## 2. Kerangka Analisis

Kode awal mengikuti Cognitive Load Theory (Sweller):

| Kode | Arti | Implikasi umum desain |
|---|---|---|
| **K** | Konteks / pengalaman belajar | Titik awal pengguna, kebiasaan belajar |
| **IL** | *Intrinsic Load*: kompleksitas bawaan materi | Kelola dengan urutan, pre-training, segmentasi |
| **EL** | *Extraneous Load*: beban dari cara penyajian | **Kurangi**: penyajian ringkas, kecepatan diatur siswa, tanpa distraksi |
| **GL** | *Germane Load*: upaya membangun skema | **Dorong**: contoh, latihan bertahap, self-explanation |
| **DS** | Desain yang diharapkan siswa | Masukan langsung untuk fitur dan UI |

## 3. Tabel Penelusuran Lengkap

| Kode | Inti temuan | Jenis beban | Implikasi desain | FR terkait |
|---|---|---|---|---|
| K01 | Pernah belajar, tetapi sebagian sudah lupa | Konteks (prior knowledge melemah) | Sediakan pemanasan dan pengingat materi prasyarat sebelum masuk materi inti | FR-01, FR-02 |
| K02 | Pembelajaran berpusat pada guru: rumus, contoh di papan, mencatat, latihan buku | Konteks | Aplikasi melengkapi kelas, bukan menggantikan. Guru perlu dasbor untuk memantau | FR-15, FR-16 |
| K03 | Lebih paham PLSV daripada PtLSV karena bingung tanda | Konteks → IL | PLSV diajarkan dulu sebagai jembatan ke PtLSV, dengan menunjukkan persamaan dan perbedaannya | FR-03, FR-05 |
| IL01 | Tertukar antara "lebih dari" dan "kurang dari" | Intrinsic | **Kartu Makna Simbol**: setiap simbol dibaca dengan kata dan ditunjukkan di garis bilangan | FR-05 |
| IL02 | Soal panjang membuat lupa operasi untuk mengisolasi variabel | Intrinsic (banyak elemen berinteraksi) | **Mode Langkah demi Langkah**: satu operasi per langkah, memilih operasi dan melihat hasilnya | FR-08 |
| IL03 | Tahu aturan membalik tanda, tetapi lupa menerapkannya | Intrinsic (prosedural) | Animasi konseptual "kenapa dibalik" + pengingat kontekstual saat membagi/mengali dengan bilangan negatif | FR-06, FR-09 |
| IL04 | Prasyarat: operasi hitung, bilangan negatif, bentuk aljabar | Intrinsic (prasyarat) | Modul **Pemanasan Prasyarat** dengan diagnosis singkat | FR-01, FR-02 |
| IL05 | Sering salah hitung bilangan negatif dan menulis tanda | Intrinsic | Deteksi jenis kesalahan otomatis dan umpan balik spesifik | FR-09, FR-11 |
| EL01 | Penjelasan terlalu cepat atau contoh langsung banyak | Extraneous | Satu contoh per layar, tanpa autoplay | FR-04, FR-07 |
| EL02 | Lebih mudah dijelaskan satu per satu, kadang tidak tahu asal angka | Extraneous | Setiap langkah menampilkan operasi yang dilakukan, dengan penanda warna yang menunjukkan asal angka (*signaling*) | FR-07 |
| EL03 | Bingung jika banyak simbol, ingin artinya dijelaskan dulu | Extraneous | **Pre-training**: istilah dan simbol dijelaskan sebelum dipakai; tooltip pada simbol | FR-05, FR-04 |
| EL04 | Butuh waktu untuk mencatat dan memahami contoh | Extraneous | Kecepatan diatur siswa (tombol "Lanjut"), bisa kembali ke langkah sebelumnya, tanpa batas waktu di mode belajar | FR-07 |
| EL05 | Instruksi singkat memudahkan fokus pada langkah | Extraneous | Instruksi ≤ 1 kalimat per langkah; teks kartu ≤ ~40 kata | FR-04, NFR-UX |
| GL01 | Latihan dan contoh berulang membantu mengingat | Germane | Generator soal tidak terbatas (backend Python) sehingga latihan bisa diulang | FR-10 |
| GL02 | Memeriksa ulang dan membandingkan dengan contoh | Germane (self-monitoring) | Tombol "Lihat contoh serupa" saat latihan; tampilan berdampingan jawaban siswa dan kunci | FR-08, FR-12 |
| GL03 | Ingin contoh mirip, petunjuk, dan pembahasan | Germane / DS | Alur **worked example → faded example → latihan mandiri**; petunjuk bertingkat | FR-07, FR-08, FR-12 |
| GL04 | Lebih mudah jika dari soal sederhana dulu | Germane | Tiga level (Dasar → Menengah → Tantangan); level berikutnya terbuka setelah penguasaan tercapai | FR-10 |
| GL05 | Menjelaskan ke orang lain memperkuat ingatan | Germane (elaborasi) | Fitur **"Jelaskan dengan katamu"** (self-explanation prompt) | FR-13 |
| DS01 | Ingin video/penjelasan, contoh, latihan, dan nilai | Desain | Komponen utama: Materi (animasi langkah), Contoh, Latihan, Nilai | FR-04, FR-06, FR-10, FR-11 |
| DS02 | Ingin penjelasan kenapa tanda berubah saat ada bilangan negatif | Desain | Animasi garis bilangan "Kenapa tandanya dibalik?" | FR-06 |
| DS03 | Ingin tahu kesalahan dan pembahasan setelah menjawab | Desain | Pembahasan per soal yang menandai **langkah yang salah** | FR-11, FR-12 |
| DS04 | Sederhana, menarik, sedikit tulisan, menu mudah | Desain | Maksimal 4 menu utama dengan ikon dan label; desain bersih | NFR-UX |
| DS05 | Jangan terlalu banyak materi per halaman dan jangan terlalu banyak animasi | Desain | Satu konsep per layar; animasi hanya untuk konsep inti; opsi "kurangi gerakan" | FR-04, NFR-UX |

## 4. Ringkasan Temuan Kunci

1. **Titik kesulitan utama:** makna simbol pertidaksamaan (IL01) dan penerapan aturan pembalikan tanda (IL03, DS02).
2. **Prasyarat yang lemah:** operasi bilangan negatif dan bentuk aljabar (IL04, IL05).
3. **Penyebab beban berlebih:** kecepatan penjelasan, banyak contoh sekaligus, dan simbol yang belum dijelaskan (EL01–EL04).
4. **Yang membantu belajar:** contoh mirip, latihan bertahap, pembahasan, dan menjelaskan kembali (GL01–GL05).
5. **Harapan antarmuka:** sederhana, sedikit teks, animasi secukupnya, ada nilai (DS01–DS05).

## 5. Keterbatasan dan Rekomendasi

- Data berasal dari **satu responden (S02)**, sehingga belum dapat digeneralisasi.
- **Rekomendasi:** wawancarai minimal 3–5 siswa lain dengan tingkat kemampuan berbeda (tinggi/sedang/rendah) dan 1 guru matematika. Tambahkan juga **tes diagnostik singkat** (5–10 soal) untuk memastikan miskonsepsi yang dominan.
- Setiap temuan baru ditambahkan ke tabel bagian 3 dengan kode baru (misalnya S03-IL01) dan ditautkan ke FR.
